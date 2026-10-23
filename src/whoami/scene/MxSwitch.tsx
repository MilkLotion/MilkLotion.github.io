import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import { DoubleSide, MathUtils, type Group, type Mesh } from 'three';

import { SWITCH_PART_OFFSETS, type SwitchPartId } from './explodeStages';
import { KEY_PRESS_DAMPING, KEY_TRAVEL } from './glareTkl';
import {
  BOTTOM_HOUSING_GEOMETRY,
  SPRING_BOTTOM_Y,
  SPRING_FREE_SCALE,
  SPRING_GEOMETRY,
  STEM_GEOMETRY,
  SWITCH_COLORS,
  SWITCH_METAL_GEOMETRY,
  TOP_HOUSING_GEOMETRY,
} from './mxSwitchGeometry';
import { applySwitchRim } from './rimLight';
import { SNAP_DELTA } from './snap';

/** 부품 벌어짐 감쇠 계수 */
const EXPLODE_DAMPING = 3;

const PART_IDS: readonly SwitchPartId[] = ['topHousing', 'stem', 'spring', 'bottomHousing'];

interface MxSwitchProps {
  /** 윗면 좌표계 스위치 원점 (보강판 윗면) */
  position: [number, number, number];
  isExploded: boolean;
  /** 해당 키가 눌림 — 스템이 키캡과 함께 트래블만큼 내려감 */
  isPressed: boolean;
}

/** 확대용 단일 스위치 — 분해 시 부품별로 위로 벌어지고 스프링은 자유 길이로 늘어남 */
export const MxSwitch = ({ position, isExploded, isPressed }: MxSwitchProps) => {
  const progressRef = useRef(0);
  const stemTravelRef = useRef(0);
  /** 첫 프레임은 벌어짐 목표에 바로 놓음 — 스위치 분해 화면으로 바로 들어와도 부품이 벌어지는 장면이 없게 */
  const isPlacedRef = useRef(false);
  const partGroupsRef = useRef<Partial<Record<SwitchPartId, Group | null>>>({});
  const springMeshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const explodeStep = isPlacedRef.current ? delta : SNAP_DELTA;
    isPlacedRef.current = true;

    const progress = MathUtils.damp(progressRef.current, isExploded ? 1 : 0, EXPLODE_DAMPING, explodeStep);
    progressRef.current = progress;

    PART_IDS.forEach((partId) => {
      const group = partGroupsRef.current[partId];
      if (group) group.position.y = SWITCH_PART_OFFSETS[partId] * progress;
    });

    // 스템은 키캡과 함께 눌림 — 키캡 윗면을 뚫고 나오지 않게
    stemTravelRef.current = MathUtils.damp(stemTravelRef.current, isPressed ? KEY_TRAVEL : 0, KEY_PRESS_DAMPING, delta);
    const stemGroup = partGroupsRef.current.stem;
    if (stemGroup) stemGroup.position.y -= stemTravelRef.current;

    const springMesh = springMeshRef.current;
    if (springMesh) springMesh.scale.y = MathUtils.lerp(1, SPRING_FREE_SCALE, progress);
  });

  const bindPart = (partId: SwitchPartId) => (group: Group | null) => {
    partGroupsRef.current[partId] = group;
  };

  return (
    <group position={position}>
      <group ref={bindPart('bottomHousing')}>
        <mesh geometry={BOTTOM_HOUSING_GEOMETRY} dispose={null}>
          <meshStandardMaterial color={SWITCH_COLORS.housing} roughness={0.62} onBeforeCompile={applySwitchRim} />
        </mesh>
        <mesh geometry={SWITCH_METAL_GEOMETRY} dispose={null}>
          <meshStandardMaterial color={SWITCH_COLORS.metal} metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      <group ref={bindPart('spring')}>
        {/* 지오메트리가 바닥에서 위로 감기므로 바닥 기준으로 늘어남 */}
        <mesh ref={springMeshRef} geometry={SPRING_GEOMETRY} position={[0, SPRING_BOTTOM_Y, 0]} dispose={null}>
          <meshStandardMaterial color={SWITCH_COLORS.spring} metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      <group ref={bindPart('stem')}>
        <mesh geometry={STEM_GEOMETRY} dispose={null}>
          <meshStandardMaterial color={SWITCH_COLORS.stem} roughness={0.38} onBeforeCompile={applySwitchRim} />
        </mesh>
      </group>

      <group ref={bindPart('topHousing')}>
        <mesh geometry={TOP_HOUSING_GEOMETRY} dispose={null}>
          {/* 창 뚫린 절두체는 직접 짠 면이라 양면 렌더로 감김 방향 실수를 흡수 */}
          <meshStandardMaterial
            color={SWITCH_COLORS.housing}
            roughness={0.62}
            side={DoubleSide}
            onBeforeCompile={applySwitchRim}
          />
        </mesh>
      </group>
    </group>
  );
};
