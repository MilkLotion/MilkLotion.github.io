import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { useCursor } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { MathUtils, MeshStandardMaterial, type Group } from 'three';

import { getKeycapGeometry, getKeycapTopSize, type ProfileRow } from './cherryProfile';
import { KEY_PRESS_DAMPING } from './glareTkl';
import { createKeycapTopTexture } from './keycapTexture';
import type { KeycapStyle } from './lazurite';

/** GMK ABS 더블샷 — 반광 표면 */
const KEYCAP_ROUGHNESS = 0.42;

interface KeycapProps {
  code: string;
  widthU: number;
  row: ProfileRow;
  style: KeycapStyle;
  /** 키캡 바닥 중심 — 모듈 상수 참조를 넘겨야 memo 가 유지됨 */
  position: [number, number, number];
  /** 끝까지 눌렀을 때 내려가는 거리 (u) */
  travel: number;
  isPressed: boolean;
  onPress: (code: string) => void;
  onRelease: (code: string) => void;
}

const KeycapBase = ({ code, widthU, row, style, position, travel, isPressed, onPress, onRelease }: KeycapProps) => {
  const travelRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isHovered);

  const geometry = getKeycapGeometry(widthU, row);

  // 옆면은 캡 색, 윗면은 각인 텍스처 — 각인 없는 키는 옆면 재질 공유
  const materials = useMemo(() => {
    const side = new MeshStandardMaterial({ color: style.cap, roughness: KEYCAP_ROUGHNESS });
    if (style.legend.kind === 'blank') return [side, side];

    const { widthMm, depthMm } = getKeycapTopSize(widthU);
    const top = new MeshStandardMaterial({
      map: createKeycapTopTexture(style, widthMm, depthMm),
      roughness: KEYCAP_ROUGHNESS,
    });
    return [side, top];
  }, [style, widthU]);

  // prop 으로 넘긴 재질·텍스처는 R3F 가 해제하지 않음 — 교체·언마운트 시 직접 해제
  useEffect(
    () => () => {
      new Set(materials).forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
    },
    [materials],
  );

  useFrame((_, delta) => {
    const group = travelRef.current;
    if (!group) return;
    group.position.y = MathUtils.damp(group.position.y, isPressed ? -travel : 0, KEY_PRESS_DAMPING, delta);
  });

  // 레이 경로 뒤쪽 키까지 같이 반응하는 것 방지
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onPress(code);
  };

  const handlePointerUp = () => {
    onRelease(code);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  // 누른 채 키 밖으로 벗어나면 pointerup 을 못 받음 — 이탈 시 해제
  const handlePointerOut = () => {
    setIsHovered(false);
    onRelease(code);
  };

  return (
    <group position={position}>
      <group ref={travelRef}>
        <mesh
          geometry={geometry}
          material={materials}
          dispose={null}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </group>
    </group>
  );
};

export const Keycap = memo(KeycapBase);
