import { CanvasTexture, SRGBColorSpace } from 'three';

import { BACK_BEZEL, CASE_DEPTH, CASE_WIDTH, SIDE_BEZEL } from '../glareTkl';
import { getKeycapStyle, LAZURITE } from '../lazurite';
import { TKL_KEYS } from '../tklLayout';

/**
 * 명함 보드(박스) 텍스처 — 앞면 · 윗면 · 왼쪽 옆면
 * - 크기: 레퍼런스 사진 박스 모서리 7점을 카메라와 함께 역산 (폭 24.6 · 높이 13.1 · 두께 3.1 u)
 * - 명암: 스튜디오 시점이 고정이라 사진의 면별 밝기를 텍스처에 굽고 조명 없는 재질로 표시
 *   (피그마 프레임 면 표본 다항식 적합 — 앞면 잔차 std 1.3 · 윗면 1.1 · 옆면 1.4)
 * - 공개 페이지라 연락처는 이메일·GitHub 만 (전화번호 제외)
 * - [스펙 미확정] 문구는 사용자 확인 전 초안
 */

export const CARD_SIZE = { width: 24.62, height: 13.15, thickness: 3.12 } as const;

export const CARD_CONTENT = {
  givenName: 'HYUNSU',
  familyName: 'NOH',
  role: 'Frontend Developer',
  contacts: ['znaldh336@gmail.com', 'github.com/MilkLotion'],
} as const;

const PX_PER_U = 96;
const FONT_FAMILY = "'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, -apple-system, 'Segoe UI', sans-serif";

const COLORS = {
  paper: '#f6f5f1',
  ink: '#3a3b3e',
  muted: '#76777b',
  /** 레퍼런스 박스 일러스트처럼 흰 키캡과 대비되는 짙은 케이스 */
  case: '#9fa1a4',
  caseEdge: '#7c7e82',
} as const;

/** 종이 바탕 휘도 — 굽는 명암의 기준 (이 밝기가 사진 종이 밝기로 치환됨) */
const PAPER_LUMINANCE = 245;

/** 사진 앞면 종이 명암 3차 적합 [1, u, v, u², uv, v², u³, v³] — u 왼→오, v 위→아래 */
const FRONT_SHADING = [163.114, 85.852, 8.573, -15.345, -3.353, -93.485, -16.292, 69.849] as const;
/** 사진 윗면 2차 적합 [1, u, v, u², uv, v²] — u 왼→오, v 뒤→앞 */
const TOP_SHADING = [202.5, 67.42, 9.28, -29.35, -0.83, -2.3] as const;
/** 사진 왼쪽 옆면(크라프트) 채널별 2차 적합 — u 뒤→앞, v 위→아래 */
const SIDE_SHADING = {
  r: [74.2, 0.74, -0.67, -9.03, 26.9, -36.43],
  g: [61.48, -20.04, -0.82, 13.38, 13.19, -30.31],
  b: [55.41, -26.05, -6.58, 16.6, 13.95, -27.83],
} as const;

type Quadratic = readonly [number, number, number, number, number, number];
type EdgeTable = readonly (readonly [distance: number, factor: number])[];

/**
 * 앞면 모서리 명암 [모서리에서 거리(화면 px), 배율] — 사진 모서리 수직 단면 실측
 * - 왼쪽: 옆면으로 말려 들어가며 어두워짐 · 아래: 바닥과 닿는 짙은 선 · 위: 윗면 반사로 밝은 띠
 */
const FRONT_EDGE_LEFT: EdgeTable = [
  [0, 0.35],
  [1, 0.45],
  [2, 0.6],
  [3, 0.8],
  [4, 0.92],
  [5, 0.97],
  [6, 1],
];
const FRONT_EDGE_BOTTOM: EdgeTable = [
  [0, 0.52],
  [1, 0.58],
  [2, 0.87],
  [3, 1],
];
const FRONT_EDGE_TOP: EdgeTable = [
  [0, 1.16],
  [2, 1.16],
  [3, 1.07],
  [4, 1.015],
  [5, 1],
];
/** 사진에서 앞면 화면 1px 에 해당하는 텍스처 px — 가로 702px ↔ 2364px, 세로 421px ↔ 1262px */
const FRONT_TEX_PER_SCREEN_PX = { x: 3.37, y: 3 } as const;

/** 레이아웃 비율 — 레퍼런스 박스 앞면 기준 (세로 비율은 앞면 높이, 가로 비율은 앞면 폭) */
const LAYOUT = {
  titleBaseline: 0.3,
  titleSize: 0.13,
  subtitleBaseline: 0.375,
  subtitleSize: 0.036,
  illustrationTop: 0.42,
  illustrationWidth: 0.6,
  contactBaseline: 0.93,
  contactSize: 0.03,
} as const;

const quadratic = (c: Quadratic, u: number, v: number) =>
  c[0] + c[1] * u + c[2] * v + c[3] * u * u + c[4] * u * v + c[5] * v * v;

const frontShading = (u: number, v: number) => {
  const c = FRONT_SHADING;
  return quadratic([c[0], c[1], c[2], c[3], c[4], c[5]], u, v) + c[6] * u ** 3 + c[7] * v ** 3;
};

const interpolateEdge = (table: EdgeTable, distance: number) => {
  if (distance <= table[0][0]) return table[0][1];
  for (let index = 1; index < table.length; index++) {
    const [x1, y1] = table[index];
    if (distance <= x1) {
      const [x0, y0] = table[index - 1];
      return y0 + ((y1 - y0) * (distance - x0)) / (x1 - x0);
    }
  }
  return table[table.length - 1][1];
};

/** 좌표 해시 노이즈 0~1 — 새로고침해도 같은 결 */
const hashNoise = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const clampByte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

const toTexture = (canvas: HTMLCanvasElement) => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  return canvas;
};

/** 가운데 정렬 두 톤 텍스트 — 앞 단어는 잉크색, 뒤 단어는 강조색 */
const drawTwoToneTitle = (context: CanvasRenderingContext2D, centerX: number, baseline: number) => {
  const first = `${CARD_CONTENT.givenName} `;
  const second = CARD_CONTENT.familyName;
  const startX = centerX - context.measureText(first + second).width / 2;

  context.textAlign = 'left';
  context.fillStyle = COLORS.ink;
  context.fillText(first, startX, baseline);
  context.fillStyle = LAZURITE.blue;
  context.fillText(second, startX + context.measureText(first).width, baseline);
};

/** 부제 — 양옆 가는 줄 */
const drawRuledSubtitle = (context: CanvasRenderingContext2D, centerX: number, baseline: number, unit: number) => {
  const textWidth = context.measureText(CARD_CONTENT.role).width;
  const gap = unit * 2.2;
  const ruleLength = unit * 6;
  const ruleY = baseline - unit * 0.9;

  context.textAlign = 'center';
  context.fillStyle = COLORS.muted;
  context.fillText(CARD_CONTENT.role, centerX, baseline);

  context.strokeStyle = COLORS.muted;
  context.lineWidth = unit * 0.16;
  context.beginPath();
  context.moveTo(centerX - textWidth / 2 - gap - ruleLength, ruleY);
  context.lineTo(centerX - textWidth / 2 - gap, ruleY);
  context.moveTo(centerX + textWidth / 2 + gap, ruleY);
  context.lineTo(centerX + textWidth / 2 + gap + ruleLength, ruleY);
  context.stroke();
};

/** '#rrggbb' 색을 배율만큼 어둡게 */
const scaleHex = (hex: string, factor: number) => {
  const channel = (offset: number) => clampByte(parseInt(hex.slice(offset, offset + 2), 16) * factor);
  return `rgb(${channel(1)}, ${channel(3)}, ${channel(5)})`;
};

/**
 * 키보드 윗면 일러스트 — 실제 배열·키캡 색 데이터로 그림
 * - 레퍼런스 박스 일러스트처럼 키캡마다 어두운 옆면 턱 + 밝은 윗면으로 입체감
 */
const drawKeyboardIllustration = (context: CanvasRenderingContext2D, centerX: number, top: number, pxPerU: number) => {
  const left = centerX - (CASE_WIDTH * pxPerU) / 2;
  const u = (value: number) => value * pxPerU;

  context.save();
  context.shadowColor = 'rgba(0, 0, 0, 0.22)';
  context.shadowBlur = u(0.6);
  context.shadowOffsetY = u(0.25);
  context.fillStyle = COLORS.case;
  context.beginPath();
  context.roundRect(left, top, u(CASE_WIDTH), u(CASE_DEPTH), u(0.22));
  context.fill();
  context.restore();

  context.strokeStyle = COLORS.caseEdge;
  context.lineWidth = u(0.05);
  context.beginPath();
  context.roundRect(left, top, u(CASE_WIDTH), u(CASE_DEPTH), u(0.22));
  context.stroke();

  const gap = 0.09;
  TKL_KEYS.forEach(({ code, x, y, width }) => {
    const cap = getKeycapStyle(code).cap;
    const keyLeft = left + u(SIDE_BEZEL + x + gap / 2);
    const keyTop = top + u(BACK_BEZEL + y + gap / 2);
    const keyWidth = u(width - gap);
    const keyHeight = u(1 - gap);

    context.fillStyle = scaleHex(cap, 0.74);
    context.beginPath();
    context.roundRect(keyLeft, keyTop, keyWidth, keyHeight, u(0.1));
    context.fill();

    context.fillStyle = cap;
    context.beginPath();
    context.roundRect(
      keyLeft + u(0.09),
      keyTop + u(0.05),
      keyWidth - u(0.18),
      keyHeight - u(0.24),
      u(0.08),
    );
    context.fill();
  });
};

/** 앞면 — 인쇄 내용을 그린 뒤 사진 종이 명암과 모서리 선을 픽셀 단위로 곱함 */
const createFrontTexture = () => {
  const canvas = createCanvas(CARD_SIZE.width * PX_PER_U, CARD_SIZE.height * PX_PER_U);
  const context = canvas.getContext('2d');
  if (!context) return toTexture(canvas);

  const { width, height } = canvas;
  const centerX = width / 2;
  const unit = height / 60;

  context.fillStyle = COLORS.paper;
  context.fillRect(0, 0, width, height);
  context.textBaseline = 'alphabetic';

  context.font = `600 ${height * LAYOUT.titleSize}px ${FONT_FAMILY}`;
  context.letterSpacing = `${height * LAYOUT.titleSize * 0.12}px`;
  drawTwoToneTitle(context, centerX, height * LAYOUT.titleBaseline);

  context.font = `400 ${height * LAYOUT.subtitleSize}px ${FONT_FAMILY}`;
  context.letterSpacing = `${height * LAYOUT.subtitleSize * 0.08}px`;
  drawRuledSubtitle(context, centerX, height * LAYOUT.subtitleBaseline, unit);

  context.letterSpacing = '0px';
  drawKeyboardIllustration(context, centerX, height * LAYOUT.illustrationTop, (width * LAYOUT.illustrationWidth) / CASE_WIDTH);

  context.font = `400 ${height * LAYOUT.contactSize}px ${FONT_FAMILY}`;
  context.letterSpacing = `${height * LAYOUT.contactSize * 0.05}px`;
  context.textAlign = 'center';
  context.fillStyle = COLORS.muted;
  context.fillText(CARD_CONTENT.contacts.join('   ·   '), centerX, height * LAYOUT.contactBaseline);

  // 모서리 배율은 행·열에만 의존 — 미리 계산해 픽셀 루프를 가볍게
  const columnFactor = Float32Array.from({ length: width }, (_, x) =>
    interpolateEdge(FRONT_EDGE_LEFT, x / FRONT_TEX_PER_SCREEN_PX.x),
  );
  const rowFactor = Float32Array.from(
    { length: height },
    (_, y) =>
      interpolateEdge(FRONT_EDGE_TOP, y / FRONT_TEX_PER_SCREEN_PX.y) *
      interpolateEdge(FRONT_EDGE_BOTTOM, (height - 1 - y) / FRONT_TEX_PER_SCREEN_PX.y),
  );

  const image = context.getImageData(0, 0, width, height);
  const { data } = image;
  for (let y = 0; y < height; y++) {
    const v = (y + 0.5) / height;
    for (let x = 0; x < width; x++) {
      const factor = (frontShading((x + 0.5) / width, v) / PAPER_LUMINANCE) * columnFactor[x] * rowFactor[y];
      const index = (y * width + x) * 4;
      data[index] = clampByte(data[index] * factor);
      data[index + 1] = clampByte(data[index + 1] * factor);
      data[index + 2] = clampByte(data[index + 2] * factor);
    }
  }
  context.putImageData(image, 0, 0);

  return toTexture(canvas);
};

/** 윗면 — 사진 밝기 그대로 (인쇄 없음) */
const createTopTexture = () => {
  const canvas = createCanvas(CARD_SIZE.width * PX_PER_U, CARD_SIZE.thickness * PX_PER_U);
  const context = canvas.getContext('2d');
  if (!context) return toTexture(canvas);

  const { width, height } = canvas;
  const image = context.createImageData(width, height);
  const { data } = image;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = quadratic(TOP_SHADING, (x + 0.5) / width, (y + 0.5) / height) + (hashNoise(x, y) - 0.5) * 1.5;
      const index = (y * width + x) * 4;
      data[index] = data[index + 1] = data[index + 2] = clampByte(value);
      data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return toTexture(canvas);
};

/** 왼쪽 옆면 — 사진 크라프트 색 + 세로 섬유 결 */
const createSideTexture = () => {
  const canvas = createCanvas(CARD_SIZE.thickness * PX_PER_U, CARD_SIZE.height * PX_PER_U);
  const context = canvas.getContext('2d');
  if (!context) return toTexture(canvas);

  const { width, height } = canvas;
  const image = context.createImageData(width, height);
  const { data } = image;
  for (let y = 0; y < height; y++) {
    const v = (y + 0.5) / height;
    for (let x = 0; x < width; x++) {
      const u = (x + 0.5) / width;
      const fiber = (hashNoise(x, Math.floor(y / 7)) - 0.5) * 5 + (hashNoise(x, y) - 0.5) * 2;
      const index = (y * width + x) * 4;
      data[index] = clampByte(quadratic(SIDE_SHADING.r, u, v) + fiber);
      data[index + 1] = clampByte(quadratic(SIDE_SHADING.g, u, v) + fiber);
      data[index + 2] = clampByte(quadratic(SIDE_SHADING.b, u, v) + fiber);
      data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return toTexture(canvas);
};

/** 앱 수명 동안 유지 */
export const BUSINESS_CARD_TEXTURES = {
  front: createFrontTexture(),
  top: createTopTexture(),
  side: createSideTexture(),
} as const;
