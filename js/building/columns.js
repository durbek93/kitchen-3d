import { THREE } from '../three-global.js';
import { BEAM_H, BEAM_W, BEAM_BOT, PLINTH_H } from '../constants.js';
import { concreteMat } from '../materials.js';
import { createBox } from './helpers.js';

export const columnsGroup = new THREE.Group();

export function buildColumns(scene) {
      // Ригели / несущие балки сечением 40 (высота) × 38 см (ширина) под плитами перекрытия
      const ringY = BEAM_BOT + BEAM_H / 2; // 3.00 м

      // Продольные фасадный и задний ригели (18.95 м)
      const beamBack = createBox(18.95, BEAM_H, BEAM_W, concreteMat, columnsGroup);
      beamBack.position.set(0, ringY, -3.235);

      const beamFront = createBox(18.95, BEAM_H, BEAM_W, concreteMat, columnsGroup);
      beamFront.position.set(0, ringY, 3.235);

      // Торцевые ригели (Оси 1 и 5)
      const beamLeftEnd = createBox(BEAM_W, BEAM_H, 6.09, concreteMat, columnsGroup);
      beamLeftEnd.position.set(-9.285, ringY, 0);

      const beamRightEnd = createBox(BEAM_W, BEAM_H, 6.09, concreteMat, columnsGroup);
      beamRightEnd.position.set(9.285, ringY, 0);

      // Поперечный ригель Оси 4 над капитальной стеной с дверью 0.8х2.1м (высота 40 см)
      const beamMid1 = createBox(BEAM_W, BEAM_H, 6.09, concreteMat, columnsGroup);
      beamMid1.position.set(-4.875, ringY, 0);

      // Поперечный ригель Оси 3 над порталом беседки
      const beamMid2 = createBox(BEAM_W, BEAM_H, 6.09, concreteMat, columnsGroup);
      beamMid2.position.set(5.275, ringY, 0);

      // Ригель над перегородкой санузла/котельной
      const uBeam = createBox(4.00, BEAM_H, 0.20, concreteMat, columnsGroup);
      uBeam.position.set(-7.075, ringY, -1.025);

      // Колонны монолитные (от верха цоколя Y = 0.50 до низа ригелей Y = 2.80 м)
      const colHeight = BEAM_BOT - PLINTH_H; // 2.30 м
      const colY = PLINTH_H + colHeight / 2; // 1.65 м

      // 10 несущих железобетонных колонн 380x380 мм (под 1.5 кирпича)
      const colPositions = [
        [-9.285, 3.235], [-9.285, -3.235],  // Ось 5
        [-4.875, 3.235], [-4.875, -3.235],  // Ось 4 (разделение кухонь)
        [0.725, 3.235],  [0.725, -3.235],   // Промежуточная колонна зимней кухни
        [5.275, 3.235],  [5.275, -3.235],   // Ось 3 (портал беседки)
        [9.285, 3.235],  [9.285, -3.235]    // Ось 2 (торец беседки)
      ];

      colPositions.forEach(([x, z]) => {
        const col = createBox(BEAM_W, colHeight, BEAM_W, concreteMat, columnsGroup);
        col.position.set(x, colY, z);
      });

  scene.add(columnsGroup);
  return { columnsGroup };
}
