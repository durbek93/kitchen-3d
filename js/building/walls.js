import { THREE } from '../three-global.js';
import { T, PLINTH_H, BEAM_BOT } from '../constants.js';
import { brickMat, frameMat, glassMat, doorLeafMat, handleMat, concreteMat } from '../materials.js';
import { createBox, createBoxWithMetricUV } from './helpers.js';

export const wallsGroup = new THREE.Group();
export const glassGroup = new THREE.Group();

export const animOpenings = [];
export const clickableOpenings = [];

function buildWallsInternal() {
      const wallH = BEAM_BOT - PLINTH_H; // 2.30 м (чистая высота кладки от цоколя до низа ригелей)
      const wallY = PLINTH_H + wallH / 2; // 1.65 м

      // --- ЛЕТНЯЯ КУХНЯ И САНУЗЕЛ/ТОПОЧНАЯ (БЛОК 1: X в [-9.075, -5.075]) ---
      // Форточка санузла/котельной (0.80 x 0.50 м, ось Z = -2.075)
      const sEndBot = createBoxWithMetricUV(0.38, 1.50, 1.90, brickMat, wallsGroup);
      sEndBot.position.set(-9.285, PLINTH_H + 1.50 / 2, -2.075);

      const fSide1 = createBoxWithMetricUV(0.38, 0.50, 0.55, brickMat, wallsGroup);
      fSide1.position.set(-9.285, PLINTH_H + 1.50 + 0.25, -2.75);

      const fSide2 = createBoxWithMetricUV(0.38, 0.50, 0.55, brickMat, wallsGroup);
      fSide2.position.set(-9.285, PLINTH_H + 1.50 + 0.25, -1.40);

      const fTopH = wallH - (1.50 + 0.50); // 0.30 м
      const sEndTop = createBoxWithMetricUV(0.38, fTopH, 1.90, brickMat, wallsGroup);
      sEndTop.position.set(-9.285, PLINTH_H + 2.00 + fTopH / 2, -2.075);

      buildTransomWindow(-9.285, -2.075, 0.80, 0.50);

      // Глухая стена летней кухни вдоль торца (Z: -1.125 до +3.025 = 4.15м)
      const sEndMain = createBoxWithMetricUV(0.38, wallH, 4.15, brickMat, wallsGroup);
      sEndMain.position.set(-9.285, wallY, 0.95);

      // Задняя стена санузла/котельной (X: -9.075 до -5.075 = 4.00м)
      const sRearWall = createBoxWithMetricUV(4.00, wallH, 0.38, brickMat, wallsGroup);
      sRearWall.position.set(-7.075, wallY, -3.235);

      // Перегородка между летней кухней и санузлом (Z = -1.025, длина 4.00м, толщина 0.20м)
      const utilDivider = createBoxWithMetricUV(4.00, wallH, 0.20, brickMat, wallsGroup);
      utilDivider.position.set(-7.075, wallY, -1.025);

      // --- РАЗДЕЛИТЕЛЬНАЯ СТЕНА ПО ОСИ 4 (X = -4.875) ---
      const doorH = 2.10;
      const doorW = 0.80;
      const lintelH = wallH - doorH; // 0.20 м (20 см кирпичная перемычка, выше которой ригель 40 см)

      // 1. Кирпичный простенок слева от двери (Z: -3.025 до -2.475 = 0.55м)
      const wSepLeft = createBoxWithMetricUV(0.38, wallH, 0.55, brickMat, wallsGroup);
      wSepLeft.position.set(-4.875, wallY, -2.75);

      // 2. Кирпичная перемычка над дверью Д-1 (по центру с/у: Z = -2.075)
      const wDoorLintel = createBoxWithMetricUV(0.38, lintelH, doorW, brickMat, wallsGroup);
      wDoorLintel.position.set(-4.875, PLINTH_H + doorH + lintelH / 2, -2.075);

      // 3. Основная стена справа от двери до фасада (Z: -1.675 до +3.025 = 4.70м)
      const wSepMid = createBoxWithMetricUV(0.38, wallH, 4.70, brickMat, wallsGroup);
      wSepMid.position.set(-4.875, wallY, 0.675);

      // Дверной блок Д-1 (0.80 × 2.10 м, центр Z = -2.075)
      buildDoorway(-4.875, -2.075, doorW, doorH, true);

      // --- ФАСАД ЗИМНЕЙ КУХНИ (Z = 3.235) ---
      const winW = 1.50; // Витражные окна 1.50 м
      const sillH = 0.38; // подоконная кладка ~38 см
      const openH = wallH - sillH; // 1.92 м в свету до ригеля

      // 1. Глухая стена 2.95 м (X: -4.675 до -1.725)
      const pierBlind = createBoxWithMetricUV(2.96, wallH, 0.38, brickMat, wallsGroup);
      pierBlind.position.set(-3.20, wallY, 3.235);

      // 2. Окно ОК-2 (1.50 м, центр X = -0.975)
      const sill2 = createBoxWithMetricUV(winW, sillH, 0.38, brickMat, wallsGroup);
      sill2.position.set(-0.975, PLINTH_H + sillH / 2, 3.235);
      buildWindow(-0.975, 3.235, winW, openH, sillH);

      // 3. Модульный простенок между ОК-2 и ОК-3 (кирпич 0.76м до колонны X = 0.725)
      const pier2Brick = createBoxWithMetricUV(0.76, wallH, 0.38, brickMat, wallsGroup);
      pier2Brick.position.set(0.155, wallY, 3.235);

      // 4. Окно ОК-3 (1.50 м, центр X = +1.675)
      const sill3 = createBoxWithMetricUV(winW, sillH, 0.38, brickMat, wallsGroup);
      sill3.position.set(1.675, PLINTH_H + sillH / 2, 3.235);
      buildWindow(1.675, 3.235, winW, openH, sillH);

      // 5. Простенок между ОК-3 и ОК-4 (жжёный кирпич: X: +2.425 до +3.575)
      const pier3Brick = createBoxWithMetricUV(1.16, wallH, 0.38, brickMat, wallsGroup);
      pier3Brick.position.set(3.00, wallY, 3.235);

      // 6. Окно ОК-4 (1.50 м, центр X = +4.325, вплотную к колонне Оси 3)
      const sill4 = createBoxWithMetricUV(winW, sillH, 0.38, brickMat, wallsGroup);
      sill4.position.set(4.325, PLINTH_H + sillH / 2, 3.235);
      buildWindow(4.325, 3.235, winW, openH, sillH);

      // --- ЗАДНЯЯ СТЕНА ЗИМНЕЙ КУХНИ (Z = -3.235) ---
      // 1. Глухой участок слева от ОК-1 (2.95 м)
      const rWall1 = createBoxWithMetricUV(2.96, wallH, 0.38, brickMat, wallsGroup);
      rWall1.position.set(-3.20, wallY, -3.235);

      // 2. Окно ОК-1 (1.50 м, центр X = -0.975 - строго соосно окну ОК-2 напротив)
      const rSill = createBoxWithMetricUV(winW, sillH, 0.38, brickMat, wallsGroup);
      rSill.position.set(-0.975, PLINTH_H + sillH / 2, -3.235);
      buildWindow(-0.975, -3.235, winW, openH, sillH);

      // 3. Кирпичный простенок 0.75 м между ОК-1 и промежуточной колонной
      const rPierBrick = createBoxWithMetricUV(0.76, wallH, 0.38, brickMat, wallsGroup);
      rPierBrick.position.set(0.155, wallY, -3.235);

      // 4. Глухой участок справа от промежуточной колонны (4.15 м)
      const rWall2 = createBoxWithMetricUV(4.16, wallH, 0.38, brickMat, wallsGroup);
      rWall2.position.set(3.00, wallY, -3.235);

      // --- РАЗДЕЛИТЕЛЬНАЯ СТЕНА ПО ОСИ 3 И ВИТРАЖ ВП-1 (X = +5.275) ---
      const portalPierBack = createBoxWithMetricUV(0.38, wallH, 1.00, brickMat, wallsGroup);
      portalPierBack.position.set(5.275, wallY, -2.525);

      const portalPierFront = createBoxWithMetricUV(0.38, wallH, 1.00, brickMat, wallsGroup);
      portalPierFront.position.set(5.275, wallY, 2.525);

      build4SectionVitraj(5.275, 0, 4.05, wallH);

      // --- КЛАДКА БЕСЕДКИ ---
      const gazPierAx4Back = createBoxWithMetricUV(0.82, wallH, 0.38, brickMat, wallsGroup);
      gazPierAx4Back.position.set(8.675, wallY, -3.235);

      const gazPierAx4Front = createBoxWithMetricUV(0.82, wallH, 0.38, brickMat, wallsGroup);
      gazPierAx4Front.position.set(8.675, wallY, 3.235);

      const gazPier1 = createBoxWithMetricUV(0.38, wallH, 0.82, brickMat, wallsGroup);
      gazPier1.position.set(9.285, wallY, -2.62);

      const gazPier2 = createBoxWithMetricUV(0.38, wallH, 0.82, brickMat, wallsGroup);
      gazPier2.position.set(9.285, wallY, 2.62);
    }

    function buildWindow(x, z, w, h, sillH) {
      const winY = PLINTH_H + sillH + h / 2;
      const fProf = 0.055;
      const fDepth = 0.08;

      // Outer fixed frame
      const fTop = createBox(w, fProf, fDepth, frameMat, glassGroup);
      fTop.position.set(x, winY + h / 2 - fProf / 2, z);

      const fBot = createBox(w, fProf, fDepth, frameMat, glassGroup);
      fBot.position.set(x, winY - h / 2 + fProf / 2, z);

      const fLeft = createBox(fProf, h - fProf * 2, fDepth, frameMat, glassGroup);
      fLeft.position.set(x - w / 2 + fProf / 2, winY, z);

      const fRight = createBox(fProf, h - fProf * 2, fDepth, frameMat, glassGroup);
      fRight.position.set(x + w / 2 - fProf / 2, winY, z);

      const fMid = createBox(0.04, h - fProf * 2, fDepth, frameMat, glassGroup);
      fMid.position.set(x, winY, z);

      // Left pane (глухая створка)
      const paneW = (w - fProf * 2 - 0.04) / 2;
      const paneH = h - fProf * 2;
      const glassLeft = createBox(paneW, paneH, 0.012, glassMat, glassGroup, false, false);
      glassLeft.position.set(x - paneW / 2 - 0.02, winY, z);

      // Right pane (поворотная открывающаяся створка)
      // Петля на правом профиле рамы
      const sashGroup = new THREE.Group();
      sashGroup.position.set(x + w / 2 - fProf, winY, z);
      glassGroup.add(sashGroup);

      const sashGlass = createBox(paneW - 0.04, paneH - 0.04, 0.012, glassMat, sashGroup, false, false);
      sashGlass.position.set(-paneW / 2, 0, 0);

      const sFrameTop = createBox(paneW, 0.04, 0.06, frameMat, sashGroup);
      sFrameTop.position.set(-paneW / 2, paneH / 2 - 0.02, 0);

      const sFrameBot = createBox(paneW, 0.04, 0.06, frameMat, sashGroup);
      sFrameBot.position.set(-paneW / 2, -paneH / 2 + 0.02, 0);

      const sFrameLeft = createBox(0.04, paneH, 0.06, frameMat, sashGroup);
      sFrameLeft.position.set(-paneW + 0.02, 0, 0);

      const sFrameRight = createBox(0.04, paneH, 0.06, frameMat, sashGroup);
      sFrameRight.position.set(-0.02, 0, 0);

      // Оконная ручка на створке
      const winHnd = createBox(0.02, 0.12, 0.045, handleMat, sashGroup);
      const hndZOffset = z > 0 ? -0.035 : 0.035;
      winHnd.position.set(-paneW + 0.045, -0.05, hndZOffset);

      animOpenings.push({
        type: 'window',
        update: (t) => {
          const rotDir = z > 0 ? -1 : 1; // Распахивание строго ВНУТРЬ помещений
          sashGroup.rotation.y = rotDir * t * (Math.PI / 3.2); // ~56 градусов внутрь
        }
      });
      clickableOpenings.push(sashGroup);
    }

    function buildTransomWindow(x, z, w, h) {
      // ИСПРАВЛЕНИЕ: Низ рамы строго на высоте верха подоконной кладки (PLINTH_H + 1.50)
      const winY = PLINTH_H + 1.50 + h / 2;
      const fProf = 0.045;
      const fDepth = 0.08;

      // Неподвижная наружная коробка (без зазоров в кирпичном проёме)
      const fTop = createBox(fDepth, fProf, w, frameMat, glassGroup);
      fTop.position.set(x, winY + h / 2 - fProf / 2, z);

      const fBot = createBox(fDepth, fProf, w, frameMat, glassGroup);
      fBot.position.set(x, winY - h / 2 + fProf / 2, z);

      const fSide1 = createBox(fDepth, h - fProf * 2, fProf, frameMat, glassGroup);
      fSide1.position.set(x, winY, z - w / 2 + fProf / 2);

      const fSide2 = createBox(fDepth, h - fProf * 2, fProf, frameMat, glassGroup);
      fSide2.position.set(x, winY, z + w / 2 - fProf / 2);

      // Откидная створка фрамуги (петли по верхней грани)
      const sashGroup = new THREE.Group();
      sashGroup.position.set(x, winY + h / 2 - fProf, z);
      glassGroup.add(sashGroup);

      const sW = w - fProf * 2 - 0.01;
      const sH = h - fProf * 2 - 0.01;
      const sProf = 0.035;
      const sashCenterY = -sH / 2;

      const sGlass = createBox(0.012, sH - sProf * 2, sW - sProf * 2, glassMat, sashGroup, false, false);
      sGlass.position.set(0, sashCenterY, 0);

      const sTopF = createBox(0.05, sProf, sW, frameMat, sashGroup);
      sTopF.position.set(0, -sProf / 2, 0);

      const sBotF = createBox(0.05, sProf, sW, frameMat, sashGroup);
      sBotF.position.set(0, -sH + sProf / 2, 0);

      const sSideF1 = createBox(0.05, sH, sProf, frameMat, sashGroup);
      sSideF1.position.set(0, sashCenterY, -sW / 2 + sProf / 2);

      const sSideF2 = createBox(0.05, sH, sProf, frameMat, sashGroup);
      sSideF2.position.set(0, sashCenterY, sW / 2 - sProf / 2);

      // Ручка фрамуги снизу
      const sHnd = createBox(0.04, 0.06, 0.025, handleMat, sashGroup);
      sHnd.position.set(0.03, -sH + 0.04, 0);

      animOpenings.push({
        type: 'transom',
        update: (t) => {
          sashGroup.rotation.z = t * (Math.PI / 6); // откидывание на 30 градусов
        }
      });
      clickableOpenings.push(sashGroup);
    }

    function buildDoorway(x, z, w, h, isTransverse) {
      const doorY = PLINTH_H + h / 2;
      const fProf = 0.05; // 5 см профиль коробки
      const fDepth = 0.38; // толщина коробки на всю стену 38 см

      if (isTransverse) {
        // Левый и правый косяки + перемычка коробки
        const jamb1 = createBox(fDepth, h, fProf, frameMat, glassGroup);
        jamb1.position.set(x, doorY, z - w / 2 + fProf / 2);

        const jamb2 = createBox(fDepth, h, fProf, frameMat, glassGroup);
        jamb2.position.set(x, doorY, z + w / 2 - fProf / 2);

        const head = createBox(fDepth, fProf, w, frameMat, glassGroup);
        head.position.set(x, doorY + h / 2 - fProf / 2, z);

        // ИСПРАВЛЕНИЕ: Единая шарнирная группа двери (петли на левом косяке Z = z - w/2 + fProf)
        const hingeZ = z - w / 2 + fProf;
        const doorHingeGroup = new THREE.Group();
        doorHingeGroup.position.set(x, doorY, hingeZ);
        glassGroup.add(doorHingeGroup);

        const leafW = w - fProf * 2;
        const leafH = h - fProf;
        const leafThick = 0.04;

        // Полотно двери (смещено от петли на leafW / 2 вдоль Z)
        const leaf = createBox(leafThick, leafH, leafW, doorLeafMat, doorHingeGroup);
        leaf.position.set(0, 0, leafW / 2);

        // Ручки жестко привязаны к полотну двери:
        // Сторона кухни (+X):
        const hPlate1 = createBox(0.008, 0.16, 0.035, handleMat, doorHingeGroup);
        hPlate1.position.set(leafThick / 2 + 0.004, -0.05, leafW - 0.08);
        const hLever1 = createBox(0.045, 0.018, 0.11, handleMat, doorHingeGroup);
        hLever1.position.set(leafThick / 2 + 0.025, -0.02, leafW - 0.08 - 0.03);

        // Сторона санузла (-X):
        const hPlate2 = createBox(0.008, 0.16, 0.035, handleMat, doorHingeGroup);
        hPlate2.position.set(-leafThick / 2 - 0.004, -0.05, leafW - 0.08);
        const hLever2 = createBox(0.045, 0.018, 0.11, handleMat, doorHingeGroup);
        hLever2.position.set(-leafThick / 2 - 0.025, -0.02, leafW - 0.08 - 0.03);

        animOpenings.push({
          type: 'door',
          update: (t) => {
            // Распахивается внутрь санузла на ~78 градусов
            doorHingeGroup.rotation.y = -t * (Math.PI * 0.43);
          }
        });
        clickableOpenings.push(doorHingeGroup);
      }
    }

    function build4SectionVitraj(x, zCenter, totalWidth, height) {
      // Витражный портал ВП-1 (4.05 × 2.30 м) между беседкой (X > 5.275) и зимней кухней (X < 5.275)
      // Конструкция: 2 боковые глухие секции по 1.05 м + 2 распашные штульповые двери по 0.95 м внутрь кухни (чистый сквозной проём 1.90 м без центрального импоста!)
      const vitY = PLINTH_H + height / 2;
      const fProf = 0.06;  // Профиль наружной коробки 6 см
      const fDepth = 0.10; // Глубина коробки 10 см
      const sideW = 1.05;  // Ширина боковых глухих секций

      // 1. Неподвижная наружная П-образная коробка и порог
      // Верхняя балка рамы
      const fTop = createBox(fDepth, fProf, totalWidth, frameMat, glassGroup);
      fTop.position.set(x, vitY + height / 2 - fProf / 2, zCenter);

      // Нижний порог
      const fBot = createBox(fDepth, fProf, totalWidth, frameMat, glassGroup);
      fBot.position.set(x, vitY - height / 2 + fProf / 2, zCenter);

      // Крайняя задняя пристенная стойка (у кирпичного пилона Z = -2.025)
      const postBack = createBox(fDepth, height - fProf * 2, fProf, frameMat, glassGroup);
      postBack.position.set(x, vitY, zCenter - totalWidth / 2 + fProf / 2);

      // Крайняя передняя пристенная стойка (у кирпичного пилона Z = +2.025)
      const postFront = createBox(fDepth, height - fProf * 2, fProf, frameMat, glassGroup);
      postFront.position.set(x, vitY, zCenter + totalWidth / 2 - fProf / 2);

      // Промежуточный задний импост (отделяет глухую заднюю секцию от проёма дверей)
      const mProf = 0.05; // 5 см профиль импоста
      const mullionZBack = zCenter - totalWidth / 2 + sideW; // -0.975 м
      const mullionBack = createBox(fDepth, height - fProf * 2, mProf, frameMat, glassGroup);
      mullionBack.position.set(x, vitY, mullionZBack);

      // Промежуточный передний импост (отделяет глухую переднюю секцию от проёма дверей)
      const mullionZFront = zCenter + totalWidth / 2 - sideW; // +0.975 м
      const mullionFront = createBox(fDepth, height - fProf * 2, mProf, frameMat, glassGroup);
      mullionFront.position.set(x, vitY, mullionZFront);

      // ВАЖНО: В центральном проёме между mullionBack и mullionFront (Z от -0.950 до +0.950)
      // ЦЕНТРАЛЬНАЯ СТОЙКА ОТСУТСТВУЕТ ПОЛНОСТЬЮ! При открытии дверей образуется чистый сквозной проём 1.90 м.

      // 2. Глухие боковые секции
      const fixPaneW = sideW - fProf - mProf / 2; // ~0.965 м
      const fixPaneH = height - fProf * 2;
      const fixGlassH = fixPaneH - 0.04;
      const fixGlassW = fixPaneW - 0.04;

      // Задний глухой витраж
      const fixZBack = (zCenter - totalWidth / 2 + fProf + mullionZBack - mProf / 2) / 2;
      const glassFixBack = createBox(0.015, fixGlassH, fixGlassW, glassMat, glassGroup, false, false);
      glassFixBack.position.set(x, vitY, fixZBack);

      // Передний глухой витраж
      const fixZFront = (mullionZFront + mProf / 2 + zCenter + totalWidth / 2 - fProf) / 2;
      const glassFixFront = createBox(0.015, fixGlassH, fixGlassW, glassMat, glassGroup, false, false);
      glassFixFront.position.set(x, vitY, fixZFront);

      // 3. Центральные распашные штульповые двери (открывание ВНУТРЬ зимней кухни, в сторону -X)
      const doorOpenW = (mullionZFront - mProf / 2) - (mullionZBack + mProf / 2); // 1.90 м
      const leafW = doorOpenW / 2; // 0.95 м ширина створки
      const leafH = height - fProf * 2 - 0.015; // 2.165 м высота створки
      const sProf = 0.075; // 7.5 см профиль створки
      const sDepth = 0.065; // 6.5 см толщина створки

      // --- Задняя створка дверей (петли на заднем импосте mullionZBack + mProf/2 = -0.950 м) ---
      const hingeZBack = mullionZBack + mProf / 2;
      const hingeX = x - 0.035; // петли с внутренней стороны (со стороны зимней кухни)
      const doorBackGroup = new THREE.Group();
      doorBackGroup.position.set(hingeX, vitY, hingeZBack);
      glassGroup.add(doorBackGroup);

      // Профиль рамы задней створки (в локальных координатах: створка идёт от Z=0 до Z=+leafW)
      const sashCenterZBack = leafW / 2;
      const sashCenterX = 0.035; // в закрытом состоянии створка выравнивается по центру проёма X=x

      // Верхняя и нижняя перекладины створки
      const bTopRail = createBox(sDepth, sProf, leafW, frameMat, doorBackGroup);
      bTopRail.position.set(sashCenterX, leafH / 2 - sProf / 2, sashCenterZBack);

      const bBotRail = createBox(sDepth, sProf * 1.5, leafW, frameMat, doorBackGroup);
      bBotRail.position.set(sashCenterX, -leafH / 2 + (sProf * 1.5) / 2, sashCenterZBack);

      // Вертикальные стойки створки (петлевая и притворная)
      const bHingeStile = createBox(sDepth, leafH, sProf, frameMat, doorBackGroup);
      bHingeStile.position.set(sashCenterX, 0, sProf / 2);

      const bMeetingStile = createBox(sDepth, leafH, sProf, frameMat, doorBackGroup);
      bMeetingStile.position.set(sashCenterX, 0, leafW - sProf / 2);

      // Стеклопакет створки
      const bGlassW = leafW - sProf * 2;
      const bGlassH = leafH - sProf * 2.5;
      const bGlass = createBox(0.015, bGlassH, bGlassW, glassMat, doorBackGroup, false, false);
      bGlass.position.set(sashCenterX, (sProf * 0.5) / 2, sashCenterZBack);

      // Петли задней створки
      [-0.85, 0, 0.85].forEach(yOffset => {
        const hg = createBox(0.03, 0.10, 0.025, frameMat, doorBackGroup);
        hg.position.set(0.0, yOffset, 0.015);
      });

      // Ручка задней створки (со стороны кухни и со стороны беседки)
      const bHndIn = createBox(0.045, 0.02, 0.12, handleMat, doorBackGroup);
      bHndIn.position.set(sashCenterX - sDepth / 2 - 0.025, -0.10, leafW - 0.08);

      const bHndOut = createBox(0.045, 0.02, 0.12, handleMat, doorBackGroup);
      bHndOut.position.set(sashCenterX + sDepth / 2 + 0.025, -0.10, leafW - 0.08);

      // --- Передняя створка дверей (петли на переднем импосте mullionZFront - mProf/2 = +0.950 м) ---
      const hingeZFront = mullionZFront - mProf / 2;
      const doorFrontGroup = new THREE.Group();
      doorFrontGroup.position.set(hingeX, vitY, hingeZFront);
      glassGroup.add(doorFrontGroup);

      // В локальных координатах: створка идёт от Z=0 до Z=-leafW
      const sashCenterZFront = -leafW / 2;

      // Верхняя и нижняя перекладины створки
      const fTopRail = createBox(sDepth, sProf, leafW, frameMat, doorFrontGroup);
      fTopRail.position.set(sashCenterX, leafH / 2 - sProf / 2, sashCenterZFront);

      const fBotRail = createBox(sDepth, sProf * 1.5, leafW, frameMat, doorFrontGroup);
      fBotRail.position.set(sashCenterX, -leafH / 2 + (sProf * 1.5) / 2, sashCenterZFront);

      // Вертикальные стойки створки (петлевая и притворная)
      const fHingeStile = createBox(sDepth, leafH, sProf, frameMat, doorFrontGroup);
      fHingeStile.position.set(sashCenterX, 0, -sProf / 2);

      const fMeetingStile = createBox(sDepth, leafH, sProf, frameMat, doorFrontGroup);
      fMeetingStile.position.set(sashCenterX, 0, -leafW + sProf / 2);

      // Стеклопакет створки
      const fGlass = createBox(0.015, bGlassH, bGlassW, glassMat, doorFrontGroup, false, false);
      fGlass.position.set(sashCenterX, (sProf * 0.5) / 2, sashCenterZFront);

      // Штульповая нащельная планка на стыке створок
      const stulpTrim = createBox(0.025, leafH, 0.03, frameMat, doorFrontGroup);
      stulpTrim.position.set(sashCenterX, 0, -leafW - 0.012);

      // Петли передней створки
      [-0.85, 0, 0.85].forEach(yOffset => {
        const hg = createBox(0.03, 0.10, 0.025, frameMat, doorFrontGroup);
        hg.position.set(0.0, yOffset, -0.015);
      });

      // Ручка передней створки
      const fHndIn = createBox(0.045, 0.02, 0.12, handleMat, doorFrontGroup);
      fHndIn.position.set(sashCenterX - sDepth / 2 - 0.025, -0.10, -leafW + 0.08);

      const fHndOut = createBox(0.045, 0.02, 0.12, handleMat, doorFrontGroup);
      fHndOut.position.set(sashCenterX + sDepth / 2 + 0.025, -0.10, -leafW + 0.08);

      // Анимация открывания: обе створки распахиваются ВНУТРЬ зимней кухни
      // Задняя створка (Z in [0, +leafW]) поворачивается на -angle
      // Передняя створка (Z in [-leafW, 0]) поворачивается на +angle
      animOpenings.push({
        type: 'vitraj',
        update: (t) => {
          const swingAngle = t * (Math.PI * 0.46); // ~83 градуса внутрь кухни
          doorBackGroup.rotation.y = -swingAngle;
          doorFrontGroup.rotation.y = swingAngle;
        }
      });
      clickableOpenings.push(doorBackGroup, doorFrontGroup);
    }



export function buildWalls(scene) {
  buildWallsInternal();
  scene.add(wallsGroup);
  scene.add(glassGroup);
  return { wallsGroup, glassGroup, animOpenings, clickableOpenings };
}
