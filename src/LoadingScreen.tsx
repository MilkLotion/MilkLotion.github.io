interface LoadingScreenProps {
  isVisible: boolean;
}

/**
 * 3D 장면 로딩 화면 — 배경·키보드가 다 그려진 뒤 한 번에 걷힘
 * - 페이지 모든 요소 위를 덮음 — 배경만 먼저 보이고 키보드가 뒤늦게 나타나는 장면을 가림
 * - 걷힌 뒤에도 DOM 에 남아 페이드아웃만 하고, 포인터·보조기기에서는 빠짐
 */
export const LoadingScreen = ({ isVisible }: LoadingScreenProps) => (
  <div className="loading-screen" data-visible={isVisible} role="status" aria-hidden={!isVisible}>
    <span className="loading-screen__spinner" aria-hidden="true" />
    <span className="sr-only">불러오는 중</span>
  </div>
);
