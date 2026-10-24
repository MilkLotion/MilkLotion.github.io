/**
 * 친구 교환·친선 배틀 링크 쪽 공통 동작 — pokebuddy/trade · pokebuddy/battle 의 index.html
 * - 주소: https://milklotion.github.io/pokebuddy/{trade|battle}#<토큰>. 토큰은 # 뒤라 서버 기록에 남지 않음
 * - 열자마자 pokebuddy://{trade|battle}/<토큰> 으로 설치한 앱을 엶. 단추는 브라우저가 막았을 때 다시 누르는 길
 * - React 없이 DOM 만 — 앱으로 넘기는 시점을 늦추지 않으려고
 * - 바깥 스크립트·글꼴·추적 없음 (Pretendard CDN 도 쓰지 않음 — 시스템 글꼴)
 */
import '../../shared/styles/globals.css';

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

const run = () => {
  const kind = document.body.dataset.kind;
  if (kind !== 'trade' && kind !== 'battle') return;

  let token = '';
  try {
    token = decodeURIComponent(window.location.hash.slice(1));
  } catch (error) {
    // 깨진 % 표기는 잘못된 링크로 봄
    console.error(error);
  }

  if (!TOKEN_PATTERN.test(token)) {
    byId('bad')?.removeAttribute('hidden');
    return;
  }

  const link = `${window.location.origin}${window.location.pathname}#${token}`;
  const deep = `pokebuddy://${kind}/${token}`;

  byId('ok')?.removeAttribute('hidden');
  byId<HTMLAnchorElement>('open')?.setAttribute('href', deep);
  const input = byId<HTMLInputElement>('link');
  if (input) input.value = link;
  const cli = byId('cli');
  if (cli) cli.textContent = `pokebuddy ${kind} ${link}`;

  const copyButton = byId<HTMLButtonElement>('copy');
  copyButton?.addEventListener('click', () => {
    const done = () => {
      copyButton.textContent = '복사됨';
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(done, () => input?.select());
    } else {
      input?.select();
    }
  });

  window.location.href = deep;
};

run();
