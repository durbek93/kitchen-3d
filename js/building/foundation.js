import { THREE } from '../three-global.js';
import { T, PLINTH_H } from '../constants.js';
import { groundMat, plinthMat, concreteMat, gravelMat } from '../materials.js';
import { createBox } from './helpers.js';

export const groundGroup = new THREE.Group();
export const plinthsGroup = new THREE.Group();
export const floorsGroup = new THREE.Group();

export function buildFoundation(scene) {
  // Ground plane & grid (в группе groundGroup для скрытия при виде снизу)
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 40), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    groundGroup.add(ground);

    const grid = new THREE.GridHelper(40, 40, 0x334155, 0x1e293b);
    grid.position.y = 0.01;
    groundGroup.add(grid);



  // Фундаментные ленты, цоколь и полы помещений
    function buildPlinths() {
      // Фундаментные ленты и цоколь (plinthsGroup, высота 50 см над землей)
      const pBack = createBox(18.95, PLINTH_H, T, plinthMat, plinthsGroup);
      pBack.position.set(0, PLINTH_H / 2, -3.235);

      const pFront = createBox(18.95, PLINTH_H, T, plinthMat, plinthsGroup);
      pFront.position.set(0, PLINTH_H / 2, 3.235);

      // Торцевые фундаментные ленты
      const pLeftEnd = createBox(T, PLINTH_H, 6.09, plinthMat, plinthsGroup);
      pLeftEnd.position.set(-9.285, PLINTH_H / 2, 0);

      const pRightEnd = createBox(T, PLINTH_H, 6.09, plinthMat, plinthsGroup);
      pRightEnd.position.set(9.285, PLINTH_H / 2, 0);

      // Поперечные ленты по Осям 2 и 3
      const pTrans1 = createBox(T, PLINTH_H, 6.09, plinthMat, plinthsGroup);
      pTrans1.position.set(-4.875, PLINTH_H / 2, 0);

      const pTrans2 = createBox(T, PLINTH_H, 6.09, plinthMat, plinthsGroup);
      pTrans2.position.set(5.275, PLINTH_H / 2, 0);

      // Фундаментная лента под перегородку санузла/котельной (для трассировки труб)
      const pUtilDiv = createBox(4.00, PLINTH_H, 0.20, plinthMat, plinthsGroup);
      pUtilDiv.position.set(-7.075, PLINTH_H / 2, -1.025);

      // Плиты пола помещений (floorsGroup — отключаемые или полупрозрачные в режиме рентгена)
      // 1) Пол беседки: 3.60 x 6.09 м
      const fGazebo = createBox(3.60, PLINTH_H, 6.09, concreteMat.clone(), floorsGroup);
      fGazebo.position.set(7.275, PLINTH_H / 2, 0);

      // 2) Пол летней кухни: 4.00 x 3.99 м
      const fSummer = createBox(4.00, PLINTH_H, 3.99, gravelMat.clone(), floorsGroup);
      fSummer.position.set(-7.075, PLINTH_H / 2, 1.05);

      // 3) Пол санузла/котельной: 4.00 x 1.90 м
      const fUtil = createBox(4.00, PLINTH_H, 1.90, concreteMat.clone(), floorsGroup);
      fUtil.position.set(-7.075, PLINTH_H / 2, -2.095);

      // 4) Пол зимней кухни-студии: 9.77 x 6.09 м
      const fWinter = createBox(9.77, PLINTH_H, 6.09, concreteMat.clone(), floorsGroup);
      fWinter.position.set(0.20, PLINTH_H / 2, 0);
    }
    buildPlinths();


  scene.add(groundGroup);
  scene.add(plinthsGroup);
  scene.add(floorsGroup);

  return { groundGroup, plinthsGroup, floorsGroup };
}
