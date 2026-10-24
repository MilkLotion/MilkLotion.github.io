/**
 * 히어로 포켓몬 움직임 규칙 — 앱 pokebuddy src/motion/rules.ts 의 한가(idle) 모드만 옮김
 * - 앱에만 있는 것(작업 모드·잠·CLI 신호·친구 끌림)은 뺌
 * - 랜딩은 머무는 시간이 짧아 쉬는 시간만 줄임 (앱 7~20초 → 2~6초). 나머지 값은 앱 그대로
 */

export type Range = readonly [number, number];

export const MOTION_RULES = {
  TIMES: {
    reactMin: 1_200, // 반응 최소 길이 — 짧은 동작은 이 길이가 될 때까지 반복 (최대 4번)
  },
  IDLE: {
    pause: [2_000, 6_000] as Range, // 걷기 사이 쉬는 시간 (앱 [7_000, 20_000])
    walk: [3_000, 7_000] as Range, // 한 번 걷는 시간 — 거리가 아니라 시간으로 정함
    pace: [0.6, 1.0] as Range, // 걷는 속도 배율 — 걸을 때마다 뽑음
    fidget: [1_200, 3_000] as Range, // 쉬는 틈의 제자리 동작 길이
    lookBack: [800, 2_500] as Range, // 걷기를 마친 뒤 걸어온 쪽을 보고 서 있는 시간
    fidgetChance: 0.5, // 쉬는 틈의 칸마다 제자리 동작을 할 확률 (앱 MODES.on.fidget)
  },
  WALK: {
    turn: 0.35, // 걷는 도중 한 번 방향을 트는 확률
    turnMinMs: 1_000, // 방향을 틀고 남은 시간이 이보다 짧으면 틀지 않고 섬
    minStepPx: 24, // 이보다 짧으면 걷지 않고 제자리 동작으로 대신함
    dragTurnPx: 6, // 끄는 방향을 바꾸는 누적 이동
    speedPxPerZoom: 18, // 도트 배율 1 당 걷는 속도 (px/s)
  },
  MOVES: {
    fidget: ['LookUp', 'Rotate', 'Nod', 'Sit', 'DeepBreath'],
    pickup: ['Hurt', 'Cringe'],
    held: ['Walk', 'Idle'], // 들린 채 버둥거림 — 끄는 방향을 봄
    drop: ['Hop', 'Nod', 'Pose'],
    click: ['Nod', 'Pose', 'Hop', 'LookUp'], // 여러 개 중 무작위
    reactFallback: ['Rotate', 'Charge'], // drop·click 후보가 하나도 없을 때
  },
  /** 두리번 — Idle 을 방향만 바꿔 씀 */
  LOOK_AROUND: 'look-around',
  FIDGET_ROWS: [0, 1, 7], // 정면과 양옆 대각선. 뒤를 보고 하면 무슨 동작인지 안 보임
} as const;

/** 화면 좌표(y 아래가 +)의 이동 방향 → PMD 행 (0 아래 · 2 오른쪽 · 4 위 · 6 왼쪽, 사이는 대각선) */
export const rowOf = (dx: number, dy: number) => {
  const octant = Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
  return (((2 - octant) % 8) + 8) % 8;
};
