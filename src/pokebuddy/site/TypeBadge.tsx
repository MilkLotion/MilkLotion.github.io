import { cn } from '../../shared/lib/cn';
import type { PokemonType } from '../data/dataTypes';
import { TYPE_DOT, TYPE_KO } from './pokemonTypes';

/** 타입 표시 — 색 dot + 이름, tonal 배경 (컬러 테두리 없음) */
export const TypeBadge = ({ type, className }: { type: PokemonType; className?: string }) => (
  <span
    className={cn('inline-flex h-6 items-center gap-1.5 rounded-full bg-accent px-2.5 text-[12px] font-semibold whitespace-nowrap', className)}
  >
    <span aria-hidden="true" className={cn('size-2 rounded-full', TYPE_DOT[type])} />
    {TYPE_KO[type]}
  </span>
);
