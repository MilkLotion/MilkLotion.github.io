/** pokebuddy 웹 데이터 타입 — scripts/build-pokebuddy-data.cjs 가 *.generated.ts 로 만듦 */

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type MoveClass = 'physical' | 'special' | 'status';

export interface MoveInfo {
  id: string;
  ko: string;
  en: string;
  type: PokemonType;
  class: MoveClass;
  /** 한 타 위력. 변화기는 null */
  power: number | null;
  /** [최소, 최대] 타수 */
  hits: number[] | null;
  /** null = 반드시 맞음 */
  accuracy: number | null;
  /** 대기 시간 (초). 메타몽 변신 같은 특수 기술은 null */
  cooldown: number | null;
  priority: number;
  contact: boolean;
  /** 효과 한 줄 — 생성기가 effects 를 사람 말로 */
  effect: string;
  /** 원작 기술 설명 */
  text: string;
  /** 이 기술을 쓰는 종 수 — 기본 기술 · 후보 · 메가 모습 */
  users: { base: number; candidate: number; mega: number };
}

export interface PartyPokemon {
  id: string;
  ko: string;
  /** PokeAPI 그림 번호 */
  pokemonId: number;
  types: PokemonType[];
}

export type TrainerLevel = 'easy' | 'normal' | 'hard' | 'champion';

export interface TrainerInfo {
  id: string;
  level: TrainerLevel;
  name: string;
  kind: string;
  /** 한 타입 파티는 그 타입, 날씨 파티는 sun·rain·sand·snow. 그 밖에는 null */
  theme: string | null;
  /** 칸 순서가 배치 — 2·4·6번 앞 열, 1·3·5번 뒤 열 */
  party: PartyPokemon[];
}

export interface PatchImage {
  version: string;
  /** 그 버전 lines 의 몇 번째 줄 그림인지 (0부터) */
  line: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** 옛 화면을 재현하지 못해 지금 앱 화면으로 찍은 그림 */
  now: boolean;
}

export interface PatchNote {
  version: string;
  date: string;
  lines: string[];
  images: PatchImage[];
}

export interface PopularPokemon extends PartyPokemon {
  /** 기간 안 배틀 파티에 들어간 횟수 (한 배틀 양쪽 모두 셈, AI 샘플 파티 제외) */
  uses: number;
  wins: number;
  losses: number;
  draws: number;
}

/** 주간 배틀 인기 순위 — 사용자가 운영 DB 에서 주마다 뽑은 집계 */
export interface PopularStats {
  /** YYYY-MM-DD */
  from: string;
  to: string;
  battles: number;
  /** 많이 쓰인 순 */
  pokemon: PopularPokemon[];
}
