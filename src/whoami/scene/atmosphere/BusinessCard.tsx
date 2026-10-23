import { memo } from 'react';

import { ContactShadows } from '@react-three/drei';
import { BoxGeometry, MeshBasicMaterial, Plane, Vector3, type Texture } from 'three';

import { ExplodeLayer } from '../ExplodeLayer';
import type { ExplodeStage } from '../explodeStages';
import { BUSINESS_CARD_TEXTURES, CARD_SIZE } from './businessCardTexture';

/**
 * 명함 보드(박스) — 레퍼런스 사진 박스 위치를 카메라와 함께 역산
 * - 중심 x 7.36 · 앞뒤 z -14.92 · 회전 0.6° (키보드 원점 기준 오른쪽 뒤)
 * - 보이는 세 면(앞 · 위 · 왼쪽)은 사진 명암을 구운 텍스처를 조명 없이 그대로 표시
 */
const CARD_POSITION: [number, number, number] = [7.36, CARD_SIZE.height / 2, -14.92];
const CARD_YAW = (0.6 * Math.PI) / 180;
/** 분해 단계에서는 바닥 아래로 내려 시야를 비움 */
const HIDDEN_OFFSET = CARD_SIZE.height + 0.5;
const DOWN: readonly [number, number, number] = [0, -1, 0];

/** 바닥(y=0) 아래를 잘라 가라앉는 것처럼 — 배경이 2D 라 내려간 박스를 가려 줄 3D 바닥이 없음 */
const FLOOR_CLIP = [new Plane(new Vector3(0, 1, 0), 0)];

const CARD_GEOMETRY = new BoxGeometry(CARD_SIZE.width, CARD_SIZE.height, CARD_SIZE.thickness);
const bakedMaterial = (map: Texture) => new MeshBasicMaterial({ map, toneMapped: false, clippingPlanes: FLOOR_CLIP });
/** 스튜디오 시점에서 보이지 않는 면 */
const unseenMaterial = new MeshBasicMaterial({ color: '#d9d7d2', toneMapped: false, clippingPlanes: FLOOR_CLIP });
/** BoxGeometry 면 순서 +x, -x(왼쪽 옆면), +y(윗면), -y, +z(앞면), -z */
const CARD_MATERIALS = [
  unseenMaterial,
  bakedMaterial(BUSINESS_CARD_TEXTURES.side),
  bakedMaterial(BUSINESS_CARD_TEXTURES.top),
  unseenMaterial,
  bakedMaterial(BUSINESS_CARD_TEXTURES.front),
  unseenMaterial,
];

interface BusinessCardProps {
  stage: ExplodeStage;
}

const BusinessCardBase = ({ stage }: BusinessCardProps) => (
  <>
    <ExplodeLayer offset={stage === 0 ? 0 : HIDDEN_OFFSET} direction={DOWN}>
      <mesh
        geometry={CARD_GEOMETRY}
        material={CARD_MATERIALS}
        position={CARD_POSITION}
        rotation={[0, CARD_YAW, 0]}
        dispose={null}
      />
    </ExplodeLayer>
    {/* 박스 밑동 접지 그림자 — 박스가 내려가기 시작하면 바로 제거 (바닥 아래로 따라가면 판째로 드러남) */}
    {stage === 0 && (
      <ContactShadows
        position={[CARD_POSITION[0], -0.002, CARD_POSITION[2]]}
        scale={[30, 12]}
        blur={2}
        far={2}
        opacity={0.5}
      />
    )}
  </>
);

export const BusinessCard = memo(BusinessCardBase);
