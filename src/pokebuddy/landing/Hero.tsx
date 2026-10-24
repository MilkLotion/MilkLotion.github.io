import type { Ref } from 'react';

import { cn } from '../../shared/lib/cn';
import { DownloadButtons } from './DownloadButtons';
import { IMAGE_BASE } from '../site/links';
import { HERO_CAPTURES } from './content';
import type { ReleaseInfo } from '../site/release';
import { SiteHeader } from '../site/SiteHeader';

const HERO_CAPTURES_WIDTH = HERO_CAPTURES.reduce((sum, capture) => sum + capture.width, 0);

interface HeroProps {
  release: ReleaseInfo;
  /** 포켓몬이 처음 걷는 줄의 기준 — 캡처 묶음 */
  capturesRef: Ref<HTMLDivElement>;
}

/**
 * 히어로 — 짙은 남색 → 청록 → 바탕색 그라데이션
 * - 캡처 윗변을 포켓몬이 걸어 다님 (와이어프레임 A안). 무대는 랜딩 전체 — LandingPage 의 PetStage
 */
export const Hero = ({ release, capturesRef }: HeroProps) => (
  <section className="bg-[linear-gradient(180deg,var(--brand-deep)_0%,var(--brand-navy)_38%,var(--brand-teal)_74%,var(--background)_100%)] px-4 pb-16 sm:px-6 md:pb-24">
    <SiteHeader />
    <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-6 pt-14 text-center md:pt-22">
      <img
        src={`${IMAGE_BASE}/logo.svg`}
        alt="pokebuddy 앱 아이콘"
        width={96}
        height={96}
        className="size-18 drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:size-24"
      />
      <h1 className="text-[34px] leading-tight font-extrabold tracking-tight text-white sm:text-5xl md:text-[64px]">
        바탕화면에서
        <br className="sm:hidden" /> 포켓몬을 키워 보세요
      </h1>
      <p className="text-base font-medium text-white/85 md:text-xl">
        일하는 동안 포켓몬이 화면을 걸어 다녀요. 가끔 밥을 주고 놀아 주면 돼요.
      </p>
      <div id="download" className="mt-2 flex w-full scroll-mt-6 justify-center">
        <DownloadButtons release={release} />
      </div>
      <p className="font-pixel text-[13px] tracking-wide text-white/70">
        v{release.version} · {release.date} · Windows · macOS · 무료
      </p>

      {/* 캡처 원본 크기(합 1020px)보다 키우지 않음 — 키우면 글자가 흐려짐. 좁은 화면은 비율대로 줄임 */}
      <div ref={capturesRef} className="mt-16 flex w-full max-w-[1020px] items-start md:mt-20">
        {HERO_CAPTURES.map((capture, index) => (
          <img
            key={capture.src}
            src={capture.src}
            alt={capture.alt}
            width={capture.width}
            height={capture.height}
            className={cn(
              'block h-auto min-w-0 shadow-[0_40px_80px_rgba(8,20,30,0.4)]',
              index === 0 ? 'rounded-l-xl' : 'rounded-r-xl',
            )}
            style={{ width: `${(capture.width / HERO_CAPTURES_WIDTH) * 100}%` }}
          />
        ))}
      </div>
    </div>
  </section>
);
