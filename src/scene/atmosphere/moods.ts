import type { CameraPose } from "../explodeStages";

/**
 * 페이지별 분위기 프리셋 — 조명·배경 효과 묶음
 * - backlight(역광): 소개 페이지(사이트 첫 페이지) — 푸른 역광과 광원 번짐, 키보드는 실루엣 윤곽, 드래그 회전 가능
 * - studio(스튜디오): 프로젝트 페이지 첫 화면 — 사진 역산 2D 배경 + 명함 보드, 화면 4시 방향 조명, 시점 고정(회전 없음)
 */

export type MoodId = "studio" | "backlight";

type Vector3Tuple = [number, number, number];

export interface ParticleSpec {
  count: number;
  color: string;
  opacity: number;
}

export interface StudioSpec {
  /** 키보드·박스에 비추는 주광 — 화면 4시 방향 */
  spot: {
    position: Vector3Tuple;
    target: Vector3Tuple;
    intensity: number;
    color: string;
    angle: number;
    /** 거리 감쇠 지수 — 가까운 오른쪽이 더 밝게 */
    decay: number;
  };
  /** 키보드가 바닥에 던지는 방향 그림자 농도 */
  shadowOpacity: number;
}

export interface Mood {
  /** 드래그로 카메라 회전 허용 — 2D 배경을 쓰는 스튜디오는 시점이 고정돼야 배경과 맞음 */
  allowRotate: boolean;
  ambient: number;
  keyLight: { intensity: number; color: string };
  fillLight: number;
  /** 뒤에서 비추는 윤곽광 */
  rimLight: { intensity: number; color: string; position: Vector3Tuple };
  /** 금속 반사에 쓰는 환경광 세기 */
  environmentIntensity: number;
  /** 물체 바로 밑 접지 그림자 — blur 는 번짐, far 는 바닥에서 그림자를 만드는 높이 한계 (u) */
  contactShadow: { opacity: number; blur: number; far: number };
  /** 조립 상태(0단계) 카메라 — 없으면 기본 정면 구도 */
  restCameraPose: CameraPose | null;
  studio: StudioSpec | null;
  /** 광원 번짐 — flare 는 가로로 길게 퍼지는 렌즈 플레어 줄 */
  glow: {
    color: string;
    size: number;
    opacity: number;
    position: Vector3Tuple;
    flare: boolean;
  } | null;
  dust: ParticleSpec | null;
}

export const MOODS: Readonly<Record<MoodId, Mood>> = {
  studio: {
    allowRotate: false,
    // 사진 명암 기준: 박스 앞면 왼쪽 #ac → 오른쪽 #d3, 윗면 #e2, 왼쪽 옆면 어두움, 키보드 오른쪽 옆면 가장 밝음
    // 균일광을 낮추고 거리 감쇠 스포트 비중을 키워 왼쪽→오른쪽 명암 차를 만듦
    // 환경 맵 회색 방이 균일광을 대신하므로 주변광은 최소, 윗면용 위쪽 조명은 올림
    ambient: 0.05,
    keyLight: { intensity: 0.7, color: "#ffffff" },
    fillLight: 0.06,
    rimLight: { intensity: 0.2, color: "#ffffff", position: [-8, 10, -18] },
    environmentIntensity: 0.75,
    // 사진 키보드 가장자리는 바닥 밝기의 10~20% 까지 짙음 — 낮은 높이만 잡아 가장자리에 몰리게
    contactShadow: { opacity: 1, blur: 3.5, far: 1.2 },
    // 위치·방향: 레퍼런스 사진의 키보드 네 모서리 · 박스 일곱 모서리 · 벽 밑선으로 역산 (평균 오차 3.7px / 401×498)
    // 화각: 사용자 피그마 프레임(1440×1024)은 같은 사진을 위아래 대칭 크롭(498→413px) — tan 비율로 35° → 29.3°
    restCameraPose: {
      position: [-23.86, 26.62, 35.37],
      target: [2.44, 4.72, -6.62],
      fov: 29.3,
    },
    studio: {
      // 화면 오른쪽 낮은 곳 — 박스는 오른쪽이 가까워 더 밝고, 왼쪽 옆면·키보드 앞면은 빛을 덜 받음
      spot: {
        position: [34, 12, 0],
        target: [4, 3, -8],
        intensity: 300,
        color: "#fff6ec",
        angle: 1.1,
        decay: 1.8,
      },
      // 사진 키보드 왼쪽 끝 그림자 중심은 바닥 밝기의 10~20% — 흐림으로 옅어지는 폭까지 비율 표로 맞춤
      shadowOpacity: 0.8,
    },
    glow: null,
    dust: null,
  },
  backlight: {
    allowRotate: true,
    // 앞면은 어둡게 두어 실루엣, 광원은 기본 카메라에서 키보드 뒷모서리에 걸리는 높이
    ambient: 0.05,
    keyLight: { intensity: 0.25, color: "#b9cdf5" },
    fillLight: 0.06,
    rimLight: { intensity: 4, color: "#7fb0ff", position: [0, 3, -18] },
    environmentIntensity: 0.25,
    contactShadow: { opacity: 0.55, blur: 2.6, far: 4 },
    // 정면 구도 — position 은 회전 한계(수직에서 85.7°, 수평 불가) 안에서만 도달 가능
    // viewShiftY: 각도는 그대로 두고 키보드만 화면 아래쪽으로 (광원 번짐·먼지 배경 효과는 화면 제자리 유지)
    restCameraPose: {
      position: [0, 10, 22],
      //position: [0, 1.65, 21.94],
      target: [0, 0, 0],
      viewShiftY: 0.2,
    },
    studio: null,
    glow: {
      color: "#6aa8ff",
      size: 30,
      opacity: 0.9,
      position: [0, -2.5, -14],
      flare: true,
    },
    dust: { count: 120, color: "#a9c8ff", opacity: 0.4 },
  },
};
