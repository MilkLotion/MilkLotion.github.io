import { ExtrudeGeometry, Path, Shape, ShapeGeometry, Vector3, type BufferGeometry } from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

import { MM } from './cherryProfile';
import {
  BACK_BEZEL,
  CASE_DEPTH,
  CASE_WIDTH,
  CREASE_FRONT_HEIGHT,
  CREASE_SLOPE,
  FRONT_BEZEL,
  FRONT_CHAMFER_ANGLE_RAD,
  FRONT_HEIGHT,
  POCKET_BACK_MARGIN,
  POCKET_FLOOR_DEPTH,
  POCKET_FRONT_MARGIN,
  POCKET_SIDE_MARGIN,
  PORT_SLOT_HEIGHT,
  PORT_SLOT_WIDTH,
  SHELL_THICKNESS,
  SIDE_BEZEL,
  SIDE_CHAMFER_ANGLE_RAD,
  TOP_CASE_OPENINGS,
  TOP_CASE_THICKNESS,
  TYPING_ANGLE_RAD,
  WEIGHT_BACK_ANGLE_RAD,
  WEIGHT_BACK_RIM,
  WEIGHT_GAP,
  type Polygon,
} from './glareTkl';
import { TKL_WIDTH_U } from './tklLayout';

/**
 * Glare TKL 케이스 지오메트리
 * - 상판: 윗면 좌표계에서 개구부 구멍을 뚫어 두께만큼 돌출
 * - 하판·무게추: 책상 좌표계 — 볼록 다면체를 반공간(평면) 교집합으로 정의하고
 *   평면 3개씩의 교점 중 모든 조건을 만족하는 점으로 볼록 껍질 생성
 * - 하판은 내부 포켓을 비우려고 볼록 조각 5개(바닥 + 사방 벽)로 나눔
 * - 책상 좌표계 원점: 윗면 앞 모서리 중앙 바로 아래 책상면, +y 위, +z 사용자 쪽
 * - 모듈에서 한 번 생성해 앱 수명 동안 공유
 */

// ── 상판 ────────────────────────────────────────

export const TOP_FRAME_BEVEL = 0.45 * MM;
/** 평면 모서리 각짐 — 하판(볼록 다면체) 모서리와 맞추고, 리뷰의 "pointed edges" 묘사와 일치 */
const TOP_FRAME_CORNER_RADIUS = 0;

/** 키 영역 좌표(u, 뒤→앞) → 상판 셰이프 좌표 (x, 앞 모서리에서 뒤쪽 거리) */
const toShapePoint = ([x, y]: Polygon[number]) =>
  [-CASE_WIDTH / 2 + SIDE_BEZEL + x, CASE_DEPTH - BACK_BEZEL - y] as const;

/** 둥근 사각 경로 — (centerX, centerY) 중심 */
const traceRoundedRect = <T extends Path>(
  path: T,
  width: number,
  height: number,
  radius: number,
  centerX = 0,
  centerY = 0,
): T => {
  const left = centerX - width / 2;
  const right = centerX + width / 2;
  const bottom = centerY - height / 2;
  const top = centerY + height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  // 반지름 0 이면 각진 사각 — 길이 0 호가 겹친 점을 만들어 삼각분할을 깨뜨리지 않게 분기
  if (r <= 0) {
    path.moveTo(left, bottom);
    path.lineTo(right, bottom);
    path.lineTo(right, top);
    path.lineTo(left, top);
    path.lineTo(left, bottom);
    return path;
  }

  path.moveTo(left + r, bottom);
  path.lineTo(right - r, bottom);
  path.absarc(right - r, bottom + r, r, -Math.PI / 2, 0, false);
  path.lineTo(right, top - r);
  path.absarc(right - r, top - r, r, 0, Math.PI / 2, false);
  path.lineTo(left + r, top);
  path.absarc(left + r, top - r, r, Math.PI / 2, Math.PI, false);
  path.lineTo(left, bottom + r);
  path.absarc(left + r, bottom + r, r, Math.PI, Math.PI * 1.5, false);
  return path;
};

/** 베벨이 외곽을 넓히고 구멍을 좁히므로 외곽은 미리 베벨만큼 줄임 */
const createTopFrameGeometry = () => {
  const outline = traceRoundedRect(
    new Shape(),
    CASE_WIDTH - TOP_FRAME_BEVEL * 2,
    CASE_DEPTH - TOP_FRAME_BEVEL * 2,
    TOP_FRAME_CORNER_RADIUS,
    0,
    CASE_DEPTH / 2,
  );

  TOP_CASE_OPENINGS.forEach((polygon) => {
    const [first, ...rest] = polygon.map(toShapePoint);
    const hole = new Path();
    hole.moveTo(...first);
    rest.forEach((point) => hole.lineTo(...point));
    hole.closePath();
    outline.holes.push(hole);
  });

  return new ExtrudeGeometry(outline, {
    depth: TOP_CASE_THICKNESS - TOP_FRAME_BEVEL * 2,
    bevelEnabled: true,
    bevelThickness: TOP_FRAME_BEVEL,
    bevelSize: TOP_FRAME_BEVEL,
    bevelSegments: 2,
    curveSegments: 4,
  });
};

// ── 반공간 ──────────────────────────────────────

interface HalfSpace {
  /** 안쪽 조건: normal · p ≤ d */
  normal: readonly [number, number, number];
  d: number;
}

const COS = Math.cos(TYPING_ANGLE_RAD);
const SIN = Math.sin(TYPING_ANGLE_RAD);
const SIDE_TAN = Math.tan(SIDE_CHAMFER_ANGLE_RAD);
const FRONT_TAN = Math.tan(FRONT_CHAMFER_ANGLE_RAD);
const BACK_COT = 1 / Math.tan(WEIGHT_BACK_ANGLE_RAD);
const HALF_WIDTH = CASE_WIDTH / 2;

/** 윗면 평면 상수 — 법선 (0, cos, sin) 기준, 앞 모서리를 지남 */
const TOP_PLANE_D = FRONT_HEIGHT * COS;
/** 하판을 상판 밑으로 겹쳐 올리는 양 — 상판 아래 모서리 베벨 틈 메움 */
const BODY_OVERLAP = 0.6 * MM;
/** 하판 외벽을 상판 벽보다 들이는 양 — 겹친 띠에서 같은 평면끼리 깜빡이지 않게, 상·하판 분할선 역할 */
const BODY_INSET = 0.05 * MM;
/** 앞면에서 꺾임선이 지나는 z */
const FRONT_CREASE_Z = (-(FRONT_HEIGHT - CREASE_FRONT_HEIGHT) * SIN) / COS;

const SOLVE_EPSILON = 1e-12;
const INSIDE_TOLERANCE = 1e-6;
const MERGE_DISTANCE_SQ = 1e-10;

// 윗면 좌표계 조건(y_local, z_local)을 책상 좌표계 반공간으로 변환
const localYAtMost = (value: number): HalfSpace => ({ normal: [0, COS, SIN], d: TOP_PLANE_D + value });
const localYAtLeast = (value: number): HalfSpace => ({ normal: [0, -COS, -SIN], d: -(TOP_PLANE_D + value) });
const localZAtMost = (value: number): HalfSpace => ({ normal: [0, -SIN, COS], d: value - FRONT_HEIGHT * SIN });
const localZAtLeast = (value: number): HalfSpace => ({ normal: [0, SIN, -COS], d: FRONT_HEIGHT * SIN - value });
const xAtMost = (value: number): HalfSpace => ({ normal: [1, 0, 0], d: value });
const xAtLeast = (value: number): HalfSpace => ({ normal: [-1, 0, 0], d: -value });
const ABOVE_DESK: HalfSpace = { normal: [0, -1, 0], d: 0 };

/** 옆면 모따기 — 꺾임선을 지나 안쪽 아래로 기운 평면, inset 만큼 더 안쪽 */
const sideChamfer = (side: 1 | -1, inset: number): HalfSpace => ({
  normal: [side, -SIDE_TAN, -SIDE_TAN * CREASE_SLOPE],
  d: HALF_WIDTH - SIDE_TAN * CREASE_FRONT_HEIGHT - inset,
});

// ── 하판 ────────────────────────────────────────

/** 하판 외곽 전체 (포켓 비우기 전) */
const CASE_BODY: readonly HalfSpace[] = [
  localYAtMost(-TOP_CASE_THICKNESS + BODY_OVERLAP),
  ABOVE_DESK,
  // 윗면과 평행한 몸체 밑면 위 — 뒤쪽은 이 아래에 무게추
  localYAtLeast(-SHELL_THICKNESS),
  xAtMost(HALF_WIDTH - BODY_INSET),
  xAtLeast(-HALF_WIDTH + BODY_INSET),
  sideChamfer(1, 0),
  sideChamfer(-1, 0),
  // 앞면·뒷면 — 윗면에 수직
  localZAtMost(-BODY_INSET),
  { normal: [0, -FRONT_TAN, 1], d: FRONT_CREASE_Z - FRONT_TAN * CREASE_FRONT_HEIGHT },
  localZAtLeast(-CASE_DEPTH + BODY_INSET),
];

/** 포켓 경계 — 윗면 좌표계, 바닥 각인 데칼도 같은 경계 사용 */
export const POCKET_HALF_WIDTH = TKL_WIDTH_U / 2 + POCKET_SIDE_MARGIN;
export const POCKET_FRONT_Z = -FRONT_BEZEL + POCKET_FRONT_MARGIN;
export const POCKET_BACK_Z = -CASE_DEPTH + BACK_BEZEL - POCKET_BACK_MARGIN;
const ABOVE_POCKET_FLOOR = localYAtLeast(-POCKET_FLOOR_DEPTH);
const WITHIN_POCKET_DEPTH = [localZAtLeast(POCKET_BACK_Z), localZAtMost(POCKET_FRONT_Z)];

const BOTTOM_CASE_PIECES: readonly (readonly HalfSpace[])[] = [
  // 바닥
  [...CASE_BODY, localYAtMost(-POCKET_FLOOR_DEPTH)],
  // 앞벽 · 뒷벽
  [...CASE_BODY, ABOVE_POCKET_FLOOR, localZAtLeast(POCKET_FRONT_Z)],
  [...CASE_BODY, ABOVE_POCKET_FLOOR, localZAtMost(POCKET_BACK_Z)],
  // 왼벽 · 오른벽
  [...CASE_BODY, ABOVE_POCKET_FLOOR, ...WITHIN_POCKET_DEPTH, xAtMost(-POCKET_HALF_WIDTH)],
  [...CASE_BODY, ABOVE_POCKET_FLOOR, ...WITHIN_POCKET_DEPTH, xAtLeast(POCKET_HALF_WIDTH)],
];

// ── 무게추 ──────────────────────────────────────

/** 무게추 경사면 윗모서리 — 몸체 밑면 위, 뒷면에서 WEIGHT_BACK_RIM 만큼 앞 */
const WEIGHT_TOP_BACK_Y = FRONT_HEIGHT - SHELL_THICKNESS * COS + (CASE_DEPTH - WEIGHT_BACK_RIM) * SIN;
const WEIGHT_TOP_BACK_Z = -SHELL_THICKNESS * SIN - (CASE_DEPTH - WEIGHT_BACK_RIM) * COS;

const WEIGHT: readonly HalfSpace[] = [
  ABOVE_DESK,
  localYAtMost(-SHELL_THICKNESS - WEIGHT_GAP),
  // 옆면은 하판 모따기 면을 그대로 이어 내림
  sideChamfer(1, WEIGHT_GAP),
  sideChamfer(-1, WEIGHT_GAP),
  // 뒷면 경사
  { normal: [0, -BACK_COT, -1], d: -WEIGHT_TOP_BACK_Z - WEIGHT_TOP_BACK_Y * BACK_COT },
];

// ── 볼록 다면체 생성 ────────────────────────────

/** 평면 3개 교점 — 크래머 공식 */
const intersectPlanes = (a: HalfSpace, b: HalfSpace, c: HalfSpace): Vector3 | null => {
  const [a1, a2, a3] = a.normal;
  const [b1, b2, b3] = b.normal;
  const [c1, c2, c3] = c.normal;
  const det = a1 * (b2 * c3 - b3 * c2) - a2 * (b1 * c3 - b3 * c1) + a3 * (b1 * c2 - b2 * c1);
  if (Math.abs(det) < SOLVE_EPSILON) return null;

  return new Vector3(
    (a.d * (b2 * c3 - b3 * c2) - a2 * (b.d * c3 - b3 * c.d) + a3 * (b.d * c2 - b2 * c.d)) / det,
    (a1 * (b.d * c3 - b3 * c.d) - a.d * (b1 * c3 - b3 * c1) + a3 * (b1 * c.d - b.d * c1)) / det,
    (a1 * (b2 * c.d - b.d * c2) - a2 * (b1 * c.d - b.d * c1) + a.d * (b1 * c2 - b2 * c1)) / det,
  );
};

const isInside = (point: Vector3, halfSpaces: readonly HalfSpace[]) =>
  halfSpaces.every(
    ({ normal: [nx, ny, nz], d }) => nx * point.x + ny * point.y + nz * point.z <= d + INSIDE_TOLERANCE,
  );

const createConvexSolid = (halfSpaces: readonly HalfSpace[]): BufferGeometry => {
  const vertices: Vector3[] = [];

  halfSpaces.forEach((a, i) => {
    halfSpaces.slice(i + 1).forEach((b, offset) => {
      halfSpaces.slice(i + offset + 2).forEach((c) => {
        const point = intersectPlanes(a, b, c);
        if (!point || !isInside(point, halfSpaces)) return;
        if (vertices.some((vertex) => vertex.distanceToSquared(point) < MERGE_DISTANCE_SQ)) return;
        vertices.push(point);
      });
    });
  });

  return new ConvexGeometry(vertices);
};

// ── 후면 포트 ───────────────────────────────────

/** USB-C 리셉터클 규격 (mm) */
const USB_C_WIDTH = 8.94 * MM;
const USB_C_HEIGHT = 3.26 * MM;
const USB_C_SHELL = 0.45 * MM;
const USB_C_TONGUE_WIDTH = 6.7 * MM;
const USB_C_TONGUE_HEIGHT = 0.7 * MM;

const createUsbShellGeometry = () => {
  const shell = traceRoundedRect(new Shape(), USB_C_WIDTH, USB_C_HEIGHT, USB_C_HEIGHT / 2);
  const innerHeight = USB_C_HEIGHT - USB_C_SHELL * 2;
  shell.holes.push(traceRoundedRect(new Path(), USB_C_WIDTH - USB_C_SHELL * 2, innerHeight, innerHeight / 2));
  return new ShapeGeometry(shell, 12);
};

/** 무게추 경사면 중앙 — 셰이프 +z 가 경사면 바깥(뒤·아래)을 향하도록 x축 회전 */
export const PORT_CENTER: [number, number, number] = [
  0,
  WEIGHT_TOP_BACK_Y / 2,
  WEIGHT_TOP_BACK_Z + (WEIGHT_TOP_BACK_Y / 2) * BACK_COT,
];
export const PORT_ROTATION_X = Math.PI / 2 + WEIGHT_BACK_ANGLE_RAD;

export const TOP_FRAME_GEOMETRY = createTopFrameGeometry();
export const BOTTOM_CASE_GEOMETRIES = BOTTOM_CASE_PIECES.map((piece) => createConvexSolid(piece));
export const WEIGHT_GEOMETRY = createConvexSolid(WEIGHT);
export const PORT_SLOT_GEOMETRY = new ShapeGeometry(
  traceRoundedRect(new Shape(), PORT_SLOT_WIDTH, PORT_SLOT_HEIGHT, PORT_SLOT_HEIGHT / 2),
  12,
);
export const USB_C_SHELL_GEOMETRY = createUsbShellGeometry();
export const USB_C_TONGUE_GEOMETRY = new ShapeGeometry(
  traceRoundedRect(new Shape(), USB_C_TONGUE_WIDTH, USB_C_TONGUE_HEIGHT, USB_C_TONGUE_HEIGHT / 3),
  4,
);
