import { useState } from 'react';

import { FreeTypingLayer } from '../FreeTypingLayer';
import { FREE_SCREEN, INTRO_SCREEN, SCREEN_COUNT, useBacklightScreens } from '../hooks/useBacklightScreens';
import { useTypingSequence } from '../hooks/useTypingSequence';
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
    title: '같은 코드 작성을\n지양합니다.',
    description: '반복되는 기능은 공통 컴포넌트로 만들고, 이를\u00A0모아 사내 디자인시스템을 개발했습니다.',
    hasProjectLinks: false,
  },
  {
    screen: 4,
    title: '작업한 프로젝트를\n소개합니다.',
    description: null,
    hasProjectLinks: true,
  },
] as const;

const NO_STEPS: readonly TypingStep[] = [];

/** 화면별 자동 타이핑 — 소개 화면 인사말 + 분해 화면 제목, 한 번에 한 문장만 재생 */
const TYPING_STEPS_BY_SCREEN = new Map<number, readonly TypingStep[]>([
  [INTRO_SCREEN, buildTypingSteps(INTRO_SENTENCE)],
  ...SCREEN_COPY.map(({ screen, title }): [number, readonly TypingStep[]] => [screen, buildTypingSteps(title)]),
]);

/**
 * 역광 페이지 — 푸른 역광 + 드래그 회전
 * - 화면 흐름: 자유 회전·자유 입력 → 소개(반투명 막 + 자동 타이핑) → 분해 1·2·3단계 + 타이핑 제목·소개글 (useBacklightScreens)
 * - 반투명 막은 소개 화면부터 끝까지 유지
 */
export const BacklightPage = () => {
  const { screen, stage } = useBacklightScreens();
  const isIntroScreen = screen === INTRO_SCREEN;
  const typingSteps = TYPING_STEPS_BY_SCREEN.get(screen) ?? NO_STEPS;
  const typing = useTypingSequence(typingSteps, typingSteps.length > 0);
  /** 시점 되돌리기 버튼을 누른 횟수 — 바뀔 때마다 같은 화면이라도 카메라를 처음 구도로 다시 옮김 */
  const [viewResetCount, setViewResetCount] = useState(0);

  return (
    <>
      {/*
        화면이 바뀌거나 되돌리기를 누를 때마다 카메라를 그 화면 구도로 — 돌려 둔 각도로 소개가 시작되지 않게
        드래그 회전은 첫 화면에서만 — 소개·분해 화면은 정해진 구도로 고정
      */}
      <KeyboardScene
        stage={stage}
        moodId="backlight"
        autoPressedCode={typing.pressedCode}
        cameraPoseKey={`${screen}:${viewResetCount}`}
        isRotatable={screen === FREE_SCREEN}
      >
        {/* 소개 화면을 떠나 사라지는 동안은 완성 문장 그대로 — 다음 화면 제목이 비치지 않게 */}
        <TypingCaption
          sentence={INTRO_SENTENCE}
          text={isIntroScreen ? typing.text : INTRO_SENTENCE}
          details={INTRO_DETAILS}
          isVisible={isIntroScreen}
          isTyping={isIntroScreen && typing.isTyping}
          isComplete={!isIntroScreen || typing.isComplete}
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
          // 떠나며 사라지는 블록은 다 친 상태 그대로
          const isComplete = !isCurrent || typing.isComplete;

          return (
            <section key={copyScreen} className="screen-copy__block" data-visible={isCurrent} inert={!isCurrent}>
              {/* 완성 제목(ghost)으로 자리를 잡고 친 글자를 같은 칸에 채움 — 치는 동안 블록 높이가 변하지 않게 */}
              <h2 className="screen-copy__title" data-typing={isCurrent && typing.isTyping} aria-label={title}>
                <span className="screen-copy__title-ghost" aria-hidden="true">
                  {title}
                </span>
                <span className="screen-copy__title-line" aria-hidden="true">
                  {isCurrent ? typing.text : title}
                  {isCurrent && <span className="screen-copy__caret" />}
                </span>
              </h2>
              <div className="screen-copy__rest" data-visible={isComplete} inert={!isComplete}>
                {description && <p className="screen-copy__line">{description}</p>}
                {hasProjectLinks && (
                  <div className="screen-copy__actions">
                    {/* [스펙 미확정] 사이트 안 프로젝트 소개 페이지 — 넣을 프로젝트·내용이 정해지면 연결 */}
                    <button type="button" className="screen-copy__action screen-copy__action--primary" disabled>
                      프로젝트 보기
                    </button>
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
    </>
  );
};
