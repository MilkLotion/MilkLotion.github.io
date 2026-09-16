import { DustParticles } from './DustParticles';
import { GlowSprite } from './GlowSprite';
import { MOODS, type MoodId } from './moods';
import { StudioSpotLight } from './StudioSpotLight';

interface AtmosphereProps {
  moodId: MoodId;
}

/** 분위기 프리셋 적용 — 조명 세기·색과 배경 빛 효과 */
export const Atmosphere = ({ moodId }: AtmosphereProps) => {
  const mood = MOODS[moodId];

  return (
    <>
      <ambientLight intensity={mood.ambient} />
      <directionalLight position={[6, 14, 10]} intensity={mood.keyLight.intensity} color={mood.keyLight.color} />
      <directionalLight position={[-10, 8, -6]} intensity={mood.fillLight} />
      <directionalLight
        position={mood.rimLight.position}
        intensity={mood.rimLight.intensity}
        color={mood.rimLight.color}
      />

      {mood.studio && <StudioSpotLight {...mood.studio.spot} />}
      {mood.glow && <GlowSprite {...mood.glow} />}
      {mood.dust && <DustParticles {...mood.dust} />}
    </>
  );
};
