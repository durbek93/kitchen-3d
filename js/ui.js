import { THREE } from './three-global.js';
import { scene, camera, renderer, controls } from './scene.js';
import { groundGroup, plinthsGroup, floorsGroup } from './building/foundation.js';
import { columnsGroup } from './building/columns.js';
import { wallsGroup, glassGroup, animOpenings, clickableOpenings } from './building/walls.js';
import {
  slabsGroup, stairCoverGroup, parapetGroup, filmGroup, xpsGroup,
  postsGroup, raftersFrontGroup, raftersRearGroup, battensGroup,
  folgoGroup, sheetGroup, syncManualCheckboxes, setRoofStep
} from './building/roof.js';
import { canopyGroup } from './building/canopy.js';
import { dimensionsGroup, updateDimOpacity } from './features/dimensions.js';
import { setSunSeason, updateSun, updatePresetButtons } from './features/sun.js';

export let currentFloorMode = 'solid';
export let isSidePanelOpen = window.innerWidth > 768;

export let openingsProgress = 0.0;
export let targetOpeningsProgress = 0.0;
export let isOpeningsOpen = false;

    function toggleLayer(layer, visible) {
      if (layer === 'ground') groundGroup.visible = visible;
      if (layer === 'plinths') plinthsGroup.visible = visible;
      if (layer === 'floors') floorsGroup.visible = visible;
      if (layer === 'roof') { sheetGroup.visible = visible; folgoGroup.visible = visible; }
      if (layer === 'rafters') { raftersFrontGroup.visible = visible; raftersRearGroup.visible = visible; battensGroup.visible = visible; postsGroup.visible = visible; }
      if (layer === 'insulation') { xpsGroup.visible = visible; filmGroup.visible = visible; stairCoverGroup.visible = visible; }
      if (layer === 'parapet') parapetGroup.visible = visible;
      if (layer === 'slabs') slabsGroup.visible = visible;
      if (layer === 'walls') wallsGroup.visible = visible;
      if (layer === 'columns') columnsGroup.visible = visible;
      if (layer === 'canopy') canopyGroup.visible = visible;
      if (layer === 'glass') glassGroup.visible = visible;
      if (layer === 'dimensions') {
        dimensionsGroup.visible = visible;
        const labelsContainer = document.getElementById('labels-container');
        if (labelsContainer) labelsContainer.style.display = visible ? 'block' : 'none';
        const sliderWrap = document.getElementById('dim-slider-wrap');
        const sliderInput = document.getElementById('dim-opacity-slider');
        if (sliderWrap) sliderWrap.style.opacity = visible ? '1' : '0.35';
        if (sliderInput) sliderInput.disabled = !visible;
      }
      syncManualCheckboxes();
    }


    function setFloorMode(mode) {
      currentFloorMode = mode;
      
      const btnSolid = document.getElementById('btn-floor-solid');
      const btnXray = document.getElementById('btn-floor-xray');
      const btnHidden = document.getElementById('btn-floor-hidden');
      const lblMode = document.getElementById('floor-mode-label');

      if (btnSolid) btnSolid.classList.toggle('active', mode === 'solid');
      if (btnXray) btnXray.classList.toggle('active', mode === 'xray');
      if (btnHidden) btnHidden.classList.toggle('active', mode === 'hidden');

      if (lblMode) {
        if (mode === 'solid') lblMode.textContent = 'Сплошной';
        if (mode === 'xray') lblMode.textContent = '🔍 Рентген';
        if (mode === 'hidden') lblMode.textContent = 'Скрыт';
      }

      if (mode === 'hidden') {
        floorsGroup.visible = false;
      } else {
        floorsGroup.visible = true;
        floorsGroup.traverse(child => {
          if (child.isMesh) {
            if (mode === 'xray') {
              // Яркий архитектурный голографический рентген: полупрозрачная бирюзовая плоскость + светящийся контур
              child.material.transparent = true;
              child.material.opacity = 0.35;
              child.material.color.setHex(0x38bdf8);
              child.material.depthWrite = false;
              child.material.roughness = 0.15;
              child.material.metalness = 0.5;

              child.children.forEach(sub => {
                if (sub.isLineSegments) {
                  sub.material.color.setHex(0x0284c7);
                }
              });
            } else {
              // Сплошной монолитный пол (единый бетон)
              child.material.transparent = false;
              child.material.opacity = 1.0;
              child.material.color.setHex(0xc4c7cc);
              child.material.depthWrite = true;
              child.material.roughness = 0.9;
              child.material.metalness = 0.05;

              child.children.forEach(sub => {
                if (sub.isLineSegments) {
                  sub.material.color.setHex(0x475569);
                }
              });
            }
            child.material.needsUpdate = true;
          }
        });
      }
    }



    function setView(view, animate = true) {
      document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));
      try {
        if (typeof event !== 'undefined' && event && event.target && event.target.classList) {
          event.target.classList.add('active');
        }
      } catch (e) {}

      const target = new THREE.Vector3(0, 1.5, 0);
      let newPos = new THREE.Vector3();

      switch(view) {
        case 'perspective':
          newPos.set(22, 15, 26);
          target.set(0, 1.5, 0);
          break;
        case 'front':
          newPos.set(0, 3.5, 26);
          target.set(0, 2.0, 0);
          break;
        case 'top':
          newPos.set(0, 34, 0.01);
          target.set(0, 0, 0);
          break;
        case 'gazebo':
          newPos.set(13, 3.0, 7);
          target.set(7.275, 1.8, 0);
          break;
        case 'summer':
          newPos.set(-13, 3.0, 7);
          target.set(-7.075, 1.8, 1.05);
          break;
        case 'utility':
          newPos.set(-4.0, 1.7, -2.075);
          target.set(-9.285, 1.7, -2.075);
          break;
        case 'bottom':
          newPos.set(0, -22, 10);
          target.set(0, 0.175, 0); // Центрируем камеру строго на подошве фундамента
          const chkGround = document.getElementById('toggle-ground');
          if (chkGround && chkGround.checked) {
            chkGround.checked = false;
            toggleLayer('ground', false);
          }
          setFloorMode('xray');
          break;
      }

      if (animate) {
        animateCamera(newPos, target);
      } else {
        camera.position.copy(newPos);
        controls.target.copy(target);
        controls.update();
      }
    }

    function resetView() {
      setView('perspective');
    }

    function animateCamera(newPos, newTarget) {
      const startPos = camera.position.clone();
      const startTarget = controls.target.clone();
      const duration = 800;
      const startTime = performance.now();

      function anim(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        camera.position.lerpVectors(startPos, newPos, ease);
        controls.target.lerpVectors(startTarget, newTarget, ease);
        controls.update();

        if (t < 1) requestAnimationFrame(anim);
      }
      requestAnimationFrame(anim);
    }

    function takeScreenshot() {
      renderer.render(scene, camera);
      const url = renderer.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = 'building-3d-model.png';
      a.href = url;
      a.click();
    }



    function toggleOpenings() {
      isOpeningsOpen = !isOpeningsOpen;
      targetOpeningsProgress = isOpeningsOpen ? 1.0 : 0.0;
      updateOpeningsUI();
    }

    function setOpeningsSlider(val) {
      targetOpeningsProgress = parseFloat(val) / 100.0;
      isOpeningsOpen = targetOpeningsProgress > 0.05;
      updateOpeningsUI();
    }

    function updateOpeningsUI() {
      const btn = document.getElementById('btn-toggle-openings');
      const valLabel = document.getElementById('openings-val');
      const slider = document.getElementById('openings-slider');
      if (btn) {
        btn.textContent = isOpeningsOpen ? '🚪 Открыты' : '🔒 Закрыты';
        btn.style.background = isOpeningsOpen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)';
        btn.style.borderColor = isOpeningsOpen ? 'rgba(16, 185, 129, 0.5)' : 'rgba(56, 189, 248, 0.4)';
        btn.style.color = isOpeningsOpen ? '#34d399' : '#38bdf8';
      }
      if (valLabel) {
        valLabel.textContent = `${Math.round(targetOpeningsProgress * 100)}%`;
      }
      if (slider) {
        slider.value = Math.round(targetOpeningsProgress * 100);
      }
    }




    function toggleSidePanel(forceState) {
      if (typeof forceState === 'boolean') {
        isSidePanelOpen = forceState;
      } else {
        isSidePanelOpen = !isSidePanelOpen;
      }

      const panel = document.getElementById('side-panel');
      const backdrop = document.getElementById('panel-backdrop');
      const fab = document.getElementById('btn-open-panel');

      if (panel) {
        panel.classList.toggle('collapsed', !isSidePanelOpen);
      }
      if (backdrop) {
        backdrop.classList.toggle('active', isSidePanelOpen && window.innerWidth <= 768);
      }
      if (fab) {
        fab.classList.toggle('visible', !isSidePanelOpen);
      }
    }

    // Обработка свайпа вниз для закрытия шторки на мобильных экранах
    const sidePanelEl = document.getElementById('side-panel');
    if (sidePanelEl) {
      let touchStartY = 0;
      let touchDeltaY = 0;

      sidePanelEl.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          touchStartY = e.touches[0].clientY;
          touchDeltaY = 0;
        }
      }, { passive: true });

      sidePanelEl.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          touchDeltaY = e.touches[0].clientY - touchStartY;
        }
      }, { passive: true });

      sidePanelEl.addEventListener('touchend', () => {
        // Если жест направлен вниз более чем на 50px и панель не прокручена вглубь
        if (touchDeltaY > 50 && sidePanelEl.scrollTop <= 5) {
          toggleSidePanel(false);
        }
      }, { passive: true });
    }



export function stepOpeningsAnimation() {
  openingsProgress += (targetOpeningsProgress - openingsProgress) * 0.08;
  animOpenings.forEach(op => op.update(openingsProgress));
}

export function initRaycasting() {
  const raycaster = new THREE.Raycaster();
  const mousePos = new THREE.Vector2();
  let ptrDownX = 0, ptrDownY = 0;

  renderer.domElement.addEventListener('pointerdown', (e) => {
    ptrDownX = e.clientX;
    ptrDownY = e.clientY;
  });

  renderer.domElement.addEventListener('pointerup', (e) => {
    const dist = Math.hypot(e.clientX - ptrDownX, e.clientY - ptrDownY);
    if (dist > 6) return; // не клик, а перемещение камеры

    mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePos, camera);

    const hits = raycaster.intersectObjects(clickableOpenings, true);
    if (hits.length > 0) {
      toggleOpenings();
    }
  });
}

export function parseUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('view')) {
    setView(urlParams.get('view'), false);
  }
  if (urlParams.has('cam')) {
    const c = urlParams.get('cam').split(',').map(Number);
    if (c.length >= 3) camera.position.set(c[0], c[1], c[2]);
  }
  if (urlParams.has('target')) {
    const t = urlParams.get('target').split(',').map(Number);
    if (t.length >= 3) controls.target.set(t[0], t[1], t[2]);
    controls.update();
  }
  if (urlParams.get('dims') === '0') {
    toggleLayer('dimensions', false);
    const chk = document.getElementById('toggle-dims');
    if (chk) chk.checked = false;
  }
  if (urlParams.has('step')) {
    const st = parseInt(urlParams.get('step'));
    if (!isNaN(st)) setRoofStep(st);
  } else if (urlParams.get('roof') === '1') {
    setRoofStep(9);
  } else if (urlParams.get('rafters') === '1') {
    setRoofStep(6);
  } else if (urlParams.get('insulation') === '1') {
    setRoofStep(4);
  } else if (urlParams.get('parapet') === '1') {
    setRoofStep(2);
  } else if (urlParams.get('slabs') === '1') {
    setRoofStep(0);
  } else {
    setRoofStep(9);
  }
  if (urlParams.get('open') === '1') {
    isOpeningsOpen = true;
    targetOpeningsProgress = 1.0;
    openingsProgress = 1.0;
    updateOpeningsUI();
    animOpenings.forEach(op => op.update(1.0));
  }
  if (urlParams.has('season')) {
    setSunSeason(urlParams.get('season'));
  }
  if (urlParams.has('sun')) {
    updateSun(parseFloat(urlParams.get('sun')), true);
    updatePresetButtons(parseFloat(urlParams.get('sun')));
  }
  if (urlParams.get('scroll') === 'sun') {
    const panel = document.getElementById('side-panel');
    if (panel) panel.scrollTop = 750;
  }
  if (urlParams.has('panel')) {
    toggleSidePanel(urlParams.get('panel') === '1');
  } else {
    toggleSidePanel(isSidePanelOpen);
  }
}

export {
  toggleLayer,
  setFloorMode,
  setView,
  resetView,
  animateCamera,
  takeScreenshot,
  toggleOpenings,
  setOpeningsSlider,
  updateOpeningsUI,
  toggleSidePanel
};
