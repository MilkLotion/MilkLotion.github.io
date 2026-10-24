/**
 * 히어로 포켓몬 그림 — 앱 화면과 같은 PMDCollab SpriteCollab 시트
 * - 원본: spriteserver.pmdcollab.org/assets/<도감>/sprites.zip (앱 캐시에서 추출)
 * - 저작자: public/pokebuddy/sprites/<도감>/credits.txt
 * - 시트 배치는 앱 src/main/art/pmd.ts 와 같음: 행 = 방향 8종(0 정면 · 2 오른쪽 · 4 뒤 · 6 왼쪽), 열 = 프레임
 * - 동작 고르기도 앱과 같음: 상태 동작(Idle·Walk·Rotate·LookUp·Nod·Pose) 칸의 1.25배를 넘는 추가 동작은 뺌
 *   → 피카츄·루카리오·이브이 Hop, 리자몽 Hurt 없음
 * - durations 는 AnimData.xml Duration(1/60초) 그대로
 */

export type PmdAnimName = 'Walk' | 'Idle' | 'Hurt' | 'Cringe' | 'Nod' | 'Pose' | 'LookUp' | 'Rotate' | 'Sit' | 'DeepBreath';

export interface PmdAnim {
  src: string;
  fw: number;
  fh: number;
  /** 프레임별 길이 (1/60초) */
  durations: number[];
}

export interface PmdSprite {
  dex: string;
  name: string;
  anims: Partial<Record<PmdAnimName, PmdAnim>> & Record<'Walk' | 'Idle', PmdAnim>;
}

export const SHEET_ROWS = 8;
export const FRAME_MS = 1000 / 60;

/** 한 번 재생 길이 (ms) */
export const animMs = (anim: PmdAnim) => anim.durations.reduce((sum, d) => sum + d, 0) * FRAME_MS;

type AnimSpec = [fw: number, fh: number, durations: number[]];

const build = (dex: string, name: string, specs: Partial<Record<PmdAnimName, AnimSpec>> & Record<'Walk' | 'Idle', AnimSpec>): PmdSprite => {
  const anims = {} as PmdSprite['anims'];
  for (const [anim, [fw, fh, durations]] of Object.entries(specs) as [PmdAnimName, AnimSpec][]) {
    anims[anim] = { src: `/pokebuddy/sprites/${dex}/${anim}-Anim.png`, fw, fh, durations };
  }
  return { dex, name, anims };
};

const BREATH = [12, 6, 6, 6, 6, 6, 6, 10, 4];
const SPIN = [2, 2, 2, 2, 2, 2, 2, 2, 2];

export const HERO_SPRITES: PmdSprite[] = [
  build('0025', '피카츄', {
    Walk: [32, 40, [8, 10, 8, 10]],
    Idle: [40, 56, [40, 2, 3, 3, 3, 2]],
    Hurt: [48, 64, [2, 8]],
    Cringe: [24, 64, [2, 8]],
    Nod: [32, 48, [6, 8, 6]],
    Pose: [32, 40, [12, 2, 8]],
    LookUp: [32, 40, [6, 6, 6]],
    Rotate: [32, 40, SPIN],
    Sit: [32, 40, [8, 8, 8]],
    DeepBreath: [24, 48, BREATH],
  }),
  build('0006', '리자몽', {
    Walk: [40, 48, [8, 10, 8, 10]],
    Idle: [40, 48, [15, 15, 15, 15]],
    Rotate: [40, 48, SPIN],
  }),
  build('0133', '이브이', {
    Walk: [40, 48, [4, 4, 4, 4, 6, 2, 2]],
    Idle: [24, 32, [16, 16]],
    Hurt: [48, 48, [2, 8]],
    Cringe: [32, 48, [2, 8]],
    Nod: [32, 32, [6, 8, 6]],
    Pose: [24, 40, [8, 1, 3, 2, 8]],
    LookUp: [24, 32, [6, 6, 6]],
    Rotate: [24, 32, SPIN],
    Sit: [24, 32, [8, 8, 8]],
    DeepBreath: [24, 32, BREATH],
  }),
  build('0448', '루카리오', {
    Walk: [32, 48, [6, 6, 6, 6]],
    Idle: [32, 56, [40, 2, 2, 4, 2, 2]],
    Hurt: [40, 56, [2, 8]],
    Cringe: [24, 56, [2, 8]],
    Nod: [32, 48, [6, 8, 6]],
    Pose: [24, 48, [12, 2, 8]],
    LookUp: [24, 40, [6, 6]],
    Rotate: [32, 48, SPIN],
    Sit: [24, 40, [8, 8, 8]],
    DeepBreath: [32, 48, BREATH],
  }),
];
