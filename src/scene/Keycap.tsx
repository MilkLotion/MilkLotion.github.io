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
/** 고른 키 표시 — Esc 키캡과 같은 금색으로 옅게 발광. 비스듬한 시점에서는 눌림만으로 구분이 안 됨 */
const HIGHLIGHT_COLOR = '#c9ab6b';
const HIGHLIGHT_INTENSITY = 0.8;

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
  /** 고른 키 — 옅은 금색 발광 */
  isHighlighted: boolean;
  onPress: (code: string) => void;
  onRelease: (code: string) => void;
  /** 마우스로 누른 순간 — 페이지가 키캡으로 무언가를 고를 때 (눌림 표시와 별개) */
  onPointerSelect?: (code: string) => void;
  /** 마우스가 올라가면 code, 벗어나면 null */
  onHoverChange?: (code: string | null) => void;
}

const KeycapBase = ({
  code,
  widthU,
  row,
  style,
  position,
  travel,
  isPressed,
  isHighlighted,
  onPress,
  onRelease,
  onPointerSelect,
  onHoverChange,
}: KeycapProps) => {
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

  // 고른 키 발광 — 재질은 스타일별로 만들어 두고 발광 속성만 바꿈 (three 객체 동기화라 Effect)
  useEffect(() => {
    new Set(materials).forEach((material) => {
      material.emissive.set(isHighlighted ? HIGHLIGHT_COLOR : '#000000');
      material.emissiveIntensity = isHighlighted ? HIGHLIGHT_INTENSITY : 1;
    });
  }, [materials, isHighlighted]);

  useFrame((_, delta) => {
    const group = travelRef.current;
    if (!group) return;
    group.position.y = MathUtils.damp(group.position.y, isPressed ? -travel : 0, KEY_PRESS_DAMPING, delta);
  });

  // 레이 경로 뒤쪽 키까지 같이 반응하는 것 방지
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onPress(code);
    onPointerSelect?.(code);
  };

  const handlePointerUp = () => {
    onRelease(code);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
    onHoverChange?.(code);
  };

  // 누른 채 키 밖으로 벗어나면 pointerup 을 못 받음 — 이탈 시 해제
  const handlePointerOut = () => {
    setIsHovered(false);
    onRelease(code);
    onHoverChange?.(null);
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
