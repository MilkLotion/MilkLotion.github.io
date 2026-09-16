import { memo } from 'react';

import { BOTTOM_FLOOR_DECAL, WEIGHT_TOP_DECAL, type TiltedDecal } from './caseDetailTextures';
import { MM } from './cherryProfile';
import {
  BOTTOM_CASE_GEOMETRIES,
  PORT_CENTER,
  PORT_ROTATION_X,
  PORT_SLOT_GEOMETRY,
  TOP_FRAME_BEVEL,
  TOP_FRAME_GEOMETRY,
  USB_C_SHELL_GEOMETRY,
  USB_C_TONGUE_GEOMETRY,
  WEIGHT_GEOMETRY,
} from './glareCaseGeometry';
import { FRONT_HEIGHT, TOP_CASE_THICKNESS, TYPING_ANGLE_RAD } from './glareTkl';

/** 실버 아노다이징 — 사진 샘플을 환경광 반사 기준으로 보정 */
const CASE_COLOR = '#c9c9c6';
/** 스테인리스 316L 샌드블라스트 무게추 */
const WEIGHT_COLOR = '#adafb0';
const PORT_HOLE_COLOR = '#0c0c0d';
const USB_C_SHELL_COLOR = '#8c8f93';
const USB_C_TONGUE_COLOR = '#1f1f22';

/** 경사면 위로 띄우는 거리 — 면 겹침 깜빡임 방지 */
const DECAL_OFFSET = 0.05 * MM;

interface TiltedDecalMeshProps {
  decal: TiltedDecal;
  metalness: number;
  roughness: number;
}

/** 책상 좌표계 부모 안에서 윗면 좌표계 평면 데칼 */
const TiltedDecalMesh = ({ decal, metalness, roughness }: TiltedDecalMeshProps) => (
  <group position={[0, FRONT_HEIGHT, 0]} rotation={[TYPING_ANGLE_RAD, 0, 0]}>
    <mesh position={[0, decal.y, decal.centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[decal.width, decal.depth]} />
      <meshStandardMaterial map={decal.texture} metalness={metalness} roughness={roughness} />
    </mesh>
  </group>
);

/** 상판 — 윗면 좌표계, 셰이프 평면(x, 뒤쪽 거리)을 눕히고 돌출 방향을 위로 */
const GlareTopFrameBase = () => (
  <mesh
    geometry={TOP_FRAME_GEOMETRY}
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -TOP_CASE_THICKNESS + TOP_FRAME_BEVEL, 0]}
    dispose={null}
  >
    <meshStandardMaterial color={CASE_COLOR} metalness={0.7} roughness={0.38} />
  </mesh>
);

/** 하판 트레이 — 책상 좌표계, 바닥 + 사방 벽 조각 + 바닥 가공 데칼 */
const GlareBottomCaseBase = () => (
  <group>
    {BOTTOM_CASE_GEOMETRIES.map((geometry) => (
      <mesh key={geometry.uuid} geometry={geometry} dispose={null}>
        <meshStandardMaterial color={CASE_COLOR} metalness={0.7} roughness={0.4} />
      </mesh>
    ))}
    <TiltedDecalMesh decal={BOTTOM_FLOOR_DECAL} metalness={0.7} roughness={0.4} />
  </group>
);

/** 무게추 + 윗면 포켓·도터보드 데칼 + 후면 포트 — 책상 좌표계 */
const GlareWeightBase = () => (
  <group>
    <mesh geometry={WEIGHT_GEOMETRY} dispose={null}>
      <meshStandardMaterial color={WEIGHT_COLOR} metalness={0.85} roughness={0.52} />
    </mesh>
    <TiltedDecalMesh decal={WEIGHT_TOP_DECAL} metalness={0.85} roughness={0.52} />

    {/* 무게추 뒷면 경사면 위 USB-C 포트 — 구멍 + 리셉터클 외곽 + 텅 */}
    <group position={PORT_CENTER} rotation={[PORT_ROTATION_X, 0, 0]}>
      <mesh geometry={PORT_SLOT_GEOMETRY} position={[0, 0, DECAL_OFFSET]} dispose={null}>
        <meshStandardMaterial color={PORT_HOLE_COLOR} roughness={0.9} />
      </mesh>
      <mesh geometry={USB_C_SHELL_GEOMETRY} position={[0, 0, DECAL_OFFSET * 2]} dispose={null}>
        <meshStandardMaterial color={USB_C_SHELL_COLOR} metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh geometry={USB_C_TONGUE_GEOMETRY} position={[0, 0, DECAL_OFFSET * 2]} dispose={null}>
        <meshStandardMaterial color={USB_C_TONGUE_COLOR} roughness={0.6} />
      </mesh>
    </group>
  </group>
);

export const GlareTopFrame = memo(GlareTopFrameBase);
export const GlareBottomCase = memo(GlareBottomCaseBase);
export const GlareWeight = memo(GlareWeightBase);
