import { useState } from 'react';

import { ProjectArtifact } from '../project-artifact/ProjectArtifact';

export const LabPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lab-page folio-width">
      <header className="folio-page-heading"><p className="folio-eyebrow">LAB / INTERFACE STUDIES</p><h1 tabIndex={-1} data-page-heading>인터페이스 실험</h1></header>
      <section className="lab-experiment"><div className="lab-experiment__visual" data-expanded={isExpanded}><ProjectArtifact kind="apps" /></div><div><span className="folio-eyebrow">01 / CSS TRANSFORMS</span><h2>평면에서 작업물로</h2><p>HTML 요소를 겹쳐 입체적인 작업물로 표현했습니다. 프로젝트를 여는 링크와 본문은 일반 HTML로 유지합니다.</p><button className="folio-button" type="button" aria-pressed={isExpanded} onClick={() => setIsExpanded((value) => !value)}>{isExpanded ? '레이어 모으기' : '레이어 펼치기'} <span aria-hidden="true">↗</span></button><p className="case-note">움직임 줄이기 설정에서는 전환 애니메이션을 생략합니다.</p></div></section>
      <section className="lab-reading"><div><span className="folio-eyebrow">02 / THREE.JS</span><h2>3D 키보드</h2></div><div><p>키캡과 스위치, 하우징을 분리한 모델입니다. 키 입력에 맞춰 키캡이 움직이고, 스크롤로 내부 구조를 펼칩니다.</p><a className="folio-text-link" href="#">키보드 열기 ↗</a></div></section>
      <section className="lab-reading"><div><span className="folio-eyebrow">03 / RESEARCH NOTE</span><h2>HTML-in-Canvas</h2></div><div><p>HTML을 Canvas·GPU 텍스처로 렌더링하는 실험 API를 조사했습니다. Chrome의 Origin Trial 단계이며, 이 포트폴리오에는 아직 적용하지 않았습니다.</p><p>입력과 텍스트 선택을 유지하면서 UI를 입체 공간에 배치할 수 있는지 살펴볼 주제입니다.</p><a className="folio-text-link" href="https://chromestatus.com/feature/5172548013916160" target="_blank" rel="noreferrer">브라우저 지원 현황 ↗</a><p className="case-note">2026.09.21 확인 · Origin Trial 148–160</p></div></section>
    </div>
  );
};
