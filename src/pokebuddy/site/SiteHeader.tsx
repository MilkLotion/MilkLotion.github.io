import { cn } from '../../shared/lib/cn';
import { Button } from '../../shared/ui/button';
import { DEX_URL, GUIDE_URL, IMAGE_BASE, LANDING_URL, PATCH_NOTES_URL } from './links';
import { REPO_URL } from './release';

type NavKey = 'about' | 'guide' | 'dex' | 'patch';

/** GitHub 마크 — lucide 1.x 에서 브랜드 아이콘이 빠져 직접 그림 */
const GithubMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

interface SiteHeaderProps {
  /**
   * - `dark`: 랜딩 히어로의 짙은 배경 위 — 배경 없음
   * - `light`: 설명서 등 바탕색 쪽 — 위에 붙는 불투명 줄 (blur 없음)
   */
  tone?: 'dark' | 'light';
  /** 지금 보고 있는 메뉴 — tonal 배경으로 표시 */
  current?: NavKey;
}

/**
 * pokebuddy 상단 줄 — 랜딩·설명서 공통
 * - 같은 쪽 안 주소(`#features`)는 랜딩에서만 짧게, 다른 쪽에선 랜딩 주소를 붙임
 */
export const SiteHeader = ({ tone = 'dark', current }: SiteHeaderProps) => {
  const onLanding = tone === 'dark';
  const landing = onLanding ? '' : LANDING_URL;
  const links: { key: NavKey; href: string; label: string }[] = [
    { key: 'about', href: `${landing}#features`, label: '소개' },
    { key: 'guide', href: GUIDE_URL, label: '공략' },
    { key: 'dex', href: DEX_URL, label: '도감' },
    { key: 'patch', href: PATCH_NOTES_URL, label: '패치노트' },
  ];
  const ghost = onLanding ? 'onDarkGhost' : 'ghost';

  const inner = (
    <div className="mx-auto flex h-18 w-full max-w-[1240px] items-center gap-6">
      <a
        href={LANDING_URL}
        className={cn('flex items-center gap-2.5 text-[19px] font-extrabold', onLanding ? 'text-white' : 'text-foreground')}
      >
        <img src={`${IMAGE_BASE}/logo.svg`} alt="" width={30} height={30} />
        pokebuddy
      </a>
      <nav aria-label="주 메뉴" className="hidden flex-1 justify-center gap-1 md:flex">
        {links.map((link) => (
          <Button
            key={link.key}
            asChild
            variant={ghost}
            size="sm"
            className={cn(link.key === current && (onLanding ? 'bg-white/10 text-white' : 'bg-accent'))}
          >
            <a href={link.href} aria-current={link.key === current ? 'page' : undefined}>
              {link.label}
            </a>
          </Button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-1 md:ml-0">
        {current !== 'guide' && (
          <Button asChild variant={ghost} size="sm" className="md:hidden">
            <a href={GUIDE_URL}>공략</a>
          </Button>
        )}
        <Button asChild variant={ghost} size="icon">
          <a href={REPO_URL} aria-label="GitHub 저장소">
            <GithubMark />
          </a>
        </Button>
        <Button asChild variant={onLanding ? 'onDark' : 'default'} size="sm" className="ml-1">
          <a href={`${landing}#download`}>받기</a>
        </Button>
      </div>
    </div>
  );

  if (onLanding) return <header>{inner}</header>;

  return <header className="sticky top-0 z-30 border-b border-border bg-background px-4 sm:px-6">{inner}</header>;
};
