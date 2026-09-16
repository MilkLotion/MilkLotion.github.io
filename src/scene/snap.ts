/**
 * MathUtils.damp 에 넘기면 목표값을 그대로 돌려주는 경과 시간 (1 - e^-∞ = 1)
 * - 마운트 뒤 첫 프레임에 써서 감쇠 이동(카메라·분해)을 목표 위치에서 시작
 * - 로딩 화면이 걷혔을 때 키보드가 스르륵 날아오거나 벌어지지 않게
 */
export const SNAP_DELTA = Number.POSITIVE_INFINITY;
