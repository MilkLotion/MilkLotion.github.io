import { useState } from 'react';

import { cn } from '../../shared/lib/cn';
import { TRAINERS } from '../data/trainers.generated';
import type { PartyPokemon, PokemonType, TrainerInfo, TrainerLevel } from '../data/dataTypes';
import { spriteUrl } from '../site/links';
import { TYPE_KO } from '../site/pokemonTypes';
import { TypeIcon } from '../site/TypeIcon';

/** 난이도 — 앱 표기 상·중·하 + 챔피언 (data/battle-samples.json level) */
const LEVELS: { key: TrainerLevel; label: string }[] = [
  { key: 'champion', label: '챔피언' },
  { key: 'hard', label: '상' },
  { key: 'normal', label: '중' },
  { key: 'easy', label: '하' },
];

const LEVEL_LABEL = Object.fromEntries(LEVELS.map((level) => [level.key, level.label])) as Record<TrainerLevel, string>;

/** 파티 유형 — battle-samples.json kind. 한 타입·날씨 파티는 subtitleOf 에서 주제를 붙임 */
const KIND_KO: Record<string, string> = {
  'type-cover': '밸런스형 파티',
  offense: '공격형 파티',
  bulk: '버티기형 파티',
  legend: '전설 포켓몬 파티',
  champion: '챔피언 파티',
};

/** 날씨 이름 — 원작 표기 */
const WEATHER_KO: Record<string, string> = { sun: '쾌청', rain: '비', sand: '모래바람', snow: '설경' };

/** 카드 아래 한 줄 — 챔피언은 지방, 나머지는 파티 유형 */
const subtitleOf = (trainer: TrainerInfo) => {
  if (trainer.region) return `${trainer.region}지방 챔피언`;
  if (trainer.kind === 'type-concept' && trainer.theme) return `${TYPE_KO[trainer.theme as PokemonType]} 타입 파티`;
  if (trainer.kind === 'weather' && trainer.theme) return `${WEATHER_KO[trainer.theme]} 파티`;
  return KIND_KO[trainer.kind] ?? '';
};

/**
 * 랜덤 배틀 AI 트레이너 파티 — 서버가 상대가 없을 때 내보내는 샘플 파티
 * - 칸 배치: 2·4·6번 앞 열(상대와 마주봄) · 1·3·5번 뒤 열. 화면에서 앞 열을 위 줄로
 */
export const TrainersTab = () => {
  const [level, setLevel] = useState<TrainerLevel | null>(null);
  const list = TRAINERS.filter((trainer) => !level || trainer.level === level);

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label="난이도" className="flex w-fit gap-1 rounded-full bg-accent p-1">
        <LevelButton active={level === null} onClick={() => setLevel(null)} label="전체" />
        {LEVELS.map((item) => (
          <LevelButton key={item.key} active={level === item.key} onClick={() => setLevel(item.key)} label={item.label} />
        ))}
      </div>
      <ul className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((trainer) => (
          <li key={trainer.id} className="flex">
            <TrainerCard trainer={trainer} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const LevelButton = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn('h-8 cursor-pointer rounded-full px-4 text-sm text-muted-foreground', active && 'bg-card font-semibold text-foreground')}
  >
    {label}
  </button>
);

const TrainerCard = ({ trainer }: { trainer: TrainerInfo }) => {
  // 칸 번호 1~6 → 앞 열(2·4·6) 위, 뒤 열(1·3·5) 아래
  const front = [1, 3, 5].map((index) => trainer.party[index]);
  const back = [0, 2, 4].map((index) => trainer.party[index]);
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-[17px] font-extrabold">{trainer.name}</h3>
          <p className="text-[13px] text-muted-foreground">{subtitleOf(trainer)}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 font-pixel text-[12px]',
            trainer.level === 'champion' ? 'bg-primary text-primary-foreground' : 'bg-accent',
          )}
        >
          {LEVEL_LABEL[trainer.level]}
        </span>
      </header>
      <div className="flex flex-col gap-2">
        <PartyRow label="앞 열" members={front} />
        <PartyRow label="뒤 열" members={back} />
      </div>
    </article>
  );
};

const PartyRow = ({ label, members }: { label: string; members: (PartyPokemon | undefined)[] }) => (
  <div className="flex flex-col gap-1.5">
    <span className="font-pixel text-[11px] text-muted-foreground">{label}</span>
    <ul className="grid grid-cols-3 gap-2">
      {members.map((member, index) =>
        member ? (
          <li key={`${member.id}-${index}`} className="flex flex-col items-center gap-1 rounded-xl bg-accent/70 px-1 pt-1 pb-2 text-center">
            <img src={spriteUrl(member.pokemonId)} alt="" width={96} height={96} loading="lazy" className="pixelated size-16" />
            <span className="text-[12px] leading-tight font-semibold">{member.ko}</span>
            <span className="flex gap-1">
              {member.types.map((type) => (
                <TypeIcon key={type} type={type} />
              ))}
            </span>
          </li>
        ) : (
          <li key={`empty-${index}`} className="rounded-xl bg-accent/40" />
        ),
      )}
    </ul>
  </div>
);
