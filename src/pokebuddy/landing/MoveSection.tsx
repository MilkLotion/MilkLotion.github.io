import { cn } from '../../shared/lib/cn';
import { MOVE_PREVIEWS, type MovePreview, type TypeKey } from './content';

const TYPE_DOT: Record<TypeKey, string> = {
  electric: 'bg-type-electric',
  fighting: 'bg-type-fighting',
  grass: 'bg-type-grass',
};

/**
 * 도감 맛보기 — 기술 카드 3장
 * - 도감 페이지가 생기면 카드를 기술 상세(`/pokebuddy/dex/#move/<id>`)로 잇고 "도감 열기" 추가
 */
export const MoveSection = () => (
  <section className="px-4 pb-20 sm:px-6 md:pb-30">
    <div className="mx-auto flex max-w-[1120px] flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-[26px] leading-snug font-extrabold tracking-tight md:text-4xl">기술 하나까지 다 찾아볼 수 있어요</h2>
        <p className="text-muted-foreground">위력, 명중, 대기 시간, 쓰는 포켓몬까지 게임 데이터 그대로예요.</p>
      </div>
      <ul className="grid items-stretch gap-4 md:grid-cols-3">
        {MOVE_PREVIEWS.map((move) => (
          <li key={move.id} className="flex">
            <MoveCard move={move} />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const MoveCard = ({ move }: { move: MovePreview }) => (
  <article className="flex w-full flex-col gap-3.5 rounded-2xl border border-border bg-card p-5.5">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-[19px] font-extrabold">{move.name}</h3>
      <span className="inline-flex h-6.5 items-center gap-1.5 rounded-full bg-muted px-2.5 text-[13px]">
        <span aria-hidden="true" className={cn('size-2 rounded-full', TYPE_DOT[move.type])} />
        {move.typeLabel}
      </span>
    </div>
    <dl className="grid grid-cols-3 gap-2 font-pixel">
      <Stat label="위력" value={String(move.power)} />
      <Stat label="명중" value={String(move.accuracy)} />
      <Stat label="대기" value={`${move.cooldown}초`} />
    </dl>
    <p className="text-sm text-muted-foreground">{move.note}</p>
  </article>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-[11px] text-muted-foreground">{label}</dt>
    <dd className="text-xl font-bold">{value}</dd>
  </div>
);
