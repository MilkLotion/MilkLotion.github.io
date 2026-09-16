import { FOCUS_SWITCH_POSITION, tiltedToWorld } from './keyboardFrame';

/**
 * 스크롤 분해 단계
 * - 0: 조립 상태
 * - 1: 키캡 · 상판 · 기보강(보강판 + 기판 + 스위치) · 하판(무게추 포함)
 * - 2: 키캡 · 상판 · 스위치 · 보강판 · 기판 · 하판 · 무게추
 * - 3: 스위치 확대 — 상부 하우징 · 스템 · 스프링 · 하부 하우징
 */
export type ExplodeStage = 0 | 1 | 2 | 3;

export const EXPLODE_STAGES: readonly ExplodeStage[] = [0, 1, 2, 3];

export type LayerId = 'keycaps' | 'topCase' | 'switches' | 'plate' | 'pcb' | 'bottomCase' | 'weight';

/** 레이어별 분해 거리 (u, 윗면 법선 방향) — 무게추를 바닥에 두고 위로 쌓음 */
export const LAYER_OFFSETS: Readonly<Record<ExplodeStage, Readonly<Record<LayerId, number>>>> = {
  0: { keycaps: 0, topCase: 0, switches: 0, plate: 0, pcb: 0, bottomCase: 0, weight: 0 },
  1: { keycaps: 6.6, topCase: 4.4, switches: 2.2, plate: 2.2, pcb: 2.2, bottomCase: 0, weight: 0 },
  2: { keycaps: 14, topCase: 11.5, switches: 9, plate: 7, pcb: 5, bottomCase: 2.5, weight: 0 },
  // 확대 스위치 주변을 비우려고 스위치보다 위 레이어를 화면 밖으로 올림
  3: { keycaps: 26, topCase: 22, switches: 9, plate: 7, pcb: 5, bottomCase: 2.5, weight: 0 },
};

export type SwitchPartId = 'topHousing' | 'stem' | 'spring' | 'bottomHousing';

/** 3단계 확대 스위치 부품 거리 (u) — 주변 스위치 위로 띄운 뒤 벌림 */
export const SWITCH_PART_OFFSETS: Readonly<Record<SwitchPartId, number>> = {
  topHousing: 3.5,
  stem: 2.6,
  spring: 1.75,
  bottomHousing: 0.9,
};

/** 기본 세로 화각 (deg) */
export const DEFAULT_CAMERA_FOV = 35;

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  /** 세로 화각 (deg) — 없으면 DEFAULT_CAMERA_FOV */
  fov?: number;
  /**
   * 렌즈 세로 평행 이동 — 화면 높이 비율, 양수면 장면이 아래로 (없으면 0)
   * - 카메라 각도·회전 중심은 그대로 두고 화면 속 위치만 옮길 때 사용
   */
  viewShiftY?: number;
}

/** 카메라가 바라볼 확대 스위치 높이 (u) — 부품 높이 중앙보다 조금 낮춰 화면 아래 안내와 겹치지 않게 */
const FOCUS_LOOK_HEIGHT = 1.95;

const focusTarget = tiltedToWorld(
  FOCUS_SWITCH_POSITION[0],
  FOCUS_SWITCH_POSITION[1] + LAYER_OFFSETS[3].switches + FOCUS_LOOK_HEIGHT,
  FOCUS_SWITCH_POSITION[2],
);

/** 단계별 카메라 — 월드 좌표, 16:9 가로 화면 기준 */
export const CAMERA_POSES: Readonly<Record<ExplodeStage, CameraPose>> = {
  0: { position: [0, 13, 17], target: [0, 0.8, 0] },
  1: { position: [-10, 15, 28], target: [0, 3.4, 0.4] },
  2: { position: [-14, 18.5, 32], target: [0, 7.6, 1] },
  3: {
    position: [focusTarget[0] + 3.4, focusTarget[1] + 2.2, focusTarget[2] + 6.4],
    target: focusTarget,
  },
};
