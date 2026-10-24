import { Button } from '../../shared/ui/button';
import { GUIDE_URL, IMAGE_BASE } from './content';
import { REPO_URL, RELEASES_URL } from './release';

const NAV_LINKS = [
  { href: '#features', label: '소개' },
  { href: GUIDE_URL, label: '공략' },
  { href: RELEASES_URL, label: '패치노트' },
] as const;

/** GitHub 마크 — lucide 1.x 에서 브랜드 아이콘이 빠져 직접 그림 */
const GithubMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

/**
 * pokebuddy 상단 줄 — 히어로 짙은 배경 위에 얹힘
 * - 도감은 페이지가 생기면 메뉴에 추가
 */
export const SiteHeader = () => (
  <header className="mx-auto flex h-18 w-full max-w-[1240px] items-center gap-6">
    <a href="/pokebuddy/" className="flex items-center gap-2.5 text-[19px] font-extrabold text-white">
      <img src={`${IMAGE_BASE}/logo.svg`} alt="" width={30} height={30} />
      pokebuddy
    </a>
    <nav aria-label="주 메뉴" className="hidden flex-1 justify-center gap-1 md:flex">
      {NAV_LINKS.map((link) => (
        <Button key={link.href} asChild variant="onDarkGhost" size="sm">
          <a href={link.href}>{link.label}</a>
        </Button>
      ))}
    </nav>
    <div className="ml-auto flex items-center gap-1 md:ml-0">
      <Button asChild variant="onDarkGhost" size="sm" className="md:hidden">
        <a href={GUIDE_URL}>공략</a>
      </Button>
      <Button asChild variant="onDarkGhost" size="icon">
        <a href={REPO_URL} aria-label="GitHub 저장소">
          <GithubMark />
        </a>
      </Button>
      <Button asChild variant="onDark" size="sm" className="ml-1">
        <a href="#download">받기</a>
      </Button>
    </div>
  </header>
);
