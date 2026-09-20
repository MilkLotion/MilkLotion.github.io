import { useState } from 'react';

import { FreeTypingLayer } from '../FreeTypingLayer';
import { FREE_SCREEN, INTRO_SCREEN, SCREEN_COUNT, useBacklightScreens } from '../hooks/useBacklightScreens';
import { PROJECTS_HASH } from '../hooks/useHashRoute';
import { useTypingSequence, type TypingDisplay } from '../hooks/useTypingSequence';
import { LoadingScreen } from '../LoadingScreen';
import { ResetViewButton } from '../ResetViewButton';
import { buildTypingSteps, type TypingStep } from '../scene/dubeolsikTyping';
import { KeyboardScene } from '../scene/KeyboardScene';
import { TypingCaption } from '../scene/TypingCaption';
import { ScreenDots } from '../ScreenDots';

/** 소개 화면 자동 타이핑 문장 — 노현수 자판이 ㄴ(S) ㅗ(H) … ㅜ(N) 라 이니셜 키가 함께 눌림 */
const INTRO_SENTENCE = '안녕하세요. 노현수입니다.';
/** 인사말을 다 친 뒤 이어지는 소개 */
const INTRO_DETAILS = ['키보드를 좋아하는 5년차 프론트엔드 개발자입니다.'] as const;

const GITHUB_URL = 'https://github.com/MilkLotion';

/**
 * 분해 화면 소개글 — 화면 번호(0부터)별 제목·설명
 * - 3 = 하는 일(화면·서버·배포를 두루) · 4 = 같은 코드 반복을 지양해 공통 컴포넌트를 만듦(디자인시스템) · 5 = 프로젝트로 이동
 * - 제목은 소개 화면 인사말과 같은 자동 타이핑 — 줄바꿈(\n)은 엔터로 치고, 친 글자와 완성 문장의 줄 위치가 같도록 직접 끊음
 * - 설명·버튼은 제목을 다 친 뒤 나타남
 * - 공개 페이지라 회사·제품·고객사 이름은 넣지 않음
 */
const SCREEN_COPY = [
  {
    screen: 2,
    title: '화면부터 서버,\n배포까지 만듭니다.',
    description: 'React로 화면을, Spring Boot로 서버를 만들고 Docker와 Jenkins로 배포까지 챙깁니다.',
    hasProjectLinks: false,
  },
  {
    screen: 3,
    title: '공통 UI를 만들어\n여러 제품에 씁니다.',
    description: '폐쇄망 설치와 배포 검증까지 맡아 사내 디자인시스템을 개발했습니다.',
    hasProjectLinks: false,
  },
  {
    screen: 4,
    title: '작업 기록',
    description: null,
    hasProjectLinks: true,
  },
] as const;

const NO_STEPS: readonly TypingStep[] = [];
/** 현재 화면도, 막 떠난 화면도 아닌 곳 — 비워 둬야 다시 들어올 때 설명 줄이 잠깐 비치지 않음 */
const IDLE_DISPLAY: TypingDisplay = { text: '', isComplete: false };

/** 화면별 자동 타이핑 — 소개 화면 인사말 + 분해 화면 제목, 한 번에 한 문장만 재생 */
const TYPING_STEPS_BY_SCREEN = new Map<number, readonly TypingStep[]>([
  [INTRO_SCREEN, buildTypingSteps(INTRO_SENTENCE)],
  ...SCREEN_COPY.map(({ screen, title }): [number, readonly TypingStep[]] => [screen, buildTypingSteps(title)]),
]);

interface BacklightPageProps {
  /** 프로젝트 페이지에서 돌아온 경우 — 첫 화면이 아니라 [프로젝트 보기]가 있던 마지막 화면부터 */
  startsAtLastScreen: boolean;
  /** 자동 타이핑을 이미 한 화면 — 다시 들어오면 치지 않고 다 친 상태로 */
  typedScreens: ReadonlySet<number>;
  /** 화면의 자동 타이핑이 첫 키를 눌렀을 때 — 이후 방문부터 건너뜀 */
  onTypingStart: (screen: number) => void;
}

/**
 * 역광 페이지 — 사이트 첫 페이지. 푸른 역광 + 드래그 회전
 * - 화면 흐름: 자유 회전·자유 입력 → 소개(반투명 막 + 자동 타이핑) → 분해 1·2·3단계 + 타이핑 제목·소개글 (useBacklightScreens)
 * - 반투명 막은 소개 화면부터 끝까지 유지
 * - 마지막 화면 [프로젝트 보기] → 프로젝트 페이지(첫 화면 스튜디오)
 */
export const BacklightPage = ({ startsAtLastScreen, typedScreens, onTypingStart }: BacklightPageProps) => {
  const { screen, stage } = useBacklightScreens(startsAtLastScreen);
  const isIntroScreen = screen === INTRO_SCREEN;
  const typingSteps = TYPING_STEPS_BY_SCREEN.get(screen) ?? NO_STEPS;

  // 들어온 렌더에서 "이미 친 화면인지" 를 고정 — 이번 방문에서 첫 키를 눌러 기록이 늘어도 치던 문장이 완성 상태로 건너뛰지 않게
  const [visit, setVisit] = useState(() => ({ screen, isRepeat: typedScreens.has(screen) }));
  if (visit.screen !== screen) {
    setVisit({ screen, isRepeat: typedScreens.has(screen) });
  }

  /** 3D 장면을 다 그렸는지 — 그 전엔 로딩 화면으로 가리고 자동 타이핑도 시작하지 않음 */
  const [isSceneReady, setIsSceneReady] = useState(false);

  const typing = useTypingSequence(typingSteps, typingSteps.length > 0 && isSceneReady, {
    isSkipped: visit.isRepeat,
    onStart: () => onTypingStart(screen),
  });
  /** 시점 되돌리기 버튼을 누른 횟수 — 바뀔 때마다 같은 화면이라도 카메라를 처음 구도로 다시 옮김 */
  const [viewResetCount, setViewResetCount] = useState(0);

  /**
   * 화면별로 그릴 타이핑 상태
   * - 현재 화면: 재생 중인 타이핑
   * - 막 떠난 화면: 떠나기 직전 모습 그대로 — 사라지는 동안 제목·설명 줄이 바뀌지 않게
   * - 그 밖: 빈 상태 — 화면 밖에서 설명 줄을 "보임" 으로 두면 들어오는 순간 사라지는 전환이 비침
   */
  const displayFor = (targetScreen: number): TypingDisplay => {
    if (targetScreen === screen) return typing;

    const { previous } = typing;
    return previous && previous.steps === TYPING_STEPS_BY_SCREEN.get(targetScreen) ? previous : IDLE_DISPLAY;
  };
  const introDisplay = displayFor(INTRO_SCREEN);

  return (
    <>
      {/*
        화면이 바뀌거나 되돌리기를 누를 때마다 카메라를 그 화면 구도로 — 돌려 둔 각도로 소개가 시작되지 않게
        드래그 회전은 첫 화면에서만 — 소개·분해 화면은 정해진 구도로 고정
        키 눌림은 첫 화면·소개 화면까지만 — 분해 화면은 제목 타이핑·방향키 이동 모두 키가 내려가지 않음
      */}
      <KeyboardScene
        stage={stage}
        moodId="backlight"
        autoPressedCode={typing.pressedCode}
        isKeyPressVisible={screen <= INTRO_SCREEN}
        cameraPoseKey={`${screen}:${viewResetCount}`}
        isRotatable={screen === FREE_SCREEN}
        onReady={() => setIsSceneReady(true)}
      >
        {/* 소개 화면을 떠나 사라지는 동안은 떠나기 직전 모습 그대로 — 다음 화면 제목이 비치지 않게 */}
        <TypingCaption
          sentence={INTRO_SENTENCE}
          text={introDisplay.text}
          details={INTRO_DETAILS}
          isVisible={isIntroScreen}
          isTyping={isIntroScreen && typing.isTyping}
          isComplete={introDisplay.isComplete}
        />
      </KeyboardScene>
      {/* 항상 붙여 둠 — 한/영 전환은 어느 화면에서든 따라가고, 글자 입력은 첫 화면에서만 */}
      <FreeTypingLayer isEnabled={screen === FREE_SCREEN} />
      {/* 배경·키보드 전체를 덮는 막 — 자막·소개글만 이 위에 */}
      <div className="intro-veil" data-visible={screen >= INTRO_SCREEN} aria-hidden="true" />
      {/* 화면별 블록을 한 칸에 겹쳐 두고 현재 화면만 보이게 — 전환 시 교차 페이드, 안 보이는 블록은 inert 로 클릭·탭 이동 차단 */}
      <div className="screen-copy">
        {SCREEN_COPY.map(({ screen: copyScreen, title, description, hasProjectLinks }) => {
          const isCurrent = copyScreen === screen;
          const { text, isComplete } = displayFor(copyScreen);

          return (
            <section key={copyScreen} className="screen-copy__block" data-visible={isCurrent} inert={!isCurrent}>
              {/* 완성 제목(ghost)으로 자리를 잡고 친 글자를 같은 칸에 채움 — 치는 동안 블록 높이가 변하지 않게 */}
              <h2 className="screen-copy__title" data-typing={isCurrent && typing.isTyping} aria-label={title}>
                <span className="screen-copy__title-ghost" aria-hidden="true">
                  {title}
                </span>
                <span className="screen-copy__title-line" aria-hidden="true">
                  {text}
                  {isCurrent && <span className="screen-copy__caret" />}
                </span>
              </h2>
              <div className="screen-copy__rest" data-visible={isComplete} inert={!isComplete}>
                {description && <p className="screen-copy__line">{description}</p>}
                {hasProjectLinks && (
                  <div className="screen-copy__actions">
                    {/* 사이트 안 프로젝트 페이지로 — 해시 이동이라 뒤로 가기로 이 화면 흐름에 복귀 */}
                    <a className="screen-copy__action screen-copy__action--primary" href={PROJECTS_HASH}>
                      프로젝트 보기
                    </a>
                    <a className="screen-copy__action" href={GITHUB_URL} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <ScreenDots count={SCREEN_COUNT} current={screen} />
      {/* 드래그로 돌려 볼 수 있는 첫 화면에서만 */}
      {screen === FREE_SCREEN && <ResetViewButton onClick={() => setViewResetCount((count) => count + 1)} />}
      <LoadingScreen isVisible={!isSceneReady} />
    </>
  );
};
