import { useEffect, useRef, type ComponentRef, type RefObject } from 'react';

import type { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';

import { DEFAULT_CAMERA_FOV, type CameraPose } from './explodeStages';
import { SNAP_DELTA } from './snap';

export type OrbitControlsRef = ComponentRef<typeof OrbitControls>;

/** 카메라 이동 감쇠 계수 */
const CAMERA_DAMPING = 2.8;
const SETTLE_DISTANCE = 0.005;
const SETTLE_FOV = 0.01;
const SETTLE_SHIFT = 0.0005;
/** 세로 화면에서 좌우가 잘리지 않도록 카메라를 뒤로 빼는 배율 */
const PORTRAIT_DISTANCE_SCALE = 1.9;

const dampTowards = (current: Vector3, goal: Vector3, delta: number) => {
  current.set(
    MathUtils.damp(current.x, goal.x, CAMERA_DAMPING, delta),
    MathUtils.damp(current.y, goal.y, CAMERA_DAMPING, delta),
    MathUtils.damp(current.z, goal.z, CAMERA_DAMPING, delta),
  );
};

interface CameraRigProps {
  /** 목표 포즈 — 모듈 상수 참조를 넘겨야 불필요한 재이동이 없음 */
  pose: CameraPose;
  /** 값이 바뀌면 같은 포즈라도 다시 이동 — 사용자가 돌려 둔 각도를 되돌릴 때 */
  poseKey?: string | number;
  controlsRef: RefObject<OrbitControlsRef | null>;
}

/**
 * 분해 단계·분위기별 카메라 이동
 * - 포즈(위치 · 바라보는 점 · 화각 · 렌즈 평행 이동)가 바뀌면 목표로 감쇠 이동
 * - 위치 이동은 도착하거나 사용자가 드래그를 시작하면 멈춤 — 회전을 허용한 분위기에서 드래그와 싸우지 않게
 * - 화각·렌즈 평행 이동은 드래그와 무관하게 끝까지 맞춤 (중간에 멈추면 분위기 전환 도중 어정쩡하게 남음)
 */
export const CameraRig = ({ pose, poseKey, controlsRef }: CameraRigProps) => {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const isPortrait = size.width < size.height;
  const goalPositionRef = useRef(new Vector3());
  const goalTargetRef = useRef(new Vector3());
  const goalFovRef = useRef(DEFAULT_CAMERA_FOV);
  const goalShiftRef = useRef(0);
  const shiftRef = useRef(0);
  /** 마지막으로 렌즈 이동을 적용한 값·화면 크기 — 바뀔 때만 다시 적용 */
  const appliedViewRef = useRef({ shift: 0, width: 0, height: 0 });
  const isMovingRef = useRef(false);
  /** 첫 포즈를 받았는지 — 첫 포즈만 감쇠 없이 바로 놓음 (로딩 화면이 걷혔을 때 카메라가 날아오지 않게) */
  const hasFirstPoseRef = useRef(false);
  const snapNextFrameRef = useRef(false);

  useEffect(() => {
    goalTargetRef.current.set(...pose.target);
    goalPositionRef.current
      .set(...pose.position)
      .sub(goalTargetRef.current)
      .multiplyScalar(isPortrait ? PORTRAIT_DISTANCE_SCALE : 1)
      .add(goalTargetRef.current);
    goalFovRef.current = pose.fov ?? DEFAULT_CAMERA_FOV;
    goalShiftRef.current = pose.viewShiftY ?? 0;
    isMovingRef.current = true;

    if (!hasFirstPoseRef.current) {
      hasFirstPoseRef.current = true;
      snapNextFrameRef.current = true;
    }
  }, [pose, poseKey, isPortrait]);

  // 사용자가 직접 돌리기 시작하면 위치 자동 이동 중단
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => {
      isMovingRef.current = false;
    };

    controls.addEventListener('start', handleStart);
    return () => controls.removeEventListener('start', handleStart);
  }, [controlsRef]);

  useFrame((_, delta) => {
    const step = snapNextFrameRef.current ? SNAP_DELTA : delta;

    if (camera instanceof PerspectiveCamera) {
      if (Math.abs(camera.fov - goalFovRef.current) >= SETTLE_FOV) {
        camera.fov = MathUtils.damp(camera.fov, goalFovRef.current, CAMERA_DAMPING, step);
        camera.updateProjectionMatrix();
      }

      if (Math.abs(shiftRef.current - goalShiftRef.current) >= SETTLE_SHIFT) {
        shiftRef.current = MathUtils.damp(shiftRef.current, goalShiftRef.current, CAMERA_DAMPING, step);
      } else {
        shiftRef.current = goalShiftRef.current;
      }

      // 렌즈 평행 이동 — 보이는 창을 전체 이미지 안에서 위로 옮기면 장면이 아래로 내려감
      const applied = appliedViewRef.current;
      const hasViewChanged =
        applied.shift !== shiftRef.current || applied.width !== size.width || applied.height !== size.height;
      if (hasViewChanged) {
        if (shiftRef.current === 0) {
          camera.clearViewOffset();
        } else {
          camera.setViewOffset(
            size.width,
            size.height,
            0,
            -shiftRef.current * size.height,
            size.width,
            size.height,
          );
        }
        appliedViewRef.current = { shift: shiftRef.current, width: size.width, height: size.height };
      }
    }

    const controls = controlsRef.current;
    if (!isMovingRef.current || !controls) return;

    dampTowards(camera.position, goalPositionRef.current, step);
    dampTowards(controls.target, goalTargetRef.current, step);
    controls.update();
    // 위치까지 놓은 뒤에 해제 — 컨트롤이 아직 안 붙은 프레임이면 다음 프레임에 다시 바로 놓음
    snapNextFrameRef.current = false;

    const hasArrived =
      camera.position.distanceTo(goalPositionRef.current) < SETTLE_DISTANCE &&
      controls.target.distanceTo(goalTargetRef.current) < SETTLE_DISTANCE;
    if (hasArrived) isMovingRef.current = false;
  });

  return null;
};
