import { useEffect, useState } from 'react';

import { EXPLODE_STAGES, type ExplodeStage } from '../scene/explodeStages';

/** 한 단계 넘긴 뒤 다음 입력을 받기까지 최소 대기 */
const STAGE_LOCK_MS = 700;
/** 잠금 중 휠 이벤트가 이어지면 이만큼 잠금 연장 — 트랙패드 관성 스크롤 흡수 */
const INERTIA_QUIET_MS = 220;
const WHEEL_THRESHOLD = 8;
const SWIPE_THRESHOLD_PX = 40;

const clampStage = (value: number): ExplodeStage =>
  EXPLODE_STAGES[Math.min(EXPLODE_STAGES.length - 1, Math.max(0, value))];

/**
 * 스크롤 분해 단계
 * - 휠 한 번(또는 세로 스와이프 한 번)에 한 단계씩 이동
 * - 아래로 스크롤 = 다음 단계, 위로 = 이전 단계
 */
export const useExplodeStage = () => {
  const [stage, setStage] = useState<ExplodeStage>(0);

  // 휠·터치 입력 구독 — 외부 이벤트 소스라 Effect 로 연결
  useEffect(() => {
    let lockedUntil = 0;
    let touchStartY: number | null = null;

    const step = (direction: 1 | -1) => {
      setStage((current) => clampStage(current + direction));
    };

    const handleWheel = (event: WheelEvent) => {
      const now = performance.now();

      if (now < lockedUntil) {
        lockedUntil = Math.max(lockedUntil, now + INERTIA_QUIET_MS);
        return;
      }
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      lockedUntil = now + STAGE_LOCK_MS;
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

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return stage;
};
