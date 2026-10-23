import { MM } from './cherryProfile';
import { TKL_DEPTH_U, TKL_WIDTH_U } from './tklLayout';

/**
 * GEON Glare TKL 케이스 형상 — 실버 아노다이징 + 스테인리스 무게추
 * - 공식 스펙: 타이핑 각 11° · 전고 18.7mm · 톱 마운트 · 상·하판 알루미늄 6063 (geon.works)
 * - 외곽 치수는 공식 미공개 — 정면 수직 사진에서 키 피치(19.05mm)를 기준자로 베젤 역산
 *   (좌우 약 5mm · 뒤 약 8.8mm · 앞 약 9.3mm → 외곽 약 358 × 137mm)
 * - 상판 개구부: 조립 가이드 CAD 기준 — Esc / F1~4 / F5~8 / F9~12 / Print열 / 메인 / Ins·Del / 방향키 T자
 * - 윗면 좌표계: 윗면 앞 모서리 중앙 원점, +y 윗면 법선, +z 사용자 쪽
 */

export const TYPING_ANGLE_RAD = (11 * Math.PI) / 180;
export const FRONT_HEIGHT = 18.7 * MM;

export const SIDE_BEZEL = 5.05 * MM;
export const BACK_BEZEL = 8.8 * MM;
export const FRONT_BEZEL = 9.3 * MM;

export const CASE_WIDTH = TKL_WIDTH_U + SIDE_BEZEL * 2;
/** 기울어진 윗면을 따라 잰 깊이 */
export const CASE_DEPTH = TKL_DEPTH_U + BACK_BEZEL + FRONT_BEZEL;

/** [스펙 미확정] 상판 두께·플레이트 깊이 — CAD 분해도 비율 추정 */
export const TOP_CASE_THICKNESS = 11 * MM;
export const PLATE_DEPTH = 7.5 * MM;
export const PLATE_THICKNESS = 1.5 * MM;
/** 보강판이 키 영역 밖으로 나오는 폭 — 고정 탭은 별도 (internalsGeometry) */
export const PLATE_MARGIN = 0.8 * MM;
/** MX 규격 — 보강판 윗면에서 기판 윗면까지 5mm */
export const PCB_TOP_DEPTH = PLATE_DEPTH + 5 * MM;
export const PCB_THICKNESS = 1.6 * MM;
/** 기판은 키 영역보다 사방 1.9mm 작음 — 하판 내벽(조립 가이드 윗면도 실측)과 1mm 여유 */
export const PCB_MARGIN = -1.9 * MM;
/**
 * 하판 내부 포켓 — 조립 가이드 하판 윗면도(a12) 선 위치 실측, 외곽 폭 357.8mm 를 기준자로 환산
 * - 내벽 두께: 좌우 약 6mm · 뒤 약 8.9mm · 앞 약 8.3mm → 키 영역 기준 여백으로 표현 (양수 = 키 영역보다 넓음)
 * - [스펙 미확정] 바닥 깊이 — 도면에 단면이 없어 기판 아래 약 3mm 여유로 추정
 */
export const POCKET_SIDE_MARGIN = -0.9 * MM;
export const POCKET_BACK_MARGIN = 0;
export const POCKET_FRONT_MARGIN = 1 * MM;
export const POCKET_FLOOR_DEPTH = 17 * MM;
/** 플레이트 윗면 → 키캡 바닥 (스위치 미눌림) */
export const KEYCAP_REST_HEIGHT = 7.2 * MM;
/** MX 스위치 전체 트래블 */
export const KEY_TRAVEL = 4 * MM;
/** 눌림 애니메이션 감쇠 계수 — 키캡·스위치 스템·스태빌라이저 스템이 같은 속도로 움직이도록 공유 */
export const KEY_PRESS_DAMPING = 28;

/**
 * 측면·하부 형상 — 측면 사진 윤곽선 검출로 역산 (앞 모서리 전고 18.7mm 를 기준자로 사용)
 * - 몸체 밑면: 윗면과 평행, 수직 두께 약 26mm — 앞 약 40mm 구간은 책상에 평평하게 닿고 그 뒤로 올라감
 * - 꺾임선: 앞 6.7mm → 뒤 20.7mm 로 오르는 직선 — 위는 수직 면, 아래는 안쪽으로 기운 모따기 면
 * - 무게추: 몸체 밑면과 책상 사이 삼각 단면, 뒷면은 약 42° 경사면에 USB-C 포트 구멍
 */
export const SHELL_THICKNESS = 26 * MM;
export const CREASE_FRONT_HEIGHT = 6.7 * MM;
/** 꺾임선 기울기 — 뒤로 1 갈 때 오르는 높이 비율 */
export const CREASE_SLOPE = 0.1037;
/** [스펙 미확정] 옆면 모따기 각 — 측면 정사진으로는 안쪽 들어간 폭을 잴 수 없어 추정 */
export const SIDE_CHAMFER_ANGLE_RAD = (25 * Math.PI) / 180;
/** 앞면 모따기 각 — 수직 기준 (측면 사진 윤곽 꺾임 실측) */
export const FRONT_CHAMFER_ANGLE_RAD = (24 * Math.PI) / 180;
/** 무게추 뒷면 경사 — 수평 기준 */
export const WEIGHT_BACK_ANGLE_RAD = (42 * Math.PI) / 180;
/** 몸체 뒷면에서 무게추 경사면 시작까지 */
export const WEIGHT_BACK_RIM = 3 * MM;
/** 몸체와 무게추 사이 분할 틈 */
export const WEIGHT_GAP = 0.25 * MM;
/** [스펙 미확정] 포트 구멍 크기 — 바닥 사진 비율 추정 */
export const PORT_SLOT_WIDTH = 12 * MM;
export const PORT_SLOT_HEIGHT = 5.5 * MM;

/** 개구부와 키 셀 사이 여유 — 상판 모서리 베벨만큼 좁아지는 것 포함 */
const OPENING_CLEARANCE = 0.6 * MM;

export type Polygon = readonly (readonly [x: number, y: number])[];

/** 키 영역 좌표(u, 왼쪽 위 원점) 사각 개구부 */
const rectOpening = (x: number, y: number, width: number, height: number): Polygon => {
  const c = OPENING_CLEARANCE;
  return [
    [x - c, y - c],
    [x + width + c, y - c],
    [x + width + c, y + height + c],
    [x - c, y + height + c],
  ];
};

/** 방향키 T자 개구부 */
const arrowOpening = (): Polygon => {
  const c = OPENING_CLEARANCE;
  return [
    [16.25 - c, 4.25 - c],
    [17.25 + c, 4.25 - c],
    [17.25 + c, 5.25 - c],
    [18.25 + c, 5.25 - c],
    [18.25 + c, 6.25 + c],
    [15.25 - c, 6.25 + c],
    [15.25 - c, 5.25 - c],
    [16.25 - c, 5.25 - c],
  ];
};

export const TOP_CASE_OPENINGS: readonly Polygon[] = [
  rectOpening(0, 0, 1, 1),
  rectOpening(2, 0, 4, 1),
  rectOpening(6.5, 0, 4, 1),
  rectOpening(11, 0, 4, 1),
  rectOpening(15.25, 0, 3, 1),
  rectOpening(0, 1.25, 15, 5),
  rectOpening(15.25, 1.25, 3, 2),
  arrowOpening(),
];
