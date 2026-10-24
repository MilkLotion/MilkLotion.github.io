import { useRef } from 'react';

import { ClosingSection } from './ClosingSection';
import { FaqSection } from './FaqSection';
import { FeatureSection } from './FeatureSection';
import { Hero } from './Hero';
import { InstallSection } from './InstallSection';
import { MoveSection } from './MoveSection';
import { PetStage } from './pet/PetStage';
import { HERO_SPRITES } from './pmdSprites';
import { SiteFooter } from './SiteFooter';
import { useLatestRelease } from './useLatestRelease';

/** 포켓몬별 처음 자리 (히어로 캡처 너비 대비) — HERO_SPRITES 순서 */
const PET_STARTS = [0.08, 0.36, 0.6, 0.9];
/** 도트 배율 — 앱 크기 단계 2의 배율이자 새 포켓몬 기본값 (pokebuddy src/party/size.ts SIZE_STEPS[1]) */
const PET_ZOOM = 1.5;

/**
 * `/pokebuddy/` 랜딩 — 와이어프레임 v1 (2026-10-24) 구성
 * - 포켓몬 무대는 화면 전체(fixed) — 스크롤해도 화면 위에 머물고, 화면 어디로든 끌어다 놓을 수 있음
 */
export const LandingPage = () => {
  const release = useLatestRelease();
  const capturesRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Hero release={release} capturesRef={capturesRef} />
      <main>
        <FeatureSection />
        <MoveSection />
        <InstallSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <SiteFooter />
      <PetStage sprites={HERO_SPRITES} starts={PET_STARTS} zoom={PET_ZOOM} anchorRef={capturesRef} />
    </>
  );
};
