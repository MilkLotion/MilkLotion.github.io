import { useEffect, useState } from 'react';

import type { TypingStep } from '../scene/dubeolsikTyping';

/** 배경이 어두워진 뒤 첫 키를 누르기까지 */
const START_DELAY_MS = 900;
/**
 * 키 사이 간격 — 최소값 + 무작위 폭, 사람이 치는 불규칙한 박자
 * - 평균 46ms × 사이 28번 + 쉼 145ms → 인사말 29타를 첫 키부터 약 1.4초에 침 (분당 약 1,200타)
 * - 사용자 조정: 분당 300타 → 600타 → 다시 2배
 */
const KEY_INTERVAL_MS = { min: 35, spread: 22 } as const;
/** 키를 누르고 있는 시간 — 간격 최소값보다 짧아야 같은 키 연타(안ㄴ → 안녀)가 떨어졌다 눌리는 게 보임 */
const KEY_HOLD_MS = 25;
/** 문장 부호·줄바꿈·띄어쓰기를 친 뒤 더 쉬는 시간 */
const PAUSE_AFTER_MS: ReadonlyMap<string, number> = new Map([
  ['.', 105],
  ['\n', 105],
  [',', 40],
  [' ', 40],
]);
/** 중단 후 글자를 비우기까지 — 자막이 사라지는 동안은 글자 유지 */
const CLEAR_DELAY_MS = 500;

interface Progress {
  /** 이 진행이 속한 문장 — 화면이 바뀌어 문장이 달라지면 이전 진행은 버림 */
  steps: readonly TypingStep[];
  index: number;
  pressedCode: string | null;
}

/**
 * 자동 타이핑 재생
 * - isPlaying 이 켜지면 steps 를 한 키씩 진행, 꺼지면 즉시 멈추고 누른 키 해제
 * - 재생 중 steps 가 바뀌면 처음부터 다시 — 이전 문장의 진행 칸이 새 문장에 섞이지 않게
 * - 끝까지 치면 마지막 문장을 그대로 둠
 */
export const useTypingSequence = (steps: readonly TypingStep[], isPlaying: boolean) => {
  const [progress, setProgress] = useState<Progress>({ steps, index: -1, pressedCode: null });

  // 타이머 기반 재생 — 외부 시간 흐름과 동기화라 Effect 로 연결
  useEffect(() => {
    const timers: number[] = [];
    const schedule = (delayMs: number, run: () => void) => {
      timers.push(window.setTimeout(run, delayMs));
    };

    if (isPlaying) {
      let at = START_DELAY_MS;

      steps.forEach(({ code, text }, index) => {
        schedule(at, () => setProgress({ steps, index, pressedCode: code }));
        schedule(at + KEY_HOLD_MS, () =>
          setProgress((current) =>
            current.steps === steps && current.index === index ? { ...current, pressedCode: null } : current,
          ),
        );

        at += KEY_INTERVAL_MS.min + Math.random() * KEY_INTERVAL_MS.spread + (PAUSE_AFTER_MS.get(text.slice(-1)) ?? 0);
      });
    } else {
      schedule(CLEAR_DELAY_MS, () => setProgress({ steps, index: -1, pressedCode: null }));
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [steps, isPlaying]);

  const isCurrentRun = progress.steps === steps;
  const index = isCurrentRun ? progress.index : -1;

  return {
    text: steps[index]?.text ?? '',
    pressedCode: isPlaying && isCurrentRun ? progress.pressedCode : null,
    /** 치는 중에는 커서 고정, 치기 전·다 친 뒤에는 깜빡임 */
    isTyping: isPlaying && index >= 0 && index < steps.length - 1,
    /** 마지막 키까지 친 상태 */
    isComplete: isPlaying && steps.length > 0 && index === steps.length - 1,
  };
};
