import type { CSSProperties } from 'react';

import { PROJECT_GROUPS, type ProjectGroupId } from '../content/projects';

interface ProjectDotProps {
  group: ProjectGroupId;
}

/** 분류 표시 — 좌측 원형 마커. 색은 분류별(회사·공모전·이전 경력) */
export const ProjectDot = ({ group }: ProjectDotProps) => (
  <span
    className="project-dot"
    style={{ '--dot-color': PROJECT_GROUPS[group].color } as CSSProperties}
    aria-hidden="true"
  />
);
