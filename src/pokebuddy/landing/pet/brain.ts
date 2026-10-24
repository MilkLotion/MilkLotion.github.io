import { animMs, type PmdAnimName, type PmdSprite } from '../pmdSprites';
import { MOTION_RULES, rowOf, type Range } from './motionRules';

/**
 * 포켓몬 한 마리의 판단 — 앱 pokebuddy src/motion/brain.ts 의 한가 모드 구조 그대로
 * - phase: rest(서 있기) · walk · look(걸어온 쪽 보기) · fidget(제자리 동작) · react(만진 반응) · held(들림)
 * - 그리기는 모름 — tick 이 돌려준 자리(pos)와 동작(act)을 PetSprite 가 그림
 * - 좌표는 무대(PetStage) 안 px. pos 는 그림 칸의 가운데
 */

export type Phase = 'rest' | 'walk' | 'look' | 'fidget' | 'react' | 'held';

export interface Play {
  anim: PmdAnimName;
  row: number;
  mode: 'loop' | 'hold';
  /** 걷기 속도 배율 — 프레임도 그만큼 빨리 넘김 */
  rate: number;
}

export interface Point {
  x: number;
  y: number;
}

/** 걸어 다닐 수 있는 범위 (pos 기준) */
export interface RoamBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface BrainOut {
  pos: Point;
  /** null 이면 정면 Idle */
  act: Play | null;
  phase: Phase;
}

interface Walk {
  from: Point;
  to: Point;
  startAt: number;
  dur: number;
  pace: number;
  /** 방향을 틀어 이어 걸을 남은 시간 */
  restMs: number;
}

const { TIMES, IDLE, WALK, MOVES, LOOK_AROUND, FIDGET_ROWS } = MOTION_RULES;

interface BrainOptions {
  sprite: PmdSprite;
  zoom: number;
  start: Point;
  /** false 면 스스로 걷거나 제자리 동작을 하지 않음 — 움직임 줄이기 설정용. 만진 반응은 함 */
  autonomous: boolean;
  rng?: () => number;
}

export const createBrain = ({ sprite, zoom, start, autonomous, rng = Math.random }: BrainOptions) => {
  const have = (name: string): name is PmdAnimName => name in sprite.anims;
  const between = ([lo, hi]: Range) => lo + rng() * (hi - lo);
  const pickOf = <T>(list: readonly T[]) => list[Math.floor(rng() * list.length)]!;
  const first = (list: readonly string[]) => list.find(have) ?? null;
  const anyOf = (list: readonly string[]) => {
    const got = list.filter(have);
    return got.length ? pickOf(got) : null;
  };
  const once = (anim: PmdAnimName) => Math.max(100, animMs(sprite.anims[anim]!));
  // 짧은 동작은 최소 길이가 될 때까지 반복 (최대 4번)
  const repeatMs = (anim: PmdAnimName) => once(anim) * Math.min(4, Math.max(1, Math.ceil(TIMES.reactMin / once(anim))));
  const play = (anim: PmdAnimName, row: number, mode: Play['mode'] = 'loop', rate = 1): Play => ({ anim, row, mode, rate });
  const speedPx = WALK.speedPxPerZoom * zoom;

  let phase: Phase = 'rest';
  let pos: Point = { ...start };
  let act: Play | null = null;
  let begun = false;
  let nextAt = 0; // 쉬는 틈이 끝나고 다음 행동을 시작할 시각
  let fidgets: number[] = []; // 쉬는 틈 안에서 제자리 동작을 할 시각들
  let until = 0; // look·fidget·react 가 끝나는 시각
  let walk: Walk | null = null;
  let lastRow = 0;
  let heldRow = 0;
  let heldUntil = 0;
  let dragAcc: Point = { x: 0, y: 0 };

  // 쉬는 틈을 열고, 그 사이 제자리 동작 시각을 칸마다 뽑음
  const startPause = (now: number) => {
    nextAt = now + between(IDLE.pause);
    fidgets = [];
    const slot = IDLE.fidget[1] + TIMES.reactMin;
    for (let at = now + IDLE.lookBack[1]; at + slot <= nextAt; at += slot) {
      if (rng() < IDLE.fidgetChance) fidgets.push(at + rng() * slot);
    }
  };

  const toRest = (now: number) => {
    phase = 'rest';
    walk = null;
    act = null;
    startPause(now);
  };

  // 목표는 범위 안 아무 데나 — 한 번은 want 만큼만 걷고 여러 번에 걸쳐 돌아다님
  const wanderTarget = (box: RoamBox, want: number): Point => {
    let best = { x: pos.x, y: pos.y, len: -1 };
    for (let i = 0; i < 4; i++) {
      const x = box.minX + rng() * (box.maxX - box.minX);
      const y = box.minY + rng() * (box.maxY - box.minY);
      const len = Math.hypot(x - pos.x, y - pos.y);
      if (len > best.len) best = { x, y, len };
      if (len >= want) break;
    }
    const k = best.len > want ? want / best.len : 1;
    return { x: pos.x + (best.x - pos.x) * k, y: pos.y + (best.y - pos.y) * k };
  };

  const startWalk = (now: number, box: RoamBox, pace: number, budgetMs: number, turns: boolean) => {
    const speed = speedPx * pace;
    const legMs = turns ? budgetMs * between([0.35, 0.65]) : budgetMs;
    const to = wanderTarget(box, (speed * legMs) / 1000);
    const dx = to.x - pos.x;
    const dy = to.y - pos.y;
    const len = Math.hypot(dx, dy);
    if (len < WALK.minStepPx) return false;
    const dur = (len / speed) * 1000;
    phase = 'walk';
    walk = { from: { ...pos }, to, startAt: now, dur, pace, restMs: turns ? budgetMs - dur : 0 };
    lastRow = rowOf(dx, dy);
    act = play('Walk', lastRow, 'loop', Math.round(pace * 100) / 100);
    return true;
  };

  const startFidget = (now: number) => {
    const pool: string[] = MOVES.fidget.filter(have);
    pool.push(LOOK_AROUND);
    const pick = pickOf(pool);
    const len = between(IDLE.fidget);
    phase = 'fidget';
    if (pick === LOOK_AROUND || !have(pick)) {
      act = play('Idle', Math.floor(rng() * 8));
      until = now + len;
    } else {
      act = play(pick, pickOf(FIDGET_ROWS));
      until = now + once(pick) * Math.max(1, Math.round(len / once(pick)));
    }
  };

  const react = (now: number, anim: PmdAnimName | null) => {
    if (!anim) return false;
    phase = 'react';
    walk = null;
    act = play(anim, 0);
    until = now + repeatMs(anim);
    return true;
  };

  const clampIn = (p: Point, box: RoamBox): Point => ({
    x: Math.min(Math.max(p.x, box.minX), box.maxX),
    y: Math.min(Math.max(p.y, box.minY), box.maxY),
  });

  const out = (): BrainOut => ({ pos: { ...pos }, act, phase });

  const tick = (now: number, box: RoamBox): BrainOut => {
    if (!begun) {
      begun = true;
      startPause(now);
    }

    // 들려 있는 동안은 손에 맡김 — 아파하는 동작이 끝나면 끄는 방향을 보며 버둥거림
    if (phase === 'held') {
      if (now >= heldUntil) {
        const anim = first(MOVES.held);
        act = anim ? play(anim, heldRow) : null;
      }
      return out();
    }

    // 무대 크기가 바뀌면 범위 안으로
    if (phase === 'walk' && walk) walk.to = clampIn(walk.to, box);
    else pos = clampIn(pos, box);

    if (phase === 'walk' && walk) {
      const t = Math.min(1, (now - walk.startAt) / walk.dur);
      pos = { x: walk.from.x + (walk.to.x - walk.from.x) * t, y: walk.from.y + (walk.to.y - walk.from.y) * t };
      if (t < 1) return out();
      const { pace, restMs } = walk;
      if (restMs >= WALK.turnMinMs && startWalk(now, box, pace, restMs, false)) return out();
      // 도착 — 걸어온 쪽을 잠깐 보고 서 있다가 정면으로
      toRest(now);
      phase = 'look';
      act = play('Idle', lastRow);
      until = now + between(IDLE.lookBack);
      return out();
    }

    if ((phase === 'look' || phase === 'fidget' || phase === 'react') && now < until) return out();
    if (phase === 'look' || phase === 'fidget') {
      phase = 'rest';
      act = null;
    } else if (phase === 'react') {
      toRest(now);
    }
    if (!autonomous) return out();

    const head = fidgets[0];
    if (head !== undefined && now >= head) {
      fidgets = fidgets.filter((at) => at > now);
      startFidget(now);
      return out();
    }
    if (now < nextAt) return out();
    if (startWalk(now, box, between(IDLE.pace), between(IDLE.walk), rng() < WALK.turn)) return out();
    // 걸을 데가 가깝다 — 제자리 동작으로 대신하고 다시 쉼
    toRest(now);
    startFidget(now);
    fidgets = fidgets.filter((at) => at > until + TIMES.reactMin);
    return out();
  };

  return {
    tick,
    position: (): Point => ({ ...pos }),
    /** 집어 들었다 — 걷기 등 무엇이든 멈추고 아파함 */
    pickup(now: number) {
      phase = 'held';
      walk = null;
      heldRow = 0;
      dragAcc = { x: 0, y: 0 };
      const anim = first(MOVES.pickup);
      act = anim ? play(anim, 0) : null;
      heldUntil = anim ? now + repeatMs(anim) : now;
    },
    /** 끄는 중 — 자리는 손(to)을 따라가고, 충분히 끌었을 때만 돌아봄 (손 떨림에 휙휙 돌지 않게) */
    drag(to: Point, box: RoamBox) {
      const next = clampIn(to, box);
      const dx = next.x - pos.x;
      const dy = next.y - pos.y;
      pos = next;
      dragAcc = { x: dragAcc.x + dx, y: dragAcc.y + dy };
      if (Math.hypot(dragAcc.x, dragAcc.y) < WALK.dragTurnPx) return;
      heldRow = rowOf(dragAcc.x, dragAcc.y);
      dragAcc = { x: 0, y: 0 };
    },
    /** 내려놓았다 — 놓은 자리에서 반응하고 쉼 */
    drop(now: number) {
      if (!react(now, first(MOVES.drop) ?? first(MOVES.reactFallback))) toRest(now);
    },
    /** 콕 찔렀다 — 걷던 중이면 그 자리에 섬 */
    click(now: number) {
      if (phase === 'held') return;
      react(now, anyOf(MOVES.click) ?? anyOf(MOVES.reactFallback));
    },
  };
};

export type Brain = ReturnType<typeof createBrain>;
