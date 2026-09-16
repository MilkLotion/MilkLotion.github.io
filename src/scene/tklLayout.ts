import type { ProfileRow } from './cherryProfile';

/**
 * GEON Glare TKL 키 배열 — 사용자 실장 기준
 * - F열 간격 0.25u: Glare 전용 플레이트 스위치 구멍 좌표 실측 (F열 중심 → 숫자열 중심 1.25u)
 * - 하단열: 1.5 · 1 · 1.5 · 7 · 1.5 · 1 · 1.5 (사진 실측)
 * - code 는 KeyboardEvent.code — 한글 입력 상태에서도 물리 키 위치로 매칭
 */

export interface TklKey {
  code: string;
  /** 키 영역 왼쪽 위 기준 좌표 (u) */
  x: number;
  y: number;
  width: number;
  row: ProfileRow;
}

export const TKL_WIDTH_U = 18.25;
export const TKL_DEPTH_U = 6.25;

type Slot = string | readonly [code: string, width: number] | { readonly gap: number };

const placeRow = (y: number, row: ProfileRow, slots: readonly Slot[]): TklKey[] => {
  let x = 0;

  return slots.flatMap((slot) => {
    if (typeof slot === 'object' && 'gap' in slot) {
      x += slot.gap;
      return [];
    }

    const [code, width] = typeof slot === 'string' ? ([slot, 1] as const) : slot;
    const key = { code, x, y, width, row };
    x += width;
    return [key];
  });
};

const letters = (chars: string) => [...chars].map((char) => `Key${char}`);
const digits = [...'1234567890'].map((digit) => `Digit${digit}`);

export const TKL_KEYS: readonly TklKey[] = [
  ...placeRow(0, 1, [
    'Escape',
    { gap: 1 },
    'F1',
    'F2',
    'F3',
    'F4',
    { gap: 0.5 },
    'F5',
    'F6',
    'F7',
    'F8',
    { gap: 0.5 },
    'F9',
    'F10',
    'F11',
    'F12',
    { gap: 0.25 },
    'PrintScreen',
    'ScrollLock',
    'Pause',
  ]),
  ...placeRow(1.25, 1, [
    'Backquote',
    ...digits,
    'Minus',
    'Equal',
    ['Backspace', 2],
    { gap: 0.25 },
    'Insert',
    'Home',
    'PageUp',
  ]),
  ...placeRow(2.25, 2, [
    ['Tab', 1.5],
    ...letters('QWERTYUIOP'),
    'BracketLeft',
    'BracketRight',
    ['Backslash', 1.5],
    { gap: 0.25 },
    'Delete',
    'End',
    'PageDown',
  ]),
  ...placeRow(3.25, 3, [['CapsLock', 1.75], ...letters('ASDFGHJKL'), 'Semicolon', 'Quote', ['Enter', 2.25]]),
  ...placeRow(4.25, 4, [
    ['ShiftLeft', 2.25],
    ...letters('ZXCVBNM'),
    'Comma',
    'Period',
    'Slash',
    ['ShiftRight', 2.75],
    { gap: 1.25 },
    'ArrowUp',
  ]),
  ...placeRow(5.25, 4, [
    ['ControlLeft', 1.5],
    'MetaLeft',
    ['AltLeft', 1.5],
    ['Space', 7],
    ['AltRight', 1.5],
    'MetaRight',
    ['ControlRight', 1.5],
    { gap: 0.25 },
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
  ]),
];

export const TKL_KEY_CODES: ReadonlySet<string> = new Set(TKL_KEYS.map(({ code }) => code));
