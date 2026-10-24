import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '../../shared/lib/cn';
import { spriteUrl } from '../site/links';
import { SiteFooter } from '../site/SiteFooter';
import { SiteHeader } from '../site/SiteHeader';
import { chapterMeta, GROUP_DOT, GROUP_LABELS, GUIDE_GROUPS, ORDERED_CHAPTERS } from './chapterMeta';
import type { GuideChapter } from './guideTypes';
import { chapterHref, useGuideRoute } from './useGuideRoute';

/** 장 머리 띠 — 랜딩 히어로와 같은 남색 → 청록 */
const BAND_CLASS = 'bg-[linear-gradient(135deg,var(--brand-deep)_0%,var(--brand-navy)_45%,var(--brand-teal)_100%)] text-white';

/**
 * `/pokebuddy/guide/` 설명서 — 장 단위 보기
 * - 내용은 pokebuddy 저장소 docs/guide.md 그대로 (npm run sync:pokebuddy 로 만든 guide.generated.ts)
 * - 장 꾸밈(아이콘·묶음·포켓몬)은 chapterMeta.ts
 * - 넓은 화면: 왼쪽 묶음별 장 목록 · 본문. 좁은 화면: 본문 위 접는 목차
 * - 따로 된 목차 화면 없음 — 주소가 비었으면 첫 장(설치) (2026-10-25 사용자)
 */
export const GuidePage = () => {
  const { chapter, anchor, hash } = useGuideRoute();

  // 장이 바뀌면 맨 위로, 소제목 주소면 그 자리로 — 장 본문이 그려진 뒤
  useEffect(() => {
    if (anchor) document.getElementById(anchor)?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash, anchor]);

  useEffect(() => {
    document.title = `${chapter.title} — pokebuddy 설명서`;
  }, [chapter]);

  return (
    <>
      <SiteHeader tone="light" current="guide" />
      <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-4 pt-8 pb-24 sm:px-6 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <nav aria-label="설명서 목차" className="sticky top-26 max-h-[calc(100vh-128px)] overflow-y-auto pb-4">
            <ChapterList current={chapter} />
          </nav>
        </aside>

        <main className="min-w-0">
          {/* 주소가 바뀌면 새로 그려 접힌 상태로 */}
          <details key={hash} className="mb-6 rounded-xl border border-border bg-card lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-bold">목차</summary>
            <nav aria-label="설명서 목차" className="px-2 pb-3">
              <ChapterList current={chapter} />
            </nav>
          </details>
          <ChapterView chapter={chapter} anchor={anchor} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
};

const ChapterList = ({ current }: { current: GuideChapter }) => (
  <div className="flex flex-col gap-5">
    {GUIDE_GROUPS.map((group) => (
      <div key={group.key} className="flex flex-col gap-1">
        <p className="flex items-center gap-2 px-3 font-pixel text-[12px] text-muted-foreground">
          <span aria-hidden="true" className={cn('size-1.5 rounded-full', GROUP_DOT[group.key])} />
          {group.label}
        </p>
        <ul className="flex flex-col gap-0.5 text-[15px]">
          {group.chapters.map((chapter) => {
            const Icon = chapterMeta(chapter).icon;
            const active = chapter === current;
            return (
              <li key={chapter.id}>
                <a
                  href={chapterHref(chapter)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-start gap-2.5 rounded-lg px-3 py-1.5 leading-snug text-muted-foreground hover:bg-accent hover:text-foreground',
                    active && 'bg-accent font-semibold text-foreground',
                  )}
                >
                  <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', active && 'text-primary')} />
                  {chapter.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
);

const ChapterView = ({ chapter, anchor }: { chapter: GuideChapter; anchor: string | null }) => {
  const index = ORDERED_CHAPTERS.indexOf(chapter);
  const prev = ORDERED_CHAPTERS[index - 1];
  const next = ORDERED_CHAPTERS[index + 1];
  const meta = chapterMeta(chapter);
  const Icon = meta.icon;

  return (
    <article>
      <header className={cn('relative overflow-hidden rounded-2xl px-6 py-7 sm:px-8 sm:py-9', BAND_CLASS)}>
        <img
          src={spriteUrl(meta.pokemon)}
          alt=""
          width={96}
          height={96}
          className="pixelated pointer-events-none absolute -right-2 -bottom-3 size-28 opacity-90 drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] sm:right-4 sm:size-36"
        />
        <div className="relative flex flex-col gap-3 pr-24 sm:pr-40">
          <p className="flex items-center gap-2 font-pixel text-[12px] text-white/75">
            설명서
            <span aria-hidden="true">›</span>
            {GROUP_LABELS[meta.group]}
          </p>
          <h1 className="flex items-center gap-3 text-[28px] leading-tight font-extrabold tracking-tight md:text-[38px]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 md:size-12">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            {chapter.title}
          </h1>
          {chapter.sections.length > 0 && (
            <nav aria-label="이 장에서" className="mt-1 flex flex-wrap gap-2">
              {chapter.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    'rounded-full bg-white/12 px-3 py-1 text-[13px] font-semibold text-white/90 hover:bg-white/20 hover:text-white',
                    anchor === section.id && 'bg-white text-brand-deep hover:bg-white hover:text-brand-deep',
                  )}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* 우리 저장소 마크다운에서 만든 HTML — 바깥 입력 없음 */}
      <div className="guide-prose mt-8" dangerouslySetInnerHTML={{ __html: chapter.html }} />

      <nav aria-label="이전·다음 장" className="mt-14 grid gap-3 sm:grid-cols-2">
        {prev ? <PagerLink chapter={prev} direction="prev" /> : <span className="hidden sm:block" />}
        {next && <PagerLink chapter={next} direction="next" />}
      </nav>
    </article>
  );
};

const PagerLink = ({ chapter, direction }: { chapter: GuideChapter; direction: 'prev' | 'next' }) => {
  const Icon = chapterMeta(chapter).icon;
  return (
    <a
      href={chapterHref(chapter)}
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-border bg-card px-5 py-4 hover:bg-accent',
        direction === 'next' && 'items-end text-right',
      )}
    >
      <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground">
        {direction === 'prev' && <ArrowLeft aria-hidden="true" className="size-3.5" />}
        {direction === 'prev' ? '이전' : '다음'}
        {direction === 'next' && <ArrowRight aria-hidden="true" className="size-3.5" />}
      </span>
      <span className="inline-flex items-center gap-2 font-bold">
        <Icon aria-hidden="true" className="size-4 text-primary" />
        {chapter.title}
      </span>
    </a>
  );
};
