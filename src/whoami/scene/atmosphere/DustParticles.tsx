import { useEffect, useMemo } from 'react';

import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, ShaderMaterial } from 'three';

import { getViewShiftNdc } from '../viewShift';
import { createSeededRandom } from './glowTextures';
import type { ParticleSpec } from './moods';

/** 먼지가 떠오르다 되감기는 높이 (u) */
const DUST_HEIGHT = 14;
/** 원근 크기 계수 — 키보드 주변 가까운 거리 기준 */
const POINT_SCALE = 40;

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHeight;
  uniform float uScale;
  uniform float uViewShift;
  varying float vTwinkle;
  varying float vFade;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.12, uHeight);
    p.x += sin(uTime * 0.3 + aPhase * 6.2831) * 0.6;
    vFade = smoothstep(0.0, 1.5, p.y) * smoothstep(uHeight, uHeight - 2.0, p.y);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // 렌즈 평행 이동을 되돌림 — 배경 효과는 키보드와 달리 화면 제자리에
    gl_Position.y += uViewShift * gl_Position.w;
    vTwinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase * 6.2831);
    gl_PointSize = aSize * uPixelRatio * (uScale / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vTwinkle;
  varying float vFade;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, distanceToCenter);
    gl_FragColor = vec4(uColor, alpha * vTwinkle * vFade * uOpacity);
    #include <colorspace_fragment>
  }
`;

/** 키보드 주변 상자 안에 흩뿌림 */
const createAttributes = (count: number) => {
  const random = createSeededRandom(23);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let index = 0; index < count; index++) {
    positions.set([(random() - 0.5) * 44, random() * DUST_HEIGHT, -14 + random() * 24], index * 3);
    sizes[index] = 0.8 + random() * 2.2;
    phases[index] = random();
  }

  return { positions, sizes, phases };
};

/** 떠오르는 먼지 입자 — 가산 혼합이라 어두운 배경에서만 빛남 */
export const DustParticles = ({ count, color, opacity }: ParticleSpec) => {
  const pixelRatio = useThree((state) => state.viewport.dpr);

  const geometry = useMemo(() => {
    const { positions, sizes, phases } = createAttributes(count);
    const points = new BufferGeometry();
    points.setAttribute('position', new Float32BufferAttribute(positions, 3));
    points.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));
    points.setAttribute('aPhase', new Float32BufferAttribute(phases, 1));
    return points;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uHeight: { value: DUST_HEIGHT },
          uScale: { value: POINT_SCALE },
          uViewShift: { value: 0 },
          uColor: { value: new Color(color) },
          uOpacity: { value: opacity },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [color, opacity],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock, camera }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uPixelRatio.value = pixelRatio;
    material.uniforms.uViewShift.value = getViewShiftNdc(camera);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} dispose={null} />;
};
