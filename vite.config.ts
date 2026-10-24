import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

import { portfolioCopyReview } from './copy-review';

/** 끝 `/` 없이 여는 pokebuddy 하위 쪽 — 앱이 `/pokebuddy/trade#…` 꼴로 엶 */
const SLASHLESS_PAGE = /^\/pokebuddy\/(guide|trade|battle|patch-notes|dex)(\?.*)?$/;

/**
 * 개발 서버 전용 폴더 주소 보정
 * - GitHub Pages 는 `/pokebuddy/trade` 를 `/pokebuddy/trade/` 로 넘겨 주지만 Vite 개발 서버는 404
 */
const slashlessPages = (): Plugin => ({
  name: 'slashless-pages',
  apply: 'serve',
  configureServer(server) {
    // @types/node 미설치라 IncomingMessage 에 url 이 안 잡힘 — 쓰는 필드만 직접 선언
    server.middlewares.use((req: { url?: string }, _res, next) => {
      const match = req.url?.match(SLASHLESS_PAGE);
      if (match) req.url = `/pokebuddy/${match[1]}/${match[2] ?? ''}`;
      next();
    });
  },
});

// 사용자 사이트(MilkLotion.github.io) 배포 — 하위 경로 없이 루트 사용
// - 페이지별 진입 HTML: `/` 메인 · `/whoami/` 포트폴리오 · `/pokebuddy/` pokebuddy 소개
// - pokebuddy 하위 쪽: `/pokebuddy/guide/` 설명서 · `/pokebuddy/patch-notes/` 패치노트 · `/pokebuddy/dex/` 배틀 도감
//   · `/pokebuddy/trade/` · `/pokebuddy/battle/` 링크 쪽 (주소 변경 금지)
// - appType 'mpa': 없는 주소를 메인으로 돌리지 않음 — GitHub Pages 처럼 404
export default defineConfig({
  base: '/',
  appType: 'mpa',
  // tailwindcss: 공통 디자인 시스템(src/shared/styles/globals.css)을 import 한 페이지에만 적용
  plugins: [slashlessPages(), portfolioCopyReview(), tailwindcss(), react()],
  build: {
    rolldownOptions: {
      // 경로는 프로젝트 루트 기준 — npm 스크립트는 루트에서 실행
      input: {
        home: 'index.html',
        whoami: 'whoami/index.html',
        pokebuddy: 'pokebuddy/index.html',
        pokebuddyGuide: 'pokebuddy/guide/index.html',
        pokebuddyTrade: 'pokebuddy/trade/index.html',
        pokebuddyBattle: 'pokebuddy/battle/index.html',
        pokebuddyPatchNotes: 'pokebuddy/patch-notes/index.html',
        pokebuddyDex: 'pokebuddy/dex/index.html',
      },
    },
  },
});
