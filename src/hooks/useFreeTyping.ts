import { useEffect, useRef, useState } from 'react';

import { getTypedUnit, type InputMode } from '../scene/dubeolsikTyping';

/** 마지막 입력 후 단어가 사라지기 시작하기까지 */
const IDLE_FADE_MS = 2000;
/** 사라지는 연출 길이 — styles.css `.free-typing__word` 전환 시간과 맞춤 */
const FADE_OUT_MS = 1000;
/** 단어 중심이 놓이는 화면 비율 범위 (%) — 첫 화면 키보드 위쪽 빈 공간 */
const WORD_AREA = { xMin: 15, xMax: 85, yMin: 12, yMax: 38 } as const;
/** 떠 있는 단어와 가로·세로 둘 다 이만큼 가까우면 다시 뽑음 (%) */
const MIN_GAP = { x: 22, y: 9 } as const;
const PLACEMENT_TRIES = 8;
/** 단어를 끝내는 키 — 다음 입력은 새 위치에서 시작 */
const WORD_BREAK_CODES: ReadonlySet<string> = new Set(['Space', 'Enter', 'NumpadEnter']);

export interface TypedWord {
  id: number;
  /** 누른 순서대로의 입력 단위 — 화면 글자는 composeDubeolsik 으로 조합 */
  units: readonly string[];
  x: number;
  y: number;
  isFading: boolean;
}

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const pickPosition = (words: readonly TypedWord[]) => {
  const roll = () => ({
    x: randomBetween(WORD_AREA.xMin, WORD_AREA.xMax),
    y: randomBetween(WORD_AREA.yMin, WORD_AREA.yMax),
  });

  let position = roll();
  for (let attempt = 1; attempt < PLACEMENT_TRIES; attempt++) {
    const isCrowded = words.some(
      (word) => Math.abs(word.x - position.x) < MIN_GAP.x && Math.abs(word.y - position.y) < MIN_GAP.y,
    );
    if (!isCrowded) break;
    position = roll();
  }
  return position;
};

/** 한/영 키 — Windows·macOS 한국어 자판 모두 key 가 HangulMode, 물리 위치는 대개 Lang1 */
const isLanguageToggle = (event: KeyboardEvent) => event.key === 'HangulMode' || event.code === 'Lang1';

/**
 * 자유 입력 — 물리 키보드로 친 글자를 단어별로 흩뿌림
 * - 한 번에 입력 중인 단어는 하나(사라지는 중이 아닌 단어), 스페이스·엔터·마지막 입력 2초 뒤에 끝나 사라지기 시작
 * - 지우기는 입력 중인 단어에서 자모 하나씩, 다 지우면 단어째 제거
 * - 한/영 키로 한글·영문 전환 (처음은 한글)
 * @param isEnabled 꺼지면 글자 입력을 받지 않고 떠 있던 단어도 정리 — 한/영 전환은 계속 따라감
 */
export const useFreeTyping = (isEnabled: boolean) => {
  const [words, setWords] = useState<readonly TypedWord[]>([]);
  const modeRef = useRef<InputMode>('kor');

  // 한/영 추적 — 입력을 받지 않는 화면에서 눌러도 반영해야 돌아왔을 때 OS 입력기 상태와 어긋나지 않음
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || !isLanguageToggle(event)) return;
      modeRef.current = modeRef.current === 'kor' ? 'eng' : 'kor';
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 글자 입력 구독 — 외부 이벤트 소스라 Effect 로 연결, 단어 목록은 여기서 동기로 고치고 화면에 반영
  useEffect(() => {
    if (!isEnabled) return;

    let model: readonly TypedWord[] = [];
    let nextId = 0;
    let idleTimer = 0;
    const removeTimers = new Set<number>();

    const publish = (next: readonly TypedWord[]) => {
      model = next;
      setWords(next);
    };

    const getActiveWord = () => model.find((word) => !word.isFading);

    const fadeActiveWord = () => {
      window.clearTimeout(idleTimer);
      const active = getActiveWord();
      if (!active) return;

      publish(model.map((word) => (word.id === active.id ? { ...word, isFading: true } : word)));

      const timer = window.setTimeout(() => {
        removeTimers.delete(timer);
        publish(model.filter((word) => word.id !== active.id));
      }, FADE_OUT_MS);
      removeTimers.add(timer);
    };

    const restartIdleTimer = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(fadeActiveWord, IDLE_FADE_MS);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;

      if (WORD_BREAK_CODES.has(event.code)) {
        fadeActiveWord();
        return;
      }

      const active = getActiveWord();

      if (event.code === 'Backspace') {
        if (!active) return;

        const units = active.units.slice(0, -1);
        if (units.length === 0) {
          window.clearTimeout(idleTimer);
          publish(model.filter((word) => word.id !== active.id));
          return;
        }

        publish(model.map((word) => (word.id === active.id ? { ...word, units } : word)));
        restartIdleTimer();
        return;
      }

      const unit = getTypedUnit({
        code: event.code,
        shiftKey: event.shiftKey,
        isCapsLock: event.getModifierState('CapsLock'),
        mode: modeRef.current,
      });
      if (!unit) return;

      publish(
        active
          ? model.map((word) => (word.id === active.id ? { ...word, units: [...word.units, unit] } : word))
          : [...model, { id: nextId++, units: [unit], ...pickPosition(model), isFading: false }],
      );
      restartIdleTimer();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(idleTimer);
      removeTimers.forEach((timer) => window.clearTimeout(timer));
      setWords([]);
    };
  }, [isEnabled]);

  return words;
};
