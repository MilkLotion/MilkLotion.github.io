import { useSyncExternalStore } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/ui/tabs';
import { POPULAR } from '../data/popular.generated';
import { SiteFooter } from '../site/SiteFooter';
import { SiteHeader } from '../site/SiteHeader';
import { MovesTab } from './MovesTab';
import { PopularTab } from './PopularTab';
import { TrainersTab } from './TrainersTab';

type TabKey = 'popular' | 'moves' | 'trainers';

/** 인기 순위는 주간 집계 파일이 있을 때만 */
const TABS: { key: TabKey; label: string }[] = [
  ...(POPULAR ? [{ key: 'popular' as const, label: '인기 포켓몬' }] : []),
  { key: 'moves', label: '기술' },
  { key: 'trainers', label: 'AI 트레이너' },
];

const DEFAULT_TAB: TabKey = TABS[0]!.key;

const isTabKey = (value: string): value is TabKey => TABS.some((tab) => tab.key === value);

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

const getTab = (): TabKey => {
  const hash = window.location.hash.slice(1);
  return isTabKey(hash) ? hash : DEFAULT_TAB;
};

/**
 * `/pokebuddy/dex/` 배틀 도감 — 앱 데이터(pokebuddy data/*.json) 그대로
 * - 탭은 주소 해시(#moves · #trainers)와 맞춤 — 링크로 바로 열 수 있게
 * - 인기 포켓몬: 사용자가 주마다 뽑는 집계(_reference/battle-stats/) — 파일이 없으면 탭 없음
 */
export const DexPage = () => {
  const tab = useSyncExternalStore(subscribe, getTab, () => DEFAULT_TAB);

  // 탭을 바꾸면 주소 해시도 — 뒤로 가기로 앞 탭에 돌아감
  const handleTabChange = (value: string) => {
    if (isTabKey(value)) window.location.hash = value;
  };

  return (
    <>
      <SiteHeader tone="light" current="dex" />
      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pt-8 pb-24 sm:px-6">
        <h1 className="text-[30px] leading-tight font-extrabold tracking-tight md:text-4xl">배틀 도감</h1>
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.key} value={item.key}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {POPULAR && (
            <TabsContent value="popular">
              <PopularTab stats={POPULAR} />
            </TabsContent>
          )}
          <TabsContent value="moves">
            <MovesTab />
          </TabsContent>
          <TabsContent value="trainers">
            <TrainersTab />
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </>
  );
};
