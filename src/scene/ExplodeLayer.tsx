import { useRef, type ReactNode } from 'react';

import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group } from 'three';

/** 분해 이동 감쇠 계수 — 약 1초에 걸쳐 도착 */
const EXPLODE_DAMPING = 3.2;

interface ExplodeLayerProps {
  /** 목표 이동 거리 (u) */
  offset: number;
  /** 이동 방향 단위 벡터 — 부모 좌표계 기준 */
  direction: readonly [number, number, number];
  children: ReactNode;
}

/** 분해 단계가 바뀌면 자식 전체를 direction 방향으로 부드럽게 이동 */
export const ExplodeLayer = ({ offset, direction, children }: ExplodeLayerProps) => {
  const groupRef = useRef<Group>(null);
  const currentRef = useRef(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    currentRef.current = MathUtils.damp(currentRef.current, offset, EXPLODE_DAMPING, delta);
    const distance = currentRef.current;
    group.position.set(direction[0] * distance, direction[1] * distance, direction[2] * distance);
  });

  return <group ref={groupRef}>{children}</group>;
};
