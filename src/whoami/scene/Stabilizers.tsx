import { memo, useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import { MathUtils, MeshStandardMaterial, type BufferGeometry, type Group } from 'three';

import { KEY_PRESS_DAMPING, KEY_TRAVEL } from './glareTkl';
import {
  STAB_HOUSING_GEOMETRY,
  STAB_STEM_GEOMETRIES,
  STAB_WIRE_GEOMETRY,
  STABILIZER_COLORS,
} from './stabilizerGeometry';

/** 스템 5개가 같은 재질을 공유 — 앱 수명 동안 유지 */
const STEM_MATERIAL = new MeshStandardMaterial({ color: STABILIZER_COLORS.stem, roughness: 0.4 });

interface StabilizerStemProps {
  geometry: BufferGeometry;
  isPressed: boolean;
}

/** 받치는 키와 함께 트래블만큼 눌리는 스템 */
const StabilizerStem = ({ geometry, isPressed }: StabilizerStemProps) => {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.position.y = MathUtils.damp(group.position.y, isPressed ? -KEY_TRAVEL : 0, KEY_PRESS_DAMPING, delta);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={STEM_MATERIAL} dispose={null} />
    </group>
  );
};

interface StabilizersProps {
  pressedCodes: ReadonlySet<string>;
}

/** 스태빌라이저 전체 — 기판에 고정되므로 기판 레이어와 함께 이동, 하우징·와이어는 고정 */
const StabilizersBase = ({ pressedCodes }: StabilizersProps) => (
  <group>
    <mesh geometry={STAB_HOUSING_GEOMETRY} dispose={null}>
      <meshStandardMaterial color={STABILIZER_COLORS.housing} roughness={0.6} />
    </mesh>
    {STAB_STEM_GEOMETRIES.map(({ code, geometry }) => (
      <StabilizerStem key={code} geometry={geometry} isPressed={pressedCodes.has(code)} />
    ))}
    <mesh geometry={STAB_WIRE_GEOMETRY} dispose={null}>
      <meshStandardMaterial color={STABILIZER_COLORS.wire} metalness={0.9} roughness={0.28} />
    </mesh>
  </group>
);

export const Stabilizers = memo(StabilizersBase);
