import { useState } from 'react';

import type { ArtifactKind } from '../types';

import { DEMO_SCENARIOS } from '../demo-scenarios';

interface CaseDemoProps {
  kind: ArtifactKind;
}

const DOCUMENT_EXCERPTS = [
  { page: '03', title: '신청 방법', sentence: '신청서는 담당 부서에 제출합니다.' },
  { page: '07', title: '제출 기한', sentence: '접수는 공고에 정해진 기간에 진행합니다.' },
] as const;

export const CaseDemo = ({ kind }: CaseDemoProps) => {
  const [step, setStep] = useState(0);
  const [sourceIndex, setSourceIndex] = useState<number | null>(null);
  const scenario = DEMO_SCENARIOS[kind];
  const current = scenario.steps[step];
  const excerpt = sourceIndex === null ? null : DOCUMENT_EXCERPTS[sourceIndex];

  if (kind === 'document') {
    return (
      <div className="case-demo case-demo--document">
        <div className="case-demo__heading"><h3>출처 선택</h3><span>합성 문서 · 동작 재구성</span></div>
        <div className="document-demo">
          <div className="document-demo__answer"><span className="folio-eyebrow">질문 / ANSWER</span><h4>언제, 어디로 신청하나요?</h4><p>담당 부서에 신청서를 제출하면 됩니다. 접수 기간은 공고에서 확인할 수 있습니다.</p><div className="document-demo__citations">{DOCUMENT_EXCERPTS.map((source, index) => <button key={source.title} type="button" aria-pressed={sourceIndex === index} onClick={() => setSourceIndex(index)}>출처 {index + 1} <span aria-hidden="true">↗</span></button>)}</div></div>
          <div className="document-demo__page" aria-live="polite">{excerpt ? <><div className="document-demo__page-meta"><span>신청 안내</span><span>{excerpt.page} / 12</span></div><h4>{excerpt.title}</h4><div className="document-demo__lines" aria-hidden="true"><i /><i /><i /></div><mark>{excerpt.sentence}</mark><div className="document-demo__lines" aria-hidden="true"><i /><i /><i /><i /></div></> : <p className="document-demo__empty">출처를 선택하면 원문이 열립니다.</p>}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`case-demo case-demo--${kind}`}>
      <div className="case-demo__heading"><h3>{scenario.title}</h3><span>사례 재구성</span></div>
      <ol className="demo-steps">{scenario.steps.map((item, index) => <li key={item.label}><button type="button" aria-pressed={step === index} onClick={() => setStep(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}</button></li>)}</ol>
      <div className="demo-scene">
        <div className="demo-window"><div className="demo-window__bar"><i />{scenario.actors[0]}</div><strong>{current.left}</strong><div className="demo-window__lines" aria-hidden="true"><i /><i /><i /></div></div>
        <div className="demo-signal" aria-hidden="true"><span>{current.event}</span><i /></div>
        <div className="demo-window" data-current={step === scenario.steps.length - 1}><div className="demo-window__bar"><i />{scenario.actors[1]}</div><strong>{current.right}</strong><div className="demo-window__lines" aria-hidden="true"><i /><i /><i /></div></div>
      </div>
      <div className="demo-controls"><p aria-live="polite">{current.description}</p><button type="button" className="folio-button" onClick={() => setStep((value) => (value + 1) % scenario.steps.length)}>{step === scenario.steps.length - 1 ? '처음부터 ↺' : '다음 단계 →'}</button></div>
    </div>
  );
};
