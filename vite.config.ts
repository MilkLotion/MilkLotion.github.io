import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { portfolioCopyReview } from './copy-review';

// 사용자 사이트(MilkLotion.github.io) 배포 — 하위 경로 없이 루트 사용
export default defineConfig({
  base: '/',
  plugins: [portfolioCopyReview(), react()],
});
