import { ChevronDown, Search } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';

import { cn } from '../../shared/lib/cn';
import { MOVES } from '../data/moves.generated';
import type { MoveClass, MoveInfo, PokemonType } from '../data/dataTypes';
import { TYPE_KO, TYPE_ORDER } from '../site/pokemonTypes';
import { TypeBadge } from '../site/TypeBadge';
import { TypeIcon } from '../site/TypeIcon';

const CLASS_KO: Record<MoveClass, string> = { physical: '물리', special: '특수', status: '변화' };

type SortKey = 'name' | 'power' | 'cooldown' | 'users';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'users', label: '많이 쓰는 순' },
  { key: 'power', label: '위력 높은 순' },
  { key: 'cooldown', label: '대기 짧은 순' },
  { key: 'name', label: '이름 순' },
];

const totalUsers = (move: MoveInfo) => move.users.base + move.users.candidate + move.users.mega;

/** 한 타 위력 × 타수 — 정렬용 */
const powerOf = (move: MoveInfo) => (move.power ?? -1) * (move.hits ? move.hits[1]! : 1);

const COMPARE: Record<SortKey, (a: MoveInfo, b: MoveInfo) => number> = {
  name: (a, b) => a.ko.localeCompare(b.ko, 'ko'),
  power: (a, b) => powerOf(b) - powerOf(a),
  cooldown: (a, b) => (a.cooldown ?? Infinity) - (b.cooldown ?? Infinity),
  users: (a, b) => totalUsers(b) - totalUsers(a),
};

const cooldownText = (move: MoveInfo) => (move.cooldown === null ? '—' : `${move.cooldown}초`);

const powerText = (move: MoveInfo) => {
  if (move.power === null) return '—';
  if (!move.hits) return String(move.power);
  const [min, max] = move.hits;
  return `${move.power}×${min === max ? min : `${min}~${max}`}`;
};

/** 앱 데이터의 기술 목록 — 검색 · 타입 · 분류 · 정렬. 줄을 누르면 설명 */
export const MovesTab = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<PokemonType | null>(null);
  const [moveClass, setMoveClass] = useState<MoveClass | null>(null);
  const [sort, setSort] = useState<SortKey>('users');
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOVES.filter(
      (move) =>
        (!type || move.type === type) &&
        (!moveClass || move.class === moveClass) &&
        (!q || move.ko.includes(q) || move.en.toLowerCase().includes(q)),
    ).sort(COMPARE[sort]);
  }, [query, type, moveClass, sort]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-background px-4 sm:max-w-xs">
            <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="기술 이름"
              aria-label="기술 이름 검색"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
          <div role="group" aria-label="분류" className="flex gap-1 rounded-full bg-accent p-1">
            {(['physical', 'special', 'status'] as MoveClass[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={moveClass === key}
                onClick={() => setMoveClass(moveClass === key ? null : key)}
                className={cn(
                  'h-8 cursor-pointer rounded-full px-3.5 text-sm text-muted-foreground',
                  moveClass === key && 'bg-card font-semibold text-foreground',
                )}
              >
                {CLASS_KO[key]}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="정렬"
            className="h-10 cursor-pointer rounded-full border border-border bg-background px-4 text-sm"
          >
            {SORTS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div role="group" aria-label="타입" className="flex flex-wrap gap-1.5">
          {TYPE_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={type === key}
              onClick={() => setType(type === key ? null : key)}
              className={cn(
                'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full pr-2.5 pl-1.5 text-[12px] text-muted-foreground hover:bg-accent',
                type === key && 'bg-accent font-semibold text-foreground',
              )}
            >
              <TypeIcon type={key} decorative />
              {TYPE_KO[key]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-pixel">{list.length}</span>개 · 줄을 누르면 설명이 보여요
      </p>

      {/* 넓은 화면: 표 */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-[13px]">
            <tr>
              <th className="px-4 py-3 font-bold">기술</th>
              <th className="px-3 py-3 font-bold">타입</th>
              <th className="px-3 py-3 font-bold">분류</th>
              <th className="px-3 py-3 text-right font-bold">위력</th>
              <th className="px-3 py-3 text-right font-bold">명중</th>
              <th className="px-3 py-3 text-right font-bold">대기</th>
              <th className="px-3 py-3 font-bold">효과</th>
              <th className="px-4 py-3 text-right font-bold">쓰는 종</th>
            </tr>
          </thead>
          <tbody>
            {list.map((move) => {
              const open = openId === move.id;
              return (
                <Fragment key={move.id}>
                  <tr
                    onClick={() => setOpenId(open ? null : move.id)}
                    className={cn('cursor-pointer border-t border-border hover:bg-accent/60', open && 'bg-accent/60')}
                  >
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1.5 font-semibold">
                        {move.ko}
                        <ChevronDown aria-hidden="true" className={cn('size-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <TypeBadge type={move.type} />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{CLASS_KO[move.class]}</td>
                    <td className="px-3 py-2.5 text-right font-pixel">{powerText(move)}</td>
                    <td className="px-3 py-2.5 text-right font-pixel">{move.accuracy ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right font-pixel">{cooldownText(move)}</td>
                    <td className="max-w-[260px] px-3 py-2.5 text-[13px] text-muted-foreground">{move.effect || '—'}</td>
                    <td className="px-4 py-2.5 text-right font-pixel">{totalUsers(move)}</td>
                  </tr>
                  {open && (
                    <tr className="bg-accent/60">
                      <td colSpan={8} className="px-4 pt-0 pb-4">
                        <MoveDetail move={move} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 좁은 화면: 카드 */}
      <ul className="flex flex-col gap-2 md:hidden">
        {list.map((move) => {
          const open = openId === move.id;
          return (
            <li key={move.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : move.id)}
                aria-expanded={open}
                className="flex w-full cursor-pointer flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold">{move.ko}</span>
                  <TypeBadge type={move.type} />
                </span>
                <span className="grid grid-cols-4 gap-2 text-center text-[12px] text-muted-foreground">
                  <MiniStat label="분류" value={CLASS_KO[move.class]} />
                  <MiniStat label="위력" value={powerText(move)} />
                  <MiniStat label="명중" value={String(move.accuracy ?? '—')} />
                  <MiniStat label="대기" value={cooldownText(move)} />
                </span>
                {move.effect && <span className="text-[13px] text-muted-foreground">{move.effect}</span>}
                {open && <MoveDetail move={move} />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <span className="flex flex-col gap-0.5 rounded-lg bg-accent py-1.5">
    {label}
    <span className="font-pixel text-[13px] text-foreground">{value}</span>
  </span>
);

const MoveDetail = ({ move }: { move: MoveInfo }) => (
  <span className="flex flex-col gap-2 pt-2 text-[13px] leading-relaxed">
    {move.text && <span>{move.text}</span>}
    <span className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
      <span>{move.en}</span>
      {move.priority !== 0 && <span>선공 {move.priority > 0 ? `+${move.priority}` : move.priority}</span>}
      {move.contact && <span>접촉</span>}
      <span>
        기본 기술 {move.users.base}종 · 후보 {move.users.candidate}종 · 메가 {move.users.mega}종
      </span>
    </span>
  </span>
);
