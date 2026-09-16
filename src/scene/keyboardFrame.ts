import {
  BACK_BEZEL,
  CASE_DEPTH,
  CASE_WIDTH,
  FRONT_HEIGHT,
  KEYCAP_REST_HEIGHT,
  PLATE_DEPTH,
  SIDE_BEZEL,
  TYPING_ANGLE_RAD,
} from './glareTkl';
import { TKL_DEPTH_U, TKL_KEYS, type TklKey } from './tklLayout';

/**
 * 키보드 좌표계 공용 값
 * - 책상 좌표계: 키보드 그룹 원점 = 윗면 앞 모서리 바로 아래 책상면
 * - 윗면 좌표계: 원점 = 윗면 앞 모서리, +y 윗면 법선 (책상 좌표계에서 FRONT_HEIGHT 위 + 11° 회전)
 */

const COS = Math.cos(TYPING_ANGLE_RAD);
const SIN = Math.sin(TYPING_ANGLE_RAD);

/** 윗면 앞 모서리 z — 바닥 투영 깊이의 절반만큼 앞으로 옮겨 키보드를 원점 중심에 둠 */
export const FRONT_EDGE_Z = (CASE_DEPTH * COS) / 2;
/** 윗면 좌표계 키캡 바닥 높이 — 케이스 윗면이 0 */
export const KEYCAP_BASE_Y = -PLATE_DEPTH + KEYCAP_REST_HEIGHT;
/** 윗면 좌표계 스위치 원점 — 보강판 윗면 */
export const SWITCH_BASE_Y = -PLATE_DEPTH;
/** 윗면 좌표계 키 영역 중심 z */
export const KEY_AREA_CENTER_Z = -CASE_DEPTH + BACK_BEZEL + TKL_DEPTH_U / 2;

/** 분해 방향 — 책상 좌표계에서 본 윗면 법선 / 윗면 좌표계의 위쪽 */
export const TILT_NORMAL: [number, number, number] = [0, COS, SIN];
export const LOCAL_UP: [number, number, number] = [0, 1, 0];

/** 키 중심 — 윗면 좌표계 (x, z) */
export const getKeyCenter = ({ x, y, width }: TklKey): [number, number] => [
  -CASE_WIDTH / 2 + SIDE_BEZEL + x + width / 2,
  -CASE_DEPTH + BACK_BEZEL + y + 0.5,
];

/** 윗면 좌표 → 씬 월드 좌표 */
export const tiltedToWorld = (x: number, y: number, z: number): [number, number, number] => [
  x,
  FRONT_HEIGHT + y * COS - z * SIN,
  FRONT_EDGE_Z + y * SIN + z * COS,
];

/** 3단계에서 확대할 스위치 — 이니셜 H 아래 */
export const FOCUS_SWITCH_CODE = 'KeyH';

const focusKey = TKL_KEYS.find(({ code }) => code === FOCUS_SWITCH_CODE) ?? TKL_KEYS[0];
const [focusX, focusZ] = getKeyCenter(focusKey);

export const FOCUS_SWITCH_POSITION: [number, number, number] = [focusX, SWITCH_BASE_Y, focusZ];
