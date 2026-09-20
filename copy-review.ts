import type { Plugin } from 'vite';

/** 이번 문구 검토에서 제거한 표현과 정정한 사실만 검사 — 문체 일반화 금지 */
const COPY_REVIEW_RULES = [
  { pattern: /작업한 프로젝트를\s*소개합니다/, reason: '페이지 이름을 반복하는 안내 대신 작업 기록 제목 사용' },
  { pattern: /같은 코드 작성을\s*지양합니다/, reason: '추상적 태도 대신 실제 공통 UI 개발 경험으로 작성' },
  { pattern: /소비처 3곳 중 둘/, reason: '세 소비처 모두 개발 참여 — 최신 원고 확인' },
  { pattern: /4종 모두 사고/, reason: '검증 4종은 회귀 대응 3종과 통일 결과 검사 1종' },
  { pattern: /재발\s*0건/, reason: '추적 기간·원자료 확인 전 공개 성과로 사용하지 않음' },
] as const;

export const reviewPortfolioCopy = (source: string) => {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const surfaces = [...withoutComments.split('\n'), withoutComments.replace(/\\n|\s*\n\s*/g, ' ')];
  return COPY_REVIEW_RULES.filter((rule) => surfaces.some((surface) => rule.pattern.test(surface))).map((rule) => rule.reason);
};

/** 기존 Vite 변환 경로에서 편집 직후 경고 — 별도 검사 명령이나 빌드 차단 없음 */
export const portfolioCopyReview = (): Plugin => ({
  name: 'portfolio-copy-review',
  apply: 'serve',
  enforce: 'pre',
  transform(source, id) {
    const path = id.replaceAll('\\', '/').split('?')[0];
    const isCopySurface = /\/src\/(?:portfolio\/.*|content\/projects|pages\/BacklightPage)\.tsx?$/.test(path);
    if (!isCopySurface || path.endsWith('/demo-scenarios.ts') || path.endsWith('/CaseDemo.tsx')) return;
    for (const reason of reviewPortfolioCopy(source)) this.warn(`[문구 검토] ${path.split('/src/')[1]}: ${reason}`);
  },
});
