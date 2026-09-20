import { lazy, Suspense, useState } from 'react';

import { goBackTo, type PageId, useHashRoute } from './hooks/useHashRoute';
import { PortfolioPage } from './portfolio/PortfolioPage';

const BacklightPage = lazy(() => import('./pages/BacklightPage').then((module) => ({ default: module.BacklightPage })));

interface PageHistory {
  current: PageId;
  /** 직전에 보던 페이지 — 처음 연 페이지면 null */
  previous: PageId | null;
}

/**
 * 키보드 홈과 읽기 화면 분리 — 상세 직접 진입 시 3D 코드를 불러오지 않음
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

  const isPortfolioPage = route.page !== 'intro';

  return (
    <main className="app" data-mood={isPortfolioPage ? 'portfolio' : 'backlight'}>
      {isPortfolioPage ? (
        <PortfolioPage
          route={route}
          onHome={() => goBackTo('', pageHistory.previous === 'intro')}
        />
      ) : (
        <Suspense fallback={<div className="intro-loading" role="status">키보드를 불러오는 중</div>}>
        <h1 className="sr-only">노현수 포트폴리오</h1>
        <a className="intro-work-link" href="#projects">작업 바로 보기 ↗</a>
        <BacklightPage
          startsAtLastScreen={pageHistory.previous !== null && pageHistory.previous !== 'intro'}
          typedScreens={typedScreens}
          onTypingStart={handleTypingStart}
        />
        </Suspense>
      )}
    </main>
  );
};
