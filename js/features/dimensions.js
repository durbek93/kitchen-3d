import { THREE } from '../three-global.js';
import { camera } from '../scene.js';

export const dimensionsGroup = new THREE.Group();
export const labels = [];
export const dimLineMaterials = [];
export let currentDimOpacity = 0.50;

let labelsContainer = null;

    function buildDimensionLines() {
      createDimLine([-9.475, 0.2, 4.45], [9.475, 0.2, 4.45], "18.95 м (Общая длина)", 0x38bdf8);
      createDimLine([-9.475, 0.2, 3.85], [-5.075, 0.2, 3.85], "4.00 м (Летняя кухня)", 0x10b981);
      createDimLine([-4.675, 0.2, 3.85], [5.075, 0.2, 3.85], "9.75 м (Зимний зал)", 0xf59e0b);
      createDimLine([5.475, 0.2, 3.85], [9.075, 0.2, 3.85], "3.60 м (Беседка)", 0x38bdf8);

      createDimLine([9.85, 0.2, -3.425], [9.85, 0.2, 3.425], "6.85 м (Общая глубина)", 0x38bdf8);
      createDimLine([-9.85, 0.2, -3.025], [-9.85, 0.2, -1.125], "1.90 м (Санузел + котельная)", 0xa855f7);
      createDimLine([-9.85, 0.2, -0.925], [-9.85, 0.2, 3.025], "3.95 м (Летн. кухня)", 0x10b981);

      createDimLine([3.575, 2.9, 3.45], [5.075, 2.9, 3.45], "1.50 м (ОК-4)", 0xf59e0b);
      createDimLine([2.425, 2.9, 3.45], [3.575, 2.9, 3.45], "1.15 м (Кирпич)", 0x38bdf8);
      createDimLine([0.925, 2.9, 3.45], [2.425, 2.9, 3.45], "1.50 м (ОК-3)", 0xf59e0b);
      createDimLine([0.525, 2.9, 3.45], [0.925, 2.9, 3.45], "0.40 м (Колонна)", 0xa855f7);
      createDimLine([-0.225, 2.9, 3.45], [0.525, 2.9, 3.45], "0.75 м (Кирпич)", 0x38bdf8);
      createDimLine([-1.725, 2.9, 3.45], [-0.225, 2.9, 3.45], "1.50 м (ОК-2)", 0xf59e0b);
      createDimLine([-4.675, 2.9, 3.45], [-1.725, 2.9, 3.45], "2.95 м (Глухая стена)", 0x10b981);

      createDimLine([-9.7, 0, -3.6], [-9.7, 0.50, -3.6], "0.50 м (Цоколь)", 0x38bdf8);
      createDimLine([-9.7, 0.50, -3.6], [-9.7, 2.80, -3.6], "2.30 м (Кладка стен)", 0xe2e8f0);
      createDimLine([-9.7, 2.80, -3.6], [-9.7, 3.20, -3.6], "0.40 м (Ригели 40×38 см)", 0xa855f7);
      createDimLine([-9.7, 3.20, -3.6], [-9.7, 3.42, -3.6], "0.22 м (Плиты ПК)", 0x10b981);
      createDimLine([-9.7, 3.42, -3.6], [-9.7, 4.32, -3.6], "0.90 м (Парапет)", 0x38bdf8);
      createDimLine([0, 3.5, -3.425], [0, 3.5, -3.925], "0.50 м (Вылет кровли назад)", 0x10b981);
      createDimLine([1.0, 3.5, -3.925], [1.0, 3.5, -3.995], "+7 см (Вылет профлиста в желоб)", 0x10b981);
      createDimLine([-9.09, 4.10, 0.5], [9.09, 4.10, 0.5], "18.19 м (Внутр. ширина кровли между парапетами 38 см)", 0x38bdf8);
      createDimLine([0.0, 4.15, -3.425], [0.0, 4.15, 3.045], "6.47 м (Глубина кровли от парапета до задней стены)", 0x38bdf8);
      createDimLine([0.0, 3.90, -0.782], [0.782, 3.90, -0.782], "0.78 м (Шаг стропил — 24 линии)", 0xf59e0b);
      createDimLine([0.0, 3.70, -2.934], [0.0, 3.70, -1.932], "1.00 м (Нахлёст стропил на 4 шпильках М12)", 0x38bdf8);
      createDimLine([2.0, 3.95, 0.0], [2.0, 3.95, -0.496], "0.50 м (Шаг обрешётки — 15 рядов)", 0x10b981);
      createDimLine([5.275, 3.55, -2.425], [9.275, 3.55, -2.425], "3.85 × 1.22 м (Временный настил лестницы)", 0xf59e0b);
      createDimLine([7.275, 3.55, -1.8], [7.275, 3.55, 3.0], "4 плиты 40-12 (Беседка)", 0x38bdf8);
      createDimLine([-9.10, 3.55, 0], [4.80, 3.55, 0], "10 плит 64-12 + 5 монолитных стяжек", 0x38bdf8);
    }

    function createDimLine(p1, p2, text, colorHex) {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...p1),
        new THREE.Vector3(...p2)
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        linewidth: 2,
        transparent: true,
        opacity: currentDimOpacity
      });
      dimLineMaterials.push(mat);

      const line = new THREE.Line(geom, mat);
      dimensionsGroup.add(line);

      [p1, p2].forEach(p => {
        const tickGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p[0], p[1] - 0.1, p[2]),
          new THREE.Vector3(p[0], p[1] + 0.1, p[2])
        ]);
        const tick = new THREE.Line(tickGeom, mat);
        dimensionsGroup.add(tick);
      });

      const mid = [
        (p1[0] + p2[0]) / 2,
        (p1[1] + p2[1]) / 2 + 0.22,
        (p1[2] + p2[2]) / 2
      ];
      add3DLabel(mid, text, colorHex);
    }

    // 3D Labels
    if (!labelsContainer) labelsContainer = document.getElementById('labels-container');

    function add3DLabel(pos, text, colorHex) {
      const el = document.createElement('div');
      el.className = 'label-3d';
      el.textContent = text;
      el.style.borderColor = '#' + colorHex.toString(16).padStart(6, '0');
      el.style.opacity = currentDimOpacity;
      labelsContainer.appendChild(el);

      labels.push({
        element: el,
        position: new THREE.Vector3(...pos)
      });
    }

    // Room center markers
    function addRoomMarkers() {
      add3DLabel([7.275, 1.8, 0], "БЕСЕДКА / ТЕРРАСА (3.60 × 6.05 м | 21.8 м²)", 0x38bdf8);
      add3DLabel([0.20, 1.8, 0], "ЗИМНЯЯ КУХНЯ-СТУДИЯ (9.60 × 6.05 м | 58.1 м²)", 0xf59e0b);
      add3DLabel([-7.075, 1.8, 1.05], "ЛЕТНЯЯ КУХНЯ (4.00 × 3.95 м | 15.8 м²)", 0x10b981);
      add3DLabel([-7.075, 1.8, -2.075], "САНУЗЕЛ + КОТЕЛЬНАЯ (4.00 × 1.90 м | 7.6 м²)", 0xa855f7);
    }
    addRoomMarkers();
    buildDimensionLines();

    function updateDimOpacity(val) {
      currentDimOpacity = val / 100;
      document.getElementById('opacity-val').textContent = val + '%';
      dimLineMaterials.forEach(m => m.opacity = currentDimOpacity);
      labels.forEach(l => l.element.style.opacity = currentDimOpacity);
    }

    const cameraDir = new THREE.Vector3();
    const toLabel = new THREE.Vector3();

    function updateLabels() {
      if (!labelsContainer || labelsContainer.style.display === 'none') return;
      const tempV = new THREE.Vector3();
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      camera.getWorldDirection(cameraDir);

      labels.forEach(lbl => {
        toLabel.copy(lbl.position).sub(camera.position);
        if (toLabel.dot(cameraDir) <= 0.1) {
          lbl.element.style.display = 'none';
          return;
        }

        tempV.copy(lbl.position);
        tempV.project(camera);

        if (tempV.z > 1) {
          lbl.element.style.display = 'none';
          return;
        }

        const x = (tempV.x * halfW) + halfW;
        const y = -(tempV.y * halfH) + halfH;

        if (x < -100 || x > window.innerWidth + 100 || y < -50 || y > window.innerHeight + 50) {
          lbl.element.style.display = 'none';
          return;
        }

        lbl.element.style.display = 'block';
        lbl.element.style.left = x + 'px';
        lbl.element.style.top = y + 'px';
      });
    }


export function initDimensions(scene) {
  labelsContainer = document.getElementById('labels-container');
  buildDimensionLines();
  addRoomMarkers();
  scene.add(dimensionsGroup);
  return { dimensionsGroup };
}

export {
  buildDimensionLines,
  createDimLine,
  add3DLabel,
  addRoomMarkers,
  updateDimOpacity,
  updateLabels
};

