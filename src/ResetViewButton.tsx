import type { MouseEvent } from 'react';

interface ResetViewButtonProps {
  onClick: () => void;
}

/** 마우스로 누르면 포커스를 옮기지 않음 — 버튼에 포커스가 남으면 이어서 치는 스페이스·엔터가 버튼을 다시 누름 */
const keepFocus = (event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

/** 돌려 본 키보드 시점을 처음 구도로 되돌리는 버튼 — 아이콘은 반시계 방향 되돌리기 화살표(lucide rotate-ccw 모양) */
export const ResetViewButton = ({ onClick }: ResetViewButtonProps) => (
  <button
    type="button"
    className="reset-view"
    aria-label="키보드 시점 처음으로"
    title="시점 처음으로"
    onMouseDown={keepFocus}
    onClick={onClick}
  >
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  </button>
);
