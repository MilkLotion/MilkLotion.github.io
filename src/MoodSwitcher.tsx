import { MOOD_IDS, MOODS, type MoodId } from './scene/atmosphere/moods';

interface MoodSwitcherProps {
  moodId: MoodId;
  onChange: (moodId: MoodId) => void;
}

/** [임시] 분위기 프리셋 비교용 — 사용자가 하나로 확정하면 제거 */
export const MoodSwitcher = ({ moodId, onChange }: MoodSwitcherProps) => (
  <div className="mood-switcher" role="group" aria-label="분위기 프리셋">
    {MOOD_IDS.map((id) => (
      <button
        key={id}
        type="button"
        className="mood-switcher__button"
        aria-pressed={id === moodId}
        onClick={() => onChange(id)}
      >
        {MOODS[id].label}
      </button>
    ))}
  </div>
);
