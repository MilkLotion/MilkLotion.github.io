import { useFreeTyping } from './hooks/useFreeTyping';
import { composeDubeolsik } from './scene/dubeolsikTyping';

interface FreeTypingLayerProps {
  /** 글자 입력을 받는 화면인지 — 꺼지면 떠 있던 단어 정리 */
  isEnabled: boolean;
}

/** 첫 화면 자유 입력 — 친 글자를 키보드 위 빈 곳에 단어별로, 끝난 단어는 위로 스르륵 올라가며 사라짐 */
export const FreeTypingLayer = ({ isEnabled }: FreeTypingLayerProps) => {
  const words = useFreeTyping(isEnabled);

  return (
    <div className="free-typing" aria-hidden="true">
      {words.map((word) => (
        <p
          key={word.id}
          className="free-typing__word"
          data-fading={word.isFading}
          style={{ left: `${word.x}%`, top: `${word.y}%` }}
        >
          {composeDubeolsik(word.units)}
          {/* 키마다 새로 그려 깜빡임을 처음부터 — 치는 동안은 켜진 채로 보임 */}
          {!word.isFading && <span key={word.units.length} className="free-typing__caret" />}
        </p>
      ))}
    </div>
  );
};
