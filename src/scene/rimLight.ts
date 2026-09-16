import type { WebGLProgramParametersWithUniforms } from 'three';

/**
 * 스위치 전용 테두리 반사광 (프레넬 림)
 * - 조명을 추가하지 않고 재질 셰이더에만 주입 — 키캡·케이스 밝기에는 영향 없음
 * - 시선과 면이 비스듬할수록(윤곽) 밝아져 검정 부품 형태가 어두운 배경에서 드러남
 * - 값 조정은 RIM 한 곳에서
 */
const RIM = {
  /** 약간 차가운 흰색 — 스튜디오 역광 느낌 */
  color: [0.62, 0.69, 0.8],
  /** 2.6 · 0.55 는 경사면 전체가 떠서 검정이 회색으로 보임 — 윤곽선에만 남도록 낮춤 */
  intensity: 0.4,
  /** 클수록 윤곽 가장자리에만 얇게 */
  power: 5.5,
} as const;

const RIM_COLOR = RIM.color.map((value) => value.toFixed(3)).join(', ');

export const applySwitchRim = (shader: WebGLProgramParametersWithUniforms) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <emissivemap_fragment>',
    `#include <emissivemap_fragment>
    float switchRim = pow( 1.0 - saturate( dot( normalize( vViewPosition ), normal ) ), ${RIM.power.toFixed(2)} );
    totalEmissiveRadiance += vec3( ${RIM_COLOR} ) * switchRim * ${RIM.intensity.toFixed(2)};`,
  );
};
