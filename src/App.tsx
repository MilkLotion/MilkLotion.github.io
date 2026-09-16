import { useState } from 'react';

import { MoodSwitcher } from './MoodSwitcher';
import { BacklightPage } from './pages/BacklightPage';
import { StudioPage } from './pages/StudioPage';
import type { MoodId } from './scene/atmosphere/moods';

/**
 * 분위기별 페이지 — 스튜디오·역광은 화면 흐름·연출을 따로 구성
 * - 전환하면 페이지가 통째로 바뀌어 3D 캔버스도 새로 만들어짐
 */
export const App = () => {
  const [moodId, setMoodId] = useState<MoodId>('studio');

  return (
    <main className="app" data-mood={moodId}>
      <h1 className="sr-only">노현수 포트폴리오</h1>
      {moodId === 'studio' ? <StudioPage /> : <BacklightPage />}
      <MoodSwitcher moodId={moodId} onChange={setMoodId} />
    </main>
  );
};
