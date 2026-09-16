import { memo, useLayoutEffect, useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import {
  DoubleSide,
  FrontSide,
  MathUtils,
  Object3D,
  type BufferGeometry,
  type InstancedMesh,
  type Side,
} from 'three';

import { KEY_PRESS_DAMPING, KEY_TRAVEL } from './glareTkl';
import { FOCUS_SWITCH_CODE, getKeyCenter, SWITCH_BASE_Y } from './keyboardFrame';
import {
  BOTTOM_HOUSING_GEOMETRY,
  STEM_GEOMETRY,
  SWITCH_COLORS,
  SWITCH_METAL_GEOMETRY,
  TOP_HOUSING_GEOMETRY,
} from './mxSwitchGeometry';
import { applySwitchRim } from './rimLight';
import { TKL_KEYS } from './tklLayout';

/** 확대용 스위치는 MxSwitch 로 따로 그리므로 제외 */
const FIELD_KEYS = TKL_KEYS.filter(({ code }) => code !== FOCUS_SWITCH_CODE);
const FIELD_CENTERS = FIELD_KEYS.map(getKeyCenter);
/** 인스턴스 행렬 계산용 임시 객체 — 프레임마다 새로 만들지 않게 모듈에서 공유 */
const placement = new Object3D();
/** 목표 트래블에 이만큼 가까워지면 도착으로 보고 갱신 중단 */
const SETTLE_TRAVEL = 1e-5;

type PressedCodes = ReadonlySet<string>;

const writeInstance = (mesh: InstancedMesh, index: number, travel: number) => {
  const [x, z] = FIELD_CENTERS[index];
  placement.position.set(x, SWITCH_BASE_Y - travel, z);
  placement.updateMatrix();
  mesh.setMatrixAt(index, placement.matrix);
};

interface InstancedPartProps {
  geometry: BufferGeometry;
  color: string;
  metalness?: number;
  roughness: number;
  side?: Side;
  /** 검정 플라스틱 부품만 테두리 반사광 */
  hasRim?: boolean;
  /** 지정하면 눌린 키 위치의 인스턴스가 트래블만큼 내려감 — 스템 전용 */
  pressedCodes?: PressedCodes;
}

const InstancedPart = ({
  geometry,
  color,
  metalness = 0,
  roughness,
  side = FrontSide,
  hasRim = false,
  pressedCodes,
}: InstancedPartProps) => {
  const meshRef = useRef<InstancedMesh>(null);
  const travelsRef = useRef(new Float32Array(FIELD_KEYS.length));

  // 배치가 정적이라 마운트 시 인스턴스 행렬을 한 번 기록
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    FIELD_KEYS.forEach((_, index) => writeInstance(mesh, index, 0));
    mesh.instanceMatrix.needsUpdate = true;
    // 기본 경계구는 원점 스위치 하나 기준이라 엉뚱하게 컬링됨 — 인스턴스 전체로 재계산
    mesh.computeBoundingSphere();
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !pressedCodes) return;

    const travels = travelsRef.current;
    let hasChanged = false;
    FIELD_KEYS.forEach(({ code }, index) => {
      const goal = pressedCodes.has(code) ? KEY_TRAVEL : 0;
      if (Math.abs(travels[index] - goal) < SETTLE_TRAVEL) return;

      travels[index] = MathUtils.damp(travels[index], goal, KEY_PRESS_DAMPING, delta);
      writeInstance(mesh, index, travels[index]);
      hasChanged = true;
    });
    if (hasChanged) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, FIELD_KEYS.length]} dispose={null}>
      {/* onBeforeCompile 에 undefined 를 넣으면 셰이더 컴파일 때 호출 실패 — 림 있을 때만 전달 */}
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        side={side}
        {...(hasRim ? { onBeforeCompile: applySwitchRim } : {})}
      />
    </instancedMesh>
  );
};

interface SwitchFieldProps {
  pressedCodes: PressedCodes;
}

/**
 * 스위치 86개 — 부품별 인스턴싱 (스프링은 하우징 안이라 생략)
 * - 스템은 키캡과 함께 눌려야 키캡 윗면을 뚫고 나오지 않음 (스템 끝이 눌린 키캡 윗면보다 높음)
 */
const SwitchFieldBase = ({ pressedCodes }: SwitchFieldProps) => (
  <group>
    {/* 창 뚫린 절두체는 직접 짠 면이라 양면 렌더 */}
    <InstancedPart
      geometry={TOP_HOUSING_GEOMETRY}
      color={SWITCH_COLORS.housing}
      roughness={0.62}
      side={DoubleSide}
      hasRim
    />
    <InstancedPart geometry={BOTTOM_HOUSING_GEOMETRY} color={SWITCH_COLORS.housing} roughness={0.62} hasRim />
    <InstancedPart
      geometry={STEM_GEOMETRY}
      color={SWITCH_COLORS.stem}
      roughness={0.38}
      hasRim
      pressedCodes={pressedCodes}
    />
    <InstancedPart geometry={SWITCH_METAL_GEOMETRY} color={SWITCH_COLORS.metal} metalness={0.85} roughness={0.3} />
  </group>
);

export const SwitchField = memo(SwitchFieldBase);
