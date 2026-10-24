import {
  Archive,
  ArrowLeftRight,
  BookOpen,
  Bot,
  Candy,
  Coins,
  Download,
  Egg,
  FileText,
  Gem,
  Heart,
  Mail,
  Monitor,
  Settings,
  Sparkles,
  Swords,
  Trophy,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { GUIDE_CHAPTERS } from './guide.generated';
import type { GuideChapter } from './guideTypes';

/**
 * 설명서 장 꾸밈 — 아이콘 · 묶음 · 대표 포켓몬
 * - 장 id 는 guide.md ## 제목에서 나옴. 여기 없는 장은 "그 밖에" 묶음 끝에 붙고 기본 아이콘을 씀
 * - 포켓몬 번호는 PokeAPI 도감 번호 (앱 초상과 같은 출처)
 */

export type GuideGroupKey = 'start' | 'grow' | 'collect' | 'together' | 'tips' | 'etc';

interface ChapterMeta {
  icon: LucideIcon;
  group: GuideGroupKey;
  pokemon: number;
}

export const GROUP_LABELS: Record<GuideGroupKey, string> = {
  start: '시작하기',
  grow: '키우기',
  collect: '모으기와 배틀',
  together: '함께하기',
  tips: '팁',
  etc: '그 밖에',
};

/** 묶음 dot 색 — globals.css 의 기능 분류 dot */
export const GROUP_DOT: Record<GuideGroupKey, string> = {
  start: 'bg-primary',
  grow: 'bg-dot-egg',
  collect: 'bg-dot-battle',
  together: 'bg-dot-friends',
  tips: 'bg-dot-evolve',
  etc: 'bg-muted-foreground',
};

const GROUP_ORDER: GuideGroupKey[] = ['start', 'grow', 'collect', 'together', 'tips', 'etc'];

/**
 * 이 순서가 목차·이전/다음 장 순서
 * - 팁 공략은 생성기가 ### 하나하나를 장으로 나눈 것 (group '팁') — 장 id 는 ### 제목
 */
const META: Record<string, ChapterMeta> = {
  설치: { icon: Download, group: 'start', pokemon: 25 },
  '처음-시작하기': { icon: Sparkles, group: 'start', pokemon: 1 },
  '놀이공간과-포켓몬': { icon: Monitor, group: 'start', pokemon: 133 },
  돌봄: { icon: Heart, group: 'grow', pokemon: 242 },
  '포인트와-상점': { icon: Coins, group: 'grow', pokemon: 52 },
  '알과-부화': { icon: Egg, group: 'grow', pokemon: 175 },
  '성장과-진화': { icon: TrendingUp, group: 'grow', pokemon: 4 },
  '파티와-박스': { icon: Archive, group: 'collect', pokemon: 448 },
  '도감과-업적': { icon: BookOpen, group: 'collect', pokemon: 479 },
  '모험과-배틀': { icon: Swords, group: 'collect', pokemon: 6 },
  '친구-교환': { icon: ArrowLeftRight, group: 'together', pokemon: 122 },
  '계정과-우편함': { icon: Mail, group: 'together', pokemon: 225 },
  '포인트-잘-버는-법': { icon: Coins, group: 'tips', pokemon: 52 },
  '친밀도-빨리-올리는-법': { icon: Heart, group: 'tips', pokemon: 35 },
  '진화시키는-법': { icon: TrendingUp, group: 'tips', pokemon: 133 },
  '메가진화-하는-법': { icon: Gem, group: 'tips', pokemon: 448 },
  '알-고르기와-원하는-포켓몬-얻기': { icon: Egg, group: 'tips', pokemon: 175 },
  '배틀-이기는-법': { icon: Swords, group: 'tips', pokemon: 6 },
  '업적-빨리-깨기': { icon: Trophy, group: 'tips', pokemon: 479 },
  '경험치레벨-빨리-올리는-법': { icon: Candy, group: 'tips', pokemon: 143 },
  설정: { icon: Settings, group: 'etc', pokemon: 137 },
  'ai-코딩-도구-연결': { icon: Bot, group: 'etc', pokemon: 81 },
  '문제-해결': { icon: Wrench, group: 'etc', pokemon: 54 },
  '그림과-라이선스': { icon: FileText, group: 'etc', pokemon: 132 },
};

const FALLBACK: ChapterMeta = { icon: FileText, group: 'etc', pokemon: 132 };
/** 새로 생긴 팁 공략 — 여기 아직 없으면 팁 묶음 끝에 */
const TIP_FALLBACK: ChapterMeta = { icon: Sparkles, group: 'tips', pokemon: 65 };

export const chapterMeta = (chapter: GuideChapter) => META[chapter.id] ?? (chapter.group === '팁' ? TIP_FALLBACK : FALLBACK);

const metaOrder = Object.keys(META);
const orderOf = (chapter: GuideChapter) => {
  const index = metaOrder.indexOf(chapter.id);
  return index === -1 ? metaOrder.length : index;
};

/** 목차 순서로 늘어놓은 장 — 이전/다음 장도 이 순서 */
export const ORDERED_CHAPTERS = [...GUIDE_CHAPTERS].sort((a, b) => orderOf(a) - orderOf(b));

export const GUIDE_GROUPS = GROUP_ORDER.map((key) => ({
  key,
  label: GROUP_LABELS[key],
  chapters: ORDERED_CHAPTERS.filter((chapter) => chapterMeta(chapter).group === key),
})).filter((group) => group.chapters.length > 0);
