import { useEffect, useRef, type MouseEvent } from 'react';

import { PROJECT_GROUPS, PROJECTS, type Project } from '../content/projects';
import { getProjectHash, replaceHash } from '../hooks/useHashRoute';
import { ProjectDot } from './ProjectDot';

interface ProjectDetailProps {
  project: Project;
}

/** 이전·다음 프로젝트 이동 — 방문 기록을 쌓지 않아 [목록으로]·뒤로 가기가 한 번에 목록으로 돌아감 */
const moveTo = (slug: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  replaceHash(getProjectHash(slug));
};

/**
 * 프로젝트 상세 — 목록 위에 겹치는 종이 시트 (3D 장면은 뒤에 그대로)
 * - 헤더 → 맥락 → 핵심 판단 → 수치 → 그림 → 사용 기술 → 이전·다음
 * - 내용이 없는 절은 그리지 않음 (이전 경력은 요약형)
 */
export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const index = PROJECTS.indexOf(project);
  const previous = PROJECTS[index - 1];
  const next = PROJECTS[index + 1];

  // 프로젝트가 바뀌면 맨 위부터 + 제목으로 포커스 — 스크린리더·키보드 사용자가 새 내용 처음에서 시작하게
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [project.slug]);

  return (
    <div ref={scrollRef} className="project-detail">
      <article className="project-detail__sheet" aria-labelledby="project-detail-title">
        <header className="project-detail__header">
          <p className="project-detail__meta">
            <span className="project-detail__group">
              <ProjectDot group={project.group} />
              {PROJECT_GROUPS[project.group].label} · {project.org}
            </span>
            <span className="project-detail__count">
              {index + 1} / {PROJECTS.length}
            </span>
          </p>
          <h2 id="project-detail-title" ref={headingRef} className="project-detail__title" tabIndex={-1}>
            {project.title}
          </h2>
          <p className="project-detail__summary">{project.summary}</p>
          <dl className="project-detail__info">
            <dt>기간</dt>
            <dd>{project.period}</dd>
            <dt>역할</dt>
            <dd>{project.role}</dd>
            <dt>상태</dt>
            <dd>{project.status}</dd>
          </dl>
        </header>

        {project.context.length > 0 && (
          <section className="project-detail__section" aria-labelledby="project-detail-context">
            <h3 id="project-detail-context" className="project-detail__section-title">
              맥락
            </h3>
            {project.context.map((paragraph) => (
              <p key={paragraph} className="project-detail__paragraph">
                {paragraph}
              </p>
            ))}
          </section>
        )}

        {project.decisions.length > 0 && (
          <section className="project-detail__section" aria-labelledby="project-detail-decisions">
            <h3 id="project-detail-decisions" className="project-detail__section-title">
              핵심 판단
            </h3>
            <ol className="project-detail__decisions">
              {project.decisions.map(({ title, body }) => (
                <li key={title} className="project-detail__decision">
                  <h4 className="project-detail__decision-title">{title}</h4>
                  <p className="project-detail__paragraph">{body}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {project.facts.length > 0 && (
          <section className="project-detail__section" aria-labelledby="project-detail-facts">
            <h3 id="project-detail-facts" className="project-detail__section-title">
              수치
            </h3>
            <dl className="project-detail__facts">
              {project.facts.map(({ label, value }) => (
                <div key={value} className="project-detail__fact">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {project.measuredNote && <p className="project-detail__note">{project.measuredNote}</p>}
          </section>
        )}

        {project.media.length > 0 && (
          <section className="project-detail__section" aria-labelledby="project-detail-media">
            <h3 id="project-detail-media" className="project-detail__section-title">
              그림
            </h3>
            {project.media.map(({ src, alt, caption }) => (
              <figure key={src} className="project-detail__figure">
                <img className="project-detail__image" src={src} alt={alt} loading="lazy" />
                <figcaption className="project-detail__caption">{caption}</figcaption>
              </figure>
            ))}
          </section>
        )}

        {project.stack.length > 0 && (
          <section className="project-detail__section" aria-labelledby="project-detail-stack">
            <h3 id="project-detail-stack" className="project-detail__section-title">
              사용 기술
            </h3>
            <ul className="project-tags">
              {project.stack.map((tech) => (
                <li key={tech} className="project-tags__item">
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="project-detail__nav" aria-label="다른 프로젝트">
          {previous ? (
            <a className="project-detail__nav-link" href={getProjectHash(previous.slug)} onClick={moveTo(previous.slug)}>
              <span className="project-detail__nav-label">← 이전</span>
              <span className="project-detail__nav-title">{previous.title}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              className="project-detail__nav-link project-detail__nav-link--next"
              href={getProjectHash(next.slug)}
              onClick={moveTo(next.slug)}
            >
              <span className="project-detail__nav-label">다음 →</span>
              <span className="project-detail__nav-title">{next.title}</span>
            </a>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
};
