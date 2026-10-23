/**
 * 메인 인입 페이지 — 갈래 안내만 둔 [임시] 구성
 * - 모션그래픽 자기소개는 [스펙 미확정], 확정되면 이 화면을 대체
 */
export const HomePage = () => (
  <main className="home">
    <h1 className="home__name">노현수</h1>
    <nav className="home__links" aria-label="페이지">
      <a href="/whoami/">whoami</a>
      <a href="/pokebuddy/">pokebuddy</a>
      <a href="https://github.com/MilkLotion" target="_blank" rel="noreferrer">GitHub ↗</a>
    </nav>
  </main>
);
