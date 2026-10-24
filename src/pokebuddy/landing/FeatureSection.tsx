import { ArrowRight } from 'lucide-react';

import { cn } from '../../shared/lib/cn';
import { GUIDE_URL } from '../site/links';
import { FEATURES, type Feature, type FeatureDot } from './content';

const DOT_CLASS: Record<FeatureDot, string> = {
  care: 'bg-dot-care',
  egg: 'bg-dot-egg',
  evolve: 'bg-dot-evolve',
  battle: 'bg-dot-battle',
  friends: 'bg-dot-friends',
};

/** 기능 소개 — 글과 그림을 좌우 번갈아 배치 */
export const FeatureSection = () => (
  <section id="features" className="scroll-mt-6 px-4 py-20 sm:px-6 md:py-24">
    <div className="mx-auto flex max-w-[1120px] flex-col gap-20 md:gap-30">
      {FEATURES.map((feature, index) => (
        <FeatureRow key={feature.id} feature={feature} reversed={index % 2 === 1} />
      ))}
    </div>
  </section>
);

interface FeatureRowProps {
  feature: Feature;
  reversed: boolean;
}

const FeatureRow = ({ feature, reversed }: FeatureRowProps) => (
  <article className={cn('grid items-center gap-8 md:gap-16', reversed ? 'md:grid-cols-[3fr_2fr]' : 'md:grid-cols-[2fr_3fr]')}>
    <div className={cn('flex flex-col gap-4', reversed && 'md:order-2')}>
      <span className="inline-flex items-center gap-2 font-pixel text-[13px] text-muted-foreground">
        <span aria-hidden="true" className={cn('size-2 rounded-full', DOT_CLASS[feature.dot])} />
        {feature.label}
      </span>
      <h2 className="text-[26px] leading-snug font-extrabold tracking-tight md:text-4xl">{feature.title}</h2>
      <p className="leading-relaxed text-muted-foreground">{feature.body}</p>
      <a href={GUIDE_URL} className="inline-flex items-center gap-1 self-start font-bold text-primary hover:text-primary-hover">
        공략에서 자세히
        <ArrowRight aria-hidden="true" className="size-4" />
      </a>
    </div>
    {/* 캡처 원본 크기보다 키우지 않음 — 칸이 더 넓으면 가운데 정렬 */}
    <div className={cn('flex justify-center', reversed && 'md:order-1')}>
      <img
        src={feature.capture.src}
        alt={feature.capture.alt}
        width={feature.capture.width}
        height={feature.capture.height}
        loading="lazy"
        className="block h-auto w-full rounded-2xl border border-border shadow-[0_24px_48px_rgba(26,51,48,0.1)]"
        style={{ maxWidth: feature.capture.width }}
      />
    </div>
  </article>
);
