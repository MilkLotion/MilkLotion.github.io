import { memo } from 'react';

import { PCB_THICKNESS, PCB_TOP_DEPTH, PLATE_DEPTH, PLATE_THICKNESS } from './glareTkl';
import { PCB_GEOMETRY, PCB_MATERIALS, PLATE_GEOMETRY } from './internalsGeometry';
import { KEY_AREA_CENTER_Z } from './keyboardFrame';

/** 알루미늄 5052 보강판 */
const PLATE_COLOR = '#9d9fa3';

/** 보강판 — 셰이프 평면(x, 뒤쪽 거리)을 눕히고 돌출 방향을 위로 */
const PlateBase = () => (
  <mesh
    geometry={PLATE_GEOMETRY}
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -PLATE_DEPTH - PLATE_THICKNESS, 0]}
    dispose={null}
  >
    <meshStandardMaterial color={PLATE_COLOR} metalness={0.6} roughness={0.5} />
  </mesh>
);

/** 기판 */
const PcbBase = () => (
  <mesh
    geometry={PCB_GEOMETRY}
    material={PCB_MATERIALS}
    position={[0, -PCB_TOP_DEPTH - PCB_THICKNESS / 2, KEY_AREA_CENTER_Z]}
    dispose={null}
  />
);

export const Plate = memo(PlateBase);
export const Pcb = memo(PcbBase);
