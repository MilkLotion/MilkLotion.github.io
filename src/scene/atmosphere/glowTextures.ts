import { CanvasTexture, SRGBColorSpace } from 'three';

/**
 * 빛 효과용 캔버스 텍스처 — 흰색 + 알파만 그리고 색은 재질 color 로 입힘
 * - 원격 이미지 없이 생성, 앱 수명 동안 공유
 */

/** 광원 번짐 — 중심이 가장 밝고 바깥으로 부드럽게 사라지는 원 */
const createRadialGlowTexture = () => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.18, 'rgba(255,255,255,0.55)');
    gradient.addColorStop(0.45, 'rgba(255,255,255,0.14)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

export const RADIAL_GLOW_TEXTURE = createRadialGlowTexture();

/** 고정 시드 난수 — 새로고침해도 효과 배치가 같게 */
export const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
