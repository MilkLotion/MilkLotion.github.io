import { cn } from '../../shared/lib/cn';
import type { PokemonType } from '../data/dataTypes';
import { IMAGE_BASE } from './links';
import { TYPE_BG, TYPE_KO } from './pokemonTypes';

/**
 * 타입 아이콘 — 앱과 같은 모양: 타입 색 네모 + 흰 타입 그림
 * - 그림: PokeAPI sprites 9세대 작은 타입 아이콘에서 바탕을 뺀 흰 그림 (앱 src/main/art/type-icon-art.ts 와 같은 방식)
 * - 크기: 보통 16px(그림 14) · 큰 것 20px(그림 18) — 앱 type-badge.css
 */
interface TypeIconProps {
  type: PokemonType;
  size?: 'md' | 'lg';
  /** 옆에 타입 이름 글자가 있으면 true — 화면 낭독이 두 번 읽지 않게 */
  decorative?: boolean;
  className?: string;
}

export const TypeIcon = ({ type, size = 'md', decorative = false, className }: TypeIconProps) => (
  <span
    {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': TYPE_KO[type], title: TYPE_KO[type] })}
    className={cn(
      'inline-flex shrink-0 items-center justify-center',
      size === 'md' ? 'size-4 rounded-[3px]' : 'size-5 rounded-[4px]',
      TYPE_BG[type],
      className,
    )}
  >
    <img
      src={`${IMAGE_BASE}/types/${type}.png`}
      alt=""
      width={60}
      height={60}
      className={cn('pixelated', size === 'md' ? 'size-3.5' : 'size-[18px]')}
    />
  </span>
);
