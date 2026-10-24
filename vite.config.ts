import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

import { portfolioCopyReview } from './copy-review';

/** `public/` 안의 정적 페이지 폴더 — GitHub Pages 처럼 폴더 주소로 열림 */
const PUBLIC_PAGE_DIRS = /^\/pokebuddy\/(guide|trade|battle)\/?(\?.*)?$/;

/**
 * 개발 서버 전용 폴더 주소 보정
 * - Vite 개발 서버는 public 폴더 주소(`/pokebuddy/trade/`)를 index.html 로 이어주지 않아 404
 * - 빌드 결과는 파일 그대로라 배포에선 불필요
 */
const publicPageDirs = (): Plugin => ({
  name: 'public-page-dirs',
  apply: 'serve',
  configureServer(server) {
    // @types/node 미설치라 IncomingMessage 에 url 이 안 잡힘 — 쓰는 필드만 직접 선언
    server.middlewares.use((req: { url?: string }, _res, next) => {
      const match = req.url?.match(PUBLIC_PAGE_DIRS);
      if (match) req.url = `/pokebuddy/${match[1]}/index.html${match[2] ?? ''}`;
      next();
    });
  },
});

// 사용자 사이트(MilkLotion.github.io) 배포 — 하위 경로 없이 루트 사용
// - 페이지별 진입 HTML: `/` 메인 · `/whoami/` 포트폴리오 · `/pokebuddy/` pokebuddy 소개
// - pokebuddy 의 guide·trade·battle 은 `public/pokebuddy/` 정적 파일 그대로 복사
// - appType 'mpa': 없는 주소를 메인으로 돌리지 않음 — GitHub Pages 처럼 404
export default defineConfig({
  base: '/',
  appType: 'mpa',
  // tailwindcss: 공통 디자인 시스템(src/shared/styles/globals.css)을 import 한 페이지에만 적용
  plugins: [publicPageDirs(), portfolioCopyReview(), tailwindcss(), react()],
  build: {
    rolldownOptions: {
      // 경로는 프로젝트 루트 기준 — npm 스크립트는 루트에서 실행
      input: {
        home: 'index.html',
        whoami: 'whoami/index.html',
        pokebuddy: 'pokebuddy/index.html',
      },
    },
  },
});
