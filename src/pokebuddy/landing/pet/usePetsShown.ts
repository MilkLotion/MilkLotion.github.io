import { useState } from 'react';

/** 같은 출처의 다른 페이지와 겹치지 않게 페이지 접두어를 붙임 */
const STORAGE_KEY = 'pokebuddy:landing:pets-shown';

const readShown = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
};

/**
 * 화면 위 포켓몬 보이기 여부 — 방문자가 고른 값을 기억 (기본 보이기)
 * - 저장소가 막힌 환경(사생활 모드 등)이면 기억하지 않고 이번 방문에만 적용
 */
export const usePetsShown = () => {
  const [shown, setShown] = useState(readShown);

  const toggle = () => {
    const next = !shown;
    setShown(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // 기억 못 해도 이번 방문에는 적용됨
    }
  };

  return { shown, toggle };
};
