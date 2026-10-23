import { useMemo, useSyncExternalStore } from 'react';

import { getProjectBySlug } from '../content/projects';

/** 프로젝트 페이지 주소 — 해시라 GitHub Pages 에서 새로고침·직접 진입해도 404 없이 열림 */
export const PROJECTS_HASH = '#projects';

export type PageId = 'intro' | 'projects' | 'about' | 'lab';

export interface HashRoute {
  page: PageId;
  /** 프로젝트 상세 — `#projects/{slug}`. 목록이거나 없는 slug 면 null */
  projectSlug: string | null;
}

export const getProjectHash = (slug: string) => `${PROJECTS_HASH}/${slug}`;

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/** 스냅샷은 원문 해시 문자열 — 객체를 만들어 돌려주면 매번 새 참조라 무한 재렌더 */
const getHash = () => window.location.hash;

const parseHash = (hash: string): HashRoute => {
  if (hash === PROJECTS_HASH) return { page: 'projects', projectSlug: null };
  if (hash === '#about') return { page: 'about', projectSlug: null };
  if (hash === '#lab') return { page: 'lab', projectSlug: null };

  if (hash.startsWith(`${PROJECTS_HASH}/`)) {
    let slug: string;
    try {
      slug = decodeURIComponent(hash.slice(PROJECTS_HASH.length + 1));
    } catch {
      return { page: 'projects', projectSlug: null };
    }
    return { page: 'projects', projectSlug: getProjectBySlug(slug) ? slug : null };
  }

  return { page: 'intro', projectSlug: null };
};

/**
 * 주소 해시로 정하는 현재 화면
 * - 해시 없음 = 키보드 홈 · `#projects` = 작업 · `#projects/{slug}` = 상세 · `#about` = 소개 · `#lab` = 실험
 * - 해시 이동은 브라우저 기록에 남아 뒤로 가기로 이전 화면 복귀
 */
export const useHashRoute = () => {
  const hash = useSyncExternalStore(subscribe, getHash);
  return useMemo(() => parseHash(hash), [hash]);
};

/**
 * 한 단계 위 화면으로 돌아가기
 * - 그 화면에서 넘어온 경우: 브라우저 뒤로 가기 — 방문 기록에 같은 화면이 앞뒤로 중복되지 않게
 * - 주소로 바로 들어온 경우: 현재 기록을 대상 해시로 바꿈 — 뒤로 가기를 쓰면 사이트를 벗어나므로
 * - replaceState 는 hashchange 가 안 나서 직접 알림
 */
export const goBackTo = (targetHash: string, isTargetBehind: boolean) => {
  if (isTargetBehind) {
    window.history.back();
    return;
  }

  const base = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, '', targetHash ? `${base}${targetHash}` : base);
  window.dispatchEvent(new Event('hashchange'));
};

/** 같은 단계의 다른 화면으로 — 이전·다음 프로젝트처럼 기록을 쌓지 않고 바꿈 */
export const replaceHash = (hash: string) => {
  window.location.replace(hash);
};
