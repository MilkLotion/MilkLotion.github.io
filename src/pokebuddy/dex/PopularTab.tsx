import { cn } from '../../shared/lib/cn';
import type { PopularPokemon, PopularStats } from '../data/dataTypes';
import { spriteUrl } from '../site/links';
import { TypeBadge } from '../site/TypeBadge';

/** 보여 줄 순위 수 */
const TOP = 30;

const percent = (value: number, total: number) => (total ? Math.round((value / total) * 1000) / 10 : 0);

/**
 * 배틀 인기 포켓몬 — 주간 집계 (사용자가 주마다 갱신)
 * - 사용률 = 그 포켓몬이 든 파티 수 ÷ 센 파티 수
 *   - AI 판은 사람 쪽만 세서 배틀 × 2 가 아님 → 파티는 늘 6칸이라 전체 사용 횟수 ÷ 6
 * - 승률 = 이긴 판 ÷ 쓴 판
 */
export const PopularTab = ({ stats }: { stats: PopularStats }) => {
  const parties = stats.pokemon.reduce((sum, pokemon) => sum + pokemon.uses, 0) / 6;
  const list = stats.pokemon.slice(0, TOP);
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        <span className="font-pixel">
          {stats.from} ~ {stats.to}
        </span>{' '}
        · 배틀 <span className="font-pixel">{stats.battles.toLocaleString('ko-KR')}</span>판 기준 · AI 트레이너 파티 제외
      </p>
      <ol className="grid gap-3 md:grid-cols-2">
        {list.map((pokemon, index) => (
          <li key={pokemon.id}>
            <PopularRow pokemon={pokemon} rank={index + 1} parties={parties} />
          </li>
        ))}
      </ol>
    </div>
  );
};

const PopularRow = ({ pokemon, rank, parties }: { pokemon: PopularPokemon; rank: number; parties: number }) => {
  const usage = percent(pokemon.uses, parties);
  const winRate = percent(pokemon.wins, pokemon.uses);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full font-pixel text-[15px]',
          rank <= 3 ? 'bg-primary text-primary-foreground' : 'bg-accent',
        )}
      >
        {rank}
      </span>
      <img src={spriteUrl(pokemon.pokemonId)} alt="" width={96} height={96} loading="lazy" className="pixelated size-16 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold">{pokemon.ko}</span>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </span>
        {/* 사용률 막대 — 1위 대비가 아니라 실제 비율 */}
        <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
            <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.min(usage, 100)}%` }} />
          </span>
          <span className="w-24 shrink-0 text-right">
            사용률 <span className="font-pixel text-foreground">{usage}%</span>
          </span>
        </span>
        <span className="text-[12px] text-muted-foreground">
          승률 <span className="font-pixel text-foreground">{winRate}%</span> · {pokemon.wins}승 {pokemon.losses}패
          {pokemon.draws > 0 && ` ${pokemon.draws}무`}
        </span>
      </div>
    </div>
  );
};
