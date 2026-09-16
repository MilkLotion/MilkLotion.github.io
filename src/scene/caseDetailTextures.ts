import { CanvasTexture, SRGBColorSpace } from 'three';

import { MM, U_MM } from './cherryProfile';
import { POCKET_BACK_Z, POCKET_FRONT_Z, POCKET_HALF_WIDTH } from './glareCaseGeometry';
import {
  CASE_DEPTH,
  CASE_WIDTH,
  FRONT_HEIGHT,
  POCKET_FLOOR_DEPTH,
  SHELL_THICKNESS,
  TYPING_ANGLE_RAD,
  WEIGHT_BACK_RIM,
  WEIGHT_GAP,
} from './glareTkl';

/**
 * 하판 바닥 · 무게추 윗면 가공 디테일 — 캔버스 데칼
 * - 배치: 조립 가이드 하판 윗면도(a12) · 무게추 렌더(a07) · 도터보드 확대(a08) 비율
 * - 볼록 다면체에는 UV 가 없어 윗면 좌표계 평면을 살짝 띄워 덮음
 * - 캔버스 위쪽 = 키보드 뒤쪽, u·v 는 0~1 비율 좌표
 */

const PX_PER_MM = 4;
/** 면 위로 띄우는 거리 — 겹침 깜빡임 방지 */
const DECAL_LIFT = 0.05 * MM;

const PALETTE = {
  case: '#c9c9c6',
  caseRecess: '#b9b9b5',
  caseEdge: '#8d8d89',
  caseHighlight: '#e3e3df',
  engraving: '#7a7a76',
  weight: '#adafb0',
  weightRecess: '#9d9fa1',
  weightEdge: '#77797b',
  weightHighlight: '#c6c8c9',
  bracket: '#c7a35f',
  board: '#141517',
  usb: '#b8bbbf',
  connector: '#d9cfb4',
  screw: '#34353a',
  cable: '#0e0e10',
} as const;

interface RecessStyle {
  fill: string;
  edge: string;
  highlight: string;
}

const CASE_RECESS: RecessStyle = { fill: PALETTE.caseRecess, edge: PALETTE.caseEdge, highlight: PALETTE.caseHighlight };
const WEIGHT_RECESS: RecessStyle = {
  fill: PALETTE.weightRecess,
  edge: PALETTE.weightEdge,
  highlight: PALETTE.weightHighlight,
};

/** 비율 좌표 붓 — 캔버스 크기와 mm 환산을 묶음 */
const createPainter = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const mm = (value: number) => value * PX_PER_MM;

  const recess = (u0: number, v0: number, u1: number, v1: number, style: RecessStyle, radiusMm = 2) => {
    const x = u0 * width;
    const y = v0 * height;
    const w = (u1 - u0) * width;
    const h = (v1 - v0) * height;
    const radius = Math.min(mm(radiusMm), w / 2, h / 2);

    context.fillStyle = style.fill;
    context.beginPath();
    context.roundRect(x, y, w, h, radius);
    context.fill();

    context.strokeStyle = style.edge;
    context.lineWidth = mm(0.5);
    context.stroke();

    // 안쪽 턱 반사광
    context.strokeStyle = style.highlight;
    context.lineWidth = mm(0.3);
    context.beginPath();
    context.roundRect(x + mm(0.7), y + mm(0.7), w - mm(1.4), h - mm(1.4), Math.max(0, radius - mm(0.7)));
    context.stroke();
  };

  const circle = (u: number, v: number, radiusMm: number, color: string) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(u * width, v * height, mm(radiusMm), 0, Math.PI * 2);
    context.fill();
  };

  /** 중심 비율 좌표 + mm 크기 사각 */
  const rectMm = (u: number, v: number, widthMm: number, heightMm: number, color: string, radiusMm = 0.6) => {
    context.fillStyle = color;
    context.beginPath();
    context.roundRect(u * width - mm(widthMm) / 2, v * height - mm(heightMm) / 2, mm(widthMm), mm(heightMm), mm(radiusMm));
    context.fill();
  };

  return { recess, circle, rectMm, mm, uPerMm: 1 / (width / PX_PER_MM), vPerMm: 1 / (height / PX_PER_MM) };
};

const createCanvas = (widthMm: number, depthMm: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(widthMm * PX_PER_MM);
  canvas.height = Math.round(depthMm * PX_PER_MM);
  return canvas;
};

const toTexture = (canvas: HTMLCanvasElement) => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

/** 하판 주 포켓 안 가로 슬롯 (v 중심, u 구간들) — a12 선 위치 실측 비율 */
const FLOOR_SLOT_ROWS: readonly { v: number; segments: readonly (readonly [number, number])[] }[] = [
  { v: 0.51, segments: [[0.037, 0.475], [0.508, 0.711], [0.734, 0.802]] },
  { v: 0.677, segments: [[0.02, 0.069], [0.091, 0.7], [0.734, 0.79]] },
  { v: 0.847, segments: [[0.02, 0.069], [0.091, 0.221], [0.244, 0.565], [0.585, 0.7], [0.723, 0.79]] },
];
const FLOOR_SLOT_HALF_V = 0.0225;
const FLOOR_SCREWS: readonly (readonly [u: number, v: number])[] = [
  [0.03, 0.06],
  [0.35, 0.06],
  [0.63, 0.06],
  [0.965, 0.06],
  [0.018, 0.51],
  [0.49, 0.51],
  [0.965, 0.51],
];

const createBottomFloorTexture = (widthMm: number, depthMm: number) => {
  const canvas = createCanvas(widthMm, depthMm);
  const context = canvas.getContext('2d');
  if (!context) return toTexture(canvas);

  const paint = createPainter(context, canvas.width, canvas.height);
  context.fillStyle = PALETTE.case;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // 뒤쪽 긴 띠 포켓 2개 · 주 포켓 · 오른쪽 세로 칸
  paint.recess(0.006, 0.004, 0.994, 0.12, CASE_RECESS);
  paint.recess(0.006, 0.19, 0.994, 0.33, CASE_RECESS);
  paint.recess(0.006, 0.37, 0.81, 0.994, CASE_RECESS);
  paint.recess(0.828, 0.375, 0.992, 0.51, CASE_RECESS);
  paint.recess(0.828, 0.705, 0.992, 0.83, CASE_RECESS);
  paint.recess(0.828, 0.86, 0.992, 0.98, CASE_RECESS);

  FLOOR_SLOT_ROWS.forEach(({ v, segments }) => {
    segments.forEach(([u0, u1]) => paint.recess(u0, v - FLOOR_SLOT_HALF_V, u1, v + FLOOR_SLOT_HALF_V, CASE_RECESS, 1));
  });
  paint.recess(0.716, 0.45, 0.73, 0.93, CASE_RECESS, 1);
  paint.recess(0.786, 0.45, 0.8, 0.93, CASE_RECESS, 1);

  FLOOR_SCREWS.forEach(([u, v]) => {
    paint.circle(u, v, 2.2, PALETTE.caseHighlight);
    paint.circle(u, v, 1.5, PALETTE.screw);
  });

  // 도터보드 케이블 브래킷 (ㄱ자)
  context.fillStyle = PALETTE.bracket;
  context.beginPath();
  context.moveTo(0.717 * canvas.width, 0.21 * canvas.height);
  context.lineTo(0.852 * canvas.width, 0.21 * canvas.height);
  context.lineTo(0.852 * canvas.width, 0.29 * canvas.height);
  context.lineTo(0.8 * canvas.width, 0.29 * canvas.height);
  context.lineTo(0.8 * canvas.width, 0.25 * canvas.height);
  context.lineTo(0.717 * canvas.width, 0.25 * canvas.height);
  context.closePath();
  context.fill();

  // 각인 — 오른쪽 칸 (실제 제품 각인 문구)
  context.fillStyle = PALETTE.engraving;
  context.textBaseline = 'alphabetic';
  context.font = `700 ${paint.mm(4.4)}px Arial, sans-serif`;
  context.fillText('Glare TKL 4th', 0.834 * canvas.width, 0.585 * canvas.height);
  context.font = `600 ${paint.mm(2.3)}px Arial, sans-serif`;
  context.fillText('Designed and Manufactured', 0.834 * canvas.width, 0.635 * canvas.height);
  context.fillText('in South Korea, Geonworks', 0.834 * canvas.width, 0.675 * canvas.height);

  return toTexture(canvas);
};

const createWeightTopTexture = (widthMm: number, depthMm: number) => {
  const canvas = createCanvas(widthMm, depthMm);
  const context = canvas.getContext('2d');
  if (!context) return toTexture(canvas);

  const paint = createPainter(context, canvas.width, canvas.height);
  context.fillStyle = PALETTE.weight;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // 경량화 포켓 2행 × 4열 — 앞쪽 2/3
  const columnGap = 0.025;
  const margin = 0.03;
  const columnWidth = (1 - margin * 2 - columnGap * 3) / 4;
  [
    [0.36, 0.64],
    [0.67, 0.95],
  ].forEach(([v0, v1]) => {
    Array.from({ length: 4 }, (_, column) => margin + column * (columnWidth + columnGap)).forEach((u0) => {
      paint.recess(u0, v0, u0 + columnWidth, v1, WEIGHT_RECESS, 3);
    });
  });

  // 도터보드 포켓 — 후면 포트와 같은 가로 중앙
  const halfPocketU = 13 * paint.uPerMm;
  paint.recess(0.5 - halfPocketU, 0.03, 0.5 + halfPocketU, 0.27, WEIGHT_RECESS, 2.5);
  // 케이블 홈 — 포켓 앞에서 오른쪽으로
  paint.recess(0.5 - 3 * paint.uPerMm, 0.26, 0.78, 0.31, WEIGHT_RECESS, 2);

  paint.rectMm(0.5, 0.15, 20, 17, PALETTE.board, 1.2);
  paint.rectMm(0.5, 0.075, 9, 3.3, PALETTE.usb, 1.2);
  paint.rectMm(0.5, 0.235, 7, 3, PALETTE.connector, 0.3);
  [-1, 1].forEach((sideU) => {
    [0.08, 0.215].forEach((v) => paint.circle(0.5 + sideU * 7.5 * paint.uPerMm, v, 1.3, PALETTE.screw));
  });

  context.strokeStyle = PALETTE.cable;
  context.lineWidth = paint.mm(2);
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(0.5 * canvas.width, 0.255 * canvas.height);
  context.lineTo(0.5 * canvas.width, 0.285 * canvas.height);
  context.lineTo(0.77 * canvas.width, 0.285 * canvas.height);
  context.stroke();

  return toTexture(canvas);
};

export interface TiltedDecal {
  width: number;
  depth: number;
  /** 윗면 좌표계 중심 z · 높이 y */
  centerZ: number;
  y: number;
  texture: CanvasTexture;
}

const createDecal = (width: number, frontZ: number, backZ: number, y: number, paint: typeof createBottomFloorTexture) => ({
  width,
  depth: frontZ - backZ,
  centerZ: (frontZ + backZ) / 2,
  y,
  texture: paint(width * U_MM, (frontZ - backZ) * U_MM),
});

/** 무게추 윗면 앞 끝 — 몸체 밑면과 책상면이 만나는 선 (윗면 좌표계 z) */
const WEIGHT_TIP_Z =
  (FRONT_HEIGHT - SHELL_THICKNESS * Math.cos(TYPING_ANGLE_RAD)) / Math.sin(TYPING_ANGLE_RAD);

export const BOTTOM_FLOOR_DECAL: TiltedDecal = createDecal(
  POCKET_HALF_WIDTH * 2,
  POCKET_FRONT_Z,
  POCKET_BACK_Z,
  -POCKET_FLOOR_DEPTH + DECAL_LIFT,
  createBottomFloorTexture,
);

export const WEIGHT_TOP_DECAL: TiltedDecal = createDecal(
  CASE_WIDTH - 16 * MM,
  WEIGHT_TIP_Z - 2 * MM,
  -CASE_DEPTH + WEIGHT_BACK_RIM + 2 * MM,
  -SHELL_THICKNESS - WEIGHT_GAP + DECAL_LIFT,
  createWeightTopTexture,
);
