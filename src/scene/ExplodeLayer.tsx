import { useRef, type ReactNode } from 'react';

import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group } from 'three';

import { SNAP_DELTA } from './snap';

/** 분해 이동 감쇠 계수 — 약 1초에 걸쳐 도착 */
const EXPLODE_DAMPING = 3.2;

interface ExplodeLayerProps {
  /** 목표 이동 거리 (u) */
  offset: number;
  /** 이동 방향 단위 벡터 — 부모 좌표계 기준 */
  direction: readonly [number, number, number];
  children: ReactNode;
}

/**
 * 분해 단계가 바뀌면 자식 전체를 direction 방향으로 부드럽게 이동
 * - 첫 프레임은 목표 거리에 바로 놓음 — 분해된 화면으로 바로 들어와도 조립 상태에서 벌어지는 장면이 없게
 */
export const ExplodeLayer = ({ offset, direction, children }: ExplodeLayerProps) => {
  const groupRef = useRef<Group>(null);
  const currentRef = useRef(0);
  const isPlacedRef = useRef(false);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const step = isPlacedRef.current ? delta : SNAP_DELTA;
    isPlacedRef.current = true;

    currentRef.current = MathUtils.damp(currentRef.current, offset, EXPLODE_DAMPING, step);
    const distance = currentRef.current;
    group.position.set(direction[0] * distance, direction[1] * distance, direction[2] * distance);
  });

  return <group ref={groupRef}>{children}</group>;
};
