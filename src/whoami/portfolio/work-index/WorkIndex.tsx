import { useState } from 'react';

import { getProjectHash } from '../../hooks/useHashRoute';
import { ProjectArtifact } from '../project-artifact/ProjectArtifact';

import { PROJECTS } from '../../content/projects';
import { CASE_STUDIES } from '../case-studies';

export const WorkIndex = () => {
  const [selectedSlug, setSelectedSlug] = useState(CASE_STUDIES[0].slug);
  const [isListView, setIsListView] = useState(false);
  const selected = CASE_STUDIES.find((item) => item.slug === selectedSlug) ?? CASE_STUDIES[0];
  const otherProjects = PROJECTS.filter((project) => project.group !== 'career' && !CASE_STUDIES.some((item) => item.slug === project.slug));

  return (
    <>
      <header className="work-heading folio-width">
        <div><p className="folio-eyebrow">HYUNSU NOH / SELECTED WORK</p><h1 tabIndex={-1} data-page-heading>노현수의 작업실.</h1><p className="work-heading__intro">상담 제품과 공통 UI를 만드는 프론트엔드 개발자입니다.</p></div>
        <div className="view-switch" role="group" aria-label="프로젝트 보기 방식">
          <button type="button" aria-pressed={!isListView} onClick={() => setIsListView(false)}>공간</button>
          <button type="button" aria-pressed={isListView} onClick={() => setIsListView(true)}>목록</button>
        </div>
      </header>

      {!isListView ? (
        <section className="workbench" aria-label="대표 프로젝트">
          <div className="workbench__grain" aria-hidden="true" />
          <div className="workbench__rule" aria-hidden="true">PROJECT ARCHIVE / 2025—26</div>
          <div className="workbench__objects folio-width">
            {CASE_STUDIES.map((item) => (
              <a key={item.slug} href={getProjectHash(item.slug)} className="work-object" data-selected={selectedSlug === item.slug} onMouseEnter={() => setSelectedSlug(item.slug)} onFocus={() => setSelectedSlug(item.slug)} aria-label={`${item.name}: ${item.title}`}>
                <ProjectArtifact kind={item.artifact} />
                <div className="work-object__label"><span>{item.number}</span><strong>{item.name}</strong><span aria-hidden="true">↗</span></div>
              </a>
            ))}
          </div>
          <div className="work-preview folio-width">
            <p className="work-preview__name">{selected.name}<span>{selected.category}</span></p>
            <div><h2>{selected.title}</h2><p>{selected.role}</p></div>
            <a href={getProjectHash(selected.slug)} className="folio-button">사례 보기 <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      ) : (
        <section className="work-list folio-width" aria-label="대표 프로젝트">
          {CASE_STUDIES.map((item) => <a href={getProjectHash(item.slug)} key={item.slug} className="work-list__item"><span className="folio-eyebrow">{item.number}</span><div><span>{item.name} · {item.category}</span><h2>{item.title}</h2><p>{item.role}</p></div><div className="work-list__artifact"><ProjectArtifact kind={item.artifact} /></div><span aria-hidden="true">↗</span></a>)}
        </section>
      )}

      <section className="other-work folio-width" aria-labelledby="other-work-title">
        <div className="section-label"><span className="folio-eyebrow">MORE WORK</span><h2 id="other-work-title">다른 작업</h2></div>
        <div>{otherProjects.map((project) => <a className="other-work__item" key={project.slug} href={getProjectHash(project.slug)}><div><h3>{project.title}</h3><p>{project.role}</p></div><span aria-hidden="true">↗</span></a>)}</div>
      </section>
    </>
  );
};
