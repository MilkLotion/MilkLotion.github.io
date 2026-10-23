import { BufferGeometry, Float32BufferAttribute } from 'three';

/**
 * 체리 프로파일 키캡 형상 (GMK 1-1-2-3-4-4)
 * - 치수 출처: KeyV2(rsheldiii) `cherry.scad` — 오픈소스 파라메트릭 키캡 모델의 체리 행별 값
 * - 씬 단위는 u (1u = 19.05mm) — mm 값에 MM 을 곱해 변환
 * - 키캡 로컬 좌표: 바닥 중심 원점, +y 위, +z 사용자 쪽
 */

export const U_MM = 19.05;
export const MM = 1 / U_MM;

export type ProfileRow = 1 | 2 | 3 | 4;

interface RowSpec {
  /** 윗면 중심 높이 (mm) */
  height: number;
  /** 윗면 기울기 (deg) — 양수면 앞(사용자 쪽) 모서리가 높음 */
  tilt: number;
}

const ROW_SPECS: Record<ProfileRow, RowSpec> = {
  1: { height: 9.8, tilt: 0 },
  2: { height: 7.45, tilt: 2.5 },
  3: { height: 6.55, tilt: 5 },
  4: { height: 7.35, tilt: 11.5 },
};

/** 1u 바닥 한 변 */
const BOTTOM_SIZE_MM = 18.16;
/** 바닥 대비 윗면 너비·깊이 감소량 */
const TOP_WIDTH_DIFFERENCE_MM = 6.31;
const TOP_DEPTH_DIFFERENCE_MM = 3.52;
/** 윗면 중심을 뒤쪽으로 미는 거리 */
const TOP_SKEW_MM = 2;
/** 원통 디시 깊이 — 좌우 방향으로만 오목 */
const DISH_DEPTH_MM = 0.65;
const BOTTOM_RADIUS_MM = 1;
const TOP_RADIUS_MM = 1.8;
/** 이 너비 이상은 디시 생략 — 긴 스페이스바 윗면은 평면에 가까움 */
const FLAT_TOP_MIN_WIDTH_U = 6;

const CORNER_SEGMENTS = 5;
/** 긴 변 분할 간격 — 디시 곡선이 앞뒤 모서리에도 드러나도록 */
const EDGE_SEGMENT_MM = 3;
const TOP_RING_COUNT = 5;

export interface KeycapTopSize {
  widthMm: number;
  depthMm: number;
}

export const getKeycapTopSize = (widthU: number): KeycapTopSize => ({
  widthMm: widthU * U_MM - (U_MM - BOTTOM_SIZE_MM) - TOP_WIDTH_DIFFERENCE_MM,
  depthMm: BOTTOM_SIZE_MM - TOP_DEPTH_DIFFERENCE_MM,
});

type Point2 = readonly [x: number, z: number];

/**
 * 둥근 사각 외곽 점열
 * - 뒤-오른쪽 모서리부터 오른쪽 변 → 앞 변 → 왼쪽 변 → 뒤 변 순
 * - 위·아래 링의 점 개수를 맞추려고 변 분할 수를 외부에서 받음
 */
const roundedRectRing = (
  halfWidth: number,
  halfDepth: number,
  radius: number,
  segmentsX: number,
  segmentsZ: number,
): Point2[] => {
  const r = Math.min(radius, halfWidth, halfDepth);
  const corners: readonly (readonly [cx: number, cz: number, startAngle: number])[] = [
    [halfWidth - r, -halfDepth + r, -Math.PI / 2],
    [halfWidth - r, halfDepth - r, 0],
    [-halfWidth + r, halfDepth - r, Math.PI / 2],
    [-halfWidth + r, -halfDepth + r, Math.PI],
  ];

  const arcs = corners.map(([cx, cz, startAngle]) =>
    Array.from({ length: CORNER_SEGMENTS + 1 }, (_, index): Point2 => {
      const angle = startAngle + (index / CORNER_SEGMENTS) * (Math.PI / 2);
      return [cx + Math.cos(angle) * r, cz + Math.sin(angle) * r];
    }),
  );

  return arcs.flatMap((arc, index) => {
    const arcEnd = arc[arc.length - 1];
    const nextArcStart = arcs[(index + 1) % arcs.length][0];
    // 짝수 번째 모서리 다음은 좌우 변(z 방향), 홀수 번째 다음은 앞뒤 변(x 방향)
    const segments = index % 2 === 0 ? segmentsZ : segmentsX;
    const edgePoints = Array.from({ length: segments - 1 }, (_, step): Point2 => {
      const t = (step + 1) / segments;
      return [arcEnd[0] + (nextArcStart[0] - arcEnd[0]) * t, arcEnd[1] + (nextArcStart[1] - arcEnd[1]) * t];
    });
    return [...arc, ...edgePoints];
  });
};

/**
 * 키캡 지오메트리 생성
 * - 그룹 0: 옆면 + 바닥 (키캡 색), 그룹 1: 윗면 (각인 텍스처 — UV 는 윗면 평면 투영)
 */
const buildKeycapGeometry = (widthU: number, row: ProfileRow): BufferGeometry => {
  const { height, tilt } = ROW_SPECS[row];
  const { widthMm: topWidth, depthMm: topDepth } = getKeycapTopSize(widthU);
  const bottomWidth = widthU * U_MM - (U_MM - BOTTOM_SIZE_MM);
  const tiltRad = (tilt * Math.PI) / 180;
  const halfTopWidth = topWidth / 2;
  const dishDepth = widthU >= FLAT_TOP_MIN_WIDTH_U ? 0 : DISH_DEPTH_MM;
  const segmentsX = Math.max(1, Math.ceil(bottomWidth / EDGE_SEGMENT_MM));
  const segmentsZ = Math.max(1, Math.ceil(BOTTOM_SIZE_MM / EDGE_SEGMENT_MM));

  const positions: number[] = [];
  const uvs: number[] = [];
  const sideIndices: number[] = [];
  const topIndices: number[] = [];

  const addVertex = (x: number, y: number, z: number, u = 0, v = 0) => {
    positions.push(x * MM, y * MM, z * MM);
    uvs.push(u, v);
    return positions.length / 3 - 1;
  };

  // 윗면 평면 좌표(x, 윗면 중심 기준 z) → 기울기·스큐·디시 반영한 키캡 좌표
  const topPoint = (x: number, zOnTop: number) => {
    const normalizedX = x / halfTopWidth;
    const dish = dishDepth * Math.max(0, 1 - normalizedX * normalizedX);
    return [x, height + zOnTop * Math.sin(tiltRad) - dish, -TOP_SKEW_MM + zOnTop * Math.cos(tiltRad)] as const;
  };

  const topUv = (x: number, zOnTop: number) => [x / topWidth + 0.5, 0.5 - zOnTop / topDepth] as const;

  const bottomRing = roundedRectRing(bottomWidth / 2, BOTTOM_SIZE_MM / 2, BOTTOM_RADIUS_MM, segmentsX, segmentsZ);
  const topRing = roundedRectRing(halfTopWidth, topDepth / 2, TOP_RADIUS_MM, segmentsX, segmentsZ);
  const ringLength = bottomRing.length;
  const nextIndex = (index: number) => (index + 1) % ringLength;

  // 옆면 — 바닥 링과 윗면 링 연결
  const sideBottom = bottomRing.map(([x, z]) => addVertex(x, 0, z));
  const sideTop = topRing.map(([x, z]) => addVertex(...topPoint(x, z)));
  sideBottom.forEach((bottom, index) => {
    const next = nextIndex(index);
    sideIndices.push(bottom, sideTop[next], sideBottom[next], bottom, sideTop[index], sideTop[next]);
  });

  // 바닥면 — 분해 연출 시 아래에서 보여도 뚫려 보이지 않게 막음
  const bottomCenter = addVertex(0, 0, 0);
  const bottomFace = bottomRing.map(([x, z]) => addVertex(x, 0, z));
  bottomFace.forEach((vertex, index) => {
    sideIndices.push(vertex, bottomFace[nextIndex(index)], bottomCenter);
  });

  // 윗면 — 동심 링으로 채워 디시 곡면 표현
  const topRings = Array.from({ length: TOP_RING_COUNT }, (_, ring) => {
    const scale = 1 - ring / TOP_RING_COUNT;
    return topRing.map(([x, z]) => addVertex(...topPoint(x * scale, z * scale), ...topUv(x * scale, z * scale)));
  });
  const topCenter = addVertex(...topPoint(0, 0), ...topUv(0, 0));

  topRings.forEach((outer, ring) => {
    const inner = topRings[ring + 1];
    outer.forEach((vertex, index) => {
      const next = nextIndex(index);
      if (inner) {
        topIndices.push(vertex, inner[index], outer[next], inner[index], inner[next], outer[next]);
      } else {
        topIndices.push(vertex, topCenter, outer[next]);
      }
    });
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex([...sideIndices, ...topIndices]);
  geometry.addGroup(0, sideIndices.length, 0);
  geometry.addGroup(sideIndices.length, topIndices.length, 1);
  geometry.computeVertexNormals();
  return geometry;
};

/** 너비·행 조합별 지오메트리 공유 — 앱 수명 동안 유지하므로 dispose 하지 않음 */
const geometryCache = new Map<string, BufferGeometry>();

export const getKeycapGeometry = (widthU: number, row: ProfileRow): BufferGeometry => {
  const cacheKey = `${widthU}:${row}`;
  const cached = geometryCache.get(cacheKey);
  if (cached) return cached;

  const geometry = buildKeycapGeometry(widthU, row);
  geometryCache.set(cacheKey, geometry);
  return geometry;
};
