import { useRef, useState } from 'react';

import { ClosingSection } from './ClosingSection';
import { FaqSection } from './FaqSection';
import { FeatureSection } from './FeatureSection';
import { Hero } from './Hero';
import { InstallSection } from './InstallSection';
import { PetStage } from './pet/PetStage';
import { PetToggle } from './pet/PetToggle';
import { usePetsShown } from './pet/usePetsShown';
import { HERO_SPRITES } from './pmdSprites';
import { SiteFooter } from '../site/SiteFooter';
import { useLatestRelease } from '../site/useLatestRelease';

/** 도트 배율 — 앱 크기 단계 2의 배율이자 새 포켓몬 기본값 (pokebuddy src/party/size.ts SIZE_STEPS[1]) */
const PET_ZOOM = 1.5;

/**
 * 화면 너비별 포켓몬 구성 — 처음 자리는 히어로 캡처 너비 대비
 * - 넓은 화면: 피카츄·리자몽·이브이·루카리오
 * - 좁은 화면: 글을 덜 가리게 피카츄·이브이 두 마리
 */
const PET_CAST = {
  wide: { sprites: HERO_SPRITES, starts: [0.08, 0.36, 0.6, 0.9] },
  narrow: { sprites: HERO_SPRITES.filter((sprite) => sprite.dex === '0025' || sprite.dex === '0133'), starts: [0.15, 0.75] },
};

/**
 * `/pokebuddy/` 랜딩 — 와이어프레임 v1 (2026-10-24) 구성
 * - 포켓몬 무대는 화면 전체(fixed) — 스크롤해도 화면 위에 머물고, 화면 어디로든 끌어다 놓을 수 있음
 * - 오른쪽 아래 단추로 숨기기·보이기 (방문자 선택 기억)
 */
export const LandingPage = () => {
  const release = useLatestRelease();
  const capturesRef = useRef<HTMLDivElement>(null);
  const [cast] = useState(() => (window.matchMedia('(max-width: 639px)').matches ? PET_CAST.narrow : PET_CAST.wide));
  const pets = usePetsShown();

  return (
    <>
      <Hero release={release} capturesRef={capturesRef} />
      <main>
        <FeatureSection />
        <InstallSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <SiteFooter />
      {pets.shown && <PetStage sprites={cast.sprites} starts={cast.starts} zoom={PET_ZOOM} anchorRef={capturesRef} />}
      <PetToggle shown={pets.shown} onToggle={pets.toggle} />
    </>
  );
};
