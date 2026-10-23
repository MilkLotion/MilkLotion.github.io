import { useMemo } from 'react';

import { Object3D } from 'three';

import type { StudioSpec } from './moods';

type StudioSpotLightProps = StudioSpec['spot'];

/**
 * 스튜디오 주광 — 넓고 부드러운 스포트라이트로 키보드·박스에 4시 방향 빛
 * - 배경 명암·그림자는 사진에서 구운 텍스처가 담당하므로 섀도맵은 쓰지 않음
 * - target 을 씬에 붙여야 행렬이 갱신됨
 */
export const StudioSpotLight = ({ position, target, intensity, color, angle, decay }: StudioSpotLightProps) => {
  const targetObject = useMemo(() => new Object3D(), []);

  return (
    <>
      <primitive object={targetObject} position={target} />
      <spotLight
        position={position}
        target={targetObject}
        color={color}
        intensity={intensity}
        angle={angle}
        penumbra={1}
        decay={decay}
      />
    </>
  );
};
