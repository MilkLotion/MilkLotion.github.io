import { useExplodeStage } from '../hooks/useExplodeStage';
import { StudioBackground } from '../scene/atmosphere/StudioBackground';
import { KeyboardScene } from '../scene/KeyboardScene';

/** 스튜디오 페이지 — 사진 역산 2D 배경 + 시점 고정, 휠 한 번에 분해 한 단계 */
export const StudioPage = () => {
  const stage = useExplodeStage();

  return (
    <>
      <StudioBackground />
      <KeyboardScene stage={stage} moodId="studio" />
    </>
  );
};
