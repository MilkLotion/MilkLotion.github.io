/**
 * GMK Lazurite (디자이너 jaekid) — 사용자 실장 배치
 * - Calcite 킷: 흰 알파 + 파란 각인
 * - Base 킷: 흰 모디 · 파란 F5~F8 · 금색 Esc · 파란 7u 스페이스 · Sys 1u
 * - High Renaissance Gold(파란 캡 금색 장식): 백스페이스 · 엔터 · 방향키
 * - High Renaissance Blue(흰 캡 파란 장식): 그레이브 · 좌우 Ctrl
 * - 이니셜 N·H·S 는 Base 킷 파란 알파(흰 각인)로 교체
 * - 색은 공식 렌더와 실물 사진 샘플을 3D 조명 기준으로 보정한 근사값 — GMK 공식 색 코드는 비공개
 */

export const LAZURITE = {
  white: '#ebe8e1',
  blue: '#233a94',
  gold: '#c9ab6b',
  goldInk: '#d9bb7a',
} as const;

export const NAME_KEYS = [
  { code: 'KeyN', label: 'N' },
  { code: 'KeyH', label: 'H' },
  { code: 'KeyS', label: 'S' },
] as const;

const NAME_KEY_CODES: ReadonlySet<string> = new Set(NAME_KEYS.map(({ code }) => code));

export type OrnamentId =
  | 'corner-tl'
  | 'corner-tr'
  | 'corner-bl'
  | 'corner-br'
  | 'crown'
  | 'fleur-up'
  | 'fleur-down'
  | 'fleur-left'
  | 'fleur-right';

export type Legend =
  | { kind: 'blank' }
  | { kind: 'alpha'; text: string }
  | { kind: 'dual'; shifted: string; base: string }
  | { kind: 'mod'; text: string; align: 'left' | 'center'; icon?: 'tab' | 'shift' }
  | { kind: 'ornament'; ornament: OrnamentId };

export interface KeycapStyle {
  cap: string;
  /** 각인·장식 색 */
  ink: string;
  legend: Legend;
}

const whiteCap = (legend: Legend): KeycapStyle => ({ cap: LAZURITE.white, ink: LAZURITE.blue, legend });
const blueCap = (legend: Legend): KeycapStyle => ({ cap: LAZURITE.blue, ink: LAZURITE.white, legend });
const goldOnBlue = (ornament: OrnamentId): KeycapStyle => ({
  cap: LAZURITE.blue,
  ink: LAZURITE.goldInk,
  legend: { kind: 'ornament', ornament },
});

const mod = (text: string, align: 'left' | 'center' = 'left'): Legend => ({ kind: 'mod', text, align });
const ornament = (id: OrnamentId): Legend => ({ kind: 'ornament', ornament: id });

const SPECIAL_STYLES: Readonly<Record<string, KeycapStyle>> = {
  Escape: { cap: LAZURITE.gold, ink: LAZURITE.blue, legend: mod('Esc') },
  F5: blueCap(mod('F5')),
  F6: blueCap(mod('F6')),
  F7: blueCap(mod('F7')),
  F8: blueCap(mod('F8')),
  PrintScreen: whiteCap(mod('Print', 'center')),
  ScrollLock: whiteCap(mod('Scroll', 'center')),
  Pause: whiteCap(mod('Pause', 'center')),
  Insert: whiteCap(mod('Insert', 'center')),
  Home: whiteCap(mod('Home', 'center')),
  PageUp: whiteCap(mod('PgUp', 'center')),
  Delete: whiteCap(mod('Delete', 'center')),
  End: whiteCap(mod('End', 'center')),
  PageDown: whiteCap(mod('PgDn', 'center')),
  Backquote: whiteCap(ornament('corner-tl')),
  Backspace: goldOnBlue('corner-tr'),
  Tab: whiteCap({ kind: 'mod', text: 'Tab', align: 'left', icon: 'tab' }),
  CapsLock: whiteCap(mod('Caps')),
  Enter: goldOnBlue('crown'),
  ShiftLeft: whiteCap({ kind: 'mod', text: 'Shift', align: 'left', icon: 'shift' }),
  ShiftRight: whiteCap({ kind: 'mod', text: 'Shift', align: 'left', icon: 'shift' }),
  ControlLeft: whiteCap(ornament('corner-bl')),
  MetaLeft: whiteCap(mod('Sys')),
  AltLeft: whiteCap(mod('Alt')),
  Space: blueCap({ kind: 'blank' }),
  AltRight: whiteCap(mod('Alt')),
  MetaRight: whiteCap(mod('Sys')),
  ControlRight: whiteCap(ornament('corner-br')),
  ArrowUp: goldOnBlue('fleur-up'),
  ArrowLeft: goldOnBlue('fleur-left'),
  ArrowDown: goldOnBlue('fleur-down'),
  ArrowRight: goldOnBlue('fleur-right'),
};

/** [Shift 기호, 기본 기호] — 위아래 2단 각인 */
const DUAL_LEGENDS: Readonly<Record<string, readonly [string, string]>> = {
  Digit1: ['!', '1'],
  Digit2: ['@', '2'],
  Digit3: ['#', '3'],
  Digit4: ['$', '4'],
  Digit5: ['%', '5'],
  Digit6: ['^', '6'],
  Digit7: ['&', '7'],
  Digit8: ['*', '8'],
  Digit9: ['(', '9'],
  Digit0: [')', '0'],
  Minus: ['_', '-'],
  Equal: ['+', '='],
  BracketLeft: ['{', '['],
  BracketRight: ['}', ']'],
  Backslash: ['|', '\\'],
  Semicolon: [':', ';'],
  Quote: ['"', "'"],
  Comma: ['<', ','],
  Period: ['>', '.'],
  Slash: ['?', '/'],
};

export const getKeycapStyle = (code: string): KeycapStyle => {
  const special = SPECIAL_STYLES[code];
  if (special) return special;

  const dual = DUAL_LEGENDS[code];
  if (dual) return whiteCap({ kind: 'dual', shifted: dual[0], base: dual[1] });

  if (/^F\d+$/.test(code)) return whiteCap(mod(code));

  if (code.startsWith('Key')) {
    const legend: Legend = { kind: 'alpha', text: code.slice(3) };
    return NAME_KEY_CODES.has(code) ? blueCap(legend) : whiteCap(legend);
  }

  return whiteCap({ kind: 'blank' });
};
