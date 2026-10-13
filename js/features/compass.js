import { THREE } from '../three-global.js';
import { dimensionsGroup, add3DLabel } from './dimensions.js';

    function build3DCompass() {
      const compGroup = new THREE.Group();
      compGroup.position.set(0, 0.03, 8.2); // Центр двора перед зданием
      dimensionsGroup.add(compGroup);

      // Внешнее круговое кольцо компаса (диаметр ~5 м)
      const ringGeom = new THREE.RingGeometry(2.35, 2.45, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x475569, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      compGroup.add(ringMesh);

      // Внутреннее тонкое кольцо
      const innerRingGeom = new THREE.RingGeometry(1.60, 1.63, 48);
      const innerRingMat = new THREE.MeshBasicMaterial({ color: 0x334155, side: THREE.DoubleSide });
      const innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
      innerRing.rotation.x = -Math.PI / 2;
      compGroup.add(innerRing);

      // Реальные единичные векторы сторон света для Ферганы (задняя стена = 156° ЮВ):
      // СЕВЕР (0°): направлен во двор и чуть вправо (X=0.407, Z=0.914)
      // ЮГ (180°): направлен за заднюю стену и чуть влево (X=-0.407, Z=-0.914)
      // ВОСТОК (90°): направлен в сторону беседки и назад (X=0.914, Z=-0.407)
      // ЗАПАД (270°): направлен в сторону летней кухни и вперед (X=-0.914, Z=0.407)
      const vNorth = new THREE.Vector3(0.407, 0, 0.914);
      const vSouth = new THREE.Vector3(-0.407, 0, -0.914);
      const vEast = new THREE.Vector3(0.914, 0, -0.407);
      const vWest = new THREE.Vector3(-0.914, 0, 0.407);

      // Осевые направляющие линии
      const lineMatNS = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      const lineMatEW = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });

      // Ось Север - Юг
      const geomNS = new THREE.BufferGeometry().setFromPoints([
        vSouth.clone().multiplyScalar(2.4),
        vNorth.clone().multiplyScalar(2.4)
      ]);
      compGroup.add(new THREE.Line(geomNS, lineMatNS));

      // Ось Запад - Восток
      const geomEW = new THREE.BufferGeometry().setFromPoints([
        vWest.clone().multiplyScalar(2.4),
        vEast.clone().multiplyScalar(2.4)
      ]);
      compGroup.add(new THREE.Line(geomEW, lineMatEW));

      // Функция создания стрелки конуса по заданному направлению
      function createArrow(dir, color, size) {
        const coneGeom = new THREE.ConeGeometry(0.18, size || 0.55, 4);
        const coneMat = new THREE.MeshBasicMaterial({ color });
        const cone = new THREE.Mesh(coneGeom, coneMat);
        cone.position.copy(dir.clone().multiplyScalar(2.4));
        cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        return cone;
      }

      compGroup.add(createArrow(vNorth, 0x38bdf8, 0.60)); // Север (синий)
      compGroup.add(createArrow(vSouth, 0xf59e0b, 0.60)); // Юг (янтарный - солнце!)
      compGroup.add(createArrow(vEast, 0x10b981, 0.50));  // Восток (зеленый)
      compGroup.add(createArrow(vWest, 0xf97316, 0.50));  // Запад (оранжевый)

      // 3D выноски сторон света (привязаны к реальным азимутам участка)
      const cCenter = compGroup.position;
      add3DLabel([cCenter.x + vNorth.x * 3.3, 0.35, cCenter.z + vNorth.z * 3.3], "СЕВЕР (336°: Фасад и двор)", 0x38bdf8);
      add3DLabel([cCenter.x + vSouth.x * 3.3, 0.35, cCenter.z + vSouth.z * 3.3], "ЮГ (156°: Задняя стена)", 0xf59e0b);
      add3DLabel([cCenter.x + vEast.x * 3.3, 0.35, cCenter.z + vEast.z * 3.3], "ВОСТОК (66°: Беседка)", 0x10b981);
      add3DLabel([cCenter.x + vWest.x * 3.3, 0.35, cCenter.z + vWest.z * 3.3], "ЗАПАД (246°: Летняя кухня)", 0xf97316);
    }
    build3DCompass();


export { build3DCompass };
