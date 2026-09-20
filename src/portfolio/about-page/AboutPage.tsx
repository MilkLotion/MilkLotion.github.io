import { getProjectHash } from '../../hooks/useHashRoute';

import { PROJECTS } from '../../content/projects';

export const AboutPage = () => (
  <div className="about-page folio-width">
    <header className="folio-page-heading"><p className="folio-eyebrow">ABOUT / HYUNSU NOH</p><h1 tabIndex={-1} data-page-heading>노현수</h1><p>React·TypeScript 프론트엔드 개발자.<br />Java·Spring Boot로 백엔드도 개발했습니다.</p></header>
    <section className="about-intro"><div className="about-note" aria-hidden="true"><span>DEVELOPER'S NOTES</span><strong>화면<br />구조<br />상태</strong><i>2021 — PRESENT</i></div><div><h2>현재 하는 일</h2><p>퀀텀에이아이에서 상담 제품과 디자인시스템을 개발합니다. 관리자와 상담사의 앱을 나누고, 공통 UI를 배포하고, 통화 중 바뀌는 상태를 처리합니다.</p><p>이전에는 이쓰리·에어콕에서 약 3년간 서버와 프론트엔드를 함께 개발했습니다. API와 데이터 처리부터 화면, 배포까지 맡은 경험이 있습니다.</p><a className="folio-text-link" href="https://github.com/MilkLotion" target="_blank" rel="noreferrer">GitHub ↗</a></div></section>
    <section className="about-section"><h2>경력</h2><div className="career-list">
      <article><time>2025.06 — 현재</time><div><h3>퀀텀에이아이</h3><p>프론트엔드 개발자 · 음성 서비스팀</p><ul><li><a href={getProjectHash('sooni')}>SOONi · 앱 구조와 다중 창 세션 ↗</a></li><li><a href={getProjectHash('qds')}>QDS · 컴포넌트와 배포 검증 ↗</a></li><li><a href={getProjectHash('public-agency-desk')}>B 공공기관 · 상담사 웹 ↗</a></li><li><a href={getProjectHash('bank-data-platform')}>A 은행 · 문서 탐색과 현장 대응 ↗</a></li></ul></div></article>
      <article><time>2022.03 — 2025.02</time><div><h3>이쓰리 / 에어콕</h3><p>풀스택 개발자 · Java, Spring Boot, React</p><ul>{PROJECTS.filter((project) => project.group === 'career' && project.slug !== 'ocr-prototype').map((project) => <li key={project.slug}><a href={getProjectHash(project.slug)}>{project.title} ↗</a></li>)}</ul></div></article>
      <article><time>2021.08 — 2021.12</time><div><h3>큐오티</h3><p>인턴 · C·Python 기반 OCR 단말기 프로토타입 개발</p></div></article>
    </div></section>
    <section className="about-section"><h2>수상·학력</h2><div className="about-awards"><p><time>2026.01</time><span>퀀텀에이아이 우수직원상</span></p><p><time>2025.12</time><span>민관협력 디지털 사회혁신 공모전 특별상<br /><small>VibeCraft 5인 팀 · 프론트엔드 담당</small></span></p><p><time>2025.11</time><span>오픈소스 개발자대회 우수작 선정<br /><small>VibeCraft · 노코드 플랫폼</small></span></p><p><time>2022.02</time><span>부경대학교 컴퓨터공학과 졸업</span></p></div></section>
    <div className="about-contact"><h2>연락</h2><a href="mailto:znaldh336@gmail.com">znaldh336@gmail.com <span aria-hidden="true">↗</span></a></div>
  </div>
);
