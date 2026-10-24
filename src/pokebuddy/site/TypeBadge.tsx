import { cn } from '../../shared/lib/cn';
import type { PokemonType } from '../data/dataTypes';
import { TYPE_KO } from './pokemonTypes';
import { TypeIcon } from './TypeIcon';

/** 타입 표시 — 타입 아이콘 + 이름, tonal 배경 (컬러 테두리 없음) */
export const TypeBadge = ({ type, className }: { type: PokemonType; className?: string }) => (
  <span
    className={cn('inline-flex h-6 items-center gap-1.5 rounded-full bg-accent pr-2.5 pl-1 text-[12px] font-semibold whitespace-nowrap', className)}
  >
    <TypeIcon type={type} decorative />
    {TYPE_KO[type]}
  </span>
);
