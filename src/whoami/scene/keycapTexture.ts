import { CanvasTexture, SRGBColorSpace } from 'three';

import type { KeycapStyle, Legend } from './lazurite';
import { drawOrnament } from './ornaments';

/** 윗면 깊이 방향 캔버스 해상도 (px) */
const TOP_RESOLUTION = 256;
const MAX_CANVAS_WIDTH = 2048;
const FONT_FAMILY = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
/** Arial 대문자 높이 / 폰트 크기 */
const CAP_HEIGHT_RATIO = 0.716;

/** 각인 배치 (mm) — GMK 킷 렌더·실물 사진 기준 근사 */
const LEGEND_LEFT_MM = 1.5;
const LEGEND_TOP_MM = 1.4;
const MOD_TOP_MM = 2.6;
const FONT_SIZE_MM = { alpha: 4.4, dual: 3.1, mod: 2.3 } as const;
const ICON_LINE_MM = 0.32;

type Context = CanvasRenderingContext2D;
type ModLegend = Extract<Legend, { kind: 'mod' }>;

const setFont = (context: Context, sizePx: number) => {
  context.font = `600 ${sizePx}px ${FONT_FAMILY}`;
};

/** Tab 화살표 — 막대에 닿는 방향 화살 */
const drawTabArrow = (
  context: Context,
  x: number,
  y: number,
  length: number,
  lineWidth: number,
  direction: 'left' | 'right',
) => {
  const head = lineWidth * 3;
  const barHalf = lineWidth * 3.2;
  const barX = direction === 'left' ? x : x + length;
  const tailX = direction === 'left' ? x + length : x;
  const tipX = barX + (direction === 'left' ? lineWidth : -lineWidth);
  const headBack = direction === 'left' ? head : -head;

  context.lineWidth = lineWidth;
  context.lineCap = 'butt';
  context.beginPath();
  context.moveTo(barX, y - barHalf);
  context.lineTo(barX, y + barHalf);
  context.moveTo(tailX, y);
  context.lineTo(tipX + headBack, y);
  context.stroke();

  context.beginPath();
  context.moveTo(tipX, y);
  context.lineTo(tipX + headBack, y - head * 0.75);
  context.lineTo(tipX + headBack, y + head * 0.75);
  context.closePath();
  context.fill();
};

/** Shift 윤곽 화살표 */
const drawShiftArrow = (context: Context, x: number, baseline: number, size: number, lineWidth: number) => {
  const height = size * 1.05;
  const neck = baseline - height * 0.45;

  context.lineWidth = lineWidth;
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(x + size / 2, baseline - height);
  context.lineTo(x + size, neck);
  context.lineTo(x + size * 0.72, neck);
  context.lineTo(x + size * 0.72, baseline);
  context.lineTo(x + size * 0.28, baseline);
  context.lineTo(x + size * 0.28, neck);
  context.lineTo(x, neck);
  context.closePath();
  context.stroke();
};

const drawModLegend = (context: Context, legend: ModLegend, width: number, height: number, pxPerMm: number) => {
  const mm = (value: number) => value * pxPerMm;
  const size = mm(FONT_SIZE_MM.mod);
  const capHeight = size * CAP_HEIGHT_RATIO;
  const lineWidth = mm(ICON_LINE_MM);
  const left = mm(LEGEND_LEFT_MM);
  setFont(context, size);

  if (legend.icon === 'tab') {
    const upperArrowY = mm(2.2);
    const textBaseline = upperArrowY + mm(1.3) + capHeight;
    drawTabArrow(context, left, upperArrowY, mm(3), lineWidth, 'left');
    context.fillText(legend.text, left, textBaseline);
    drawTabArrow(context, left, textBaseline + mm(1.4), mm(3), lineWidth, 'right');
    return;
  }

  if (legend.icon === 'shift') {
    const baseline = height / 2 + capHeight / 2;
    const iconSize = capHeight * 1.25;
    drawShiftArrow(context, left, baseline, iconSize, lineWidth);
    context.fillText(legend.text, left + iconSize + mm(0.7), baseline);
    return;
  }

  const baseline = mm(MOD_TOP_MM) + capHeight;
  if (legend.align === 'center') {
    context.textAlign = 'center';
    context.fillText(legend.text, width / 2, baseline);
    return;
  }
  context.fillText(legend.text, left, baseline);
};

const drawLegend = (context: Context, legend: Legend, width: number, height: number, pxPerMm: number) => {
  const mm = (value: number) => value * pxPerMm;
  const left = mm(LEGEND_LEFT_MM);
  const top = mm(LEGEND_TOP_MM);
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';

  switch (legend.kind) {
    case 'blank':
      return;
    case 'alpha': {
      const size = mm(FONT_SIZE_MM.alpha);
      setFont(context, size);
      context.fillText(legend.text, left, top + size * CAP_HEIGHT_RATIO);
      return;
    }
    case 'dual': {
      const size = mm(FONT_SIZE_MM.dual);
      const firstBaseline = top + size * CAP_HEIGHT_RATIO;
      setFont(context, size);
      context.fillText(legend.shifted, left, firstBaseline);
      context.fillText(legend.base, left, firstBaseline + size * 1.15);
      return;
    }
    case 'mod':
      drawModLegend(context, legend, width, height, pxPerMm);
      return;
    case 'ornament':
      drawOrnament(context, legend.ornament, width, height, pxPerMm);
      return;
  }
};

/**
 * 키캡 윗면 텍스처 — 캡 색 바탕 + 각인/장식
 * - 폰트 파일·원격 요청 없이 2D 캔버스로 그림
 * - 캔버스 비율을 윗면 실제 비율(mm)에 맞춰 넓은 키에서도 글자가 늘어나지 않음
 */
export const createKeycapTopTexture = (style: KeycapStyle, topWidthMm: number, topDepthMm: number): CanvasTexture => {
  const pxPerMm = Math.min(TOP_RESOLUTION / topDepthMm, MAX_CANVAS_WIDTH / topWidthMm);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(topWidthMm * pxPerMm);
  canvas.height = Math.round(topDepthMm * pxPerMm);

  const context = canvas.getContext('2d');

  if (context) {
    context.fillStyle = style.cap;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = style.ink;
    context.strokeStyle = style.ink;
    drawLegend(context, style.legend, canvas.width, canvas.height, pxPerMm);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};
