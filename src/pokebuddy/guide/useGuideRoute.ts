import { useSyncExternalStore } from 'react';

import { GUIDE_CHAPTERS } from './guide.generated';
import type { GuideChapter } from './guideTypes';

/**
 * 설명서 쪽 주소 — 해시 하나로 장과 위치를 정함
 * - `#<장 id>` → 그 장 맨 위
 * - `#<소제목 id>` → 그 소제목이 든 장을 열고 그 자리로 (옛 한 쪽 설명서의 앵커 그대로 동작)
 * - 비었거나 모르는 값 → 첫 장(설치)
 */
export interface GuideRoute {
  chapter: GuideChapter;
  /** 장 안에서 스크롤할 제목 id. 장 맨 위면 null */
  anchor: string | null;
}

/** 본문 HTML 속 모든 제목 id → 장 */
const ANCHOR_TO_CHAPTER = new Map<string, GuideChapter>();
for (const chapter of GUIDE_CHAPTERS) {
  for (const match of chapter.html.matchAll(/ id="([^"]+)"/g)) {
    ANCHOR_TO_CHAPTER.set(decodeHtml(match[1]!), chapter);
  }
}

function decodeHtml(value: string) {
  return value.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

const getHash = () => window.location.hash;

const toRoute = (hash: string): GuideRoute => {
  let id = '';
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch (error) {
    // 깨진 % 표기 — 첫 장으로
    console.error(error);
  }
  const chapter = GUIDE_CHAPTERS.find((item) => item.id === id);
  if (chapter) return { chapter, anchor: null };
  // 나뉜 장의 옛 주소(#팁) → 그 묶음 첫 장
  const firstOfGroup = GUIDE_CHAPTERS.find((item) => item.group === id);
  if (firstOfGroup) return { chapter: firstOfGroup, anchor: null };
  const owner = ANCHOR_TO_CHAPTER.get(id);
  if (owner) return { chapter: owner, anchor: id };
  return { chapter: GUIDE_CHAPTERS[0]!, anchor: null };
};

/** id 는 글자·숫자·- 만 — 그대로 해시에 씀 */
export const chapterHref = (chapter: GuideChapter) => `#${chapter.id}`;

export const useGuideRoute = (): GuideRoute & { hash: string } => {
  const hash = useSyncExternalStore(subscribe, getHash, () => '');
  return { ...toRoute(hash), hash };
};
