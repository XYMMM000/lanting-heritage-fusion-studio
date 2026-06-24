import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const viewer = document.getElementById('stl-viewer');
const canvas = document.getElementById('stl-canvas');

if (viewer && canvas) {
  const loading = document.getElementById('stl-loading');
  const progress = document.getElementById('stl-progress');
  const faces = document.getElementById('stl-faces');
  const modeLabel = document.getElementById('stl-mode-label');
  const resetButton = document.getElementById('stl-reset');
  const wireframeButton = document.getElementById('stl-wireframe');
  const rotateButton = document.getElementById('stl-rotate');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090c0e);
  scene.fog = new THREE.Fog(0x090c0e, 7, 18);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
  const initialCamera = new THREE.Vector3(5.2, 4.1, 6.3);
  camera.position.copy(initialCamera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.72;
  controls.minDistance = 2.4;
  controls.maxDistance = 13;

  scene.add(new THREE.HemisphereLight(0xdce8ed, 0x151b1e, 2.7));
  const key = new THREE.DirectionalLight(0xe8ff8a, 5);
  key.position.set(4, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff5a1f, 4.2);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const grid = new THREE.GridHelper(10, 20, 0x668000, 0x20282b);
  grid.position.y = -1.55;
  scene.add(grid);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(3.25, 3.55, 0.16, 80),
    new THREE.MeshStandardMaterial({ color: 0x11171a, roughness: 0.78, metalness: 0.35 })
  );
  platform.position.y = -1.65;
  scene.add(platform);

  let model;
  let solidMaterial;
  let edgeLines;
  let initialized = false;

  function parseBinarySTL(buffer) {
    const view = new DataView(buffer);
    const triangleCount = view.getUint32(80, true);
    const expectedLength = 84 + triangleCount * 50;
    if (expectedLength > buffer.byteLength) throw new Error('STL 数据不完整');

    const positions = new Float32Array(triangleCount * 9);
    const normals = new Float32Array(triangleCount * 9);
    let offset = 84;

    for (let face = 0; face < triangleCount; face += 1) {
      const nx = view.getFloat32(offset, true);
      const ny = view.getFloat32(offset + 4, true);
      const nz = view.getFloat32(offset + 8, true);
      offset += 12;

      for (let vertex = 0; vertex < 3; vertex += 1) {
        const index = face * 9 + vertex * 3;
        positions[index] = view.getFloat32(offset, true);
        positions[index + 1] = view.getFloat32(offset + 4, true);
        positions[index + 2] = view.getFloat32(offset + 8, true);
        normals[index] = nx;
        normals[index + 1] = ny;
        normals[index + 2] = nz;
        offset += 12;
      }
      offset += 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    return { geometry, triangleCount };
  }

  function fitModel(geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const center = box.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.computeBoundingBox();

    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 5.3 / maxDimension;

    model.scale.setScalar(scale);
    model.rotation.x = -Math.PI / 2;
    model.rotation.z = Math.PI / 8;
    model.updateMatrixWorld(true);

    const fittedBox = new THREE.Box3().setFromObject(model);
    model.position.y -= fittedBox.min.y + 1.48;
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function resetView() {
    camera.position.copy(initialCamera);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function resize() {
    const width = viewer.querySelector('.stl-stage').clientWidth;
    const height = viewer.querySelector('.stl-stage').clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  async function loadModel() {
    if (initialized) return;
    initialized = true;
    progress.textContent = '正在读取 605 KB 网格数据';

    try {
      const response = await fetch(encodeURI('assets/qingcang/装配体2 - 五寸机 机身-1.STL'));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      progress.textContent = '正在解析三角网格';

      const parsed = parseBinarySTL(buffer);
      solidMaterial = new THREE.MeshStandardMaterial({
        color: 0xbfdc23,
        roughness: 0.42,
        metalness: 0.16,
        side: THREE.DoubleSide
      });
      model = new THREE.Mesh(parsed.geometry, solidMaterial);
      scene.add(model);

      const edgeGeometry = new THREE.EdgesGeometry(parsed.geometry, 26);
      edgeLines = new THREE.LineSegments(
        edgeGeometry,
        new THREE.LineBasicMaterial({ color: 0x273014, transparent: true, opacity: 0.7 })
      );
      model.add(edgeLines);

      fitModel(parsed.geometry);
      faces.textContent = parsed.triangleCount.toLocaleString('zh-CN');
      loading.classList.add('hidden');
    } catch (error) {
      loading.classList.add('error');
      loading.querySelector('strong').textContent = '模型加载失败';
      progress.textContent = error.message;
    }
  }

  resetButton.addEventListener('click', resetView);
  canvas.addEventListener('dblclick', resetView);
  wireframeButton.addEventListener('click', () => {
    if (!solidMaterial) return;
    solidMaterial.wireframe = !solidMaterial.wireframe;
    edgeLines.visible = !solidMaterial.wireframe;
    wireframeButton.classList.toggle('active', solidMaterial.wireframe);
    modeLabel.textContent = solidMaterial.wireframe ? '三角线框' : '实体 + 结构线';
  });
  rotateButton.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    rotateButton.classList.toggle('active', controls.autoRotate);
    rotateButton.querySelector('span').textContent = controls.autoRotate ? '●' : '○';
  });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewer.querySelector('.stl-stage'));

  const visibilityObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    loadModel();
    visibilityObserver.disconnect();
  }, { rootMargin: '300px' });
  visibilityObserver.observe(viewer);

  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  resize();
  animate();
}
