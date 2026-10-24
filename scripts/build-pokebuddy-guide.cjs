// pokebuddy 웹 가이드 만들기 — pokebuddy 저장소의 docs/guide.md 를 설명서 쪽(/pokebuddy/guide/)이 읽는 장별 데이터로 바꾼다
// - 출력: src/pokebuddy/guide/guide.generated.ts (장마다 제목·본문 HTML·소제목) + public/pokebuddy/guide/images/ (그림)
// - 화면은 src/pokebuddy/guide/GuidePage.tsx — 랜딩과 같은 헤더·토큰, 장 단위 보기
// - ## 제목 하나가 한 장. 첫 ## 앞(저장소 문서 안내)은 웹에 싣지 않음
// - pokebuddy 저장소 scripts/build-guide-site.cjs 에서 옮겨 옴 (2026-10-24 웹 페이지를 이 저장소로 통합)
// - 원본은 pokebuddy 저장소 docs/guide.md 하나뿐이다. 웹 가이드만 고치지 않는다 (2026-10-10 사용자 "설치부터 전부")
// - 자동 연동 없음 — 설명서가 바뀌면 손으로 다시 실행해 커밋한다 (2026-10-24 사용자 결정)
// - guide.md 가 쓰는 마크다운만 다룬다: 제목 #~####(목차에는 ##·### 만), 문단, 목록(-, 1. 두 칸 들여쓰기), 표, 그림, 인라인 코드·링크·굵게, HTML 주석
// - 상대 링크(specs/…·contributing/…·../README.md)는 GitHub 저장소 주소로, 그림은 images/ 로 복사하고 원본 크기를 적는다
// - 새 패키지 없이 node 기본 모듈만 쓴다
// 실행: npm run sync:pokebuddy [pokebuddy 저장소 경로, 기본 ../2.pokebuddy/pokebuddy]
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// pokebuddy 저장소 — 그림·설명서 원본 위치
const SOURCE = path.resolve(ROOT, process.argv[2] || '../2.pokebuddy/pokebuddy');
const SRC = path.join(SOURCE, 'docs', 'guide.md');
const OUT_IMAGES = path.join(ROOT, 'public', 'pokebuddy', 'guide', 'images');
const OUT_DATA = path.join(ROOT, 'src', 'pokebuddy', 'guide', 'guide.generated.ts');
// 웹에서 그림 주소 — 장 주소(#…)와 상관없이 같은 곳
const IMAGE_URL = '/pokebuddy/guide/';
const REPO = 'https://github.com/MilkLotion/pokebuddy';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// GitHub 과 같은 제목 앵커 — 소문자, 문장 부호 빼기, 빈칸은 -
const slug = (s) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');

const images = new Set();

// PNG 머리(IHDR)에서 원본 크기 — 그림을 원본보다 키우지 않으려고 씀
function pngSize(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString('ascii', 1, 4) !== 'PNG') throw new Error(`PNG 아님: ${file}`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// 링크 주소 — 저장소 안 상대 경로는 GitHub 주소로. 같은 쪽 앵커와 바깥 주소는 그대로
function href(url) {
  if (/^(https?:|mailto:|#)/.test(url)) return url;
  const [file, hash] = url.split('#');
  const abs = path.posix.normalize(path.posix.join('docs', file));
  if (abs === 'docs/guide.md') return hash ? `#${hash}` : '#';
  return `${REPO}/blob/main/${abs}${hash ? `#${hash}` : ''}`;
}

// 인라인 — 코드 조각을 먼저 떼어 두고, 그림·링크·굵게를 바꾼 뒤 되돌린다
function inline(text) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    images.add(src);
    const { width, height } = pngSize(path.join(SOURCE, 'docs', src));
    return `<img src="${IMAGE_URL}${src}" alt="${alt}" width="${width}" height="${height}" style="max-width:${width}px" loading="lazy">`;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const to = href(url.replace(/&amp;/g, '&'));
    const outside = /^https?:/.test(to) ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${esc(to)}"${outside}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codeHtml(codes[Number(i)]));
}

// 인라인 코드 — 한글이 든 것과 ✕·◀·?·‹ › 같은 기호 단추는 앱 화면의 단추·탭 이름이라 칩으로, 나머지(경로·명령)는 코드로
function codeHtml(text) {
  const isUiLabel = /[가-힣]/.test(text) || /^[^\p{L}\p{N}]{1,3}$/u.test(text);
  return isUiLabel ? `<span class="ui-label">${esc(text)}</span>` : `<code>${esc(text)}</code>`;
}

// 그림만 있는 줄 → 그림 + 캡션(대체 글). 좁은 그림(메뉴 등)은 넓은 화면에서 글 옆으로
const NARROW_FIGURE_PX = 420;
function figureHtml(line) {
  const [, alt, src] = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
  const { width } = pngSize(path.join(SOURCE, 'docs', src));
  const narrow = width <= NARROW_FIGURE_PX ? ' class="is-narrow"' : '';
  return `<figure${narrow}>${inline(line)}${alt ? `<figcaption>${esc(alt)}</figcaption>` : ''}</figure>`;
}

// ### 절마다 한 덩어리로 감쌈 — 화면에서 절이 카드처럼 나뉘게. 첫 ### 앞은 장 도입부
function wrapSections(html) {
  const [intro, ...parts] = html.split(/\n(?=<h3 )/);
  if (intro.startsWith('<h3 ')) parts.unshift(intro);
  const lead = intro.startsWith('<h3 ') ? '' : `<div class="guide-intro">\n${intro}\n</div>\n`;
  return lead + parts.map((part) => `<section class="guide-block">\n${part}\n</section>`).join('\n');
}

// 표 한 줄 — 앞뒤 | 를 떼고 \| 는 글자로 둔다
const cells = (line) => line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

// ### 하나하나를 따로 한 장으로 나누는 ## — 팁은 공략마다 한 쪽 (2026-10-25 사용자 "팁도 다 페이지 분리해")
// - 나뉜 장은 group 에 원래 ## id 를 적음. ## 바로 아래 도입 문단은 버림
const SPLIT_CHAPTERS = new Set(['팁']);

// 장 나누기 — ## 마다 새 장. 본문은 그 장의 out 에 쌓고, 첫 ## 앞은 버림
function render(md) {
  const lines = md.replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '').split('\n');
  const chapters = [];
  let out = [];
  let title = 'pokebuddy';
  // 지금 나누는 중인 ## id (SPLIT_CHAPTERS)
  let splitting = null;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      const id = slug(text);
      if (level === 1) title = text;
      else if (level === 2) {
        out = [];
        splitting = SPLIT_CHAPTERS.has(id) ? id : null;
        if (!splitting) chapters.push({ id, title: text, sections: [], out });
      } else if (level === 3 && splitting) {
        out = [];
        chapters.push({ id, title: text, sections: [], out, group: splitting });
      } else {
        if (level === 3 && chapters.length) chapters[chapters.length - 1].sections.push({ id, title: text });
        out.push(`<h${level} id="${esc(id)}">${inline(text)}</h${level}>`);
      }
      i += 1;
      continue;
    }
    // 표 — 머리 줄 다음이 --- 구분 줄
    if (line.trim().startsWith('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      out.push('<div class="table"><table><thead><tr>' + head.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    // 목록 — 들여쓰기 두 칸마다 한 단계. 이어지는 줄은 앞 항목에 붙인다
    if (/^\s*(-|\d+\.)\s+/.test(line)) {
      const stack = [];
      while (i < lines.length && lines[i].trim() && !/^#{1,4}\s/.test(lines[i]) && !lines[i].trim().startsWith('|')) {
        const m = /^(\s*)(-|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (!m) {
          out.push(` ${inline(lines[i].trim())}`);
          i += 1;
          continue;
        }
        const depth = Math.floor(m[1].length / 2);
        const tag = m[2] === '-' ? 'ul' : 'ol';
        while (stack.length > depth + 1) out.push(`</li></${stack.pop()}>`);
        if (stack.length === depth + 1) {
          if (stack[depth] !== tag) { out.push(`</li></${stack.pop()}>`); out.push(`<${tag}>`); stack.push(tag); }
          else out.push('</li>');
        } else while (stack.length < depth + 1) { out.push(`<${tag}>`); stack.push(tag); }
        out.push(`<li>${inline(m[3])}`);
        i += 1;
      }
      while (stack.length) out.push(`</li></${stack.pop()}>`);
      continue;
    }
    // 그림만 있는 줄
    if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(line.trim())) {
      out.push(figureHtml(line.trim()));
      i += 1;
      continue;
    }
    // 문단 — 빈 줄·제목·목록·표 앞까지 이어 붙인다
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^#{1,4}\s/.test(lines[i]) && !/^\s*(-|\d+\.)\s+/.test(lines[i]) && !lines[i].trim().startsWith('|')) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return {
    title,
    chapters: chapters.map(({ id, title: chapterTitle, sections, out: body, group }) => ({
      id,
      title: chapterTitle,
      ...(group ? { group } : {}),
      sections,
      html: wrapSections(body.join('\n')),
    })),
  };
}

function main() {
  const { title, chapters } = render(fs.readFileSync(SRC, 'utf8'));
  const ts = `// 만든 파일 — 고치지 말 것. 원본은 pokebuddy 저장소 docs/guide.md, 만드는 곳은 scripts/build-pokebuddy-guide.cjs (npm run sync:pokebuddy)
import type { GuideChapter } from './guideTypes';

export const GUIDE_TITLE = ${JSON.stringify(title)};

export const GUIDE_CHAPTERS: GuideChapter[] = ${JSON.stringify(chapters, null, 2)};
`;
  fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });
  fs.writeFileSync(OUT_DATA, ts);
  // 이전 설명서 그림이 남지 않게 비우고 다시 복사 (images/ 아래만)
  fs.rmSync(OUT_IMAGES, { recursive: true, force: true });
  for (const src of images) {
    const from = path.join(SOURCE, 'docs', src);
    if (!fs.existsSync(from)) throw new Error(`그림 없음: docs/${src}`);
    const to = path.join(OUT_IMAGES, '..', src);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
  process.stdout.write(`웹 가이드: ${path.relative(ROOT, OUT_DATA)} · 장 ${chapters.length}개 · 그림 ${images.size}개\n`);
}

main();

