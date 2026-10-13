import { THREE } from './three-global.js';

    function createBurntBrickTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Mortar background
      ctx.fillStyle = '#b8b2a8';
      ctx.fillRect(0, 0, 512, 512);

      const rows = 16;
      const rowH = 512 / rows;
      const brickW = 64;

      const colors = ['#c25c38', '#b8512e', '#cc6642', '#a64426', '#b04928', '#9e3d21', '#8c351b', '#d4714d'];

      for (let r = 0; r < rows; r++) {
        const y = r * rowH;
        const offset = (r % 2) * (brickW / 2);
        for (let x = -brickW; x < 512 + brickW; x += brickW) {
          const colIdx = Math.floor(Math.random() * colors.length);
          ctx.fillStyle = colors[colIdx];
          ctx.fillRect(x + offset + 2, y + 2, brickW - 4, rowH - 4);

          ctx.fillStyle = 'rgba(0, 0, 0, ' + (Math.random() * 0.18) + ')';
          ctx.fillRect(x + offset + 2, y + 2, brickW - 4, rowH - 4);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      return texture;
    }

    const brickTexture = createBurntBrickTexture();

    // --- Materials ---
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.85,
      metalness: 0.05
    });

    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTexture,
      roughness: 0.88,
      metalness: 0.02
    });

    const parapetCapMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.5
    });

    const slabMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.80,
      metalness: 0.05
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.35,
      side: THREE.DoubleSide
    });

    // Оцинкованный профнастил 0.45 мм
    const galvanizedMat = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      roughness: 0.35,
      metalness: 0.75,
      side: THREE.DoubleSide
    });

    // Фольгоизол (серебристый отражающий слой)
    const folgoMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.85,
      side: THREE.DoubleSide
    });

    // Теплоизоляция XPS (Пеноплэкс 50 мм) фирменного оранжевого цвета
    const xpsMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.85,
      metalness: 0.05
    });

    const xpsEdgeMat = new THREE.LineBasicMaterial({
      color: 0xc2410c,
      linewidth: 1
    });

    // Водосточные желоба и трубы
    const gutterMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.40,
      metalness: 0.50
    });

    const timberMat = new THREE.MeshStandardMaterial({
      color: 0xbc9470,
      roughness: 0.75,
      metalness: 0.05
    });

    // Светлая сосна: основная стропильная доска 6.00 м (35×140 мм)
    const timberFrontMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887, // Burlywood / светлая строганая сосна
      roughness: 0.70,
      metalness: 0.05
    });

    // Янтарная сосна: доборный отрезок 2.00 м (35×140 мм, нахлёст 1.0 м + свес 50 см)
    const timberRearMat = new THREE.MeshStandardMaterial({
      color: 0xb5783f, // тёплый янтарный оттенок для чёткой видимости стыка стропил
      roughness: 0.70,
      metalness: 0.05
    });

    // Оцинкованные шпильки М12, увеличенные шайбы DIN 9021 и монтажные уголки
    const boltMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.20,
      metalness: 0.90
    });

    // Оцинкованные ветровые (торцевые) планки свеса и пристенный фартук
    const flashingMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.65
    });

    // Пароизоляционная плёнка 200 мкм (тёмный полиэтилен)
    const vaporMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.40,
      metalness: 0.10,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2f1fd,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.4
    });

    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.8
    });

    const doorLeafMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.6,
      metalness: 0.1
    });

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.95
    });

    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xb0b5bd,
      roughness: 0.9
    });

    const gravelMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.95
    });

    const edgeLineMat = new THREE.LineBasicMaterial({
      color: 0x475569,
      linewidth: 1
    });

    // Материал для монолитных участков (заливных стяжек между плитами ПК)
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // гладкий плотный монолитный железобетон
      roughness: 0.65,
      metalness: 0.08
    });

    const monolithEdgeMat = new THREE.LineBasicMaterial({
      color: 0x334155,
      linewidth: 1
    });


const sheetMat = galvanizedMat;
const pipeMat = gutterMat;
const battenMat = timberMat;

export {
  createBurntBrickTexture,
  concreteMat,
  brickMat,
  parapetCapMat,
  slabMat,
  roofMat,
  galvanizedMat,
  sheetMat,
  pipeMat,
  battenMat,
  folgoMat,
  xpsMat,
  xpsEdgeMat,
  gutterMat,
  timberMat,
  timberFrontMat,
  timberRearMat,
  boltMat,
  flashingMat,
  vaporMat,
  glassMat,
  frameMat,
  handleMat,
  doorLeafMat,
  groundMat,
  plinthMat,
  gravelMat,
  edgeLineMat,
  monolithMat,
  monolithEdgeMat
};

