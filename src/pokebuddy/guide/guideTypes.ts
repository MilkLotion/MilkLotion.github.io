/** 설명서 장 데이터 — scripts/build-pokebuddy-guide.cjs 가 guide.generated.ts 로 만듦 */

export interface GuideSection {
  /** 제목 앵커 — GitHub 과 같은 규칙 */
  id: string;
  title: string;
}

export interface GuideChapter {
  id: string;
  title: string;
  /** 나뉜 장(팁 공략 하나하나)의 원래 ## id */
  group?: string;
  /** ### 소제목 — "이 장에서" 목록 */
  sections: GuideSection[];
  /** 장 제목(##)을 뺀 본문 HTML — 우리 마크다운에서 만든 것 */
  html: string;
}
