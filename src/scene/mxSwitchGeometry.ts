import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  Curve,
  CylinderGeometry,
  Float32BufferAttribute,
  LatheGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import { MM } from './cherryProfile';

/**
 * 체리 MX 흑축 (MX1A-11NW · PCB 고정 5핀)
 * - 형태 기준: 위키미디어 공용 · telcontar 의 MX 실물·분해 사진 (윗면 · 정면 · 측면 · 바닥 · 분해)
 * - 높이: 측면 사진을 하우징 폭 15.6mm 로 환산 — 상부 하우징 윗면 6.6mm · 스템 끝 10.5mm · 하부 하우징 4.8mm
 * - 소재·색: 상·하부 하우징 검정 나일론 · 스템 검정 POM · 스테인리스 스프링 · 금 합금 접점 (체리 데이터시트)
 * - 원점: 보강판 윗면 중앙, +y 위, +z 사용자 쪽 — 핀·접점·로고는 뒤쪽, LED 창은 앞쪽
 */

export const SWITCH_COLORS = {
  housing: '#1d1e21',
  stem: '#121315',
  spring: '#cdd0d4',
  metal: '#c2a266',
} as const;

/** 금속 핀 위치 (x, z mm) — 스위치 중심 기준 */
export const SWITCH_PIN_POSITIONS_MM: readonly (readonly [x: number, z: number])[] = [
  [-3.81, -2.54],
  [2.54, -5.08],
];

const FLANGE_TOP_Y = 0.9;
const LOWER_BODY_TOP_Y = 2.8;
const HOUSING_TOP_Y = 6.6;
const STEM_TOP_Y = 10.5;
/** 하부 하우징 안쪽 바닥 윗면 */
const FLOOR_TOP_Y = -4;
/** 조립 상태 스프링 — 하우징 바닥에서 스템 어깨 아래까지 */
const SPRING_HEIGHT_MM = 8.4;

export const SPRING_BOTTOM_Y = FLOOR_TOP_Y * MM;
/** 분해했을 때 늘어나는 자유 길이 비율 */
export const SPRING_FREE_SCALE = 1.45;

type Point3 = readonly [x: number, y: number, z: number];

/** mm 단위 박스 — 중심 좌표 지정, 병합을 위해 비인덱스로 통일 */
const box = (width: number, height: number, depth: number, x: number, y: number, z: number) =>
  new BoxGeometry(width * MM, height * MM, depth * MM).translate(x * MM, y * MM, z * MM).toNonIndexed();

const cylinder = (radius: number, height: number, x: number, y: number, z: number, segments = 16) =>
  new CylinderGeometry(radius * MM, radius * MM, height * MM, segments)
    .translate(x * MM, y * MM, z * MM)
    .toNonIndexed();

const merge = (geometries: BufferGeometry[]) => mergeGeometries(geometries) ?? new BufferGeometry();

/** 사각형 면 목록 → 평면 법선 지오메트리 (병합 호환용 빈 UV 포함) */
const buildQuads = (quads: readonly (readonly [Point3, Point3, Point3, Point3])[]) => {
  const positions = quads.flatMap(([a, b, c, d]) => [a, b, c, a, c, d].flatMap(([x, y, z]) => [x * MM, y * MM, z * MM]));
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(new Array((positions.length / 3) * 2).fill(0), 2));
  geometry.computeVertexNormals();
  return geometry;
};

const rectAt = (width: number, depth: number, y: number): Point3[] => [
  [-width / 2, y, -depth / 2],
  [width / 2, y, -depth / 2],
  [width / 2, y, depth / 2],
  [-width / 2, y, depth / 2],
];

/** 윗면에 스템 창이 뚫린 사각 절두체 — 바깥 경사면 · 윗면 테두리 · 창 안쪽 벽 · 창 바닥 · 밑면 */
const createWindowedFrustum = () => {
  const bottom = rectAt(13.3, 13.3, LOWER_BODY_TOP_Y);
  const top = rectAt(10.4, 11.8, HOUSING_TOP_Y);
  const windowTop = rectAt(7.4, 5.6, HOUSING_TOP_Y);
  const windowFloor = rectAt(7.4, 5.6, 5.2);
  const next = (index: number) => (index + 1) % 4;

  return buildQuads([
    ...[0, 1, 2, 3].flatMap((i) => [
      [bottom[i], top[i], top[next(i)], bottom[next(i)]] as const,
      [top[i], windowTop[i], windowTop[next(i)], top[next(i)]] as const,
      [windowTop[i], windowFloor[i], windowFloor[next(i)], windowTop[next(i)]] as const,
    ]),
    [bottom[0], bottom[1], bottom[2], bottom[3]],
    [windowFloor[0], windowFloor[3], windowFloor[2], windowFloor[1]],
  ]);
};

/** 상부 하우징 — 플랜지 · 앞뒤 걸쇠 탭 · 수직 몸체 · 창 뚫린 경사 몸체 · LED 창 둔덕 · CHERRY 로고 돌출 */
const createTopHousing = () =>
  merge([
    box(15.6, FLANGE_TOP_Y, 15.6, 0, FLANGE_TOP_Y / 2, 0),
    box(2.6, 0.9, 1, 0, 0.45, -8.3),
    box(2.6, 0.9, 1, 0, 0.45, 8.3),
    box(13.3, LOWER_BODY_TOP_Y - FLANGE_TOP_Y, 13.3, 0, (FLANGE_TOP_Y + LOWER_BODY_TOP_Y) / 2, 0),
    createWindowedFrustum(),
    cylinder(1.4, 0.25, 0, HOUSING_TOP_Y + 0.125, 4.4, 20),
    box(2.2, 0.1, 0.5, 0, HOUSING_TOP_Y + 0.3, 4.4),
    box(5.5, 0.15, 1.2, 0, HOUSING_TOP_Y + 0.075, -5),
  ]);

/** 스프링 받침 — 센터 포스트 구멍을 둘러싼 원통 턱 */
const createSpringSocket = () =>
  new LatheGeometry(
    [
      new Vector2(1.2 * MM, FLOOR_TOP_Y * MM),
      new Vector2(2.3 * MM, FLOOR_TOP_Y * MM),
      new Vector2(2.3 * MM, -1.2 * MM),
      new Vector2(1.2 * MM, -1.2 * MM),
      new Vector2(1.2 * MM, FLOOR_TOP_Y * MM),
    ],
    20,
  ).toNonIndexed();

/** 하부 하우징 — 속 빈 상자 · 모서리 귀 · 동서 보강판 걸쇠 · 스프링 받침 · 센터 포스트 · PCB 고정 핀 */
const createBottomHousing = () =>
  merge([
    box(14, 1, 14, 0, FLOOR_TOP_Y - 0.5, 0),
    box(14, -FLOOR_TOP_Y, 1, 0, FLOOR_TOP_Y / 2, -6.5),
    box(14, -FLOOR_TOP_Y, 1, 0, FLOOR_TOP_Y / 2, 6.5),
    box(1, -FLOOR_TOP_Y, 12, -6.5, FLOOR_TOP_Y / 2, 0),
    box(1, -FLOOR_TOP_Y, 12, 6.5, FLOOR_TOP_Y / 2, 0),
    ...[-1, 1].flatMap((sideX) => [-1, 1].map((sideZ) => box(2.4, 0.8, 2.4, sideX * 5.8, 0.4, sideZ * 5.8))),
    box(0.7, 2.4, 4.5, -7.35, -2.8, 0),
    box(0.7, 2.4, 4.5, 7.35, -2.8, 0),
    createSpringSocket(),
    cylinder(2, 2, 0, -6, 0),
    cylinder(0.85, 2.6, -5.08, -6.3, 0, 10),
    cylinder(0.85, 2.6, 5.08, -6.3, 0, 10),
  ]);

/** 스템 — 십자 · 창에 보이는 머리 · 어깨 판 · 슬라이더 레일과 걸림턱 · 스프링 가이드 · 접점 누르는 다리 */
const createStem = () => {
  const crossHeight = STEM_TOP_Y - HOUSING_TOP_Y;
  const crossY = (HOUSING_TOP_Y + STEM_TOP_Y) / 2;

  return merge([
    box(4.1, crossHeight, 1.17, 0, crossY, 0),
    box(1.17, crossHeight, 4.1, 0, crossY, 0),
    box(6.8, 1.2, 5, 0, 6, 0),
    box(8.6, 1, 6.4, 0, 4.9, 0),
    box(1, 4.4, 5, -3.8, 2.2, 0),
    box(1, 4.4, 5, 3.8, 2.2, 0),
    box(0.8, 0.8, 2, -4.4, 0.4, 0),
    box(0.8, 0.8, 2, 4.4, 0.4, 0),
    cylinder(1, 7.4, 0, 0.7, 0, 12),
    new ConeGeometry(1 * MM, 0.8 * MM, 12).rotateX(Math.PI).translate(0, -3.4 * MM, 0).toNonIndexed(),
    box(3.2, 3.6, 0.9, 1.2, 2.6, -3.3),
    box(1.2, 1, 1.4, 1.2, 0.3, -3.6),
  ]);
};

/** 금속 — 기판 핀 2개 + 고정 접점 + 기울어진 가동 접점 판 */
const createMetal = () =>
  merge([
    ...SWITCH_PIN_POSITIONS_MM.map(([x, z]) => box(1.5, 3.3, 0.5, x, -6.65, z)),
    box(3.6, 3.2, 0.3, -1.4, -2.4, -5.6),
    new BoxGeometry(3.6 * MM, 3.8 * MM, 0.3 * MM)
      .rotateX(0.35)
      .translate(1.6 * MM, -2 * MM, -4.8 * MM)
      .toNonIndexed(),
  ]);

/** 스프링 나선 — t 0→1 동안 바닥에서 height 까지 감아 올라감 */
class HelixCurve extends Curve<Vector3> {
  private readonly radius: number;
  private readonly height: number;
  private readonly turns: number;

  constructor(radius: number, height: number, turns: number) {
    super();
    this.radius = radius;
    this.height = height;
    this.turns = turns;
  }

  override getPoint(t: number, optionalTarget = new Vector3()): Vector3 {
    const angle = t * this.turns * Math.PI * 2;
    return optionalTarget.set(Math.cos(angle) * this.radius, t * this.height, Math.sin(angle) * this.radius);
  }
}

/** 인스턴싱·단일 스위치가 공유 — 앱 수명 동안 유지 */
export const TOP_HOUSING_GEOMETRY = createTopHousing();
export const BOTTOM_HOUSING_GEOMETRY = createBottomHousing();
export const STEM_GEOMETRY = createStem();
export const SWITCH_METAL_GEOMETRY = createMetal();
export const SPRING_GEOMETRY = new TubeGeometry(
  new HelixCurve(2.6 * MM, SPRING_HEIGHT_MM * MM, 12),
  240,
  0.3 * MM,
  6,
  false,
);
