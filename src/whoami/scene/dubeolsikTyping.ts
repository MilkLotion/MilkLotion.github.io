/**
 * 두벌식 입력 — 한글 입력기 동작을 키 단위로 재현
 * - buildTypingSteps: 문장 → 누를 키 순서 + 키마다 화면 표시 (자동 타이핑용)
 * - getTypedUnit · composeDubeolsik: 누른 물리 키 → 자모·영문자 → 조합된 글자 (직접 입력용, 한/영은 페이지가 따로 추적)
 * - 초성을 누르면 입력기가 우선 앞 글자 받침으로 붙였다가, 모음이 오면 다음 글자로 넘김 (하 → 핫 → 하세)
 */

export interface TypingStep {
  /** 누르는 키 — KeyboardEvent.code, 자판 매핑이 없으면 null */
  code: string | null;
  /** 이 키를 누른 직후 화면에 보이는 전체 문자열 */
  text: string;
}

const HANGUL_BASE = 0xac00;
const HANGUL_COUNT = 11172;
const JUNG_COUNT = 21;
const JONG_COUNT = 28;

/** 유니코드 한글 음절 조합 순서 — 초성 19 · 중성 21 · 종성 27(+받침 없음) */
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const JONG = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];

/** 두벌식 자판 — 알파벳 줄 순서대로 대응하는 자모 */
const DUBEOLSIK_ROWS = [
  ['ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ', 'QWERTYUIOP'],
  ['ㅁㄴㅇㄹㅎㅗㅓㅏㅣ', 'ASDFGHJKL'],
  ['ㅋㅌㅊㅍㅠㅜㅡ', 'ZXCVBNM'],
] as const;

const JAMO_KEY_CODES: ReadonlyMap<string, string> = new Map(
  DUBEOLSIK_ROWS.flatMap(([jamos, letters]) => [...jamos].map((jamo, index) => [jamo, `Key${letters[index]}`] as const)),
);

const CODE_JAMOS: ReadonlyMap<string, string> = new Map([...JAMO_KEY_CODES].map(([jamo, code]) => [code, jamo]));

/** Shift 와 함께 누르면 바뀌는 자모 — 쌍자음 · ㅒ · ㅖ */
const SHIFT_CODE_JAMOS: ReadonlyMap<string, string> = new Map([
  ['KeyQ', 'ㅃ'],
  ['KeyW', 'ㅉ'],
  ['KeyE', 'ㄸ'],
  ['KeyR', 'ㄲ'],
  ['KeyT', 'ㅆ'],
  ['KeyO', 'ㅒ'],
  ['KeyP', 'ㅖ'],
]);

/** 자동 타이핑 문장의 한글 외 글자 → 누를 키 (줄바꿈은 엔터) */
const SYMBOL_KEY_CODES: ReadonlyMap<string, string> = new Map([
  ['.', 'Period'],
  [',', 'Comma'],
  [' ', 'Space'],
  ['\n', 'Enter'],
]);

/** 직접 입력에서 한글 외에 받는 기호 — 숫자는 따로 처리 */
const CODE_SYMBOLS: ReadonlyMap<string, string> = new Map([
  ['Period', '.'],
  ['Comma', ','],
]);

const SHIFT_CODE_SYMBOLS: ReadonlyMap<string, string> = new Map([
  ['Digit1', '!'],
  ['Slash', '?'],
]);

const COMPOUND_VOWELS: ReadonlyMap<string, string> = new Map([
  ['ㅗㅏ', 'ㅘ'],
  ['ㅗㅐ', 'ㅙ'],
  ['ㅗㅣ', 'ㅚ'],
  ['ㅜㅓ', 'ㅝ'],
  ['ㅜㅔ', 'ㅞ'],
  ['ㅜㅣ', 'ㅟ'],
  ['ㅡㅣ', 'ㅢ'],
]);

const COMPOUND_FINALS: ReadonlyMap<string, string> = new Map([
  ['ㄱㅅ', 'ㄳ'],
  ['ㄴㅈ', 'ㄵ'],
  ['ㄴㅎ', 'ㄶ'],
  ['ㄹㄱ', 'ㄺ'],
  ['ㄹㅁ', 'ㄻ'],
  ['ㄹㅂ', 'ㄼ'],
  ['ㄹㅅ', 'ㄽ'],
  ['ㄹㅌ', 'ㄾ'],
  ['ㄹㅍ', 'ㄿ'],
  ['ㄹㅎ', 'ㅀ'],
  ['ㅂㅅ', 'ㅄ'],
]);

/** 겹받침 → [남는 받침, 모음이 오면 다음 글자 초성으로 넘어가는 자음] — 없 + ㅓ → 업서 */
const SPLIT_FINALS: ReadonlyMap<string, readonly [string, string]> = new Map(
  [...COMPOUND_FINALS].map(([pair, jong]) => [jong, [pair[0], pair[1]] as const]),
);

interface Syllable {
  cho: number;
  jung: number;
  jong: number;
}

/** 한글 음절이 아니면 null — 빈 문자열(NaN)도 걸러짐 */
const decompose = (char: string): Syllable | null => {
  const offset = char.charCodeAt(0) - HANGUL_BASE;
  if (!(offset >= 0 && offset < HANGUL_COUNT)) return null;

  return {
    cho: Math.floor(offset / (JUNG_COUNT * JONG_COUNT)),
    jung: Math.floor(offset / JONG_COUNT) % JUNG_COUNT,
    jong: offset % JONG_COUNT,
  };
};

const composeSyllable = ({ cho, jung, jong }: Syllable) =>
  String.fromCharCode(HANGUL_BASE + (cho * JUNG_COUNT + jung) * JONG_COUNT + jong);

const keyOf = (jamo: string) => JAMO_KEY_CODES.get(jamo) ?? null;

export const buildTypingSteps = (sentence: string): TypingStep[] => {
  const steps: TypingStep[] = [];
  let typed = '';

  for (const char of sentence) {
    const syllable = decompose(char);

    if (!syllable) {
      typed += char;
      steps.push({ code: SYMBOL_KEY_CODES.get(char) ?? null, text: typed });
      continue;
    }

    const choJamo = CHO[syllable.cho];
    const previous = decompose(typed.slice(-1));
    const choAsJong = JONG.indexOf(choJamo);

    // 초성 — 앞 글자가 받침 없는 음절이고 이 자음이 받침이 될 수 있으면 입력기가 일단 받침으로 붙임
    const choText =
      previous && previous.jong === 0 && choAsJong > 0
        ? typed.slice(0, -1) + composeSyllable({ ...previous, jong: choAsJong })
        : typed + choJamo;

    steps.push({ code: keyOf(choJamo), text: choText });
    steps.push({ code: keyOf(JUNG[syllable.jung]), text: typed + composeSyllable({ ...syllable, jong: 0 }) });
    if (syllable.jong > 0) steps.push({ code: keyOf(JONG[syllable.jong]), text: typed + char });

    typed += char;
  }

  return steps;
};

/** 직접 입력 언어 — 한/영 키로 전환 */
export type InputMode = 'kor' | 'eng';

interface TypedKey {
  /** KeyboardEvent.code — 물리 키 위치 */
  code: string;
  shiftKey: boolean;
  /** Caps Lock 켜짐 — 영문 대소문자에만 반영 */
  isCapsLock: boolean;
  mode: InputMode;
}

/** 누른 키 하나가 만드는 입력 단위 — 자모·영문자 또는 기호·숫자 한 글자, 받지 않는 키는 null */
export const getTypedUnit = ({ code, shiftKey, isCapsLock, mode }: TypedKey): string | null => {
  const letter = /^Key([A-Z])$/.exec(code)?.[1];
  if (letter && mode === 'eng') return shiftKey !== isCapsLock ? letter : letter.toLowerCase();

  if (shiftKey) {
    const shifted = SHIFT_CODE_JAMOS.get(code) ?? SHIFT_CODE_SYMBOLS.get(code);
    if (shifted) return shifted;
  }

  const jamo = CODE_JAMOS.get(code);
  if (jamo) return jamo;
  if (shiftKey) return null;
  if (/^Digit\d$/.test(code)) return code.slice(-1);
  return CODE_SYMBOLS.get(code) ?? null;
};

/** 조합 중인 글자 — 자모 문자열, 비어 있는 자리는 null */
interface Composing {
  cho: string | null;
  jung: string | null;
  jong: string | null;
}

const EMPTY_COMPOSING: Composing = { cho: null, jung: null, jong: null };

const renderComposing = ({ cho, jung, jong }: Composing) => {
  if (cho && jung) {
    return composeSyllable({ cho: CHO.indexOf(cho), jung: JUNG.indexOf(jung), jong: jong ? JONG.indexOf(jong) : 0 });
  }
  return cho ?? jung ?? '';
};

/**
 * 입력 단위 목록 → 화면 글자 — 두벌식 입력기 규칙
 * - 겹모음(ㅗ+ㅏ=ㅘ) · 겹받침(ㅂ+ㅅ=ㅄ) 조합, 받침 뒤 모음이 오면 받침(겹받침은 뒤 자음)을 다음 글자로 넘김
 * - 지우기는 목록 끝 단위를 빼고 다시 조합하면 입력기와 같은 결과 (자모 하나씩 지워짐)
 */
export const composeDubeolsik = (units: readonly string[]) => {
  let text = '';
  let current = EMPTY_COMPOSING;

  const commit = (next: Composing) => {
    text += renderComposing(current);
    current = next;
  };

  for (const unit of units) {
    const { cho, jung, jong } = current;

    if (CHO.includes(unit)) {
      const compoundFinal = jong ? COMPOUND_FINALS.get(jong + unit) : undefined;

      if (compoundFinal) {
        current = { ...current, jong: compoundFinal };
      } else if (cho && jung && !jong && JONG.includes(unit)) {
        current = { ...current, jong: unit };
      } else {
        commit({ cho: unit, jung: null, jong: null });
      }
    } else if (JUNG.includes(unit)) {
      const compoundVowel = jung && !jong ? COMPOUND_VOWELS.get(jung + unit) : undefined;

      if (jong) {
        const split = SPLIT_FINALS.get(jong);
        current = { ...current, jong: split ? split[0] : null };
        commit({ cho: split ? split[1] : jong, jung: unit, jong: null });
      } else if (compoundVowel) {
        current = { ...current, jung: compoundVowel };
      } else if (cho && !jung) {
        current = { ...current, jung: unit };
      } else {
        commit({ cho: null, jung: unit, jong: null });
      }
    } else {
      commit(EMPTY_COMPOSING);
      text += unit;
    }
  }

  return text + renderComposing(current);
};
