import { Camera } from 'lucide-react';

import { cn } from '../../shared/lib/cn';
import { PATCH_NOTES } from '../data/patchNotes.generated';
import type { PatchImage, PatchNote } from '../data/dataTypes';
import { InlineText } from '../site/InlineText';
import { SiteFooter } from '../site/SiteFooter';
import { SiteHeader } from '../site/SiteHeader';

/**
 * `/pokebuddy/patch-notes/` 패치노트 — 앱 안 패치노트와 같은 글 + 바뀐 화면 캡처
 * - 글: pokebuddy 저장소 data/patch-notes.json · 그림: 웹 전용 (scripts/build-pokebuddy-data.cjs)
 * - 그림은 해당 줄 바로 아래. 그림 있는 버전은 왼쪽 목록에 카메라 표시
 */
export const PatchNotesPage = () => (
  <>
    <SiteHeader tone="light" current="patch" />
    <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-4 pt-8 pb-24 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">
        <nav aria-label="버전 목록" className="sticky top-26 max-h-[calc(100vh-128px)] overflow-y-auto pb-4">
          <ul className="flex flex-col gap-0.5">
            {PATCH_NOTES.map((note) => (
              <li key={note.version}>
                <a
                  href={`#v${note.version}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <span className="font-pixel text-[13px]">v{note.version}</span>
                  {note.images.length > 0 && <Camera aria-label="그림 있음" className="size-3.5 text-primary" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex min-w-0 flex-col gap-6">
        <h1 className="text-[30px] leading-tight font-extrabold tracking-tight md:text-4xl">패치노트</h1>
        {PATCH_NOTES.map((note, index) => (
          <PatchCard key={note.version} note={note} latest={index === 0} />
        ))}
      </main>
    </div>
    <SiteFooter />
  </>
);

const PatchCard = ({ note, latest }: { note: PatchNote; latest: boolean }) => (
  <article id={`v${note.version}`} className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-7">
    <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2 className="font-pixel text-[22px] font-bold">v{note.version}</h2>
      <time dateTime={note.date} className="text-sm text-muted-foreground">
        {note.date}
      </time>
      {latest && <span className="rounded-full bg-accent px-2.5 py-0.5 text-[12px] font-semibold text-primary">최신</span>}
    </header>
    <ul className="mt-5 flex flex-col gap-4">
      {note.lines.map((line, index) => {
        const images = note.images.filter((image) => image.line === index);
        return (
          <li key={line} className="flex flex-col gap-3">
            <p className="relative pl-5 leading-relaxed">
              <span aria-hidden="true" className="absolute top-[0.7em] left-1 size-1.5 rounded-full bg-primary/60" />
              <InlineText text={line} />
            </p>
            {images.length > 0 && (
              <div className={cn('flex flex-wrap gap-4 pl-5', images.length > 1 && 'items-start')}>
                {images.map((image) => (
                  <PatchFigure key={image.src} image={image} />
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  </article>
);

const PatchFigure = ({ image }: { image: PatchImage }) => (
  <figure className="flex min-w-0 flex-col gap-2" style={{ maxWidth: image.width }}>
    <img
      src={image.src}
      alt={image.alt.replace(/`/g, '')}
      width={image.width}
      height={image.height}
      loading="lazy"
      className="block h-auto w-full drop-shadow-[0_0_1px_rgba(26,51,48,0.35)] drop-shadow-[0_12px_24px_rgba(26,51,48,0.12)]"
    />
    <figcaption className="text-[13px] text-muted-foreground">
      <InlineText text={image.alt} />
      {image.now && ' · 지금 화면'}
    </figcaption>
  </figure>
);
