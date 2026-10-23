const REPO_URL = 'https://github.com/MilkLotion/pokebuddy';

/**
 * pokebuddy 소개 페이지 — pokebuddy 저장소 site/index.html 을 옮긴 [임시] 구성
 * - 설명서·게임 페이지 느낌의 소개는 [스펙 미확정]
 * - 권리 고지 문구는 pokebuddy 저장소 docs/design.md "권리와 배포" 기준 — 임의로 줄이지 않음
 */
export const PokebuddyPage = () => (
  <main className="pokebuddy">
    <p>
      pokebuddy — <a href="guide/">설명서와 팁</a> · <a href={REPO_URL}>github.com/MilkLotion/pokebuddy</a>
    </p>
    <p className="pokebuddy__notice">
      pokebuddy 는 팬이 만든 비공식 앱이에요. Nintendo · Creatures Inc. · GAME FREAK inc. · The Pokémon Company 와 제휴하지 않았어요.
      <br />
      포켓몬의 권리는 Nintendo · Creatures Inc. · GAME FREAK inc. 에 있어요. <a href={`${REPO_URL}#라이선스`}>그림 출처와 라이선스</a>
    </p>
  </main>
);
