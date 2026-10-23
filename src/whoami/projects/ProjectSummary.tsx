import { PROJECT_GROUPS, type Project } from '../content/projects';
import { getProjectHash } from '../hooks/useHashRoute';
import { ProjectDot } from './ProjectDot';

interface ProjectSummaryProps {
  project: Project;
}

/** 오른쪽 요약 패널 — 고른(또는 마우스를 올린) 프로젝트의 한 줄 요약·대표 수치·스택 */
export const ProjectSummary = ({ project }: ProjectSummaryProps) => (
  <aside className="project-summary" aria-label="프로젝트 요약">
    <p className="project-summary__meta">
      <span className="project-summary__group">
        <ProjectDot group={project.group} />
        {PROJECT_GROUPS[project.group].label} · {project.org}
      </span>
      <kbd className="project-key">{project.keyLabel}</kbd>
    </p>
    <h2 className="project-summary__title">{project.title}</h2>
    <p className="project-summary__period">
      {project.period} · {project.status}
    </p>
    <p className="project-summary__text">{project.summary}</p>
    {project.highlights.length > 0 && (
      <ul className="project-summary__highlights">
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    )}
    {project.stack.length > 0 && (
      <ul className="project-tags" aria-label="사용 기술">
        {project.stack.map((tech) => (
          <li key={tech} className="project-tags__item">
            {tech}
          </li>
        ))}
      </ul>
    )}
    <a className="project-summary__more" href={getProjectHash(project.slug)}>
      자세히 보기
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  </aside>
);
