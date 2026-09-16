import { Html } from '@react-three/drei';

import { CASE_DEPTH } from './glareTkl';
import { tiltedToWorld } from './keyboardFrame';

/** 자막 기준점 — 케이스 뒤 모서리 가운데에서 윗면 법선으로 1u 위, 자막 묶음 아래 끝이 여기에 붙음 */
const CAPTION_ANCHOR = tiltedToWorld(0, 1, -CASE_DEPTH);

interface TypingCaptionProps {
  /** 완성 문장 — 보이지 않게 깔아 자리를 잡아 두고, 친 글자는 그 왼쪽부터 채움 */
  sentence: string;
  text: string;
  /** 다 친 뒤 아래에 이어 보여 줄 줄 — 자리는 처음부터 잡아 둬 타이핑 줄이 움직이지 않게 */
  details?: readonly string[];
  isVisible: boolean;
  isTyping: boolean;
  isComplete: boolean;
}

/**
 * 소개 화면 자막 — 키보드 위쪽에 흰 글자로 한 글자씩, 다 치면 아래 소개 줄이 이어서 나타남
 * - 3D 기준점에 붙여 분위기별 카메라·렌즈 평행 이동이 달라도 키보드 위에 유지
 * - 글자 하나하나를 읽어 주지 않도록 보조기기에서는 숨김 (문장은 페이지 제목과 같은 내용)
 */
export const TypingCaption = ({
  sentence,
  text,
  details = [],
  isVisible,
  isTyping,
  isComplete,
}: TypingCaptionProps) => (
  // z-index 1 고정 — 키보드까지 덮는 소개 화면 막(z-index 없음)보다 항상 위
  <Html position={CAPTION_ANCHOR} pointerEvents="none" zIndexRange={[1, 1]}>
    <div className="typing-caption" data-visible={isVisible} data-typing={isTyping} aria-hidden="true">
      <p className="typing-caption__typed">
        <span className="typing-caption__ghost">{sentence}</span>
        <span className="typing-caption__line">
          {text}
          <span className="typing-caption__caret" />
        </span>
      </p>
      {details.length > 0 && (
        <div className="typing-caption__details" data-visible={isComplete}>
          {details.map((line) => (
            <p key={line} className="typing-caption__detail">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  </Html>
);
