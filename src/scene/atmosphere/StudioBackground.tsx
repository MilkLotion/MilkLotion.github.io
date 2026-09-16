import { memo } from 'react';

/**
 * 스튜디오 배경 — 사용자 피그마 프레임(1440×1024, 사진 영역 x 220~1219)을 수치 분석해 만든 2D SVG
 * - 벽·바닥 경계: 오른쪽 위에서 왼쪽 중단으로 내려오는 직선 y = -0.20962x + 492.69 (사진 오른쪽 경계 40점 적합)
 * - 벽: 우상단이 어두운 회전 타원 방사 그라데이션 (사진 대비 오차 RMS 1.5)
 * - 바닥: 오른쪽 아래가 밝고 왼쪽으로 어두워지는 가로로 긴 방사 그라데이션 (RMS 4.2)
 * - 박스 그림자: 좌중단 바닥의 짙은 쐐기 — 사진 밝기 ÷ 바닥 그라데이션 비율을 세로 불투명도 단계로 옮김
 * - 사진 밖(프레임 좌우 여백)은 같은 그라데이션을 이어 채우고, 관측 범위 밖 값은 마지막 단계에서 멈춤
 * - viewBox 를 가로로 넓게 잡고 slice — 화면 높이 기준으로 맞춰져 3D 카메라(세로 화각 고정)와 정렬 유지
 */

const VIEW_LEFT = -2280;
const VIEW_WIDTH = 6000;
const FRAME_HEIGHT = 1024;

const BOUNDARY = { slope: -0.20962, intercept: 492.69 } as const;
const boundaryY = (x: number) => BOUNDARY.slope * x + BOUNDARY.intercept;

const toPoints = (points: readonly (readonly [number, number])[]) => points.map((point) => point.join(',')).join(' ');

/**
 * 벽 가장자리 흐림 — 사진 경계는 전이 약 4px 이지만 401px 원본을 2.5배 확대하며 번진 것
 * - 그대로 따라 하면 화면이 흐릿해 보여 계단 현상만 가리는 수준으로 줄임
 */
const BOUNDARY_SOFTNESS = 0.5;
/** 흐림이 화면 윗변·왼변을 반투명하게 만들지 않도록 벽 도형을 화면 밖까지 넓히는 여유 */
const WALL_OVERSCAN = 20;

const WALL_POINTS = toPoints([
  [VIEW_LEFT - WALL_OVERSCAN, -WALL_OVERSCAN],
  [(-WALL_OVERSCAN - BOUNDARY.intercept) / BOUNDARY.slope, -WALL_OVERSCAN],
  [VIEW_LEFT - WALL_OVERSCAN, boundaryY(VIEW_LEFT - WALL_OVERSCAN)],
]);

/** 박스 그림자 쐐기 — 위는 경계선, 오른쪽은 박스 뒤로 충분히 들어간 x, 아래는 그림자가 끝나는 y */
const SHADOW_LEFT_X = -400;
const SHADOW_RIGHT_X = 470;
const SHADOW_BOTTOM_Y = 720;
const SHADOW_POINTS = toPoints([
  [SHADOW_LEFT_X, boundaryY(SHADOW_LEFT_X)],
  [SHADOW_RIGHT_X, boundaryY(SHADOW_RIGHT_X)],
  [SHADOW_RIGHT_X, SHADOW_BOTTOM_Y],
  [SHADOW_LEFT_X, SHADOW_BOTTOM_Y],
]);

/**
 * 벽 광원(가장 밝은 곳) 중심 — 사진 적합값 (473, -204) 에서 사용자 요청으로 왼쪽 110 이동
 * - y 는 프레임 위쪽 밖이라 화면에는 번짐만 보임
 */
const WALL_LIGHT_CENTER = { x: 363, y: -204 } as const;

/** [offset, 회색값 hex] */
const WALL_STOPS = [
  [0, '#b4b4b4'],
  [0.1429, '#acacac'],
  [0.2857, '#a0a0a0'],
  [0.4286, '#808080'],
  [0.5714, '#4d4d4d'],
  [0.64, '#3b3b3b'],
] as const;

const FLOOR_STOPS = [
  [0, '#c2c2c2'],
  [0.155, '#c2c2c2'],
  [0.2, '#bfbfbf'],
  [0.4, '#bebebe'],
  [0.6, '#a9a9a9'],
  [0.8, '#777777'],
] as const;

/**
 * [프레임 y, 검정 불투명도] — 1 - (사진 밝기 ÷ 바닥 그라데이션), x 222~300 평균
 * - 위쪽 번짐은 실측 그대로, 아래 끝(그림자 경계)은 확대 번짐을 걷어내 약 48px → 30px 로 좁힘
 */
const SHADOW_STOPS = [
  [436, 0.1],
  [460, 0.17],
  [484, 0.25],
  [508, 0.34],
  [532, 0.43],
  [556, 0.51],
  [580, 0.59],
  [604, 0.68],
  [618, 0.66],
  [628, 0.48],
  [638, 0.22],
  [648, 0.08],
  [664, 0.03],
  [690, 0],
] as const;
const SHADOW_GRADIENT_TOP = SHADOW_STOPS[0][0];
const SHADOW_GRADIENT_HEIGHT = SHADOW_STOPS[SHADOW_STOPS.length - 1][0] - SHADOW_GRADIENT_TOP;

/**
 * 가로 페이드 [프레임 x, 불투명도]
 * - 왼쪽: 사진 밖으로는 서서히 지움 — 관측 근거 없는 긴 띠 방지
 * - 오른쪽: 박스 뒤에서 사라지게 — 박스 밑동 앞에 세로 경계가 드러나지 않게
 */
const SHADOW_FADE_STOPS = [
  [-80, 0],
  [220, 1],
  [380, 1],
  [SHADOW_RIGHT_X, 0],
] as const;
const SHADOW_FADE_LEFT = SHADOW_FADE_STOPS[0][0];
const SHADOW_FADE_WIDTH = SHADOW_FADE_STOPS[SHADOW_FADE_STOPS.length - 1][0] - SHADOW_FADE_LEFT;

const StudioBackgroundBase = () => (
  <svg
    className="studio-background"
    viewBox={`${VIEW_LEFT} 0 ${VIEW_WIDTH} ${FRAME_HEIGHT}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <radialGradient
        id="studio-bg-wall"
        gradientUnits="userSpaceOnUse"
        cx="0"
        cy="0"
        r="1"
        gradientTransform={`translate(${WALL_LIGHT_CENTER.x} ${WALL_LIGHT_CENTER.y}) rotate(-11) scale(1185 1717)`}
      >
        {WALL_STOPS.map(([offset, color]) => (
          <stop key={offset} offset={offset} stopColor={color} />
        ))}
      </radialGradient>

      <radialGradient
        id="studio-bg-floor"
        gradientUnits="userSpaceOnUse"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="translate(1489 763) rotate(8.72) scale(1764 587)"
      >
        {FLOOR_STOPS.map(([offset, color]) => (
          <stop key={offset} offset={offset} stopColor={color} />
        ))}
      </radialGradient>

      <linearGradient
        id="studio-bg-shadow"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1={SHADOW_GRADIENT_TOP}
        x2="0"
        y2={SHADOW_GRADIENT_TOP + SHADOW_GRADIENT_HEIGHT}
      >
        {SHADOW_STOPS.map(([y, opacity]) => (
          <stop
            key={y}
            offset={(y - SHADOW_GRADIENT_TOP) / SHADOW_GRADIENT_HEIGHT}
            stopColor="#000000"
            stopOpacity={opacity}
          />
        ))}
      </linearGradient>

      <linearGradient
        id="studio-bg-shadow-fade"
        gradientUnits="userSpaceOnUse"
        x1={SHADOW_FADE_LEFT}
        y1="0"
        x2={SHADOW_FADE_LEFT + SHADOW_FADE_WIDTH}
        y2="0"
      >
        {SHADOW_FADE_STOPS.map(([x, opacity]) => (
          <stop
            key={x}
            offset={(x - SHADOW_FADE_LEFT) / SHADOW_FADE_WIDTH}
            stopColor="#ffffff"
            stopOpacity={opacity}
          />
        ))}
      </linearGradient>

      <mask
        id="studio-bg-shadow-mask"
        maskUnits="userSpaceOnUse"
        x={VIEW_LEFT}
        y="0"
        width={VIEW_WIDTH}
        height={FRAME_HEIGHT}
      >
        <rect x={VIEW_LEFT} y="0" width={VIEW_WIDTH} height={FRAME_HEIGHT} fill="url(#studio-bg-shadow-fade)" />
      </mask>

      <filter
        id="studio-bg-soft-edge"
        filterUnits="userSpaceOnUse"
        x={VIEW_LEFT - WALL_OVERSCAN * 2}
        y={-WALL_OVERSCAN * 2}
        width={VIEW_WIDTH + WALL_OVERSCAN * 4}
        height={FRAME_HEIGHT + WALL_OVERSCAN * 4}
      >
        <feGaussianBlur stdDeviation={BOUNDARY_SOFTNESS} />
      </filter>
    </defs>

    {/* 바닥을 전체에 깔고 벽을 위에 덮어 경계선 틈이 생기지 않게 */}
    <rect x={VIEW_LEFT} y="0" width={VIEW_WIDTH} height={FRAME_HEIGHT} fill="url(#studio-bg-floor)" />
    <polygon points={WALL_POINTS} fill="url(#studio-bg-wall)" filter="url(#studio-bg-soft-edge)" />
    <polygon points={SHADOW_POINTS} fill="url(#studio-bg-shadow)" mask="url(#studio-bg-shadow-mask)" />
  </svg>
);

export const StudioBackground = memo(StudioBackgroundBase);
