import { memo, useLayoutEffect, useRef, type ReactNode } from 'react';

import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { BackSide, Mesh, type Group } from 'three';

import { Atmosphere } from './atmosphere/Atmosphere';
import { BusinessCard } from './atmosphere/BusinessCard';
import { MOODS, type Mood, type MoodId } from './atmosphere/moods';
import { StudioShadows } from './atmosphere/StudioShadows';
import { CameraRig, type OrbitControlsRef } from './CameraRig';
import { CAMERA_POSES, DEFAULT_CAMERA_FOV, type ExplodeStage } from './explodeStages';
import { Keyboard } from './Keyboard';

interface ShadowCastersProps {
  children: ReactNode;
}

/** 자식 메시 전부 그림자 투사 — 키보드 부품이 수백 개라 개별 지정 대신 마운트 시 한 번 순회 */
const ShadowCasters = ({ children }: ShadowCastersProps) => {
  const groupRef = useRef<Group>(null);

  useLayoutEffect(() => {
    groupRef.current?.traverse((object) => {
      if (object instanceof Mesh) object.castShadow = true;
    });
  }, []);

  return <group ref={groupRef}>{children}</group>;
};

interface SceneEnvironmentProps {
  mood: Mood;
}

/**
 * 알루미늄 반사용 환경광 — Lightformer 로 로컬 생성, 원격 HDR 요청 없음
 * - Environment 는 자식이 바뀔 때마다 환경 맵을 다시 구움 — 자동 입력으로 씬이 키마다 재렌더돼도 분위기가 같으면 건너뛰도록 memo
 */
const SceneEnvironmentBase = ({ mood }: SceneEnvironmentProps) => (
  <Environment resolution={256} environmentIntensity={mood.environmentIntensity}>
    <Lightformer form="rect" intensity={2.5} position={[0, 9, 7]} scale={[22, 6, 1]} target={[0, 0, 0]} />
    <Lightformer form="rect" intensity={1.2} position={[-14, 4, -2]} scale={[12, 4, 1]} target={[0, 0, 0]} />
    <Lightformer form="rect" intensity={1.2} position={[14, 4, -2]} scale={[12, 4, 1]} target={[0, 0, 0]} />
    {/* 뒷면·아래 향한 모따기와 무게추만 살리는 약한 반사광 */}
    <Lightformer form="rect" intensity={0.4} position={[0, 5, -14]} scale={[22, 6, 1]} target={[0, 0, 0]} />
    <Lightformer form="rect" intensity={0.14} position={[0, -8, 0]} scale={[30, 30, 1]} target={[0, 0, 0]} />
    {/* 스튜디오 — 회색 방 + 오른쪽 소프트박스: 거친 금속 케이스가 검은 환경을 반사해 어둡게 뜨던 것 보정 */}
    {mood.studio && (
      <>
        <mesh scale={100}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#9a9a9a" side={BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={4} position={[40, 12, 4]} scale={[30, 20, 1]} target={[0, 0, 0]} />
      </>
    )}
  </Environment>
);

const SceneEnvironment = memo(SceneEnvironmentBase);

interface KeyboardSceneProps {
  stage: ExplodeStage;
  moodId: MoodId;
  /** 자동 입력이 누르고 있는 키 */
  autoPressedCode?: string | null;
  /** 값이 바뀌면 같은 포즈라도 카메라를 다시 옮김 — 사용자가 돌려 둔 각도를 화면 전환 때 되돌릴 때 */
  cameraPoseKey?: string | number;
  /** 드래그 회전 허용 — 넘기지 않으면 분위기 기본값(allowRotate) */
  isRotatable?: boolean;
  /** 캔버스 안에 함께 그릴 요소 — 3D 기준점에 붙는 자막 등 */
  children?: ReactNode;
}

/**
 * 첫 화면 3D 씬
 * - 배경은 투명 캔버스 + 분위기별 CSS 그라데이션, 조명·빛 효과는 Atmosphere
 * - 스튜디오 분위기만 명함 보드 · 4시 방향 주광 사용 — 배경은 캔버스 뒤 DOM 의 StudioBackground(SVG)
 * - 휠은 분해 단계 전환에 쓰므로 줌은 끔
 * - 회전 기본값은 분위기별(스튜디오는 2D 배경과 맞아야 해 고정, 역광은 드래그 회전 가능) — 페이지가 화면마다 isRotatable 로 덮어씀
 */
export const KeyboardScene = ({
  stage,
  moodId,
  autoPressedCode = null,
  cameraPoseKey,
  isRotatable,
  children,
}: KeyboardSceneProps) => {
  const controlsRef = useRef<OrbitControlsRef>(null);
  const mood = MOODS[moodId];
  const cameraPose = stage === 0 && mood.restCameraPose ? mood.restCameraPose : CAMERA_POSES[stage];

  return (
    // VSM — 넓게 흐린 그림자를 적은 샘플로 부드럽게 (그림자를 받는 건 평평한 바닥판뿐이라 VSM 번짐 문제 없음)
    <Canvas
      shadows="variance"
      camera={{ position: CAMERA_POSES[0].position, fov: DEFAULT_CAMERA_FOV }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        // 박스가 바닥 아래로 내려갈 때 재질별 잘라내기 평면을 쓰려면 켜야 함
        gl.localClippingEnabled = true;
      }}
    >
      <Atmosphere moodId={moodId} />
      <SceneEnvironment mood={mood} />

      {mood.studio && (
        <>
          <BusinessCard stage={stage} />
          <StudioShadows opacity={mood.studio.shadowOpacity} isVisible={stage === 0} />
        </>
      )}

      <ShadowCasters>
        <Keyboard stage={stage} autoPressedCode={autoPressedCode} />
      </ShadowCasters>

      {/*
        키보드 전용 — 원점 중심으로 두고 앞뒤 ±12 로 좁힘
        (중심을 옮겨 호리존트 곡면·박스가 캡처 범위에 들어가면 앞쪽 바닥에 엉뚱한 그림자 얼룩이 생김)
      */}
      <ContactShadows
        position={[0, -0.001, 0]}
        scale={[40, 24]}
        blur={mood.contactShadow.blur}
        far={mood.contactShadow.far}
        opacity={mood.contactShadow.opacity}
      />
      {children}
      <OrbitControls
        ref={controlsRef}
        target={CAMERA_POSES[0].target}
        enablePan={false}
        enableZoom={false}
        enableRotate={isRotatable ?? mood.allowRotate}
        minDistance={3}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.1}
      />
      <CameraRig pose={cameraPose} poseKey={cameraPoseKey} controlsRef={controlsRef} />
    </Canvas>
  );
};
