import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

import { FRAME_MS, SHEET_ROWS, type PmdSprite } from '../pmdSprites';
import { createBrain, type Brain, type Play, type Point, type RoamBox } from './brain';

/**
 * 포켓몬 무대 — 앱의 무대 창(stage) 역할. 앱이 바탕화면 전체를 쓰듯 보이는 화면 전체를 씀
 * - 무대 = 화면에 고정된 fixed 층. 스크롤과 상관없이 포켓몬은 화면 위 그 자리에 머묾
 * - 좌표는 화면(뷰포트) px. 끌어서 놓을 수 있는 범위도 화면 전체
 * - 한 마리마다 brain(판단) 하나 + 그림 칸 하나. 매 프레임 DOM 스타일만 바꿈 — React 렌더 없음
 * - 스스로는 자기 "줄" 높이를 따라 화면 너비 안에서 좌우로만 걸음
 *   - 처음 줄: 페이지 맨 위에서 본 히어로 캡처(anchor) 윗변 높이. 스크롤 위치와 무관. 화면보다 낮으면 화면 아래 끝
 *   - 놓은 뒤: 놓은 높이
 */

/** 이보다 덜 움직이고 떼면 클릭 */
const CLICK_SLOP_PX = 4;
/** 걷는 줄의 좌우 여백 (px) */
const LANE_GUTTER_PX = 16;
/**
 * 프레임 중심이 발보다 얼마나 위인지 (원본 도트 px)
 * - PMD 프레임은 동작마다 칸 크기가 달라도 몸 중심이 칸 가운데
 * - 피카츄·리자몽·이브이·루카리오 실측 약 6px
 */
const CENTER_ABOVE_FEET = 6;
/** brain 이 동작을 정하지 않았을 때(서 있기) 그림 */
const IDLE_FRONT: Play = { anim: 'Idle', row: 0, mode: 'loop', rate: 1 };

interface PetStageProps {
  sprites: PmdSprite[];
  /** 처음 자리 (기준 요소 너비 대비 0~1) — sprites 순서 */
  starts: number[];
  /** 도트 배율 — 앱 크기 단계(1 · 1.5 · 2 · 2.5 · 3) 중 하나 */
  zoom: number;
  /** 처음 자리의 기준 — 페이지를 열었을 때 이 요소의 윗변 */
  anchorRef: RefObject<HTMLElement | null>;
}

interface Pet {
  sprite: PmdSprite;
  brain: Brain;
  box: HTMLDivElement;
  frameEl: HTMLDivElement;
  /** 그림 칸 크기 — 가진 동작 중 가장 큰 칸 */
  w: number;
  h: number;
  /** 걷는 줄 높이 (pos.y, 화면 기준) */
  laneY: number;
  shown: { play: Play | null; frame: number; elapsed: number };
}

interface Grab {
  pet: Pet;
  pointerId: number;
  lastX: number;
  lastY: number;
  /** 누른 곳과 몸 중심의 차이 — 집은 자리 그대로 끌려오게 */
  offset: Point;
  moved: number;
  picked: boolean;
}

const cellOf = (sprite: PmdSprite, zoom: number) => {
  const anims = Object.values(sprite.anims);
  return { w: Math.max(...anims.map((a) => a.fw)) * zoom, h: Math.max(...anims.map((a) => a.fh)) * zoom };
};

export const PetStage = ({ sprites, starts, zoom, anchorRef }: PetStageProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const petsRef = useRef<Pet[]>([]);
  const grabRef = useRef<Grab | null>(null);

  const feet = CENTER_ABOVE_FEET * zoom;

  /** 화면 크기가 바뀌어도 줄이 화면 안에 남게 — 발이 화면 아래 끝을 넘지 않음 */
  const laneYIn = (pet: Pet, stage: HTMLDivElement) => Math.min(Math.max(pet.laneY, pet.h / 2), stage.clientHeight - feet);

  const roamBox = (pet: Pet, stage: HTMLDivElement): RoamBox => {
    const y = laneYIn(pet, stage);
    return {
      minX: LANE_GUTTER_PX + pet.w / 2,
      maxX: Math.max(LANE_GUTTER_PX + pet.w / 2, stage.clientWidth - LANE_GUTTER_PX - pet.w / 2),
      minY: y,
      maxY: y,
    };
  };

  const dragBox = (pet: Pet, stage: HTMLDivElement): RoamBox => ({
    minX: pet.w / 2,
    maxX: Math.max(pet.w / 2, stage.clientWidth - pet.w / 2),
    minY: pet.h / 2,
    maxY: Math.max(pet.h / 2, stage.clientHeight - feet),
  });

  useEffect(() => {
    const stage = stageRef.current;
    const anchor = anchorRef.current;
    if (!stage || !anchor) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const a = anchor.getBoundingClientRect();

    petsRef.current = sprites.map((sprite, index) => {
      const { w, h } = cellOf(sprite, zoom);
      const x = a.left + w / 2 + (starts[index] ?? 0.5) * Math.max(0, a.width - w);
      // 스크롤 위치와 상관없이 맨 위에서 열었을 때의 캡처 윗변 높이 — 스크롤한 채 새로고침해도 같은 자리
      // (브라우저가 스크롤을 되살리는 시점이 이 계산보다 앞일 수도 뒤일 수도 있어 문서 좌표로 잼)
      const laneY = Math.min(Math.max(a.top + window.scrollY - feet, h / 2), stage.clientHeight - feet);
      return {
        sprite,
        brain: createBrain({ sprite, zoom, start: { x, y: laneY }, autonomous: !reduced }),
        box: boxRefs.current[index]!,
        frameEl: frameRefs.current[index]!,
        w,
        h,
        laneY,
        shown: { play: null, frame: 0, elapsed: 0 },
      };
    });

    const paint = (pet: Pet, play: Play | null, dt: number) => {
      const shown = pet.shown;
      const current = play ?? IDLE_FRONT;
      // 동작이 바뀌면 첫 프레임부터
      if (shown.play !== play) {
        shown.play = play;
        shown.frame = 0;
        shown.elapsed = 0;
      }
      const anim = pet.sprite.anims[current.anim] ?? pet.sprite.anims.Idle;
      const last = anim.durations.length - 1;
      shown.elapsed += dt * current.rate;
      while (shown.elapsed >= anim.durations[shown.frame]! * FRAME_MS) {
        if (current.mode === 'hold' && shown.frame === last) {
          shown.elapsed = 0;
          break;
        }
        shown.elapsed -= anim.durations[shown.frame]! * FRAME_MS;
        shown.frame = (shown.frame + 1) % anim.durations.length;
      }
      const row = Math.min(current.row, SHEET_ROWS - 1);
      const style = pet.frameEl.style;
      style.width = `${anim.fw * zoom}px`;
      style.height = `${anim.fh * zoom}px`;
      style.backgroundImage = `url(${anim.src})`;
      style.backgroundSize = `${anim.durations.length * anim.fw * zoom}px ${SHEET_ROWS * anim.fh * zoom}px`;
      style.backgroundPosition = `-${shown.frame * anim.fw * zoom}px -${row * anim.fh * zoom}px`;
    };

    let last = performance.now();
    let rafId = 0;

    const loop = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      for (const pet of petsRef.current) {
        const { pos, act } = pet.brain.tick(now, roamBox(pet, stage));
        pet.box.style.transform = `translate(${pos.x - pet.w / 2}px, ${pos.y - pet.h / 2}px)`;
        // 들린 포켓몬이 맨 앞, 나머지는 아래쪽에 선 것이 앞
        pet.box.style.zIndex = grabRef.current?.pet === pet ? '100000' : String(Math.round(pos.y));
        paint(pet, act, dt);
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
    // anchorRef·roamBox 는 ref·인자만 읽어 의존성에서 뺌
  }, [sprites, starts, zoom, feet]);

  const handlePointerDown = (index: number) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const pet = petsRef.current[index];
    if (event.button !== 0 || !pet) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const pos = pet.brain.position();
    grabRef.current = {
      pet,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      offset: { x: event.clientX - pos.x, y: event.clientY - pos.y },
      moved: 0,
      picked: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const grab = grabRef.current;
    const stage = stageRef.current;
    if (!grab || !stage || grab.pointerId !== event.pointerId) return;

    grab.moved += Math.hypot(event.clientX - grab.lastX, event.clientY - grab.lastY);
    grab.lastX = event.clientX;
    grab.lastY = event.clientY;

    // 손 떨림은 클릭으로 봄 — 넘어서면 그때 집어 듦
    if (!grab.picked) {
      if (grab.moved < CLICK_SLOP_PX) return;
      grab.picked = true;
      grab.pet.brain.pickup(performance.now());
    }
    // 무대가 화면에 고정이라 화면 좌표가 곧 무대 좌표
    grab.pet.brain.drag({ x: event.clientX - grab.offset.x, y: event.clientY - grab.offset.y }, dragBox(grab.pet, stage));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const grab = grabRef.current;
    if (!grab || grab.pointerId !== event.pointerId) return;
    grabRef.current = null;

    const now = performance.now();
    if (!grab.picked) {
      grab.pet.brain.click(now);
      return;
    }
    // 놓은 높이가 새 줄
    grab.pet.laneY = grab.pet.brain.position().y;
    grab.pet.brain.drop(now);
  };

  return (
    <div ref={stageRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {sprites.map((sprite, index) => {
        const { w, h } = cellOf(sprite, zoom);
        return (
          <div
            key={sprite.dex}
            ref={(el) => {
              boxRefs.current[index] = el;
            }}
            className="pointer-events-none absolute top-0 left-0 flex items-center justify-center"
            style={{ width: w, height: h }}
          >
            <div
              ref={(el) => {
                frameRefs.current[index] = el;
              }}
              title={`${sprite.name} — 끌어서 옮길 수 있어요`}
              className="pixelated pointer-events-auto cursor-grab touch-none bg-no-repeat select-none active:cursor-grabbing"
              onPointerDown={handlePointerDown(index)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>
        );
      })}
    </div>
  );
};
