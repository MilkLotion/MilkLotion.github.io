import { useEffect, useState } from 'react';

import type { ExplodeStage } from '../scene/explodeStages';

/**
 * 역광 페이지 화면별 분해 단계 — 휠·세로 스와이프 한 번에 한 화면씩
 * - 0 자유 회전 + 자유 입력: 분해 없음
 * - 1 소개: 들어오면 바로 반투명 막 + 자동 타이핑, 움직여도 유지
 * - 2~4 분해 1·2·3단계 + 소개글 — 반투명 막 유지
 */
const SCREEN_STAGES: readonly ExplodeStage[] = [0, 0, 1, 2, 3];
export const SCREEN_COUNT = SCREEN_STAGES.length;
export const FREE_SCREEN = 0;
export const INTRO_SCREEN = 1;

/** 한 화면 넘긴 뒤 다음 입력을 받기까지 최소 대기 */
const SCREEN_LOCK_MS = 700;
/** 잠금 중 휠 이벤트가 이어지면 이만큼 잠금 연장 — 트랙패드 관성 스크롤 흡수 */
const INERTIA_QUIET_MS = 220;
const WHEEL_THRESHOLD = 8;
const SWIPE_THRESHOLD_PX = 40;

const clampScreen = (value: number) => Math.min(SCREEN_COUNT - 1, Math.max(0, value));

/**
 * 역광 페이지 화면 흐름 — 아래로 스크롤·↓ 키 = 다음 화면, 위로 스크롤·↑ 키 = 이전 화면
 * - startsAtLastScreen: 프로젝트 페이지에서 돌아왔을 때 마지막 화면부터 (마운트 시점에만 읽음)
 */
export const useBacklightScreens = (startsAtLastScreen: boolean) => {
  const [screen, setScreen] = useState(() => (startsAtLastScreen ? SCREEN_COUNT - 1 : 0));

  // 휠·터치·방향키 입력 구독 — 외부 이벤트 소스라 Effect 로 연결
  useEffect(() => {
    let lockedUntil = 0;
    let touchStartY: number | null = null;

    const step = (direction: 1 | -1) => {
      setScreen((current) => clampScreen(current + direction));
    };

    const handleWheel = (event: WheelEvent) => {
      const now = performance.now();

      if (now < lockedUntil) {
        lockedUntil = Math.max(lockedUntil, now + INERTIA_QUIET_MS);
        return;
      }
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      lockedUntil = now + SCREEN_LOCK_MS;
      step(event.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null) return;

      // 위로 밀면 양수 — 아래로 스크롤한 것과 같은 방향
      const deltaY = touchStartY - (event.changedTouches[0]?.clientY ?? touchStartY);
      touchStartY = null;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD_PX) return;

      step(deltaY > 0 ? 1 : -1);
    };

    // 누르고 있어 반복 입력이 들어와도 한 화면만 — 3D 키보드의 방향키 눌림 표시는 Keyboard 가 따로 처리
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'ArrowDown') step(1);
      if (event.key === 'ArrowUp') step(-1);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return { screen, stage: SCREEN_STAGES[screen] };
};
