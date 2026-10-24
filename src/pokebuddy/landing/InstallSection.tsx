import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/ui/tabs';
import { INSTALL_STEPS } from './content';
import { detectPlatform } from '../site/release';

type InstallTab = keyof typeof INSTALL_STEPS;

const TAB_LABELS: Record<InstallTab, string> = { windows: 'Windows', mac: 'Mac' };

/** 설치 안내 — 서명·공증이 없어 처음 한 번 뜨는 경고 넘기는 법. 방문자 OS 탭을 먼저 염 */
export const InstallSection = () => {
  const [defaultTab] = useState<InstallTab>(() => (detectPlatform()?.startsWith('mac') ? 'mac' : 'windows'));

  return (
    <section className="px-4 pb-20 sm:px-6 md:pb-30">
      <div className="mx-auto grid max-w-[1120px] gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-[26px] leading-snug font-extrabold tracking-tight md:text-4xl">설치</h2>
          <p className="text-muted-foreground">코드 서명이 없어서 처음 한 번은 경고가 떠요. 이렇게 넘기면 돼요.</p>
        </div>
        <Tabs defaultValue={defaultTab}>
          <TabsList aria-label="운영체제">
            {(Object.keys(INSTALL_STEPS) as InstallTab[]).map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {TAB_LABELS[tab]}
              </TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(INSTALL_STEPS) as InstallTab[]).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <ol className="flex flex-col gap-3">
                {INSTALL_STEPS[tab].map((step, index) => (
                  <li key={step} className="flex gap-4 rounded-2xl border border-border bg-card px-5 py-4.5">
                    <span className="font-pixel font-bold text-primary">{index + 1}</span>
                    <span className="break-words [overflow-wrap:anywhere]">{step}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
