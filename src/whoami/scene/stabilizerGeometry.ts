import { BoxGeometry, BufferGeometry, CylinderGeometry } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import { MM } from './cherryProfile';
import { PCB_TOP_DEPTH } from './glareTkl';
import { getKeyCenter } from './keyboardFrame';
import { TKL_KEYS } from './tklLayout';

/**
 * 체리 PCB 나사 고정식 스태빌라이저
 * - Glare 기판(Hineybush H87nu)은 PCB 마운트 — 조립 가이드 기판 렌더에 좌 Shift · 스페이스 · 우측 묶음 표시
 * - 스위치 중심 → 스태빌 스템 중심: 2u~2.75u 11.938mm · 7u 57.15mm (체리 규격)
 * - 좌표: 윗면 좌표계, 기판 윗면 기준
 */

export const STABILIZER_COLORS = {
  housing: '#1b1c1f',
  stem: '#121315',
  wire: '#c5c8cc',
} as const;

/** 키별 스태빌 반간격 (mm) */
const HALF_SPAN_MM: Readonly<Record<string, number>> = {
  Backspace: 11.938,
  Enter: 11.938,
  ShiftLeft: 11.938,
  ShiftRight: 11.938,
  Space: 57.15,
};

export interface StabilizerPlacement {
  /** 스태빌라이저가 받치는 키 — 눌림 연동용 */
  code: string;
  x: number;
  z: number;
  /** 키 중심에서 좌우 스템까지 (u) */
  halfSpan: number;
}

export const STABILIZERS: readonly StabilizerPlacement[] = TKL_KEYS.filter(({ code }) => code in HALF_SPAN_MM).map(
  (key) => {
    const [x, z] = getKeyCenter(key);
    return { code: key.code, x, z, halfSpan: HALF_SPAN_MM[key.code] * MM };
  },
);

/** 하우징 z 범위 (mm, 스템 기준) — 뒤쪽으로 길게 뻗음 */
export const STAB_HOUSING_Z_MM = { back: -7.5, front: 4.7 } as const;
const STAB_HOUSING_WIDTH_MM = 6.6;
const STAB_HOUSING_HEIGHT_MM = 11.2;
/** 와이어 — 하우징 뒤쪽 끝, 기판 위 */
const WIRE_RADIUS_MM = 0.75;
const WIRE_Y_MM = 1.2;
const WIRE_Z_MM = -8.3;

const base = -PCB_TOP_DEPTH;

const box = (width: number, height: number, depth: number, x: number, yMm: number, zMm: number) =>
  new BoxGeometry(width * MM, height * MM, depth * MM).translate(x, base + yMm * MM, zMm * MM).toNonIndexed();

const merge = (geometries: BufferGeometry[]) => mergeGeometries(geometries) ?? new BufferGeometry();

/** 스태빌마다 좌우 한 쌍 — 절대 좌표로 한 지오메트리에 병합 */
const eachSide = (build: (x: number, z: number) => BufferGeometry[]) =>
  merge(STABILIZERS.flatMap(({ x, z, halfSpan }) => [...build(x - halfSpan, z), ...build(x + halfSpan, z)]));

export const STAB_HOUSING_GEOMETRY = eachSide((x, z) => [
  box(
    STAB_HOUSING_WIDTH_MM,
    STAB_HOUSING_HEIGHT_MM,
    STAB_HOUSING_Z_MM.front - STAB_HOUSING_Z_MM.back,
    x,
    STAB_HOUSING_HEIGHT_MM / 2,
    z / MM + (STAB_HOUSING_Z_MM.front + STAB_HOUSING_Z_MM.back) / 2,
  ),
]);

/** 슬라이더 + 키캡에 끼는 십자 — 스위치 스템 십자와 같은 높이(보강판 위 10.7mm)까지 */
const buildStem = (x: number, z: number) => [
  box(4, 3.4, 4, x, 10.7, z / MM),
  box(4.1, 3.3, 1.17, x, 14.05, z / MM),
  box(1.17, 3.3, 4.1, x, 14.05, z / MM),
];

/** 스템은 키마다 따로 — 받치는 키가 눌리면 함께 내려가야 키캡 윗면을 뚫고 나오지 않음 */
export const STAB_STEM_GEOMETRIES = STABILIZERS.map(({ code, x, z, halfSpan }) => ({
  code,
  geometry: merge([...buildStem(x - halfSpan, z), ...buildStem(x + halfSpan, z)]),
}));

export const STAB_WIRE_GEOMETRY = merge(
  STABILIZERS.flatMap(({ x, z, halfSpan }) => {
    const wireZ = z + WIRE_Z_MM * MM;
    const y = base + WIRE_Y_MM * MM;
    const legLength = (STAB_HOUSING_Z_MM.back - WIRE_Z_MM + 3) * MM;
    const leg = (sideX: number) =>
      new CylinderGeometry(WIRE_RADIUS_MM * MM, WIRE_RADIUS_MM * MM, legLength, 8)
        .rotateX(Math.PI / 2)
        .translate(sideX, y, wireZ + legLength / 2)
        .toNonIndexed();

    return [
      new CylinderGeometry(WIRE_RADIUS_MM * MM, WIRE_RADIUS_MM * MM, halfSpan * 2, 8)
        .rotateZ(Math.PI / 2)
        .translate(x, y, wireZ)
        .toNonIndexed(),
      leg(x - halfSpan),
      leg(x + halfSpan),
    ];
  }),
);
