import { useState } from 'react';

import { goBackTo, type PageId, useHashRoute } from './hooks/useHashRoute';
import { BacklightPage } from './pages/BacklightPage';
import { ProjectsPage } from './pages/ProjectsPage';

interface PageHistory {
  current: PageId;
  /** 직전에 보던 페이지 — 처음 연 페이지면 null */
  previous: PageId | null;
}

/**
 * 페이지 전환 — 주소 해시 기준 (useHashRoute)
 * - 소개: 역광 페이지. 마지막 화면의 [프로젝트 보기]가 프로젝트 페이지로 이동
 * - 프로젝트: 스튜디오 키보드가 목록 — 상세는 같은 페이지 위에 겹쳐 3D 장면을 다시 불러오지 않음
 * - 소개 ↔ 프로젝트는 페이지가 통째로 바뀌어 3D 캔버스도 새로 만들어짐
 */
export const App = () => {
  const route = useHashRoute();
  const [pageHistory, setPageHistory] = useState<PageHistory>({ current: route.page, previous: null });
  /** 자동 타이핑을 이미 한 역광 화면 — 역광 페이지가 프로젝트 페이지에 다녀와 새로 마운트돼도 유지 (새로고침하면 초기화) */
  const [typedScreens, setTypedScreens] = useState<ReadonlySet<number>>(() => new Set());

  // 페이지가 바뀐 렌더에서 바로 기록 — Effect 를 거치면 돌아온 역광 페이지가 첫 화면으로 한 번 마운트됨
  if (pageHistory.current !== route.page) {
    setPageHistory({ current: route.page, previous: pageHistory.current });
  }

  const handleTypingStart = (screen: number) => {
    setTypedScreens((current) => (current.has(screen) ? current : new Set(current).add(screen)));
  };

  const isProjectsPage = route.page === 'projects';

  return (
    <main className="app" data-mood={isProjectsPage ? 'studio' : 'backlight'}>
      <h1 className="sr-only">노현수 포트폴리오</h1>
      {isProjectsPage ? (
        <ProjectsPage
          detailSlug={route.projectSlug}
          onLeave={() => goBackTo('', pageHistory.previous === 'intro')}
        />
      ) : (
        <BacklightPage
          startsAtLastScreen={pageHistory.previous === 'projects'}
          typedScreens={typedScreens}
          onTypingStart={handleTypingStart}
        />
      )}
    </main>
  );
};
