import { getProjectHash } from '../../hooks/useHashRoute';
import { CaseDemo } from '../case-demo/CaseDemo';
import { ProjectArtifact } from '../project-artifact/ProjectArtifact';
import { ResponsibilityDiagram } from './ResponsibilityDiagram';

import type { Project } from '../../content/projects';

import { CASE_STUDIES, getCaseStudy } from '../case-studies';

interface CaseStudyProps {
  project: Project;
}

/** 상세는 독립된 읽기 화면 — 숨겨진 3D 장면 없이 직접 주소로 진입 */
export const CaseStudy = ({ project }: CaseStudyProps) => {
  const study = getCaseStudy(project.slug);
  const sections = study?.sections ?? [
    ...(project.context.length ? [{ title: '배경', paragraphs: project.context }] : []),
    ...project.decisions.map((decision) => ({ title: decision.title, paragraphs: [decision.body] })),
  ];
  const next = CASE_STUDIES[(CASE_STUDIES.findIndex((item) => item.slug === project.slug) + 1) % CASE_STUDIES.length];
  const jumpTo = (id: string) => {
    const heading = document.getElementById(id);
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <article className="case-study folio-width">
      <div className="case-breadcrumb"><a href="#projects">← 전체 작업</a><span>{study?.name ?? project.title}</span></div>
      <header className={`case-hero${study ? '' : ' case-hero--text'}`}>
        <div className="case-hero__copy"><p className="folio-eyebrow">{study ? `${study.number} / ${study.category}` : project.org}</p><h1 tabIndex={-1} data-page-heading>{study?.title ?? project.title}</h1><p>{project.summary}</p><dl className="case-meta"><div><dt>역할</dt><dd>{study?.role ?? project.role}</dd></div><div><dt>기간</dt><dd>{project.period}</dd></div><div><dt>상태</dt><dd>{project.status}</dd></div></dl></div>
        {study && <figure className="case-hero__artifact"><ProjectArtifact kind={study.artifact} /><figcaption>{study.name} / 개념 도해</figcaption></figure>}
      </header>

      <nav className="case-chapters" aria-label="사례 목차"><span className="folio-eyebrow">CONTENTS</span>{sections.map((section, index) => <button key={section.title} type="button" onClick={() => jumpTo(`case-section-${index}`)}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</button>)}<button type="button" onClick={() => jumpTo('case-evidence')}>기록·사용 기술</button></nav>

      {sections.map((section, index) => <section className="case-section" key={section.title}><div className="case-section__heading"><span className="folio-eyebrow">{String(index + 1).padStart(2, '0')}</span><h2 id={`case-section-${index}`} tabIndex={-1}>{section.title}</h2></div><div className="case-section__body">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{study?.artifact === 'apps' && index === 1 && <ResponsibilityDiagram />}{study && index === (study.artifact === 'calls' || study.artifact === 'document' ? 0 : sections.length - 1) && <CaseDemo key={project.slug} kind={study.artifact} />}</div></section>)}

      <section className="case-section"><div className="case-section__heading"><span className="folio-eyebrow">NOTES</span><h2 id="case-evidence" tabIndex={-1}>기록·사용 기술</h2></div><div className="case-section__body">{study && <><p>{study.result}</p><dl className="case-scope">{study.scope.map((item) => <div key={item.label}><dd>{item.value}</dd><dt>{item.label}</dt></div>)}</dl>{study.note && <p className="case-note">{study.note}</p>}</>}
        {project.media.length > 0 && <details className="case-evidence"><summary>화면과 구조도 <span>{project.media.length}</span></summary><div className="case-media">{project.media.map((media) => <figure key={media.src}><a href={media.src} target="_blank" rel="noreferrer" aria-label={`${media.alt}, 원본 보기`}><img src={media.src} alt={media.alt} loading="lazy" /></a><figcaption>{media.caption}</figcaption></figure>)}</div></details>}
        {project.facts.length > 0 && <details className="case-evidence"><summary>개발 기록</summary><dl className="case-records">{project.facts.map((fact) => <div key={fact.label + fact.value}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>{project.measuredNote && <p className="case-note">{project.measuredNote}</p>}</details>}
        {project.stack.length > 0 && <ul className="folio-tech" aria-label="사용 기술">{project.stack.map((tech) => <li key={tech}>{tech}</li>)}</ul>}
      </div></section>
      <nav className="case-next" aria-label="다른 작업"><a href="#projects">← 전체 작업</a><a href={getProjectHash(next.slug)}><span>다음 사례</span><strong>{next.name} ↗</strong></a></nav>
    </article>
  );
};
