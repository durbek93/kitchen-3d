import { THREE } from './three-global.js';

let container, scene, camera, renderer, controls;
let ambientLight, sunLight, fillLight;
let intStudioLight1, intStudioLight2, intGazeboLight, intSummerLight, intUtilityLight;
let bottomLight, bottomFill1, bottomFill2;
let currentInteractionMode = 'rotate';

export function initScene() {
  container = document.getElementById('canvas-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a);
  scene.fog = new THREE.FogExp2(0x0f172a, 0.010);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.02, 1000);
  camera.position.set(22, 16, 26);

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI - 0.01; // Свободное вращение 360° (можно смотреть снизу под фундамент)
  controls.minPolarAngle = 0.01;
  controls.minDistance = 0.2;
  controls.maxDistance = 80;
  controls.target.set(0, 1.5, 0);
  controls.screenSpacePanning = true;
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };

  renderer.domElement.addEventListener('mousedown', () => {
    if (currentInteractionMode === 'pan') renderer.domElement.style.cursor = 'grabbing';
  });
  renderer.domElement.addEventListener('mouseup', () => {
    if (currentInteractionMode === 'pan') renderer.domElement.style.cursor = 'grab';
  });

  // --- Lighting ---
  ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  sunLight = new THREE.DirectionalLight(0xfff7ed, 1.55);
  sunLight.position.set(0, 42, 35);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 140;
  sunLight.shadow.camera.left = -26;
  sunLight.shadow.camera.right = 26;
  sunLight.shadow.camera.top = 26;
  sunLight.shadow.camera.bottom = -26;
  sunLight.shadow.bias = -0.0004;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);
  scene.add(sunLight.target);

  fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
  fillLight.position.set(-20, 20, -20);
  scene.add(fillLight);

  // Warm interior lights so inside spaces glow and are clearly visible through transparent glass
  intStudioLight1 = new THREE.PointLight(0xfffaed, 1.4, 15);
  intStudioLight1.position.set(-2.5, 2.3, 0);
  scene.add(intStudioLight1);

  intStudioLight2 = new THREE.PointLight(0xfffaed, 1.4, 15);
  intStudioLight2.position.set(2.5, 2.3, 0);
  scene.add(intStudioLight2);

  intGazeboLight = new THREE.PointLight(0xfffaed, 0.9, 12);
  intGazeboLight.position.set(6.9, 2.3, 0);
  scene.add(intGazeboLight);

  intSummerLight = new THREE.PointLight(0xfffaed, 0.9, 12);
  intSummerLight.position.set(-6.9, 2.3, 0);
  scene.add(intSummerLight);

  // Light inside the unified 2x4m utility room
  intUtilityLight = new THREE.PointLight(0xfffaed, 1.1, 10);
  intUtilityLight.position.set(-6.9, 2.3, -2.0);
  scene.add(intUtilityLight);

  // --- Нижнее инженерное освещение (для фундамента и коммуникаций снизу) ---
  bottomLight = new THREE.DirectionalLight(0xf8fafc, 1.3);
  bottomLight.position.set(0, -35, 0);
  bottomLight.target.position.set(0, 0, 0);
  scene.add(bottomLight);
  scene.add(bottomLight.target);

  bottomFill1 = new THREE.DirectionalLight(0x93c5fd, 0.85);
  bottomFill1.position.set(-20, -20, 20);
  scene.add(bottomFill1);

  bottomFill2 = new THREE.DirectionalLight(0xfef08a, 0.85);
  bottomFill2.position.set(20, -20, -20);
  scene.add(bottomFill2);

  window.addEventListener('resize', onWindowResize);

  return { scene, camera, renderer, controls, sunLight, ambientLight };
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function setInteractionMode(mode) {
  currentInteractionMode = mode;
  const btnRot = document.getElementById('btn-mode-rotate');
  const btnPan = document.getElementById('btn-mode-pan');
  if (btnRot) btnRot.classList.toggle('active', mode === 'rotate');
  if (btnPan) btnPan.classList.toggle('active', mode === 'pan');

  if (!controls || !renderer) return;

  if (mode === 'pan') {
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };
    renderer.domElement.style.cursor = 'grab';
  } else {
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    renderer.domElement.style.cursor = 'default';
  }
}

export {
  container, scene, camera, renderer, controls,
  ambientLight, sunLight, fillLight,
  intStudioLight1, intStudioLight2, intGazeboLight, intSummerLight, intUtilityLight,
  bottomLight, bottomFill1, bottomFill2,
  currentInteractionMode
};
