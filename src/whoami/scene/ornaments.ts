import type { OrnamentId } from './lazurite';

/**
 * High Renaissance 노벨티 장식 — 캔버스 벡터 근사
 * - 원본 장식은 비공개 벡터라 킷 렌더·실물 사진을 보고 형태만 재구성
 * - 좌표는 px, 크기는 호출부에서 mm 환산값으로 전달
 */

type Context = CanvasRenderingContext2D;

/** 모서리 장식 크기·여백 (mm) */
const CORNER_SIZE_MM = 8.5;
const CORNER_MARGIN_MM = 1.1;
/** 엔터 왕관 장식 (mm) */
const CROWN_WIDTH_MM = 27;
const CROWN_HEIGHT_MM = 8.5;
/** 방향키 백합 장식 (mm) */
const FLEUR_SIZE_MM = 7.5;

const FLEUR_ROTATION: Readonly<Record<'up' | 'right' | 'down' | 'left', number>> = {
  up: 0,
  right: Math.PI / 2,
  down: Math.PI,
  left: -Math.PI / 2,
};

const dot = (context: Context, x: number, y: number, radius: number) => {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
};

/** 잎 — 시작점에서 angle 방향으로 뻗는 양끝 뾰족한 형태 */
const leaf = (context: Context, x: number, y: number, length: number, width: number, angle: number) => {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(0, 0);
  context.quadraticCurveTo(length / 2, -width, length, 0);
  context.quadraticCurveTo(length / 2, width, 0, 0);
  context.fill();
  context.restore();
};

/** 소용돌이 — 반지름이 줄어들며 말려 들어가고 끝에 둥근 매듭 */
const curl = (
  context: Context,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  sweep: number,
  lineWidth: number,
) => {
  const steps = 32;

  context.beginPath();
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    const angle = startAngle + sweep * t;
    const r = radius * (1 - 0.65 * t);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (step === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.stroke();

  const endAngle = startAngle + sweep;
  dot(context, cx + Math.cos(endAngle) * radius * 0.35, cy + Math.sin(endAngle) * radius * 0.35, lineWidth * 1.1);
};

/** 모서리 장식 — 원점이 모서리, +x·+y 방향으로 뻗음 */
const drawCornerFlourish = (context: Context, size: number) => {
  const lineWidth = size * 0.055;

  curl(context, size * 0.2, size * 0.2, size * 0.15, Math.PI * 0.75, Math.PI * 1.6, lineWidth);
  leaf(context, size * 0.27, size * 0.27, size * 0.2, size * 0.06, Math.PI / 4);

  // 두 변을 따라 대칭 — 대각선 기준 x·y 교환
  [false, true].forEach((isSwapped) => {
    context.save();
    if (isSwapped) context.transform(0, 1, 1, 0, 0, 0);
    curl(context, size * 0.47, size * 0.11, size * 0.08, Math.PI, -Math.PI * 1.4, lineWidth * 0.8);
    leaf(context, size * 0.3, size * 0.07, size * 0.12, size * 0.04, 0);
    dot(context, size * 0.65, size * 0.07, size * 0.032);
    dot(context, size * 0.75, size * 0.06, size * 0.024);
    dot(context, size * 0.83, size * 0.055, size * 0.016);
    context.restore();
  });
};

/** 엔터 왕관 장식 — 원점이 장식 중심 */
const drawCrown = (context: Context, width: number, height: number) => {
  const lineWidth = height * 0.07;

  // 받침 두 줄
  context.fillRect(-width * 0.46, height * 0.3, width * 0.92, lineWidth * 0.6);
  context.fillRect(-width * 0.5, height * 0.42, width, lineWidth * 0.9);

  // 가운데 봉오리
  leaf(context, 0, height * 0.12, height * 0.42, height * 0.1, -Math.PI / 2);
  dot(context, 0, -height * 0.42, lineWidth * 0.9);

  [-1, 1].forEach((side) => {
    context.save();
    context.scale(side, 1);
    curl(context, width * 0.12, -height * 0.02, height * 0.22, Math.PI, Math.PI * 1.5, lineWidth);
    curl(context, width * 0.3, height * 0.02, height * 0.18, 0, -Math.PI * 1.5, lineWidth);
    leaf(context, width * 0.2, height * 0.14, height * 0.3, height * 0.08, -0.3);
    leaf(context, width * 0.04, height * 0.2, height * 0.26, height * 0.07, 0.1);
    dot(context, width * 0.42, height * 0.1, lineWidth * 0.8);
    dot(context, width * 0.47, height * 0.17, lineWidth * 0.6);
    context.restore();
  });
};

/** 방향키 백합 장식 — 원점이 중심, 위쪽을 가리킴 */
const drawFleur = (context: Context, size: number) => {
  leaf(context, 0, size * 0.12, size * 0.55, size * 0.13, -Math.PI / 2);

  [-1, 1].forEach((side) => {
    context.save();
    context.scale(side, 1);
    leaf(context, size * 0.04, size * 0.1, size * 0.34, size * 0.09, Math.PI * 0.2);
    dot(context, size * 0.34, size * 0.3, size * 0.035);
    context.restore();
  });

  dot(context, 0, size * 0.36, size * 0.05);
};

export const drawOrnament = (
  context: Context,
  ornament: OrnamentId,
  width: number,
  height: number,
  pxPerMm: number,
) => {
  const mm = (value: number) => value * pxPerMm;

  context.save();

  switch (ornament) {
    case 'corner-tl':
    case 'corner-tr':
    case 'corner-bl':
    case 'corner-br': {
      const isRight = ornament === 'corner-tr' || ornament === 'corner-br';
      const isBottom = ornament === 'corner-bl' || ornament === 'corner-br';
      const margin = mm(CORNER_MARGIN_MM);
      context.translate(isRight ? width - margin : margin, isBottom ? height - margin : margin);
      context.scale(isRight ? -1 : 1, isBottom ? -1 : 1);
      drawCornerFlourish(context, mm(CORNER_SIZE_MM));
      break;
    }
    case 'crown':
      context.translate(width / 2, height / 2);
      drawCrown(context, mm(CROWN_WIDTH_MM), mm(CROWN_HEIGHT_MM));
      break;
    case 'fleur-up':
    case 'fleur-right':
    case 'fleur-down':
    case 'fleur-left':
      context.translate(width / 2, height / 2);
      context.rotate(FLEUR_ROTATION[ornament.slice('fleur-'.length) as keyof typeof FLEUR_ROTATION]);
      drawFleur(context, mm(FLEUR_SIZE_MM));
      break;
  }

  context.restore();
};
