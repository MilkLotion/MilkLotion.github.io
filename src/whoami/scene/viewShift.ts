import { PerspectiveCamera, type Camera } from 'three';

/**
 * 렌즈 평행 이동량 — 정규화 화면 좌표(NDC, 세로 -1~1) 기준, 양수면 장면이 아래로 내려간 상태
 * - CameraRig 가 setViewOffset 으로 키보드를 화면 아래로 옮길 때, 배경 효과는 이 값만큼 되돌려 원래 화면 위치를 유지
 */
export const getViewShiftNdc = (camera: Camera) =>
  camera instanceof PerspectiveCamera && camera.view?.enabled ? (-2 * camera.view.offsetY) / camera.view.fullHeight : 0;
