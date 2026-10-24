/**
 * 랜딩 문구·데이터
 * - 사실 근거: pokebuddy 저장소 main 9b09e840 (앱 0.22.1) 코드·data/*.json, docs/guide.md
 * - 앱 캡처 원본은 _reference/captures/ (공개 저장소 밖). 쓰는 것만 public/pokebuddy/images/ 로 복사
 */

import { IMAGE_BASE } from '../site/links';

export interface Capture {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** 히어로 캡처 — 앱처럼 설정창 오른쪽에 상세 창을 위쪽 맞춰 틈 없이 붙임 */
export const HERO_CAPTURES: Capture[] = [
  {
    src: `${IMAGE_BASE}/01-hero-settings.png`,
    alt: '설정창 파티 탭 — 피카츄, 리자몽, 개굴닌자, 이브이, 루카리오, 님피아',
    width: 640,
    height: 682,
  },
  {
    src: `${IMAGE_BASE}/01-hero-detail.png`,
    alt: '피카츄 상세 창 — 밥 주기, 놀아주기, 친밀도·만복도·심심함',
    width: 380,
    height: 573,
  },
];

export type FeatureDot = 'care' | 'egg' | 'evolve' | 'battle' | 'friends';

export interface Feature {
  id: string;
  dot: FeatureDot;
  label: string;
  title: string;
  body: string;
  capture: Capture;
}

/** 캡처는 2026-10-24 Windows · 앱 0.22.1 (pokebuddy 세션이 로컬 계정으로 촬영) */
export const FEATURES: Feature[] = [
  {
    id: 'care',
    dot: 'care',
    label: '돌보기',
    title: '밥 주기와 놀아주기, 두 가지면 돼요',
    body: '포켓몬을 우클릭하면 밥 주기와 놀아주기가 나와요. 배가 고프면 말풍선이 뜨지만, 무시해도 친밀도는 깎이지 않아요. 파티에 있는 포켓몬은 시간이 지나면 포인트를 모아요.',
    capture: { src: `${IMAGE_BASE}/02-care-menu.png`, alt: '이브이 우클릭 메뉴 — 밥 주기, 놀아주기, 볼에 넣기, 상세 보기', width: 520, height: 380 },
  },
  {
    id: 'egg',
    dot: 'egg',
    label: '알',
    title: '포인트로 알을 사고, 직접 깨요',
    body: '알은 돌보미집에서 준비 시간을 채운 뒤 열어요. 어떤 포켓몬이 나올지는 열어 봐야 알아요.',
    capture: { src: `${IMAGE_BASE}/03-egg-daycare.png`, alt: '돌보미집 — 부화 준비가 끝난 알과 열기 단추', width: 640, height: 682 },
  },
  {
    id: 'evolve',
    dot: 'evolve',
    label: '진화',
    title: '조건을 채우면 직접 진화시켜요',
    body: '파티에 두면 시간이 지나며 레벨이 올라요. 레벨, 친밀도, 진화 도구, 낮과 밤 같은 조건을 채우면 알림이 오고, 진화는 직접 눌러요. 갈래가 여럿이면 어느 쪽으로 갈지 골라요.',
    capture: { src: `${IMAGE_BASE}/04-evolve.png`, alt: '이브이 진화 창 — 샤미드·에브이·님피아 등 8갈래와 조건', width: 1084, height: 746 },
  },
  {
    id: 'battle',
    dot: 'battle',
    label: '배틀',
    title: '파티를 짜서 배틀해요',
    body: '배틀은 6대6으로 자동으로 싸우는 실시간 배틀이에요. 모두 레벨 50으로 맞추고, 기술은 대기 시간이 돌아오면 바로 써요. 그날 첫 랜덤 배틀은 500P, 그 뒤로는 이기면 50P를 받아요.',
    capture: { src: `${IMAGE_BASE}/05-battle.png`, alt: '랜덤 배틀 화면 — 6대6 자동 배틀과 피해 기록', width: 1116, height: 615 },
  },
  {
    id: 'friends',
    dot: 'friends',
    label: '친구와 함께',
    title: '친구와 교환하고 배틀해요',
    body: '교환 링크를 만들어 친구에게 보내면 포켓몬을 한 마리씩 바꿔요. 친선 배틀도 링크로 걸어요. 교환과 친선 배틀은 로그인한 계정으로 해요.',
    capture: { src: `${IMAGE_BASE}/06-trade.png`, alt: '친구 교환 화면 — 내 피카츄와 친구의 이브이', width: 640, height: 682 },
  },
];

export const INSTALL_STEPS = {
  windows: [
    '설치 파일(pokebuddy-Setup-버전.exe)을 실행해요.',
    '"Windows의 PC 보호" 창이 뜨면 추가 정보를 누른 뒤 실행을 눌러요. 코드 서명이 없어서 처음 한 번 떠요.',
    '묻지 않고 바로 설치돼요. 관리자 권한은 필요 없어요. 설치가 끝나면 첫 포켓몬 선택 창이 떠요.',
  ],
  mac: [
    'Apple 실리콘은 arm64, Intel 은 x64 dmg 를 열고 PokeBuddy 를 응용 프로그램 폴더로 끌어 넣어요.',
    '"Apple 이 확인할 수 없음" 경고가 뜨면 시스템 설정 → 개인정보 보호 및 보안에서 그래도 열기를 눌러요.',
    '"손상되었기 때문에 열 수 없습니다"가 뜨면 터미널에서 xattr -dr com.apple.quarantine /Applications/PokeBuddy.app 을 실행한 뒤 다시 열어요.',
  ],
} as const;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    id: 'time',
    question: '게임 시간은 언제 흘러요?',
    answer: '앱이 켜져 있을 때만 흘러요. PC 를 잠그거나 절전하거나 앱을 끄면 멈추고, 멈춘 시간을 나중에 몰아서 주지 않아요.',
  },
  {
    id: 'login',
    question: '로그인해야 하나요?',
    answer: '아니요. 로그인하지 않으면 앱이 익명 계정을 만들어 저장해요. 교환, 친선 배틀, 우편 선물 받기는 로그인한 계정만 할 수 있어요. 로그인은 아이디·비밀번호나 GitHub 로 해요.',
  },
  {
    id: 'save',
    question: '저장은 어디에 돼요?',
    answer: 'PC 의 앱 데이터 폴더에 저장돼요. Windows 는 AppData\\Roaming\\pokebuddy, Mac 은 ~/Library/Application Support/pokebuddy 예요. 앱을 지웠다 다시 깔아도 파티와 포인트가 남아요.',
  },
  {
    id: 'cover',
    question: '포켓몬이 다른 창을 가리면요?',
    answer: '포켓몬이 없는 곳을 누르면 뒤의 창이 그대로 눌려요. 포켓몬 위까지 뒤 창을 누르고 싶으면 트레이 메뉴에서 고스트 모드를 켜고, 잠깐 치우고 싶으면 잠시 숨기기를 눌러요. 숨긴 동안에도 시간은 흘러요.',
  },
];
