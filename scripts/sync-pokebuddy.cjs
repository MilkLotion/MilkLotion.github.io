// pokebuddy 저장소의 웹 파일을 public/pokebuddy/ 로 복사 — 설명서·교환·배틀 페이지 수동 반영용
// - 원본은 pokebuddy 저장소: docs/guide.md(설명서) · site/trade · site/battle. 여기서 고치지 않고 원본 수정 후 다시 실행
// - 설명서는 pokebuddy 저장소의 scripts/build-guide-site.cjs 로 생성
// - trade/·battle/ 주소는 앱이 만든 공유 링크가 쓰므로 경로 유지
// 실행: npm run sync:pokebuddy [pokebuddy 저장소 경로, 기본 ../2.pokebuddy/pokebuddy]
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.resolve(ROOT, process.argv[2] || '../2.pokebuddy/pokebuddy');
const OUT = path.join(ROOT, 'public', 'pokebuddy');

if (!fs.existsSync(path.join(SOURCE, 'docs', 'guide.md'))) {
  process.stderr.write(`pokebuddy 저장소를 찾지 못함: ${SOURCE}\n`);
  process.exit(1);
}

for (const page of ['trade', 'battle']) {
  fs.mkdirSync(path.join(OUT, page), { recursive: true });
  fs.copyFileSync(path.join(SOURCE, 'site', page, 'index.html'), path.join(OUT, page, 'index.html'));
}

// 이전 설명서 그림이 남지 않게 비우고 다시 생성
fs.rmSync(path.join(OUT, 'guide'), { recursive: true, force: true });
execFileSync(process.execPath, [path.join(SOURCE, 'scripts', 'build-guide-site.cjs'), path.join(OUT, 'guide')], { stdio: 'inherit' });
