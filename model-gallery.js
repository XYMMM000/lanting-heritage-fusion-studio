import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const viewport = document.getElementById('model-viewport');
const canvas = document.getElementById('model-canvas');

if (viewport && canvas) {
  const loading = document.getElementById('model-loading');
  const progress = document.getElementById('model-progress');
  const title = document.getElementById('model-title');
  const description = document.getElementById('model-description');
  const counter = document.getElementById('model-counter');
  const options = [...document.querySelectorAll('.model-option')];

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x10120e);
  scene.fog = new THREE.Fog(0x10120e, 8, 22);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  camera.position.set(4.6, 3.4, 5.8);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;
  controls.minDistance = 2;
  controls.maxDistance = 14;

  scene.add(new THREE.HemisphereLight(0xe8e3d6, 0x252018, 2.2));
  const key = new THREE.DirectionalLight(0xffd7b4, 5);
  key.position.set(5, 7, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd84932, 4);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(4.6, 72),
    new THREE.MeshStandardMaterial({ color: 0x171813, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.75;
  scene.add(ground);

  const grid = new THREE.GridHelper(9, 18, 0x57332b, 0x252820);
  grid.position.y = -1.73;
  scene.add(grid);

  const loader = new FBXLoader();
  let activeModel;
  let currentRequest = 0;
  let initialized = false;

  function resize() {
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function normalizeModel(model) {
    model.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = new THREE.MeshStandardMaterial({
        color: 0xb87a48,
        roughness: 0.56,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3.6 / maxDimension;

    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    model.rotation.x = -Math.PI / 2;

    const normalizedBox = new THREE.Box3().setFromObject(model);
    const normalizedCenter = normalizedBox.getCenter(new THREE.Vector3());
    model.position.sub(normalizedCenter);
    model.position.y += .15;
  }

  function loadModel(option, index) {
    const requestId = ++currentRequest;
    loading.classList.remove('hidden', 'error');
    progress.textContent = '0%';
    title.textContent = option.dataset.title;
    description.textContent = option.dataset.description;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(options.length).padStart(2, '0')}`;

    loader.load(
      `assets/models/${option.dataset.model}`,
      model => {
        if (requestId !== currentRequest) return;
        if (activeModel) scene.remove(activeModel);
        normalizeModel(model);
        activeModel = model;
        scene.add(model);
        camera.position.set(4.6, 3.4, 5.8);
        controls.target.set(0, 0, 0);
        controls.update();
        loading.classList.add('hidden');
      },
      event => {
        if (!event.total) {
          progress.textContent = '读取结构数据';
          return;
        }
        progress.textContent = `${Math.round(event.loaded / event.total * 100)}%`;
      },
      error => {
        console.error('FBX model failed to load:', error);
        loading.classList.add('error');
        loading.querySelector('strong').textContent = '模型加载失败';
        progress.textContent = '请通过本地服务器或线上地址访问';
      }
    );
  }

  options.forEach((option, index) => {
    option.addEventListener('click', () => {
      options.forEach(item => item.classList.remove('active'));
      option.classList.add('active');
      loadModel(option, index);
    });
  });

  canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; });
  canvas.addEventListener('dblclick', () => {
    camera.position.set(4.6, 3.4, 5.8);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.update();
  });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);

  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  const activationObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || initialized) return;
    initialized = true;
    resize();
    loadModel(options[0], 0);
    animate();
    activationObserver.disconnect();
  }, { rootMargin: '300px' });

  activationObserver.observe(viewport);
}
