import { useLayoutEffect, useRef } from 'react';

import { AboutPage } from './about-page/AboutPage';
import { CaseStudy } from './case-study/CaseStudy';
import { LabPage } from './lab-page/LabPage';
import { WorkIndex } from './work-index/WorkIndex';

import type { HashRoute } from '../hooks/useHashRoute';

import { getProjectBySlug } from '../content/projects';
import './portfolio.css';
import './artifacts.css';
import './case-study.css';

interface PortfolioPageProps {
  route: HashRoute;
  onHome: () => void;
}

export const PortfolioPage = ({ route, onHome }: PortfolioPageProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, number>());
  const project = route.projectSlug ? getProjectBySlug(route.projectSlug) : undefined;
  const routeKey = project?.slug ?? route.page;
  const isIndex = route.page === 'projects' && !project;

  // 같은 목록으로 돌아오면 읽던 위치 복원, 새 화면에서는 제목으로 포커스 이동
  useLayoutEffect(() => {
    const root = scrollRef.current;
    const heading = root?.querySelector<HTMLElement>('[data-view]:not([hidden]) [data-page-heading]');
    root?.scrollTo({ top: positions.current.get(routeKey) ?? 0, behavior: 'instant' });
    heading?.focus({ preventScroll: true });
    document.title = `${project?.title ?? (route.page === 'about' ? '소개' : route.page === 'lab' ? '실험' : '작업')} · 노현수`;
    return () => { document.title = '노현수 · Portfolio'; };
  }, [project, route.page, routeKey]);

  return (
    <div className="portfolio" ref={scrollRef} onScroll={(event) => positions.current.set(routeKey, event.currentTarget.scrollTop)}>
      <a className="folio-skip" href="#portfolio-content" onClick={(event) => { event.preventDefault(); scrollRef.current?.querySelector<HTMLElement>('[data-view]:not([hidden]) [data-page-heading]')?.focus(); }}>본문으로</a>
      <header className="folio-header"><div className="folio-header__inner folio-width"><button type="button" className="folio-identity" onClick={onHome} aria-label="키보드 홈으로"><span className="folio-key" aria-hidden="true">N</span><strong>노현수</strong><span className="folio-identity__role">FRONTEND DEVELOPER</span></button><nav aria-label="주요 메뉴"><a href="#projects" aria-current={route.page === 'projects' ? 'page' : undefined}>작업</a><a href="#about" aria-current={route.page === 'about' ? 'page' : undefined}>소개</a><a href="#lab" aria-current={route.page === 'lab' ? 'page' : undefined}>실험</a><a className="folio-header__contact" href="mailto:znaldh336@gmail.com">연락 ↗</a></nav></div></header>
      <div id="portfolio-content">
        <div data-view="index" hidden={!isIndex}><WorkIndex /></div>
        {project && <div data-view="case"><CaseStudy key={project.slug} project={project} /></div>}
        {route.page === 'about' && <div data-view="about"><AboutPage /></div>}
        {route.page === 'lab' && <div data-view="lab"><LabPage /></div>}
      </div>
      <footer className="folio-footer folio-width"><span>노현수 · 프론트엔드 개발자</span><nav aria-label="연락처"><a href="mailto:znaldh336@gmail.com">이메일 ↗</a><a href="https://github.com/MilkLotion" target="_blank" rel="noreferrer">GitHub ↗</a></nav></footer>
    </div>
  );
};
