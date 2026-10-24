import { DEX_URL, GUIDE_URL, PATCH_NOTES_URL } from './links';
import { REPO_URL } from './release';

const FOOTER_LINKS = [
  { href: REPO_URL, label: 'GitHub' },
  { href: `${REPO_URL}#라이선스`, label: '그림 출처와 라이선스' },
  { href: GUIDE_URL, label: '공략' },
  { href: DEX_URL, label: '도감' },
  { href: PATCH_NOTES_URL, label: '패치노트' },
  { href: '/', label: 'milklotion.github.io' },
] as const;

/**
 * 푸터 — 권리 고지
 * - 문구는 pokebuddy 저장소 docs/design.md "권리와 배포" 기준. 임의로 줄이지 않음
 */
export const SiteFooter = () => (
  <footer className="border-t border-border px-4 pt-10 pb-14 sm:px-6">
    <div className="mx-auto flex max-w-[1120px] flex-col gap-4 text-[13px] leading-relaxed text-muted-foreground">
      <nav aria-label="바닥 링크" className="flex flex-wrap gap-x-5 gap-y-2">
        {FOOTER_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-primary hover:text-primary-hover">
            {link.label}
          </a>
        ))}
      </nav>
      <p>
        pokebuddy 는 팬이 만든 비공식 앱이에요. Nintendo · Creatures Inc. · GAME FREAK inc. · The Pokémon Company 와 제휴하지
        않았어요.
        <br />
        포켓몬의 권리는 Nintendo · Creatures Inc. · GAME FREAK inc. 에 있어요.
      </p>
      {/* 걷는 그림 저작자 표시 — 종별 기여자는 public/pokebuddy/sprites/<도감>/credits.txt */}
      <p>
        걷는 포켓몬 그림:{' '}
        <a href="https://sprites.pmdcollab.org/" className="text-primary hover:text-primary-hover">
          PMDCollab SpriteCollab
        </a>{' '}
        (CC BY-NC 4.0)
      </p>
    </div>
  </footer>
);
