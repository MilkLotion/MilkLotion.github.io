import { BoxGeometry, CanvasTexture, ExtrudeGeometry, MeshStandardMaterial, Path, Shape, SRGBColorSpace } from 'three';

import { MM, U_MM } from './cherryProfile';
import { PCB_MARGIN, PCB_THICKNESS, PLATE_MARGIN, PLATE_THICKNESS } from './glareTkl';
import { getKeyCenter, KEY_AREA_CENTER_Z } from './keyboardFrame';
import { SWITCH_PIN_POSITIONS_MM } from './mxSwitchGeometry';
import { STAB_HOUSING_Z_MM, STABILIZERS } from './stabilizerGeometry';
import { TKL_DEPTH_U, TKL_KEYS, TKL_WIDTH_U } from './tklLayout';

/**
 * 기보강 내부 부품 지오메트리 — 윗면 좌표계
 * - 보강판: 본체 + 방향키 구역 2조각 (Glare 전용 보강판 사진), 상판 고정 탭 8개 — 뒤 5 · 앞 3 (조립 가이드 M2.5 × 8)
 *   스위치 컷아웃 14mm · 스태빌 컷아웃 (유연 슬릿 생략)
 * - 기판: 윗면에 실크 외곽선 · 센터 홀 · 핀 패드 · 다이오드 · 스태빌 고정 홀
 */

const SWITCH_CUTOUT = 14 * MM;
const STAB_CUTOUT_WIDTH = 7 * MM;
const STAB_CUTOUT_CLEARANCE = 0.6 * MM;
/** 본체·방향키 구역 분할 (키 영역 x, u) — 0.25u 간격 가운데 */
const PLATE_SPLIT_U = 15.125;
const PLATE_SPLIT_GAP = 2.4 * MM;
const TAB_WIDTH = 12 * MM;
const TAB_DEPTH = 4.5 * MM;
const TAB_HOLE_RADIUS = 1.35 * MM;
/** 고정 탭 위치 (키 영역 x, u) — 보강판 사진에서 스위치 구멍 피치 기준 실측 */
const BACK_TAB_U = [1.53, 6.28, 10.84, 14.15, 16.9];
const FRONT_TAB_U = [1.96, 13.09, 16.78];

const PCB_PX_PER_MM = 5;
const PCB_COLORS = {
  board: '#141517',
  silk: '#d7d7d2',
  pad: '#c9a45c',
  hole: '#060606',
  diode: '#262626',
} as const;
/** 체리 PCB 스태빌 고정 홀 (스템 기준 z mm, 반지름 mm) */
const STAB_PCB_HOLES_MM: readonly (readonly [z: number, radius: number])[] = [
  [-6.985, 1.525],
  [8.255, 2],
];

const PCB_WIDTH = TKL_WIDTH_U + PCB_MARGIN * 2;
const PCB_DEPTH = TKL_DEPTH_U + PCB_MARGIN * 2;

// 셰이프 좌표: (x, s) — s 는 앞 모서리 기준 뒤쪽 거리(= -z), 돌출 후 x축 -90° 회전으로 눕힘
const KEY_AREA_LEFT = -TKL_WIDTH_U / 2;
const toX = (u: number) => KEY_AREA_LEFT + u;
const PLATE_BACK_S = -(KEY_AREA_CENTER_Z - TKL_DEPTH_U / 2) + PLATE_MARGIN;
const PLATE_FRONT_S = -(KEY_AREA_CENTER_Z + TKL_DEPTH_U / 2) - PLATE_MARGIN;

const rectHole = (centerX: number, centerS: number, width: number, depth: number) => {
  const hole = new Path();
  hole.moveTo(centerX - width / 2, centerS - depth / 2);
  hole.lineTo(centerX + width / 2, centerS - depth / 2);
  hole.lineTo(centerX + width / 2, centerS + depth / 2);
  hole.lineTo(centerX - width / 2, centerS + depth / 2);
  hole.closePath();
  return hole;
};

/** 보강판 한 조각 외곽 — 앞뒤 모서리에 나사 구멍 뚫린 고정 탭 */
const tracePlateOutline = (left: number, right: number, backTabs: number[], frontTabs: number[]) => {
  const halfTab = TAB_WIDTH / 2;
  const shape = new Shape();

  shape.moveTo(left, PLATE_FRONT_S);
  frontTabs.forEach((x) => {
    shape.lineTo(x - halfTab, PLATE_FRONT_S);
    shape.lineTo(x - halfTab, PLATE_FRONT_S - TAB_DEPTH);
    shape.lineTo(x + halfTab, PLATE_FRONT_S - TAB_DEPTH);
    shape.lineTo(x + halfTab, PLATE_FRONT_S);
  });
  shape.lineTo(right, PLATE_FRONT_S);
  shape.lineTo(right, PLATE_BACK_S);
  [...backTabs].reverse().forEach((x) => {
    shape.lineTo(x + halfTab, PLATE_BACK_S);
    shape.lineTo(x + halfTab, PLATE_BACK_S + TAB_DEPTH);
    shape.lineTo(x - halfTab, PLATE_BACK_S + TAB_DEPTH);
    shape.lineTo(x - halfTab, PLATE_BACK_S);
  });
  shape.lineTo(left, PLATE_BACK_S);
  shape.closePath();

  const tabHoles = [
    ...backTabs.map((x) => [x, PLATE_BACK_S + TAB_DEPTH / 2] as const),
    ...frontTabs.map((x) => [x, PLATE_FRONT_S - TAB_DEPTH / 2] as const),
  ];
  tabHoles.forEach(([x, s]) => {
    shape.holes.push(new Path().absarc(x, s, TAB_HOLE_RADIUS, 0, Math.PI * 2, false));
  });

  return shape;
};

const createPlateGeometry = () => {
  const splitX = toX(PLATE_SPLIT_U);
  const isMain = (u: number) => u < PLATE_SPLIT_U;

  const main = tracePlateOutline(
    KEY_AREA_LEFT - PLATE_MARGIN,
    splitX - PLATE_SPLIT_GAP / 2,
    BACK_TAB_U.filter(isMain).map(toX),
    FRONT_TAB_U.filter(isMain).map(toX),
  );
  const nav = tracePlateOutline(
    splitX + PLATE_SPLIT_GAP / 2,
    -KEY_AREA_LEFT + PLATE_MARGIN,
    BACK_TAB_U.filter((u) => !isMain(u)).map(toX),
    FRONT_TAB_U.filter((u) => !isMain(u)).map(toX),
  );

  TKL_KEYS.forEach((key) => {
    const [x, z] = getKeyCenter(key);
    (x < splitX ? main : nav).holes.push(rectHole(x, -z, SWITCH_CUTOUT, SWITCH_CUTOUT));
  });

  // 스태빌 하우징은 뒤쪽으로 치우쳐 있어 컷아웃 중심도 뒤로 이동
  const stabCenterOffsetS = (-(STAB_HOUSING_Z_MM.front + STAB_HOUSING_Z_MM.back) / 2) * MM;
  const stabDepth = (STAB_HOUSING_Z_MM.front - STAB_HOUSING_Z_MM.back) * MM + STAB_CUTOUT_CLEARANCE * 2;
  STABILIZERS.forEach(({ x, z, halfSpan }) => {
    [x - halfSpan, x + halfSpan].forEach((stabX) => {
      main.holes.push(rectHole(stabX, -z + stabCenterOffsetS, STAB_CUTOUT_WIDTH, stabDepth));
    });
  });

  return new ExtrudeGeometry([main, nav], { depth: PLATE_THICKNESS, bevelEnabled: false });
};

const fillCircle = (context: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
};

/** 기판 윗면 — 캔버스 위쪽이 키보드 뒤쪽 */
const createPcbTexture = () => {
  const px = (mm: number) => mm * PCB_PX_PER_MM;
  const toCanvasX = (x: number) => px((x + PCB_WIDTH / 2) * U_MM);
  const toCanvasY = (z: number) => px((z - KEY_AREA_CENTER_Z + PCB_DEPTH / 2) * U_MM);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(px(PCB_WIDTH * U_MM));
  canvas.height = Math.round(px(PCB_DEPTH * U_MM));
  const context = canvas.getContext('2d');

  if (context) {
    context.fillStyle = PCB_COLORS.board;
    context.fillRect(0, 0, canvas.width, canvas.height);

    TKL_KEYS.forEach((key) => {
      const [x, z] = getKeyCenter(key);
      const centerX = toCanvasX(x);
      const centerY = toCanvasY(z);

      context.strokeStyle = PCB_COLORS.silk;
      context.lineWidth = px(0.2);
      context.strokeRect(centerX - px(7.3), centerY - px(7.3), px(14.6), px(14.6));

      context.fillStyle = PCB_COLORS.hole;
      fillCircle(context, centerX, centerY, px(2));

      SWITCH_PIN_POSITIONS_MM.forEach(([pinX, pinZ]) => {
        context.fillStyle = PCB_COLORS.pad;
        fillCircle(context, centerX + px(pinX), centerY + px(pinZ), px(1.25));
        context.fillStyle = PCB_COLORS.hole;
        fillCircle(context, centerX + px(pinX), centerY + px(pinZ), px(0.75));
      });

      // 다이오드 — 패드 2개 사이 몸체
      context.fillStyle = PCB_COLORS.pad;
      context.fillRect(centerX + px(3.2), centerY + px(4.4), px(1), px(1.4));
      context.fillRect(centerX + px(5.6), centerY + px(4.4), px(1), px(1.4));
      context.fillStyle = PCB_COLORS.diode;
      context.fillRect(centerX + px(4.1), centerY + px(4.6), px(1.6), px(1));
    });

    context.fillStyle = PCB_COLORS.hole;
    STABILIZERS.forEach(({ x, z, halfSpan }) => {
      [x - halfSpan, x + halfSpan].forEach((stabX) => {
        STAB_PCB_HOLES_MM.forEach(([holeZ, radius]) => {
          fillCircle(context, toCanvasX(stabX), toCanvasY(z) + px(holeZ), px(radius));
        });
      });
    });
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

/** 앱 수명 동안 유지 — 모듈에서 한 번 생성 */
export const PLATE_GEOMETRY = createPlateGeometry();
export const PCB_GEOMETRY = new BoxGeometry(PCB_WIDTH, PCB_THICKNESS, PCB_DEPTH);

const pcbSideMaterial = new MeshStandardMaterial({ color: PCB_COLORS.board, roughness: 0.7 });
const pcbTopMaterial = new MeshStandardMaterial({ map: createPcbTexture(), roughness: 0.55, metalness: 0.1 });

/** BoxGeometry 면 순서 +x, -x, +y, -y, +z, -z — 윗면(+y)만 회로 텍스처 */
export const PCB_MATERIALS = [
  pcbSideMaterial,
  pcbSideMaterial,
  pcbTopMaterial,
  pcbSideMaterial,
  pcbSideMaterial,
  pcbSideMaterial,
];
