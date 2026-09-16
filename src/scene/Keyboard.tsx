import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExplodeLayer } from './ExplodeLayer';
import { LAYER_OFFSETS, type ExplodeStage } from './explodeStages';
import { GlareBottomCase, GlareTopFrame, GlareWeight } from './GlareCase';
import { FRONT_HEIGHT, KEY_TRAVEL, TYPING_ANGLE_RAD } from './glareTkl';
import { Keycap } from './Keycap';
import {
  FOCUS_SWITCH_CODE,
  FOCUS_SWITCH_POSITION,
  FRONT_EDGE_Z,
  getKeyCenter,
  KEYCAP_BASE_Y,
  LOCAL_UP,
  TILT_NORMAL,
} from './keyboardFrame';
import { Pcb, Plate } from './KeyboardInternals';
import { getKeycapStyle } from './lazurite';
import { MxSwitch } from './MxSwitch';
import { Stabilizers } from './Stabilizers';
import { SwitchField } from './SwitchField';
import { TKL_KEY_CODES, TKL_KEYS } from './tklLayout';

type PressedCodes = ReadonlySet<string>;

const NO_PRESSED_CODES: PressedCodes = new Set();

/** 이미 반영된 상태면 같은 참조 반환 — 불필요한 재렌더 방지 */
const withCode = (code: string) => (prev: PressedCodes) => (prev.has(code) ? prev : new Set(prev).add(code));

const withoutCode = (code: string) => (prev: PressedCodes) => {
  if (!prev.has(code)) return prev;
  const next = new Set(prev);
  next.delete(code);
  return next;
};

/** 배치·스타일은 정적 — 모듈에서 한 번 계산해 Keycap memo 가 참조를 유지하게 함 */
const KEYBOARD_KEYS = TKL_KEYS.map((key) => {
  const [x, z] = getKeyCenter(key);
  return { ...key, style: getKeycapStyle(key.code), position: [x, KEYCAP_BASE_Y, z] as [number, number, number] };
});

interface KeyboardProps {
  stage: ExplodeStage;
  /** 자동 입력이 누르고 있는 키 — 사용자 입력과 합쳐 표시 */
  autoPressedCode: string | null;
}

export const Keyboard = ({ stage, autoPressedCode }: KeyboardProps) => {
  const [pressedCodes, setPressedCodes] = useState<PressedCodes>(NO_PRESSED_CODES);

  const press = useCallback((code: string) => setPressedCodes(withCode(code)), []);
  const release = useCallback((code: string) => setPressedCodes(withoutCode(code)), []);

  // 표시용 집합 — 사용자 입력 상태는 건드리지 않고 자동 입력 키만 얹음
  const activeCodes = useMemo(
    () => (autoPressedCode === null ? pressedCodes : withCode(autoPressedCode)(pressedCodes)),
    [pressedCodes, autoPressedCode],
  );

  // 물리 키보드 입력 구독 — 외부 이벤트 소스라 Effect 로 연결
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || !TKL_KEY_CODES.has(event.code)) return;
      press(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      release(event.code);
    };

    // Alt+Tab 등으로 포커스가 나가면 keyup 을 못 받아 키가 눌린 채 남음 — 전체 해제
    const handleBlur = () => {
      setPressedCodes(NO_PRESSED_CODES);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [press, release]);

  const offsets = LAYER_OFFSETS[stage];

  return (
    <group position={[0, 0, FRONT_EDGE_Z]}>
      {/* 하판·무게추 — 책상 좌표계, 분해 방향은 윗면 법선 */}
      <ExplodeLayer offset={offsets.weight} direction={TILT_NORMAL}>
        <GlareWeight />
      </ExplodeLayer>

      <ExplodeLayer offset={offsets.bottomCase} direction={TILT_NORMAL}>
        <GlareBottomCase />
      </ExplodeLayer>

      {/* 나머지 — 윗면 좌표계, 원점이 윗면 앞 모서리 */}
      <group position={[0, FRONT_HEIGHT, 0]} rotation={[TYPING_ANGLE_RAD, 0, 0]}>
        {/* 스태빌라이저는 PCB 나사 고정식이라 기판과 함께 이동 */}
        <ExplodeLayer offset={offsets.pcb} direction={LOCAL_UP}>
          <Pcb />
          <Stabilizers pressedCodes={activeCodes} />
        </ExplodeLayer>

        <ExplodeLayer offset={offsets.plate} direction={LOCAL_UP}>
          <Plate />
        </ExplodeLayer>

        <ExplodeLayer offset={offsets.switches} direction={LOCAL_UP}>
          <SwitchField pressedCodes={activeCodes} />
          <MxSwitch
            position={FOCUS_SWITCH_POSITION}
            isExploded={stage === 3}
            isPressed={activeCodes.has(FOCUS_SWITCH_CODE)}
          />
        </ExplodeLayer>

        <ExplodeLayer offset={offsets.topCase} direction={LOCAL_UP}>
          <GlareTopFrame />
        </ExplodeLayer>

        <ExplodeLayer offset={offsets.keycaps} direction={LOCAL_UP}>
          {KEYBOARD_KEYS.map((key) => (
            <Keycap
              key={key.code}
              code={key.code}
              widthU={key.width}
              row={key.row}
              style={key.style}
              position={key.position}
              travel={KEY_TRAVEL}
              isPressed={activeCodes.has(key.code)}
              onPress={press}
              onRelease={release}
            />
          ))}
        </ExplodeLayer>
      </group>
    </group>
  );
};
