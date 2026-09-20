import type { ArtifactKind } from '../types';

interface ProjectArtifactProps {
  kind: ArtifactKind;
}

/** 프로젝트별 작업물 — CSS 입체 표현, 본문과 링크는 바깥 DOM에 유지 */
export const ProjectArtifact = ({ kind }: ProjectArtifactProps) => (
  <div className={`artifact artifact--${kind}`} aria-hidden="true">
    <div className="artifact__shadow" />
    <div className="artifact__plinth" />
    {kind === 'apps' && (
      <div className="artifact__app-stack">
        <div className="artifact__plate artifact__plate--bottom"><span>DATA</span><i /><i /><i /></div>
        <div className="artifact__plate artifact__plate--middle"><span>SHELL</span><div className="artifact__grid"><i /><i /><i /><i /></div></div>
        <div className="artifact__plate artifact__plate--top"><small>01 / APPLICATIONS</small><strong>SOONi</strong><div className="artifact__app-names"><span>ADMIN</span><span>DESK</span><span>DEMO</span><span>WIDGET</span></div></div>
      </div>
    )}
    {kind === 'components' && (
      <div className="artifact__panel artifact__panel--components">
        <div className="artifact__panel-head"><span>QDS</span><span>02</span></div>
        <strong className="artifact__type">Aa</strong>
        <div className="artifact__swatches"><i /><i /><i /></div>
        <div className="artifact__control"><span>Button</span><i /></div>
        <div className="artifact__input">Select <span>⌄</span></div>
        <div className="artifact__rule" /><div className="artifact__rule artifact__rule--short" />
      </div>
    )}
    {kind === 'calls' && (
      <div className="artifact__call-pair">
        <div className="artifact__phone artifact__phone--back"><small>PREVIOUS</small><strong>A</strong><i /><i /><span>조회 중</span></div>
        <div className="artifact__phone artifact__phone--front"><small>CURRENT</small><strong>B</strong><i /><i /><span>통화 중 <b /></span></div>
        <div className="artifact__call-link">A ≠ B</div>
      </div>
    )}
    {kind === 'document' && (
      <div className="artifact__documents">
        <div className="artifact__page artifact__page--back"><small>ANSWER</small><div className="artifact__rule" /><div className="artifact__rule" /><div className="artifact__citation">02 ↗</div></div>
        <div className="artifact__page artifact__page--front"><div className="artifact__page-head"><span>SOURCE</span><span>04</span></div><strong>문서의 출처</strong><i /><i /><i /><mark /><i /><i /><i /></div>
      </div>
    )}
  </div>
);
