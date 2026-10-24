/** pokebuddy 사이트 쪽 주소 — 랜딩·설명서·교환·배틀 공통 */

export const LANDING_URL = '/pokebuddy/';
export const GUIDE_URL = '/pokebuddy/guide/';
export const PATCH_NOTES_URL = '/pokebuddy/patch-notes/';
export const DEX_URL = '/pokebuddy/dex/';
export const IMAGE_BASE = '/pokebuddy/images';

/** PokeAPI 정지 도트 — 앱 초상과 같은 출처 (src/main/art/sources.ts) */
export const spriteUrl = (pokemonId: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
