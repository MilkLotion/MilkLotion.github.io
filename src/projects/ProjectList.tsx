import { PROJECT_GROUP_ORDER, PROJECT_GROUPS, PROJECTS } from '../content/projects';
import { getProjectHash } from '../hooks/useHashRoute';
import { ProjectDot } from './ProjectDot';

/** 분류별 묶음 — 데이터가 정적이라 모듈에서 한 번 */
const GROUPED_PROJECTS = PROJECT_GROUP_ORDER.map((groupId) => ({
  groupId,
  projects: PROJECTS.filter((project) => project.group === groupId),
})).filter(({ projects }) => projects.length > 0);

interface ProjectListProps {
  selectedSlug: string;
  /** 마우스가 올라간 항목 — 벗어나면 null. 요약 패널 미리보기용 */
  onPreview: (slug: string | null) => void;
  /** 키보드 탭 이동으로 항목에 들어왔을 때 — 키캡 선택과 맞춤 */
  onSelect: (slug: string) => void;
}

/**
 * 프로젝트 목록 — 키캡 인덱스와 같은 내용을 DOM 으로
 * - 누르면 바로 상세로 (모바일에서는 이 목록이 주 탐색 수단)
 * - 현재 고른 항목은 좌측 세로 막대(blade) + 옅은 배경, 분류는 dot
 */
export const ProjectList = ({ selectedSlug, onPreview, onSelect }: ProjectListProps) => (
  <nav className="project-list" aria-label="프로젝트 목록">
    <p className="project-list__hint">키캡이나 숫자 키로 고르기</p>
    {GROUPED_PROJECTS.map(({ groupId, projects }) => (
      <section key={groupId} className="project-list__group" aria-labelledby={`project-group-${groupId}`}>
        <h2 id={`project-group-${groupId}`} className="project-list__group-title">
          <ProjectDot group={groupId} />
          {PROJECT_GROUPS[groupId].label}
        </h2>
        <ol className="project-list__items">
          {projects.map((project) => (
            <li key={project.slug}>
              <a
                className="project-list__item"
                href={getProjectHash(project.slug)}
                data-selected={project.slug === selectedSlug}
                onPointerEnter={() => onPreview(project.slug)}
                onPointerLeave={() => onPreview(null)}
                onFocus={() => onSelect(project.slug)}
              >
                <kbd className="project-key">{project.keyLabel}</kbd>
                <span className="project-list__title">{project.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    ))}
  </nav>
);
