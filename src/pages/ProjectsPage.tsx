import { useCallback, useMemo, useState } from 'react';

import { BackButton } from '../BackButton';
import { getProjectByKeyCode, getProjectBySlug, PROJECTS } from '../content/projects';
import { goBackTo, PROJECTS_HASH } from '../hooks/useHashRoute';
import { useProjectKeys } from '../hooks/useProjectKeys';
import { LoadingScreen } from '../LoadingScreen';
import { ProjectDetail } from '../projects/ProjectDetail';
import { ProjectList } from '../projects/ProjectList';
import { ProjectSummary } from '../projects/ProjectSummary';
import { StudioBackground } from '../scene/atmosphere/StudioBackground';
import { KeyboardScene } from '../scene/KeyboardScene';

import '../projects/projects.css';

const [FIRST_PROJECT] = PROJECTS;

interface ProjectsPageProps {
  /** `#projects/{slug}` 상세 — 목록이면 null */
  detailSlug: string | null;
  /** 목록에서 [돌아가기] — 소개 페이지 마지막 화면으로 */
  onLeave: () => void;
}

interface DetailEntry {
  slug: string | null;
  /** 이 상세를 목록에서 열었는지 — 그렇다면 [목록으로]가 브라우저 뒤로 가기 */
  hasListBehind: boolean;
}

/**
 * 프로젝트 페이지 — 스튜디오 키보드가 곧 목록 (조립 상태 고정, 휠 분해 없음)
 * - 숫자열 키캡 1 … 0, - 에 프로젝트 11건. 마우스를 올리면 오른쪽 패널 미리보기, 누르면 고름(키캡이 눌린 채 유지)
 * - 왼쪽 DOM 목록은 같은 내용 — 누르면 바로 상세. 모바일에서는 이 목록이 주 탐색 수단
 * - 상세는 같은 페이지 위에 겹쳐 3D 장면을 다시 불러오지 않음
 */
export const ProjectsPage = ({ detailSlug, onLeave }: ProjectsPageProps) => {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(detailSlug ?? FIRST_PROJECT.slug);
  /** 왼쪽 목록에서 마우스를 올린 항목 */
  const [listPreviewSlug, setListPreviewSlug] = useState<string | null>(null);
  /** 마우스를 올린 키캡 — 프로젝트 키가 아니면 무시 */
  const [hoveredKeyCode, setHoveredKeyCode] = useState<string | null>(null);
  const [detailEntry, setDetailEntry] = useState<DetailEntry>({ slug: detailSlug, hasListBehind: false });

  // 상세 주소가 바뀐 렌더에서 바로 기록·선택 동기화 — 상세를 닫았을 때 그 프로젝트 키가 눌린 채 목록으로 돌아오게
  if (detailEntry.slug !== detailSlug) {
    setDetailEntry({
      slug: detailSlug,
      hasListBehind: detailSlug !== null && (detailEntry.slug === null || detailEntry.hasListBehind),
    });
    if (detailSlug) setSelectedSlug(detailSlug);
  }

  const selectedProject = getProjectBySlug(selectedSlug) ?? FIRST_PROJECT;
  const detailProject = detailSlug ? getProjectBySlug(detailSlug) : undefined;
  const previewProject =
    (hoveredKeyCode ? getProjectByKeyCode(hoveredKeyCode) : undefined) ??
    (listPreviewSlug ? getProjectBySlug(listPreviewSlug) : undefined) ??
    selectedProject;

  const heldCodes = useMemo(() => new Set([selectedProject.keyCode]), [selectedProject.keyCode]);

  // 키캡 memo 가 유지되도록 참조 고정 — 상태 설정 함수만 씀
  const selectByKeyCode = useCallback((code: string) => {
    const project = getProjectByKeyCode(code);
    if (project) setSelectedSlug(project.slug);
  }, []);

  const closeDetail = () => goBackTo(PROJECTS_HASH, detailEntry.hasListBehind);

  useProjectKeys({ selectedProject, detailProject, onSelect: setSelectedSlug, onCloseDetail: closeDetail });

  return (
    <>
      <StudioBackground />
      <KeyboardScene
        stage={0}
        moodId="studio"
        heldCodes={heldCodes}
        onKeyPointerSelect={selectByKeyCode}
        onKeyHoverChange={setHoveredKeyCode}
        onReady={() => setIsSceneReady(true)}
      />
      {/* 상세가 열리면 뒤에서 탭 이동·클릭이 잡히지 않게 */}
      <div className="projects-index" inert={detailProject !== undefined}>
        <ProjectList selectedSlug={selectedProject.slug} onPreview={setListPreviewSlug} onSelect={setSelectedSlug} />
        <ProjectSummary project={previewProject} />
      </div>
      {detailProject && <ProjectDetail project={detailProject} />}
      {/* 상세 시트보다 위 — 어느 화면에서든 같은 자리 */}
      <BackButton label={detailProject ? '목록으로' : '돌아가기'} onClick={detailProject ? closeDetail : onLeave} />
      <LoadingScreen isVisible={!isSceneReady} />
    </>
  );
};
