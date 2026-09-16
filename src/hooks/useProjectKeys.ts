import { useEffect, useEffectEvent } from 'react';

import { getProjectByKeyCode, PROJECTS, type Project } from '../content/projects';
import { getProjectHash, replaceHash } from './useHashRoute';

interface ProjectKeysOptions {
  selectedProject: Project;
  /** 상세가 열려 있으면 그 프로젝트 */
  detailProject: Project | undefined;
  onSelect: (slug: string) => void;
  /** 상세 → 목록 */
  onCloseDetail: () => void;
}

/** 키 입력이 버튼·링크 위에서 일어났는지 — Enter 는 요소 자체 동작에 맡김 */
const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof HTMLAnchorElement || target instanceof HTMLButtonElement;

/**
 * 프로젝트 페이지 물리 키보드 입력
 * - 목록: 숫자열 키(1 … 0, -) = 고르기 · ← → = 앞뒤 프로젝트 고르기 · Enter = 고른 프로젝트 상세
 * - 상세: Esc = 목록으로 · ← → = 이전·다음 프로젝트
 * - Ctrl·Alt·Meta 조합은 브라우저 단축키라 건드리지 않음
 */
export const useProjectKeys = ({ selectedProject, detailProject, onSelect, onCloseDetail }: ProjectKeysOptions) => {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;

    const currentProject = detailProject ?? selectedProject;
    const index = PROJECTS.indexOf(currentProject);
    const neighbor =
      event.key === 'ArrowLeft' ? PROJECTS[index - 1] : event.key === 'ArrowRight' ? PROJECTS[index + 1] : undefined;

    if (detailProject) {
      if (event.key === 'Escape') onCloseDetail();
      if (neighbor) replaceHash(getProjectHash(neighbor.slug));
      return;
    }

    const keyProject = getProjectByKeyCode(event.code);
    if (keyProject) {
      onSelect(keyProject.slug);
      return;
    }
    if (neighbor) {
      onSelect(neighbor.slug);
      return;
    }
    if (event.key === 'Enter' && !isInteractiveTarget(event.target)) {
      window.location.hash = getProjectHash(selectedProject.slug);
    }
  });

  // 전역 키 입력 구독 — 외부 이벤트 소스라 Effect 로 연결
  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleKeyDown(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
};
