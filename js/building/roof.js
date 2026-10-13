import { THREE } from '../three-global.js';
import { T, PLINTH_H, WALL_TOP, BEAM_H, BEAM_W, BEAM_BOT, SLAB_THICK, PARAPET_H } from '../constants.js';
import {
  slabMat, parapetCapMat, vaporMat, xpsMat, xpsEdgeMat, timberMat, timberFrontMat, timberRearMat,
  boltMat, folgoMat, sheetMat, galvanizedMat, flashingMat, gutterMat, brickMat
} from '../materials.js';
import { createBox, createMonolithBox, createBoxWithMetricUV } from './helpers.js';
import { canopyGroup } from './canopy.js';

// Группы послойного монтажа кровли
export const slabsGroup = new THREE.Group();
export const stairCoverGroup = new THREE.Group();
export const parapetGroup = new THREE.Group();
export const filmGroup = new THREE.Group();
export const xpsGroup = new THREE.Group();
export const postsGroup = new THREE.Group();
export const raftersFrontGroup = new THREE.Group();
export const raftersRearGroup = new THREE.Group();
export const battensGroup = new THREE.Group();
export const folgoGroup = new THREE.Group();
export const sheetGroup = new THREE.Group();

// Обратная совместимость для вспомогательных вызовов
export const insulationGroup = new THREE.Group();
export const raftersGroup = new THREE.Group();
export const pitchedRoofGroup = new THREE.Group();

    function buildCeilingSlabs() {
      const slabW12 = 1.18; // номинал 1.20 м (факт 1.18 м с рустом)
      const slabL64 = 6.40; // длина плит ПК 64-12 (опирание на фасадный и задний ригели по 15.5 см)
      const slabY = WALL_TOP + SLAB_THICK / 2; // 3.31 м

      // -------------------------------------------------------------
      // 1) БЕСЕДКА (Ось 3 - Ось 2, справа со двора):
      // 4 плиты 40-12 (длина 3.85 м вдоль здания, опирание на поперечные ригели).
      // 5-й слот со стороны заднего двора свободен — открыт проём 3.85 × 1.22 м под лестницу на крышу!
      // -------------------------------------------------------------
      const gazSlabLengthX = 3.85;
      const gazSlabWidthZ = 1.18;
      const gazSlabCenterX = 7.275;
      const gazSlabZPositions = [-1.20, 0.00, 1.20, 2.40];
      gazSlabZPositions.forEach(z => {
        const slab = createBox(gazSlabLengthX, SLAB_THICK, gazSlabWidthZ, slabMat, slabsGroup);
        slab.position.set(gazSlabCenterX, slabY, z);
      });

      // -------------------------------------------------------------
      // 2) ЗИМНЯЯ КУХНЯ (Справа налево: от портала беседки к перегородке с/у):
      // Семь плит марки 64-12 + 4 монолитных участка (стяжки)
      // -------------------------------------------------------------
      // Плита №1 (64-12) — примыкает к пилону витража беседки
      const s1 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s1.position.set(4.475, slabY, 0);

      // Монолитный участок №1 (стяжка 28 см)
      const m1 = createMonolithBox(0.28, SLAB_THICK, slabL64, slabsGroup);
      m1.position.set(3.735, slabY, 0);

      // Плита №2 (64-12)
      const s2 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s2.position.set(2.995, slabY, 0);

      // Монолитный участок №2 (стяжка 28 см)
      const m2 = createMonolithBox(0.28, SLAB_THICK, slabL64, slabsGroup);
      m2.position.set(2.255, slabY, 0);

      // Плита №3 (64-12) — опирается на выпуски арматуры фасадной колонны
      const s3 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s3.position.set(1.515, slabY, 0);

      // Монолитный участок №3 (стяжка 42 см над колонной X = 0.725)
      const m3 = createMonolithBox(0.42, SLAB_THICK, slabL64, slabsGroup);
      m3.position.set(0.705, slabY, 0);

      // Плиты №4, №5, №6 (64-12) — 3 плиты подряд без зазоров (сплошной настил 3.60 м)
      const s4 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s4.position.set(-0.105, slabY, 0);

      const s5 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s5.position.set(-1.305, slabY, 0);

      const s6 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s6.position.set(-2.505, slabY, 0);

      // Монолитный участок №4 (стяжка 45 см у второй колонны)
      const m4 = createMonolithBox(0.45, SLAB_THICK, slabL64, slabsGroup);
      m4.position.set(-3.330, slabY, 0);

      // Плита №7 (64-12) — крайняя плита зимней кухни перед капитальной стеной 38 см
      const s7 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s7.position.set(-4.155, slabY, 0);

      // -------------------------------------------------------------
      // 3) ЛЕТНЯЯ КУХНЯ + САНУЗЕЛ/КОТЕЛЬНАЯ (Справа налево: от стены с/у к торцу):
      // Три плиты марки 64-12 + монолитный участок №5 + торцевой добор
      // -------------------------------------------------------------
      // Плита №8 (64-12)
      const s8 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s8.position.set(-5.680, slabY, 0);

      // Плита №9 (64-12) — идёт подряд за плитой №8
      const s9 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s9.position.set(-6.880, slabY, 0);

      // Монолитный участок №5 (стяжка 44 см)
      const m5 = createMonolithBox(0.44, SLAB_THICK, slabL64, slabsGroup);
      m5.position.set(-7.700, slabY, 0);

      // Плита №10 (64-12)
      const s10 = createBox(slabW12, SLAB_THICK, slabL64, slabMat, slabsGroup);
      s10.position.set(-8.520, slabY, 0);

      // Заливка ригеля/монолита до уровня плит у торцевой стены (Ось 5)
      const mEnd = createMonolithBox(0.38, SLAB_THICK, slabL64, slabsGroup);
      mEnd.position.set(-9.285, slabY, 0);

      // -------------------------------------------------------------
      // 4) АРМОПОЯС НА УРОВНЕ ПЛИТ (H = 22 см, закрывает торцы плит снаружи)
      // -------------------------------------------------------------
      const pBeltF = createMonolithBox(18.95, SLAB_THICK, 0.225, slabsGroup);
      pBeltF.position.set(0, slabY, 3.3125);

      const pBeltB = createMonolithBox(18.95, SLAB_THICK, 0.225, slabsGroup);
      pBeltB.position.set(0, slabY, -3.3125);

      // -------------------------------------------------------------
      // 5) ПОПЕРЕЧНЫЕ МОНОЛИТНЫЕ ЗАЛИВКИ (H = 22 см, строго в уровень с плитами перекрытия)
      // -------------------------------------------------------------
      // Зона 1: Монолитный пояс между зимней и летней кухней (над стеной и ригелем Оси 4)
      const mBeltDiv = createMonolithBox(0.38, SLAB_THICK, 6.40, slabsGroup);
      mBeltDiv.position.set(-4.875, slabY, 0);

      // Зона 2: Монолитный пояс между зимней кухней и беседкой (над ригелем Оси 3)
      const mBeltGaz = createMonolithBox(0.38, SLAB_THICK, 6.40, slabsGroup);
      mBeltGaz.position.set(5.275, slabY, 0);

      // Зона 3: Монолитный пояс по наружному торцу беседки (над торцевым ригелем Оси 2)
      const mBeltEndGaz = createMonolithBox(0.38, SLAB_THICK, 6.40, slabsGroup);
      mBeltEndGaz.position.set(9.285, slabY, 0);
    }
    buildCeilingSlabs();

    // -----------------------------------------------------------------
    // 1. ВРЕМЕННЫЙ НАСТИЛ ЛЕСТНИЧНОГО ПРОЁМА (Шаг 1)
    // -----------------------------------------------------------------
    function buildStairCover() {
      const slabTopY = WALL_TOP + SLAB_THICK; // 3.42 м
      // Проём 3.85 × 1.22 м (X: от 5.35 до 9.20 м, Z: от -1.815 до -3.035 м, центр Z = -2.425)
      // Опорные поперечные балки 50×100 мм под настил
      const joistZ = [-2.85, -2.425, -2.00];
      joistZ.forEach(jz => {
        const jst = createBox(3.85, 0.05, 0.10, timberMat, stairCoverGroup);
        jst.position.set(7.275, slabTopY - 0.05, jz);
      });
      // Деревянный сплошной настил из досок 35 мм вровень с плитами перекрытия
      const stairCover = createBox(3.85, 0.035, 1.20, timberMat, stairCoverGroup);
      stairCover.position.set(7.275, slabTopY - 0.0175, -2.425);
    }
    buildStairCover();

    // -----------------------------------------------------------------
    // 2. ПАРАПЕТНЫЕ СТЕНЫ (90 см) И ОЦИНКОВАННЫЕ КРЫШКИ (Шаг 2)
    // -----------------------------------------------------------------
    function buildParapet() {
      const parapetBaseY = WALL_TOP + SLAB_THICK; // 3.42 м
      const pY = parapetBaseY + PARAPET_H / 2; // 3.87 м
      const pThick = 0.38;

      // Передний фасадный парапет (18.95 м, высота 90 см)
      const pFront = createBoxWithMetricUV(18.95, PARAPET_H, pThick, brickMat, parapetGroup);
      pFront.position.set(0, pY, 3.235);

      // Боковые парапетные стены на полную глубину 6.85 м (Z: от -3.425 до +3.425 м)
      const pDepth = 6.85;
      const pLeft = createBoxWithMetricUV(pThick, PARAPET_H, pDepth, brickMat, parapetGroup);
      pLeft.position.set(-9.285, pY, 0);

      const pRight = createBoxWithMetricUV(pThick, PARAPET_H, pDepth, brickMat, parapetGroup);
      pRight.position.set(9.285, pY, 0);

      // Оцинкованные парапетные крышки (фартуки с капельником)
      const capH = 0.04;
      const capY = parapetBaseY + PARAPET_H + capH / 2;

      const capFront = createBox(18.95, capH, pThick + 0.06, parapetCapMat, parapetGroup);
      capFront.position.set(0, capY, 3.235);

      const capLeft = createBox(pThick + 0.06, capH, pDepth + 0.06, parapetCapMat, parapetGroup);
      capLeft.position.set(-9.285, capY, 0);

      const capRight = createBox(pThick + 0.06, capH, pDepth + 0.06, parapetCapMat, parapetGroup);
      capRight.position.set(9.285, capY, 0);
    }
    buildParapet();

    // -----------------------------------------------------------------
    // 3. ПАРОИЗОЛЯЦИОННАЯ ПЛЁНКА 200 МКМ (Шаг 3)
    // -----------------------------------------------------------------
    // -----------------------------------------------------------------
    // 3. ПАРОИЗОЛЯЦИОННАЯ ПЛЁНКА 200 МКМ (Шаг 3)
    // -----------------------------------------------------------------
    function buildVaporFilm() {
      const slabTopY = WALL_TOP + SLAB_THICK; // 3.42 м
      const filmW = 18.18; // 18.19 м между парапетами 38 см
      const filmD = 6.47;  // 6.47 м от фасадного парапета до задней стены
      const centerZ = -0.19; // центр между +3.045 и -3.425 м

      // Сплошной слой по всей площади плит и временного настила
      const vaporGeom = new THREE.PlaneGeometry(filmW, filmD);
      const vaporMesh = new THREE.Mesh(vaporGeom, vaporMat);
      vaporMesh.rotation.x = -Math.PI / 2;
      vaporMesh.position.set(0, slabTopY + 0.003, centerZ);
      filmGroup.add(vaporMesh);

      // Заход плёнки на парапеты (вертикальные нахлёсты 15 см)
      const flapH = 0.15;
      const flapFront = new THREE.Mesh(new THREE.PlaneGeometry(filmW, flapH), vaporMat);
      flapFront.position.set(0, slabTopY + flapH / 2, 3.045);
      filmGroup.add(flapFront);

      const flapLeft = new THREE.Mesh(new THREE.PlaneGeometry(filmD, flapH), vaporMat);
      flapLeft.rotation.y = Math.PI / 2;
      flapLeft.position.set(-9.09, slabTopY + flapH / 2, centerZ);
      filmGroup.add(flapLeft);

      const flapRight = new THREE.Mesh(new THREE.PlaneGeometry(filmD, flapH), vaporMat);
      flapRight.rotation.y = -Math.PI / 2;
      flapRight.position.set(9.09, slabTopY + flapH / 2, centerZ);
      filmGroup.add(flapRight);
    }
    buildVaporFilm();

    // -----------------------------------------------------------------
    // 4. ТЕПЛОИЗОЛЯЦИЯ XPS ПЕНОПЛЭКС 50 ММ (Шаг 4)
    // -----------------------------------------------------------------
    function buildXPS() {
      const slabTopY = WALL_TOP + SLAB_THICK; // 3.42 м
      const xpsThick = 0.05;
      const xpsY = slabTopY + xpsThick / 2 + 0.006;
      const xpsTotalW = 18.18;
      const xpsTotalD = 6.47;
      const centerZ = -0.19;

      const xpsMesh = new THREE.Mesh(new THREE.BoxGeometry(xpsTotalW, xpsThick, xpsTotalD), xpsMat);
      xpsMesh.position.set(0, xpsY, centerZ);
      xpsMesh.castShadow = true;
      xpsMesh.receiveShadow = true;

      const xpsEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(xpsTotalW, xpsThick, xpsTotalD));
      xpsMesh.add(new THREE.LineSegments(xpsEdges, xpsEdgeMat));
      xpsGroup.add(xpsMesh);

      // Линии сетки швов плит Пеноплэкс (1.20 × 0.60 м со смещением)
      const seamPoints = [];
      for (let z = -3.10; z <= 2.91; z += 0.60) {
        seamPoints.push(new THREE.Vector3(-xpsTotalW / 2, xpsY + xpsThick / 2 + 0.001, z));
        seamPoints.push(new THREE.Vector3(xpsTotalW / 2, xpsY + xpsThick / 2 + 0.001, z));
      }
      for (let x = -8.4; x <= 8.41; x += 1.20) {
        seamPoints.push(new THREE.Vector3(x, xpsY + xpsThick / 2 + 0.001, centerZ - xpsTotalD / 2));
        seamPoints.push(new THREE.Vector3(x, xpsY + xpsThick / 2 + 0.001, centerZ + xpsTotalD / 2));
      }
      const seamLinesGeom = new THREE.BufferGeometry().setFromPoints(seamPoints);
      const seamLines = new THREE.LineSegments(seamLinesGeom, xpsEdgeMat);
      xpsGroup.add(seamLines);
    }
    buildXPS();

    // -----------------------------------------------------------------
    // 5. ОПОРНЫЕ СТОЙКИ, ЛЕЖЕНЬ, МАУЭРЛАТ И ПРОГОНЫ (Шаг 5)
    // -----------------------------------------------------------------
    function buildPostsAndPurlins() {
      const slabTopY = WALL_TOP + SLAB_THICK; // 3.42 м
      const zFront = 3.045;
      const zRearEdge = -3.925;
      const deltaZ = zFront - zRearEdge; // 6.97 м
      const deltaY = 4.00 - 3.415;       // 0.585 м
      const purlinW_Total = 18.18;       // внутренняя ширина между парапетами 38 см

      // А) Передний подстропильный брус 100×100 мм и вертикальные стойки h=48 см
      const frontPurlin = createBox(purlinW_Total, 0.10, 0.10, timberMat, postsGroup);
      frontPurlin.position.set(0, 3.95, zFront - 0.05);

      for (let x = -8.6; x <= 8.61; x += 2.4) {
        const post = createBox(0.10, 0.48, 0.10, timberMat, postsGroup);
        post.position.set(x, 3.42 + 0.24, zFront - 0.05);
      }

      // Б) Задний мауэрлат: доска 35×140 мм плашмя по задней стене через рубероид
      const ruberoidRear = createBox(purlinW_Total, 0.005, 0.16, new THREE.MeshBasicMaterial({ color: 0x1e293b }), postsGroup);
      ruberoidRear.position.set(0, slabTopY + 0.0025, -3.235);

      const rearMauerlat = createBox(purlinW_Total, 0.035, 0.14, timberMat, postsGroup);
      rearMauerlat.position.set(0, slabTopY + 0.005 + 0.0175, -3.235);

      // В) Промежуточный опорный прогон в середине 6-метрового пролёта (ось Z = +0.50 м)
      const zMid = 0.50;
      const bottomRafterAtMid = 3.415 + deltaY * (zMid - zRearEdge) / deltaZ; // ~3.786 м
      const purlinH = 0.10;
      const purlinW = 0.10;
      const purlinCenterY = bottomRafterAtMid - purlinH / 2; // ~3.736 м

      const midLezhen = createBox(purlinW_Total, 0.035, 0.14, timberMat, postsGroup);
      midLezhen.position.set(0, slabTopY + 0.0175, zMid);

      const midPurlin = createBox(purlinW_Total, purlinH, purlinW, timberMat, postsGroup);
      midPurlin.position.set(0, purlinCenterY, zMid);

      const postHMid = (purlinCenterY - purlinH / 2) - (slabTopY + 0.035); // ~23 см
      for (let x = -8.6; x <= 8.61; x += 2.4) {
        const mPost = createBox(0.10, postHMid, 0.10, timberMat, postsGroup);
        mPost.position.set(x, slabTopY + 0.035 + postHMid / 2, zMid);
      }

      // Г) Разгрузочный подстропильный прогон под стыком стропил (ось Z = -2.05 м)
      // Расположен прямо под началом 1-метрового нахлёста доборов стропил!
      const zSplice = -2.05;
      const bottomRafterAtSplice = 3.415 + deltaY * (zSplice - zRearEdge) / deltaZ; // ~3.572 м
      const splicePurlinCenterY = bottomRafterAtSplice - purlinH / 2; // ~3.522 м

      const spliceLezhen = createBox(purlinW_Total, 0.035, 0.14, timberMat, postsGroup);
      spliceLezhen.position.set(0, slabTopY + 0.0175, zSplice);

      const splicePurlin = createBox(purlinW_Total, purlinH, purlinW, timberMat, postsGroup);
      splicePurlin.position.set(0, splicePurlinCenterY, zSplice);

      const postHSplice = Math.max(0.04, (splicePurlinCenterY - purlinH / 2) - (slabTopY + 0.035));
      for (let x = -8.6; x <= 8.61; x += 2.4) {
        const sPost = createBox(0.10, postHSplice, 0.10, timberMat, postsGroup);
        sPost.position.set(x, slabTopY + 0.035 + postHSplice / 2, zSplice);
      }
    }
    buildPostsAndPurlins();

    // -----------------------------------------------------------------
    // 6. СТРОПИЛЬНАЯ СИСТЕМА: 6.0 М + ДОБОР 2.0 М С НАХЛЁСТОМ 1.0 М (Шаг 6)
    // -----------------------------------------------------------------
    function buildRafters() {
      const zFront = 3.045;
      const zRearEdge = -3.925; // свес 50 см за задней стеной (-3.425 м)
      const deltaZ = zFront - zRearEdge; // 6.97 м
      const deltaY = 4.00 - 3.415;       // 0.585 м
      const slopeAngle = -Math.atan2(deltaY, deltaZ); // ~ -4.80°
      const cosA = Math.cos(slopeAngle);

      const rafterThickness = 0.035;
      const rafterHeight = 0.14;

      // 1) ОСНОВНАЯ СТРОПИЛЬНАЯ ДОСКА (Целая доска 6.00 м по скату):
      // От zFront = +3.045 м вниз по скату на 6.00 м.
      // Конец доски: Z = +3.045 - 6.00 * cosA = -2.934 м.
      const mainLen = 6.00;
      const zMainEnd = zFront - mainLen * cosA; // ~ -2.934 м
      const mainCenterZ = (zFront + zMainEnd) / 2; // ~ +0.0555 м
      const mainEndY = 4.00 - deltaY * (zFront - zMainEnd) / deltaZ; // ~ 3.498 м
      const mainCenterY = (4.00 + mainEndY) / 2 + rafterHeight / 2; // ~ 3.819 м

      // 2) ДОБОРНЫЙ ОТРЕЗОК СТРОПИЛА (Длина 2.00 м по скату):
      // Доходит до карнизного свеса zRearEdge = -3.925 м.
      // Начало отрезка: Z = -3.925 + 2.00 * cosA = -1.932 м.
      // НАХЛЁСТ со стропилом 6.0 м: от -1.932 м до -2.934 м = ровно 1.00 м по скату!
      const extLen = 2.00;
      const zExtStart = zRearEdge + extLen * cosA; // ~ -1.932 м
      const extCenterZ = (zExtStart + zRearEdge) / 2; // ~ -2.9285 м
      const extStartY = 3.415 + deltaY * (zExtStart - zRearEdge) / deltaZ; // ~ 3.582 м
      const extCenterY = (extStartY + 3.415) / 2 + rafterHeight / 2; // ~ 3.5685 м

      // 24 стропильные линии (шаг ~78.2 см между парапетами 38 см)
      const numLines = 24;
      const xStart = -8.995;
      const xEnd = 8.995;
      const stepX = (xEnd - xStart) / (numLines - 1); // ~0.782 м

      for (let i = 0; i < numLines; i++) {
        const x = xStart + i * stepX;

        // А) Основная доска 6.0 м (светлая строганая сосна)
        const rMain = createBox(rafterThickness, rafterHeight, mainLen, timberFrontMat, raftersFrontGroup);
        rMain.rotation.x = slopeAngle;
        rMain.position.set(x - rafterThickness / 2, mainCenterY, mainCenterZ);

        // Б) Доборный отрезок 2.0 м (янтарная сосна для чёткой видимости стыка)
        const rExt = createBox(rafterThickness, rafterHeight, extLen, timberRearMat, raftersRearGroup);
        rExt.rotation.x = slopeAngle;
        rExt.position.set(x + rafterThickness / 2, extCenterY, extCenterZ);

        // В) Стальные шпильки М12 с шайбами DIN 9021 в зоне нахлёста 1.0 м
        // 4 шпильки равномерно по всей длине нахлёста (-1.93 м .. -2.93 м)
        const boltPositionsZ = [-2.05, -2.32, -2.58, -2.85];
        boltPositionsZ.forEach(bz => {
          const bY = 4.00 - deltaY * (zFront - bz) / deltaZ + rafterHeight / 2;
          const boltGeom = new THREE.CylinderGeometry(0.009, 0.009, 0.09, 12);
          const boltMesh = new THREE.Mesh(boltGeom, boltMat);
          boltMesh.rotation.z = Math.PI / 2;
          boltMesh.position.set(x, bY, bz);
          raftersRearGroup.add(boltMesh);

          // Шайбы увеличенные по бокам с обеих сторон
          [-0.042, 0.042].forEach(wx => {
            const washerGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.004, 16);
            const washer = new THREE.Mesh(washerGeom, boltMat);
            washer.rotation.z = Math.PI / 2;
            washer.position.set(x + wx, bY, bz);
            raftersRearGroup.add(washer);
          });
        });

        // Г) Опорные монтажные усиленные уголки к прогону под стыком и к мауэрлату
        const bracketGeom = new THREE.BoxGeometry(0.04, 0.07, 0.07);

        // Уголок к прогону под стыком (Z = -2.05 м)
        const b1 = new THREE.Mesh(bracketGeom, boltMat);
        b1.position.set(x + rafterThickness + 0.02, 3.522 + 0.05, -2.05);
        raftersRearGroup.add(b1);

        // Уголок к заднему мауэрлату (Z = -3.235 м)
        const b2 = new THREE.Mesh(bracketGeom, boltMat);
        b2.position.set(x + rafterThickness + 0.02, 3.44 + 0.035, -3.235);
        raftersRearGroup.add(b2);
      }

      // Лобовая доска карниза (доска 25×140 мм вдоль всего заднего свеса Z = -3.925 м)
      // Полностью закрывает торцы деревянных стропил снаружи!
      const fasciaBoard = createBox(18.18, rafterHeight, 0.025, timberRearMat, raftersRearGroup);
      fasciaBoard.rotation.x = slopeAngle;
      fasciaBoard.position.set(0, 3.415 + rafterHeight / 2, zRearEdge - 0.0125);
    }
    buildRafters();

    // -----------------------------------------------------------------
    // 7. ОБРЕШЁТКА 40×50 ММ (Шаг 50 см, 15 рядов) (Шаг 7)
    // -----------------------------------------------------------------
    function buildBattens() {
      const zFront = 3.045;
      const zRearEdge = -3.925;
      const deltaZ = zFront - zRearEdge; // 6.97 м
      const deltaY = 4.00 - 3.415;       // 0.585 м
      const slopeAngle = -Math.atan2(deltaY, deltaZ);
      const rafterTotalLen = Math.hypot(deltaZ, deltaY); // ~7.00 м

      const battW = 18.18; // внутренняя ширина между парапетами 38 см
      const battThick = 0.04;
      const battDepth = 0.05;
      const numBattens = 15; // РОВНО 15 рядов бруска
      const rafterBattSpan = rafterTotalLen - 0.06; // карнизный брусок отступает 6 см от края
      const battStep = rafterBattSpan / (numBattens - 1); // шаг ровно ~49.6 см (~50 см)

      for (let i = 0; i < numBattens; i++) {
        const sDist = i * battStep; // расстояние от верхнего края ската
        const bZ = zFront - sDist * Math.cos(slopeAngle);
        const bY = 4.00 - sDist * Math.sin(-slopeAngle) + 0.14 + battThick / 2;

        const batten = createBox(battW, battThick, battDepth, timberMat, battensGroup);
        batten.rotation.x = slopeAngle;
        batten.position.set(0, bY, bZ);
      }
    }
    buildBattens();

    // -----------------------------------------------------------------
    // 8. СЛОЙ ФОЛЬГОИЗОЛА (Шаг 8)
    // -----------------------------------------------------------------
    function buildFolgoizol() {
      const zFront = 3.045;
      const zRearEdge = -3.935;
      const deltaZ = zFront - zRearEdge;
      const deltaY = 4.00 - 3.414;
      const slopeAngle = -Math.atan2(deltaY, deltaZ);
      const folgoLen = Math.hypot(deltaZ, deltaY);
      const roofW = 18.18;

      const centerZ = (zFront + zRearEdge) / 2;
      const centerY = (4.00 + 3.414) / 2 + 0.14 + 0.04 + 0.003;

      const folgoMesh = new THREE.Mesh(new THREE.PlaneGeometry(roofW, folgoLen), folgoMat);
      folgoMesh.rotation.x = slopeAngle - Math.PI / 2;
      folgoMesh.position.set(0, centerY, centerZ);
      folgoGroup.add(folgoMesh);
    }
    buildFolgoizol();

    // -----------------------------------------------------------------
    // 9. ПРОФНАСТИЛ 0.45 ММ (+7 см свес), ВЕТРОВЫЕ ПЛАНКИ, ВОДОСТОК (Шаг 9)
    // -----------------------------------------------------------------
    function buildSheetAndFinishing() {
      const zFront = 3.045;
      const zRearEdge = -3.925; // торец стропил (свес 50 см)
      // ВНИМАНИЕ: Свес профнастила выходит на +7 см ДАЛЬШЕ стропил!
      // Стропила кончаются на -3.925 м, а профнастил выходит до -3.995 м!
      const zSheetRear = -3.995;
      const deltaZ = zFront - zSheetRear; // 7.04 м
      const deltaY = 4.00 - (3.415 - 0.070 * (0.585 / 6.97)); // ~0.591 м
      const slopeAngle = -Math.atan2(deltaY, deltaZ);
      const sheetLen = Math.hypot(deltaZ, deltaY); // ~7.06 м
      const roofW = 18.18; // между парапетами 38 см

      const centerZ = (zFront + zSheetRear) / 2;
      const centerY = (4.00 + 3.409) / 2 + 0.14 + 0.04 + 0.016;

      // 1) Оцинкованный профнастил 0.45 мм
      const profMesh = new THREE.Mesh(new THREE.BoxGeometry(roofW, 0.015, sheetLen), galvanizedMat);
      profMesh.rotation.x = slopeAngle;
      profMesh.position.set(0, centerY, centerZ);
      profMesh.castShadow = true;
      profMesh.receiveShadow = true;

      // Трапециевидные волны (гофры) профнастила каждые 20 см вдоль здания
      const ribPoints = [];
      const halfL = sheetLen / 2;
      for (let rx = -roofW / 2 + 0.10; rx <= roofW / 2; rx += 0.20) {
        ribPoints.push(new THREE.Vector3(rx, 0.015, -halfL));
        ribPoints.push(new THREE.Vector3(rx, 0.015, halfL));
      }
      const ribsGeom = new THREE.BufferGeometry().setFromPoints(ribPoints);
      const ribLines = new THREE.LineSegments(ribsGeom, new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 }));
      profMesh.add(ribLines);
      sheetGroup.add(profMesh);

      // 2) Оцинкованная карнизная планка и облицовка лобовой доски
      // Полностью закрывает торцы деревянных стропил и направляет сток в желоб
      const fasciaMetal = createBox(roofW, 0.15, 0.030, flashingMat, sheetGroup);
      fasciaMetal.rotation.x = slopeAngle;
      fasciaMetal.position.set(0, 3.415 + 0.07, zRearEdge - 0.0125);

      const dripApron = createBox(roofW, 0.003, 0.16, flashingMat, sheetGroup);
      dripApron.rotation.x = slopeAngle;
      dripApron.position.set(0, 3.59, -3.94);

      // 3) Ветровые (торцевые) планки на боковых свесах кровли (слева и справа)
      // Закрывают боковые срезы стропил и обрешётки от ветра и дождя!
      const windTrimL = 0.58; // от задней стены -3.425 до края свеса -3.995
      const windTrimCenterZ = (-3.425 + zSheetRear) / 2;
      const windTrimY = 3.57;
      [-roofW / 2 - 0.01, roofW / 2 + 0.01].forEach(wx => {
        // Вертикальное крыло планки (закрывает бок)
        const trimV = createBox(0.01, 0.22, windTrimL, flashingMat, sheetGroup);
        trimV.rotation.x = slopeAngle;
        trimV.position.set(wx, windTrimY - 0.06, windTrimCenterZ);

        // Горизонтальный нахлёст планки на профлист
        const trimH = createBox(0.08, 0.01, windTrimL, flashingMat, sheetGroup);
        trimH.rotation.x = slopeAngle;
        trimH.position.set(wx > 0 ? wx - 0.04 : wx + 0.04, windTrimY + 0.05, windTrimCenterZ);
      });

      // 4) Пристенная планка примыкания (фартук) со стороны переднего парапета
      const apronH = 0.15;
      const apronD = 0.12;
      const apronY = 4.00 + 0.14 + 0.04 + 0.05;
      const apron = createBox(roofW, apronH, apronD, parapetCapMat, sheetGroup);
      apron.rotation.x = slopeAngle * 0.5;
      apron.position.set(0, apronY, zFront - 0.02);

      // 5) Водосточный желоб: расположен строго под вылетом профлиста (Z = -4.01 м)
      const gutterY = 3.45;
      const gutter = createBox(roofW + 0.20, 0.09, 0.14, gutterMat, sheetGroup);
      gutter.position.set(0, gutterY, -4.01);

      // 6) Три водосточные трубы 100 мм: по краям X = ±8.80 и по центру X = 0
      const downpipePositions = [-8.80, 0.00, 8.80];
      const pipeH = gutterY - 0.20;
      downpipePositions.forEach(px => {
        const elbow = createBox(0.10, 0.08, 0.45, gutterMat, sheetGroup);
        elbow.position.set(px, gutterY - 0.04, -3.72);

        const pipe = createBox(0.10, pipeH, 0.10, gutterMat, sheetGroup);
        pipe.position.set(px, 0.20 + pipeH / 2, -3.425 - 0.08);

        const shoe = createBox(0.10, 0.12, 0.15, gutterMat, sheetGroup);
        shoe.position.set(px, 0.26, -3.425 - 0.15);
      });
    }
    buildSheetAndFinishing();

    // -------------------------------------------------------------


    // СТЕППЕР ПОСЛОЙНОГО МОНТАЖА КРОВЛИ (ШАГИ 0-9)
    // ==========================================
    let currentRoofStep = 9;
    let isRoofManualMode = false;

    const ROOF_STEPS = [
      {
        step: 0,
        badge: "Шаг 0 / 9",
        title: "Шаг 0: ЖБ-плиты перекрытия (проём открыт)",
        desc: "10 плит ПК 64-12, 4 плиты 40-12 над беседкой. Лестничный проём 3.85 × 1.22 м открыт."
      },
      {
        step: 1,
        badge: "Шаг 1 / 9",
        title: "Шаг 1: Временный настил лестничного проёма (3.85 × 1.22 м)",
        desc: "4 опорные поперечные балки 50×100 мм и сплошной настил из досок 35 мм вровень с плитами."
      },
      {
        step: 2,
        badge: "Шаг 2 / 9",
        title: "Шаг 2: Парапетные стены (90 см в 1.5 кирпича / 38 см)",
        desc: "Кладка из жжёного кирпича 38 см высотой 90 см с оцинкованными крышками-фартуками (внутр. габарит 18.19 × 6.47 м)."
      },
      {
        step: 3,
        badge: "Шаг 3 / 9",
        title: "Шаг 3: Пароизоляционная плёнка 200 мкм (18.19 × 6.47 м)",
        desc: "Сплошная плёнка по всей площади плит (117.7 м²) с нахлёстом 15 см на парапеты и проклейкой швов (1 рулон 150 м²)."
      },
      {
        step: 4,
        badge: "Шаг 4 / 9",
        title: "Шаг 4: Теплоизоляция XPS Пеноплэкс 50 мм (22 пачки)",
        desc: "Плиты экструдированного пенополистирола 50 мм со смещением швов и L-кромкой (117.7 м² в свету, 22 пачки / 122.1 м²)."
      },
      {
        step: 5,
        badge: "Шаг 5 / 9",
        title: "Шаг 5: Опорные стойки, лежень, мауэрлат и прогоны",
        desc: "Передний брус h=48 см, задний мауэрлат, промежуточный прогон (Z=+0.5 м) и прогон под стыком стропил (Z=-2.05 м)."
      },
      {
        step: 6,
        badge: "Шаг 6 / 9",
        title: "Шаг 6: Стропила 6.0 м + добор 2.0 м с нахлёстом 1.0 м (32 доски)",
        desc: "24 целые доски 6.0 м (светлые) + 24 добора 2.0 м (янтарные). Нахлёст 1.0 м у свеса на 4 шпильках М12. Всего 32 доски 6.0 м!"
      },
      {
        step: 7,
        badge: "Шаг 7 / 9",
        title: "Шаг 7: Обрешётка из бруска 40×50 мм (шаг 50 см, 15 рядов)",
        desc: "15 рядов калиброванного антисептированного бруска 40×50 мм с шагом 50 см (чистый расход 273 пог. м / закупка 300 м)."
      },
      {
        step: 8,
        badge: "Шаг 8 / 9",
        title: "Шаг 8: Слой Фольгоизола (теплоотражающий экран)",
        desc: "Рулонный фольгированный экран поверх обрешётки фольгой вверх (отражает 95% летнего жара)."
      },
      {
        step: 9,
        badge: "Шаг 9 / 9",
        title: "Шаг 9: Профнастил 0.45 мм (18 листов 7.06 м), свес +7 см, водосток",
        desc: "18 оцинкованных листов 7.06 м со свесом +7 см за стропила в желоб, торцевые ветровые планки и 3 водостока."
      }
    ];

    function setRoofStep(step) {
      if (step < -1) step = -1;
      if (step > 9) step = 9;
      currentRoofStep = step;
      isRoofManualMode = false;

      if (step === -1) {
        hideAllRoof();
        return;
      }

      // Применяем видимость слоёв по цепочке (накопительный монтаж 0..step)
      slabsGroup.visible = (step >= 0);
      stairCoverGroup.visible = (step >= 1);
      parapetGroup.visible = (step >= 2);
      filmGroup.visible = (step >= 3);
      xpsGroup.visible = (step >= 4);
      postsGroup.visible = (step >= 5);
      raftersFrontGroup.visible = (step >= 6);
      raftersRearGroup.visible = (step >= 6);
      battensGroup.visible = (step >= 7);
      folgoGroup.visible = (step >= 8);
      sheetGroup.visible = (step >= 9);

      // Синхронизируем UI степпера
      const slider = document.getElementById('roof-step-slider');
      if (slider) slider.value = step;

      const badge = document.getElementById('roof-step-badge');
      if (badge) {
        badge.textContent = ROOF_STEPS[step].badge;
        badge.style.background = '#38bdf8';
        badge.style.color = '#0f172a';
      }

      const title = document.getElementById('roof-step-title');
      if (title) title.textContent = ROOF_STEPS[step].title;

      const desc = document.getElementById('roof-step-desc');
      if (desc) desc.textContent = ROOF_STEPS[step].desc;

      // Синхронизируем чекбоксы в ручной панели
      syncManualCheckboxes();
    }

    function nextRoofStep() {
      if (currentRoofStep < 9) setRoofStep(currentRoofStep + 1);
    }

    function prevRoofStep() {
      if (currentRoofStep > -1) setRoofStep(currentRoofStep - 1);
    }

    function hideAllRoof() {
      currentRoofStep = -1;
      isRoofManualMode = false;

      slabsGroup.visible = false;
      stairCoverGroup.visible = false;
      parapetGroup.visible = false;
      filmGroup.visible = false;
      xpsGroup.visible = false;
      postsGroup.visible = false;
      raftersFrontGroup.visible = false;
      raftersRearGroup.visible = false;
      battensGroup.visible = false;
      folgoGroup.visible = false;
      sheetGroup.visible = false;

      const slider = document.getElementById('roof-step-slider');
      if (slider) slider.value = -1;

      const badge = document.getElementById('roof-step-badge');
      if (badge) {
        badge.textContent = 'Интерьер (-1)';
        badge.style.background = '#64748b';
        badge.style.color = '#f8fafc';
      }
      const title = document.getElementById('roof-step-title');
      if (title) title.textContent = 'Крыша и перекрытие скрыты (Интерьер)';
      const desc = document.getElementById('roof-step-desc');
      if (desc) desc.textContent = 'Отображаются стены, перегородки и проёмы. Ползунок в начальной позиции (-1). Для возврата к кровле сдвиньте ползунок вправо.';

      syncManualCheckboxes();
    }

    function toggleManualLayer(layer, visible) {
      isRoofManualMode = true;
      if (layer === 'slabs') slabsGroup.visible = visible;
      if (layer === 'stair') stairCoverGroup.visible = visible;
      if (layer === 'parapet') parapetGroup.visible = visible;
      if (layer === 'film') filmGroup.visible = visible;
      if (layer === 'xps') xpsGroup.visible = visible;
      if (layer === 'posts') postsGroup.visible = visible;
      if (layer === 'rafterFront') raftersFrontGroup.visible = visible;
      if (layer === 'rafterRear') raftersRearGroup.visible = visible;
      if (layer === 'battens') battensGroup.visible = visible;
      if (layer === 'folgo') folgoGroup.visible = visible;
      if (layer === 'sheet') sheetGroup.visible = visible;

      const badge = document.getElementById('roof-step-badge');
      if (badge) {
        badge.textContent = 'Ручной';
        badge.style.background = '#f59e0b';
        badge.style.color = '#0f172a';
      }
      const title = document.getElementById('roof-step-title');
      if (title) title.textContent = 'Ручной выбор слоёв';
    }

    function syncManualCheckboxes() {
      const setChk = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = val;
      };
      setChk('toggle-layer-slabs', slabsGroup.visible);
      setChk('toggle-layer-stair', stairCoverGroup.visible);
      setChk('toggle-layer-parapet', parapetGroup.visible);
      setChk('toggle-layer-film', filmGroup.visible);
      setChk('toggle-layer-xps', xpsGroup.visible);
      setChk('toggle-layer-posts', postsGroup.visible);
      setChk('toggle-layer-rafter-front', raftersFrontGroup.visible);
      setChk('toggle-layer-rafter-rear', raftersRearGroup.visible);
      setChk('toggle-layer-battens', battensGroup.visible);
      setChk('toggle-layer-folgo', folgoGroup.visible);
      setChk('toggle-layer-sheet', sheetGroup.visible);
      setChk('toggle-canopy', canopyGroup.visible);
    }



export function buildRoof(scene) {
  buildCeilingSlabs();
  buildStairCover();
  buildParapet();
  buildVaporFilm();
  buildXPS();
  buildPostsAndPurlins();
  buildRafters();
  buildBattens();
  buildFolgoizol();
  buildSheetAndFinishing();

  scene.add(stairCoverGroup);
  scene.add(parapetGroup);
  scene.add(filmGroup);
  scene.add(xpsGroup);
  scene.add(postsGroup);
  scene.add(raftersFrontGroup);
  scene.add(raftersRearGroup);
  scene.add(battensGroup);
  scene.add(folgoGroup);
  scene.add(sheetGroup);
  scene.add(slabsGroup);

  // Инициализируем шаг 9
  setRoofStep(9);
}

export {
  setRoofStep,
  nextRoofStep,
  prevRoofStep,
  hideAllRoof,
  toggleManualLayer,
  syncManualCheckboxes,
  ROOF_STEPS,
  currentRoofStep
};

