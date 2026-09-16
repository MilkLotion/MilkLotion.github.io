interface BackButtonProps {
  /** 버튼 글자 — 목록에서는 "돌아가기", 상세에서는 "목록으로" */
  label: string;
  onClick: () => void;
}

/** 프로젝트 페이지 왼쪽 위 돌아가기 — 한 단계 위 화면으로. 아이콘은 왼쪽 화살표(lucide arrow-left 모양) */
export const BackButton = ({ label, onClick }: BackButtonProps) => (
  <button type="button" className="back-button" onClick={onClick}>
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
    {label}
  </button>
);
