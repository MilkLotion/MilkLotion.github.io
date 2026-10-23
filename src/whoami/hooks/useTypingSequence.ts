import { useEffect, useEffectEvent, useState } from 'react';

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

/** 화면에 그릴 타이핑 상태 */
export interface TypingDisplay {
  text: string;
  /** 마지막 키까지 친 상태 */
  isComplete: boolean;
}

/** 직전 회차가 마지막으로 보여 준 상태 — 어느 문장이었는지 steps 로 구분 */
export interface PreviousTyping extends TypingDisplay {
  steps: readonly TypingStep[];
}

interface Run {
  /** 재생 회차 — 입력이 바뀔 때마다 올라감. 같은 문장으로 돌아와도 새 회차 */
  id: number;
  steps: readonly TypingStep[];
  isPlaying: boolean;
  isSkipped: boolean;
  /** 이 회차가 시작되는 순간 찍어 둔 직전 회차의 마지막 모습 — 다음 회차가 시작될 때까지 유지 */
  previous: PreviousTyping | null;
}

interface Progress {
  /** 이 진행이 속한 회차 — 현재 회차가 아니면 무시 */
  runId: number;
  index: number;
  pressedCode: string | null;
}

interface TypingSequenceOptions {
  /** 이미 친 문장 — 다시 치지 않고 다 친 상태로 바로 보여 줌 (키 눌림도 없음) */
  isSkipped?: boolean;
  /** 이번 회차의 첫 키를 눌렀을 때 — 호출 측이 "친 문장" 으로 기록하는 용도 */
  onStart?: () => void;
}

const isLastIndex = (steps: readonly TypingStep[], index: number) => steps.length > 0 && index === steps.length - 1;

/** 회차가 지금 몇 번째 키까지 보여 주는지 — 치기 전·재생 안 함은 -1 */
const getShownIndex = (run: Run, progress: Progress) => {
  if (!run.isPlaying) return -1;
  if (run.isSkipped) return run.steps.length - 1;
  return progress.runId === run.id ? progress.index : -1;
};

const snapshotOf = (run: Run, progress: Progress): PreviousTyping => {
  const index = getShownIndex(run, progress);
  return { steps: run.steps, text: run.steps[index]?.text ?? '', isComplete: isLastIndex(run.steps, index) };
};

/**
 * 자동 타이핑 재생
 * - isPlaying 이 켜지면 steps 를 한 키씩 진행, 꺼지면 즉시 멈추고 누른 키 해제
 * - isSkipped 면 치지 않고 다 친 상태로 — 한 번 친 화면에 다시 들어왔을 때
 * - 입력이 바뀌면 새 회차 — 이전 회차의 진행(다 친 상태 포함)이 새 문장에 한 프레임도 비치지 않게
 * - previous: 직전 회차가 떠나기 직전 모습. 화면을 떠나 사라지는 동안 그대로 두는 용도
 */
export const useTypingSequence = (
  steps: readonly TypingStep[],
  isPlaying: boolean,
  { isSkipped = false, onStart }: TypingSequenceOptions = {},
) => {
  const [run, setRun] = useState<Run>({ id: 0, steps, isPlaying, isSkipped, previous: null });
  const [progress, setProgress] = useState<Progress>({ runId: 0, index: -1, pressedCode: null });
  const notifyStart = useEffectEvent(() => onStart?.());

  // 입력이 바뀐 렌더에서 바로 회차를 올리고 직전 모습을 찍음 — Effect 를 거치면 커밋 한 번 동안 이전 회차 기준으로 그려짐
  if (run.steps !== steps || run.isPlaying !== isPlaying || run.isSkipped !== isSkipped) {
    setRun({ id: run.id + 1, steps, isPlaying, isSkipped, previous: snapshotOf(run, progress) });
  }

  // 타이머 기반 재생 — 외부 시간 흐름과 동기화라 Effect 로 연결
  useEffect(() => {
    const { id: runId, steps: runSteps, isPlaying: runIsPlaying, isSkipped: runIsSkipped } = run;
    if (!runIsPlaying || runIsSkipped) return;

    const timers: number[] = [];
    let at = START_DELAY_MS;

    runSteps.forEach(({ code, text }, index) => {
      timers.push(
        window.setTimeout(() => {
          if (index === 0) notifyStart();
          setProgress({ runId, index, pressedCode: code });
        }, at),
      );
      timers.push(
        window.setTimeout(() => {
          setProgress((current) =>
            current.runId === runId && current.index === index ? { ...current, pressedCode: null } : current,
          );
        }, at + KEY_HOLD_MS),
      );

      at += KEY_INTERVAL_MS.min + Math.random() * KEY_INTERVAL_MS.spread + (PAUSE_AFTER_MS.get(text.slice(-1)) ?? 0);
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [run]);

  const index = getShownIndex(run, progress);
  const isRunning = isPlaying && !isSkipped && progress.runId === run.id;

  return {
    text: steps[index]?.text ?? '',
    pressedCode: isRunning ? progress.pressedCode : null,
    /** 치는 중에는 커서 고정, 치기 전·다 친 뒤에는 깜빡임 */
    isTyping: isRunning && index >= 0 && index < steps.length - 1,
    isComplete: isPlaying && isLastIndex(steps, index),
    previous: run.previous,
  };
};
