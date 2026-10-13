import { THREE } from '../three-global.js';
import { createBox, createCylinder } from './helpers.js';

export const canopyGroup = new THREE.Group();

export function buildCanopy(scene) {
  // Монолитный поликарбонат дымчатого цвета (smoky bronze tint)
      const polycarbMat = new THREE.MeshPhysicalMaterial({
        color: 0x3a2e22, // Выразительный дымчато-бронзовый оттенок
        roughness: 0.15,
        metalness: 0.15,
        transparent: true,
        opacity: 0.52,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      // Литые кронштейны (чёрный матовый графит / антрацит)
      const bracketMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.45,
        metalness: 0.80
      });

      // Водоотводный желоб и пристенный профиль
      const gutterMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.35,
        metalness: 0.85
      });

      // Оцинкованные анкеры (сталь)
      const boltMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.25,
        metalness: 0.95
      });

      function createCylinder(rTop, rBot, height, segs, mat, group) {
        const geom = new THREE.CylinderGeometry(rTop, rBot, height, segs);
        const mesh = new THREE.Mesh(geom, mat);
        if (group) group.add(mesh);
        return mesh;
      }

      // Геометрия изогнутого полотна поликарбоната:
      // Вылет: 1.25 м (от стены Z = 3.425 м до Z = 4.675 м)
      // Длина: 18.50 м (от X = -9.25 м до X = +9.25 м)
      // Высота у стены: Y = 3.10 м (ригель от 2.80 до 3.20 м)
      // Высота у переднего свеса: Y = 2.68 м (комфортный проход > 2.15 м над цоколем)
      const nx = 64;
      const nz = 24;
      const positions = [];
      const uvs = [];
      const indices = [];

      for (let j = 0; j <= nz; j++) {
        const s = j / nz;
        const z = 3.425 + 1.25 * s;
        const y = 3.10 - 0.10 * s - 0.32 * s * s;
        for (let i = 0; i <= nx; i++) {
          const u = i / nx;
          const x = -9.25 + 18.50 * u;
          positions.push(x, y, z);
          uvs.push(u, s);
        }
      }

      for (let j = 0; j < nz; j++) {
        for (let i = 0; i < nx; i++) {
          const a = j * (nx + 1) + i;
          const b = j * (nx + 1) + (i + 1);
          const c = (j + 1) * (nx + 1) + i;
          const d = (j + 1) * (nx + 1) + (i + 1);
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }

      const polyGeom = new THREE.BufferGeometry();
      polyGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      polyGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      polyGeom.setIndex(indices);
      polyGeom.computeVertexNormals();

      const polyMesh = new THREE.Mesh(polyGeom, polycarbMat);
      polyMesh.renderOrder = 10;
      canopyGroup.add(polyMesh);

      // Пристенная прижимная планка (алюминий с уплотнителем EPDM)
      const wallStrip = createBox(18.52, 0.05, 0.02, gutterMat, canopyGroup);
      wallStrip.position.set(0, 3.115, 3.425 + 0.01);

      // Передний круглый водоотводный профиль (желоб с продольным пазом)
      const frontGutter = createCylinder(0.025, 0.025, 18.54, 16, gutterMat, canopyGroup);
      frontGutter.rotation.z = Math.PI / 2;
      frontGutter.position.set(0, 2.67, 4.675);

      // Торцевые сливные носики («Выход воды») с левой и правой стороны
      [-9.27, 9.27].forEach(sx => {
        const spout = createCylinder(0.020, 0.020, 0.08, 12, gutterMat, canopyGroup);
        spout.rotation.z = (sx > 0 ? -Math.PI / 4 : Math.PI / 4);
        spout.position.set(sx + (sx > 0 ? 0.03 : -0.03), 2.65, 4.675);
      });

      // -----------------------------------------------------------------
      // МОНОЛИТНЫЙ ЛИТОЙ КРОНШТЕЙН (ТОЧНО ПО ФОТО-ОБРАЗЦУ ЮСАРАЙ / PALRAM)
      // Векторный контур с двумя сквозными каплевидными окнами облегчения
      // -----------------------------------------------------------------
      const bracketShape = new THREE.Shape();
      // 1. Задняя вертикальная опорная грань (монтажная база к ригелю)
      bracketShape.moveTo(0, 2.85);
      bracketShape.lineTo(0, 3.08);

      // 2. Верхняя плавная несущая дуга (под поликарбонат)
      const N_pts = 24;
      for (let i = 1; i <= N_pts; i++) {
        const u = (i / N_pts) * 1.22;
        const v = 3.08 - 0.08 * u - 0.20 * u * u;
        bracketShape.lineTo(u, v);
      }

      // 3. Переднее сопряжение с кольцом водостока
      bracketShape.lineTo(1.22, 2.655);

      // 4. Нижний грациозный арочный свод (обратно к низу стеновой базы)
      for (let i = N_pts - 1; i >= 0; i--) {
        const u = (i / N_pts) * 1.22;
        const v = 2.85 - 0.16 * u - 0.20 * u * (1 - u / 1.22);
        bracketShape.lineTo(u, v);
      }
      bracketShape.closePath();

      // Окно 1: Заднее каплевидно-треугольное сквозное окно (как на фото)
      const hole1 = new THREE.Path();
      hole1.moveTo(0.05, 2.89);
      hole1.lineTo(0.05, 3.03);
      hole1.quadraticCurveTo(0.20, 3.01, 0.40, 2.94);
      hole1.lineTo(0.38, 2.80);
      hole1.quadraticCurveTo(0.20, 2.78, 0.05, 2.89);
      hole1.closePath();
      bracketShape.holes.push(hole1);

      // Окно 2: Переднее аэродинамическое вытянутое каплевидное окно (как на фото)
      const hole2 = new THREE.Path();
      hole2.moveTo(0.48, 2.88);
      hole2.quadraticCurveTo(0.70, 2.82, 0.98, 2.73);
      hole2.quadraticCurveTo(0.98, 2.68, 0.90, 2.67);
      hole2.quadraticCurveTo(0.68, 2.68, 0.47, 2.75);
      hole2.closePath();
      bracketShape.holes.push(hole2);

      const extrudeSettings = {
        steps: 1,
        depth: 0.026,
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.003,
        bevelSegments: 2
      };

      const bracketBaseGeom = new THREE.ExtrudeGeometry(bracketShape, extrudeSettings);
      bracketBaseGeom.translate(0, 0, -0.013);
      bracketBaseGeom.rotateY(-Math.PI / 2);
      bracketBaseGeom.translate(0, 0, 3.425);

      // 15 модульных литых кронштейнов с анкерным креплением в монолитный ригель
      const bracketCount = 15;
      const xMin = -9.25;
      const xMax = 9.25;
      const dx = (xMax - xMin) / (bracketCount - 1);

      for (let k = 0; k < bracketCount; k++) {
        const bx = xMin + k * dx;

        // Литой монолитный кронштейн с каплевидными окнами (цельная деталь)
        const bracketMesh = new THREE.Mesh(bracketBaseGeom, bracketMat);
        bracketMesh.position.set(bx, 0, 0);
        canopyGroup.add(bracketMesh);

        // Переднее круглое кольцо-обойма под водосточный желоб (как на фото)
        const socket = createCylinder(0.034, 0.034, 0.032, 24, bracketMat, canopyGroup);
        socket.rotation.z = Math.PI / 2;
        socket.position.set(bx, 2.665, 4.670);

        // Стальные анкеры М10 в тело бетонного ригеля
        [3.05, 2.88].forEach(by => {
          const bolt = createCylinder(0.011, 0.011, 0.025, 8, boltMat, canopyGroup);
          bolt.rotation.x = Math.PI / 2;
          bolt.position.set(bx, by, 3.425 + 0.02);

          const washer = createCylinder(0.016, 0.016, 0.005, 12, boltMat, canopyGroup);
          washer.rotation.x = Math.PI / 2;
          washer.position.set(bx, by, 3.425 + 0.016);
        });

        // Верхняя прижимная арочная накладка поверх поликарбоната (черная полоса вдоль кронштейна)
        const stripSegs = 14;
        for (let m = 0; m < stripSegs; m++) {
          const s1 = m / stripSegs;
          const s2 = (m + 1) / stripSegs;
          const z1 = 3.425 + 1.25 * s1;
          const y1 = (3.10 - 0.10 * s1 - 0.32 * s1 * s1) + 0.004;
          const z2 = 3.425 + 1.25 * s2;
          const y2 = (3.10 - 0.10 * s2 - 0.32 * s2 * s2) + 0.004;

          const dz = z2 - z1;
          const dy = y2 - y1;
          const segLen = Math.hypot(dz, dy);
          const angle = Math.atan2(dy, dz);

          const capStrip = createBox(0.024, 0.006, segLen, bracketMat, canopyGroup);
          capStrip.position.set(bx, (y1 + y2) / 2, (z1 + z2) / 2);
          capStrip.rotation.x = -angle;
        }
      }

  scene.add(canopyGroup);
  canopyGroup.visible = true;
  return { canopyGroup };
}
