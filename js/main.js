import { THREE } from './three-global.js';
import { initScene, scene, camera, renderer, controls, setInteractionMode } from './scene.js';
import { buildFoundation } from './building/foundation.js';
import { buildColumns } from './building/columns.js';
import { buildWalls } from './building/walls.js';
import {
  buildRoof, setRoofStep, nextRoofStep, prevRoofStep, hideAllRoof, toggleManualLayer
} from './building/roof.js';
import { buildCanopy } from './building/canopy.js';
import { initDimensions, updateLabels, updateDimOpacity } from './features/dimensions.js';
import { build3DCompass } from './features/compass.js';
import {
  setSunSeason, updateSun, setSunTimeFromSlider, setSunPreset,
  toggleSunAnimation, stepSunAnimation
} from './features/sun.js';
import {
  toggleLayer, setFloorMode, setView, resetView, takeScreenshot,
  toggleOpenings, setOpeningsSlider, toggleSidePanel,
  stepOpeningsAnimation, initRaycasting, parseUrlParams
} from './ui.js';

// 1. Инициализация сцены, света и камеры
initScene();

// 2. Построение строительных конструкций здания
buildFoundation(scene);
buildColumns(scene);
buildWalls(scene);
buildRoof(scene);
buildCanopy(scene);

// 3. Инженерные выноски, размеры и 3D-компас
initDimensions(scene);
build3DCompass();

// 4. Интерактивные события и URL-параметры
initRaycasting();
parseUrlParams();

// 5. Главный цикл рендеринга Three.js
function animate() {
  requestAnimationFrame(animate);

  stepOpeningsAnimation();
  stepSunAnimation();

  controls.update();
  renderer.render(scene, camera);
  updateLabels();
}
animate();

// 6. Экспорт функций в window для поддержки inline HTML обработчиков (onclick, onchange, oninput)
window.setInteractionMode = setInteractionMode;
window.setView = setView;
window.resetView = resetView;
window.takeScreenshot = takeScreenshot;
window.toggleSidePanel = toggleSidePanel;
window.toggleLayer = toggleLayer;
window.setFloorMode = setFloorMode;
window.setRoofStep = setRoofStep;
window.nextRoofStep = nextRoofStep;
window.prevRoofStep = prevRoofStep;
window.hideAllRoof = hideAllRoof;
window.toggleManualLayer = toggleManualLayer;
window.updateDimOpacity = updateDimOpacity;
window.toggleOpenings = toggleOpenings;
window.setOpeningsSlider = setOpeningsSlider;
window.setSunSeason = setSunSeason;
window.setSunTimeFromSlider = setSunTimeFromSlider;
window.setSunPreset = setSunPreset;
window.toggleSunAnimation = toggleSunAnimation;
