import { useMemo, useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import { MathUtils, Object3D, type ShadowMaterial } from 'three';

/**
 * 스튜디오 키보드 그림자 — 그림자만 받는 투명 바닥판 + 그림자 전용 방향광
 * - 빛 방향: 사진 박스 그림자 아래 경계 두 점을 바닥으로 역투영 → 그림자 방향 (x, z) = (-0.866, -0.5)
 *   빛은 반대인 앞 오른쪽(화면 4시), 고도는 사진과 렌더 그림자 비율 표를 맞춰 48°
 * - 광원 세기 0 — 키보드 명암은 기존 조명 그대로 두고 그림자만 만듦
 * - VSM 흐림으로 짙은 중심과 옅어지는 바깥쪽을 함께 만듦
 *   (접지 그림자는 밑판이 케이스보다 안쪽이라 케이스에 가려 가장자리에 거의 드러나지 않음)
 * - 분해 단계에서는 카메라가 움직여 2D 배경 바닥과 어긋나므로 그림자를 서서히 지움
 * - 박스 그림자는 2D 배경에 이미 있어 박스는 그림자를 던지지 않음
 */

const SHADOW_TARGET: [number, number, number] = [0, 0, -2];
const LIGHT_HORIZONTAL_DIRECTION = { x: 0.866, z: 0.5 } as const;
const LIGHT_ELEVATION_RAD = (48 * Math.PI) / 180;
const LIGHT_DISTANCE = 40;
const LIGHT_POSITION: [number, number, number] = [
  SHADOW_TARGET[0] + LIGHT_HORIZONTAL_DIRECTION.x * Math.cos(LIGHT_ELEVATION_RAD) * LIGHT_DISTANCE,
  SHADOW_TARGET[1] + Math.sin(LIGHT_ELEVATION_RAD) * LIGHT_DISTANCE,
  SHADOW_TARGET[2] + LIGHT_HORIZONTAL_DIRECTION.z * Math.cos(LIGHT_ELEVATION_RAD) * LIGHT_DISTANCE,
];
/**
 * 그림자 카메라 범위 (u)
 * - VSM 은 범위 경계에 짙은 선을 남김 — 그림자판 전체가 범위 안에 들어가야 화면에 선이 안 생김
 * - 범위를 넓힌 만큼 섀도맵 한 칸이 커지므로 흐림 반경을 함께 줄여 부드러움 유지 (16·18 → 24·12)
 */
const SHADOW_EXTENT = 24;
const SHADOW_BLUR_RADIUS = 12;
/**
 * 그림자판 — 키보드(바닥 투영 x ±9.8, z ±3.5)와 왼쪽 뒤로 떨어지는 그림자만 덮는 크기
 * - 모서리가 그림자 카메라 좌표 최대 17.4 로 범위 ±24 안
 */
const CATCHER = { centerX: -1, centerZ: -3, width: 30, depth: 22 } as const;
/** 그림자 나타남·사라짐 감쇠 계수 */
const FADE_DAMPING = 4;

interface StudioShadowsProps {
  opacity: number;
  isVisible: boolean;
}

export const StudioShadows = ({ opacity, isVisible }: StudioShadowsProps) => {
  const target = useMemo(() => new Object3D(), []);
  const materialRef = useRef<ShadowMaterial>(null);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    material.opacity = MathUtils.damp(material.opacity, isVisible ? opacity : 0, FADE_DAMPING, delta);
  });

  return (
    <>
      <primitive object={target} position={SHADOW_TARGET} />
      <directionalLight
        position={LIGHT_POSITION}
        target={target}
        intensity={0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-radius={SHADOW_BLUR_RADIUS}
        shadow-blurSamples={16}
        shadow-bias={-0.0005}
        shadow-camera-left={-SHADOW_EXTENT}
        shadow-camera-right={SHADOW_EXTENT}
        shadow-camera-top={SHADOW_EXTENT}
        shadow-camera-bottom={-SHADOW_EXTENT}
        shadow-camera-near={1}
        shadow-camera-far={90}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CATCHER.centerX, 0.002, CATCHER.centerZ]} receiveShadow>
        <planeGeometry args={[CATCHER.width, CATCHER.depth]} />
        <shadowMaterial ref={materialRef} opacity={opacity} depthWrite={false} />
      </mesh>
    </>
  );
};
