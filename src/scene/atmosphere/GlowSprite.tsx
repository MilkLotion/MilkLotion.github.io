import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, PerspectiveCamera, Vector3, type Group } from 'three';

import { getViewShiftNdc } from '../viewShift';
import { RADIAL_GLOW_TEXTURE } from './glowTextures';
import type { Mood } from './moods';

type GlowSpriteProps = NonNullable<Mood['glow']>;

/** 프레임마다 새로 만들지 않도록 모듈에서 공유하는 계산용 벡터 */
const basePosition = new Vector3();
const cameraForward = new Vector3();
const cameraUp = new Vector3();

/**
 * 광원 번짐 — 키보드 뒤에 두어 가려진 부분이 실루엣으로 남음
 * - 렌즈 평행 이동으로 키보드만 화면 아래로 옮길 때, 번짐은 이동량만큼 카메라 위쪽으로 되돌려 화면 제자리 유지
 *   (스프라이트는 카메라를 향한 평면이라 중심 깊이 하나로 정확히 보정됨)
 */
export const GlowSprite = ({ color, size, opacity, position, flare }: GlowSpriteProps) => {
  const groupRef = useRef<Group>(null);

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) return;

    basePosition.set(...position);
    const shiftNdc = getViewShiftNdc(camera);
    if (shiftNdc === 0 || !(camera instanceof PerspectiveCamera)) {
      group.position.copy(basePosition);
      return;
    }

    camera.getWorldDirection(cameraForward);
    cameraUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
    const depth = cameraForward.dot(basePosition.clone().sub(camera.position));
    // NDC 세로 1 = 그 깊이에서 화면 절반 높이
    const halfHeightAtDepth = depth * Math.tan((camera.fov * Math.PI) / 360);
    group.position.copy(basePosition).addScaledVector(cameraUp, shiftNdc * halfHeightAtDepth);
  });

  return (
    <group ref={groupRef} position={position}>
      <sprite scale={[size, size, 1]}>
        <spriteMaterial
          map={RADIAL_GLOW_TEXTURE}
          color={color}
          opacity={opacity}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      {flare && (
        <sprite scale={[size * 1.8, size * 0.12, 1]}>
          <spriteMaterial
            map={RADIAL_GLOW_TEXTURE}
            color={color}
            opacity={opacity * 0.6}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}
    </group>
  );
};
