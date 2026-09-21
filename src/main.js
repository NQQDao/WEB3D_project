import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ============================================================================
// 1. PROCEDURAL TEXTURE GENERATORS (Cao cấp, siêu nhẹ, không phụ thuộc file ngoài)
// ============================================================================

// Tạo vân sàn gỗ tự nhiên (Wood Parquet / Planks)
function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b3885d';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankHeight = 64;
  const plankWidth = 256;
  const rows = 1024 / plankHeight;
  const cols = 1024 / plankWidth;

  for (let r = 0; r < rows; r++) {
    const offsetX = (r % 2) * (plankWidth / 2);
    for (let c = -1; c <= cols; c++) {
      const x = c * plankWidth + offsetX;
      const y = r * plankHeight;

      // Màu biến thiên nhẹ giữa các thanh gỗ
      const toneVariation = (Math.sin(r * 3.7 + c * 5.1) * 0.5 + 0.5) * 24 - 12;
      const baseR = Math.min(255, Math.max(0, 180 + toneVariation));
      const baseG = Math.min(255, Math.max(0, 138 + toneVariation * 0.9));
      const baseB = Math.min(255, Math.max(0, 95 + toneVariation * 0.7));

      ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
      ctx.fillRect(x + 1, y + 1, plankWidth - 2, plankHeight - 2);

      // Đường vân thớ gỗ
      ctx.strokeStyle = `rgba(${baseR - 25}, ${baseG - 25}, ${baseB - 25}, 0.25)`;
      ctx.lineWidth = 1;
      for (let g = 0; g < 4; g++) {
        const gy = y + 8 + g * 13;
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.bezierCurveTo(
          x + plankWidth * 0.3, gy + (Math.random() - 0.5) * 4,
          x + plankWidth * 0.7, gy + (Math.random() - 0.5) * 4,
          x + plankWidth, gy
        );
        ctx.stroke();
      }

      // Rãnh giữa các thanh gỗ
      ctx.strokeStyle = 'rgba(70, 42, 22, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, plankWidth, plankHeight);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Tạo vân thảm len dệt (Woven Area Rug)
function createRugTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ded5c7';
  ctx.fillRect(0, 0, 512, 512);

  // Vân dệt chéo xương cá tinh tế
  ctx.strokeStyle = 'rgba(165, 150, 135, 0.4)';
  ctx.lineWidth = 2;
  for (let i = -512; i < 1024; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 512);
    ctx.lineTo(i + 512, 0);
    ctx.stroke();
  }

  // Viền hoa văn tối giản phong cách Bắc Âu
  ctx.strokeStyle = 'rgba(120, 105, 90, 0.5)';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 472, 472);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Tạo vân đá cẩm thạch Calacatta cho mặt bàn trà
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8f7f4';
  ctx.fillRect(0, 0, 512, 512);

  // Đường vân đá tự nhiên uốn lượn
  ctx.strokeStyle = 'rgba(190, 175, 160, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.bezierCurveTo(150, 80, 280, 300, 512, 260);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(160, 140, 125, 0.35)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(80, 0);
  ctx.bezierCurveTo(220, 180, 320, 240, 440, 512);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(215, 195, 175, 0.4)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(200, 512);
  ctx.bezierCurveTo(310, 380, 380, 120, 512, 80);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Tạo tranh nghệ thuật trừu tượng treo tường
function createArtCanvasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Nền tranh
  ctx.fillStyle = '#f1ece4';
  ctx.fillRect(0, 0, 512, 768);

  // Khối hình học Terracotta ấm
  ctx.fillStyle = '#b76543';
  ctx.beginPath();
  ctx.arc(256, 320, 160, 0, Math.PI);
  ctx.fill();

  // Khối tròn Olive
  ctx.fillStyle = '#656f5a';
  ctx.beginPath();
  ctx.arc(320, 220, 90, 0, Math.PI * 2);
  ctx.fill();

  // Khối vàng hoàng thổ Warm Ochre
  ctx.fillStyle = '#d3a059';
  ctx.beginPath();
  ctx.arc(180, 420, 80, 0, Math.PI * 2);
  ctx.fill();

  // Vòm nét đen tối giản (Arch line)
  ctx.strokeStyle = '#23201d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 380, 190, Math.PI, 0, false);
  ctx.stroke();

  // Đường kẻ thẳng thanh lịch
  ctx.beginPath();
  ctx.moveTo(256, 80);
  ctx.lineTo(256, 680);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ============================================================================
// 2. SETUP SCENE, CAMERA, RENDERER & CONTROLS
// ============================================================================

const container = document.getElementById('canvas-container') || document.body;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xefeae2);
scene.fog = new THREE.FogExp2(0xefeae2, 0.035);

const camera = new THREE.PerspectiveCamera(
  40,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(4.5, 3.0, 5.8);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(-0.2, 0.9, 0.2);
controls.minDistance = 2.4;
controls.maxDistance = 10.5;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // Không cho camera đi xuống dưới sàn
controls.minPolarAngle = 0.15;
controls.enablePan = true;

// ============================================================================
// 3. LIGHTING SYSTEM (Hệ thống ánh sáng 3 kịch bản: Ngày, Hoàng Hôn, Đêm)
// ============================================================================

const hemiLight = new THREE.HemisphereLight(0xfff7ea, 0x8a7d72, 0.7);
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

// Ánh sáng mặt trời chính chiếu từ hướng cửa sổ
const sunLight = new THREE.DirectionalLight(0xfff4e6, 2.2);
sunLight.position.set(-6, 7, 3);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 25;
sunLight.shadow.camera.left = -5.5;
sunLight.shadow.camera.right = 5.5;
sunLight.shadow.camera.top = 5.5;
sunLight.shadow.camera.bottom = -5.5;
sunLight.shadow.bias = -0.0003;
sunLight.shadow.radius = 2.2;
scene.add(sunLight);

// Đèn hắt bổ trợ làm sáng các góc khuất
const fillLight = new THREE.DirectionalLight(0xe8eeff, 0.6);
fillLight.position.set(5, 4, 4);
scene.add(fillLight);

// Ánh sáng phát ra từ đèn cây (Halo Floor Lamp)
const lampLight = new THREE.PointLight(0xffb86c, 0, 6, 1.8);
lampLight.position.set(2.35, 2.2, -0.6);
lampLight.castShadow = true;
lampLight.shadow.bias = -0.001;
lampLight.shadow.radius = 3;
scene.add(lampLight);

// Nguồn sáng phát sáng của chao đèn cây
let lampShadeMaterial;

// Cấu hình các chế độ ánh sáng
const lightingPresets = {
  day: {
    bg: 0xefeae2,
    fog: 0xefeae2,
    hemiSky: 0xfff8ee,
    hemiGround: 0xa49789,
    hemiInt: 0.8,
    ambient: 0.45,
    sunCol: 0xfff4e6,
    sunInt: 2.2,
    sunPos: [-6, 7, 3],
    fillCol: 0xe8eeff,
    fillInt: 0.65,
    lampInt: 0,
    lampEmissive: 0x000000,
    exposure: 1.05,
  },
  sunset: {
    bg: 0xd8bfaf,
    fog: 0xd8bfaf,
    hemiSky: 0xffcb9e,
    hemiGround: 0x5a4235,
    hemiInt: 0.65,
    ambient: 0.35,
    sunCol: 0xff8c42,
    sunInt: 2.8,
    sunPos: [-7, 4.5, 2.5],
    fillCol: 0xffa07a,
    fillInt: 0.4,
    lampInt: 1.5,
    lampEmissive: 0xffa84d,
    exposure: 1.0,
  },
  night: {
    bg: 0x141824,
    fog: 0x141824,
    hemiSky: 0x222d46,
    hemiGround: 0x11131c,
    hemiInt: 0.25,
    ambient: 0.15,
    sunCol: 0x3d507a,
    sunInt: 0.3,
    sunPos: [-6, 5, 3],
    fillCol: 0x232c45,
    fillInt: 0.2,
    lampInt: 4.8,
    lampEmissive: 0xffbe76,
    exposure: 1.15,
  },
};

let currentLightingMode = 'day';

function setLightingMode(mode) {
  const cfg = lightingPresets[mode] || lightingPresets.day;
  currentLightingMode = mode;

  scene.background.setHex(cfg.bg);
  scene.fog.color.setHex(cfg.fog);

  hemiLight.color.setHex(cfg.hemiSky);
  hemiLight.groundColor.setHex(cfg.hemiGround);
  hemiLight.intensity = cfg.hemiInt;

  ambientLight.intensity = cfg.ambient;

  sunLight.color.setHex(cfg.sunCol);
  sunLight.intensity = cfg.sunInt;
  sunLight.position.set(cfg.sunPos[0], cfg.sunPos[1], cfg.sunPos[2]);

  fillLight.color.setHex(cfg.fillCol);
  fillLight.intensity = cfg.fillInt;

  lampLight.intensity = cfg.lampInt;
  if (lampShadeMaterial) {
    lampShadeMaterial.emissive.setHex(cfg.lampEmissive);
  }

  renderer.toneMappingExposure = cfg.exposure;
}

// ============================================================================
// 4. CHẤT LIỆU VẬT LIỆU CAO CẤP (PBR Materials)
// ============================================================================

const woodTexture = createWoodTexture();
const rugTexture = createRugTexture();
const marbleTexture = createMarbleTexture();
const artTexture = createArtCanvasTexture();

// Chất liệu sàn gỗ
const floorMaterial = new THREE.MeshStandardMaterial({
  map: woodTexture,
  roughness: 0.38,
  metalness: 0.05,
});

// Chất liệu thảm len dệt
const rugMaterial = new THREE.MeshStandardMaterial({
  map: rugTexture,
  roughness: 0.95,
  metalness: 0.0,
});

// Chất liệu tường nhà
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xf4eee6,
  roughness: 0.9,
  metalness: 0.0,
});

// Chất liệu kim loại đồng thau xước (Brushed Brass)
const brassMaterial = new THREE.MeshStandardMaterial({
  color: 0xcca368,
  metalness: 0.88,
  roughness: 0.28,
});

// Chất liệu kim loại đen nhám (Matte Black Metal)
const blackMetalMaterial = new THREE.MeshStandardMaterial({
  color: 0x1f2022,
  metalness: 0.7,
  roughness: 0.35,
});

// Chất liệu gốm sứ trắng tinh (Matte Ceramic)
const ceramicMaterial = new THREE.MeshStandardMaterial({
  color: 0xfaf9f6,
  roughness: 0.25,
  metalness: 0.05,
});

// Bảng tùy chọn màu sắc & chất liệu Sofa
export const sofaFinishes = {
  cream: {
    name: 'Kem Bouclé (Ivory)',
    color: 0xf3ece0,
    roughness: 0.88,
    metalness: 0.0,
    description: 'Vải nỉ xù Bouclé cao cấp nhập khẩu Bỉ, ấm áp, mềm mại tự nhiên.',
    pillowColorA: 0xc89d7c,
    pillowColorB: 0x5a6351,
  },
  cognac: {
    name: 'Da Bò Cognac (Leather)',
    color: 0x9e522c,
    roughness: 0.38,
    metalness: 0.08,
    description: 'Da thuộc Full-grain Italy màu nâu Cognac sang trọng cổ điển.',
    pillowColorA: 0xe8ded0,
    pillowColorB: 0x2e2c2a,
  },
  sage: {
    name: 'Xanh Rêu Velvet (Olive)',
    color: 0x485844,
    roughness: 0.65,
    metalness: 0.02,
    description: 'Nhung tuyết màu xanh rêu thanh lịch, phong cách Modern Nordic.',
    pillowColorA: 0xd9b382,
    pillowColorB: 0xece5db,
  },
  charcoal: {
    name: 'Xám Khói Slate (Charcoal)',
    color: 0x2b2e34,
    roughness: 0.78,
    metalness: 0.02,
    description: 'Vải dệt công nghệ chống bám bẩn, gam màu xám than hiện đại.',
    pillowColorA: 0xc47e5b,
    pillowColorB: 0x9fa4ab,
  },
};

const sofaMaterial = new THREE.MeshStandardMaterial({
  color: sofaFinishes.cream.color,
  roughness: sofaFinishes.cream.roughness,
  metalness: sofaFinishes.cream.metalness,
});

const pillowMaterialA = new THREE.MeshStandardMaterial({
  color: sofaFinishes.cream.pillowColorA,
  roughness: 0.75,
});

const pillowMaterialB = new THREE.MeshStandardMaterial({
  color: sofaFinishes.cream.pillowColorB,
  roughness: 0.8,
});

function applySofaFinish(key) {
  const finish = sofaFinishes[key];
  if (!finish) return;
  sofaMaterial.color.setHex(finish.color);
  sofaMaterial.roughness = finish.roughness;
  sofaMaterial.metalness = finish.metalness;
  pillowMaterialA.color.setHex(finish.pillowColorA);
  pillowMaterialB.color.setHex(finish.pillowColorB);
}

// ============================================================================
// 5. MÔ HÌNH HÓA NỘI THẤT 3D (3D Interior Showroom Components)
// ============================================================================

const sceneGroup = new THREE.Group();
scene.add(sceneGroup);

// --- A. PHÒNG KIẾN TRÚC (Sàn, Tường, Phào, Cửa sổ, Tranh) ---
function buildRoom() {
  const room = new THREE.Group();

  // Sàn nhà
  const floorGeo = new THREE.PlaneGeometry(12, 10);
  const floor = new THREE.Mesh(floorGeo, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  // Thảm phòng khách
  const rugGeo = new RoundedBoxGeometry(3.6, 0.02, 2.6, 6, 0.08);
  const rug = new THREE.Mesh(rugGeo, rugMaterial);
  rug.position.set(-0.2, 0.01, 0.2);
  rug.receiveShadow = true;
  room.add(rug);

  // Tường sau
  const backWallGeo = new THREE.BoxGeometry(12, 5, 0.2);
  const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
  backWall.position.set(0, 2.5, -4.5);
  backWall.receiveShadow = true;
  room.add(backWall);

  // Tường bên phải
  const rightWallGeo = new THREE.BoxGeometry(0.2, 5, 10);
  const rightWall = new THREE.Mesh(rightWallGeo, wallMaterial);
  rightWall.position.set(5.5, 2.5, 0);
  rightWall.receiveShadow = true;
  room.add(rightWall);

  // Phào chân tường (Skirting / Baseboard)
  const baseboardGeo = new THREE.BoxGeometry(12, 0.18, 0.06);
  const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d8, roughness: 0.5 });
  const baseboardBack = new THREE.Mesh(baseboardGeo, baseboardMat);
  baseboardBack.position.set(0, 0.09, -4.38);
  room.add(baseboardBack);

  // Cửa sổ kính lớn phía tường trái (Floor-to-ceiling Architectural Window)
  const windowGroup = new THREE.Group();
  windowGroup.position.set(-5.2, 2.4, 0);
  windowGroup.rotation.y = Math.PI / 2;

  // Khung cửa sổ nhôm đen
  const frameMat = blackMetalMaterial;
  const outerFrameGeo = new THREE.BoxGeometry(5.2, 3.8, 0.12);
  const outerFrame = new THREE.Mesh(outerFrameGeo, frameMat);
  windowGroup.add(outerFrame);

  // Đố cửa sổ (Mullions)
  const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.7, 0.14), frameMat);
  windowGroup.add(mullionV);

  const mullionH = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.08, 0.14), frameMat);
  mullionH.position.y = 0.5;
  windowGroup.add(mullionH);

  // Kính cửa sổ bán trong suốt
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.18,
    transmission: 0.9,
    roughness: 0.05,
    ior: 1.45,
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 3.6), glassMat);
  windowGroup.add(glass);

  // Vùng trời / ban công mờ phía ngoài cửa sổ
  const vistaMat = new THREE.MeshBasicMaterial({ color: 0xfdfaf5 });
  const vistaPlane = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), vistaMat);
  vistaPlane.position.z = -0.3;
  windowGroup.add(vistaPlane);

  room.add(windowGroup);

  // Tranh nghệ thuật trừu tượng treo tường sau
  const artGroup = new THREE.Group();
  artGroup.position.set(-0.3, 2.6, -4.38);

  const artFrameGeo = new THREE.BoxGeometry(1.6, 2.2, 0.05);
  const artFrame = new THREE.Mesh(artFrameGeo, brassMaterial);
  artFrame.castShadow = true;
  artGroup.add(artFrame);

  const artCanvasGeo = new THREE.PlaneGeometry(1.48, 2.08);
  const artCanvasMat = new THREE.MeshStandardMaterial({
    map: artTexture,
    roughness: 0.7,
  });
  const artCanvas = new THREE.Mesh(artCanvasGeo, artCanvasMat);
  artCanvas.position.z = 0.03;
  artGroup.add(artCanvas);

  room.add(artGroup);

  // Kệ gỗ gắn tường phong cách tối giản (Floating shelf)
  const shelfGeo = new RoundedBoxGeometry(2.4, 0.06, 0.28, 4, 0.02);
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x936848, roughness: 0.4 });
  const shelf = new THREE.Mesh(shelfGeo, shelfMat);
  shelf.position.set(2.6, 2.1, -4.26);
  shelf.castShadow = true;
  shelf.receiveShadow = true;
  room.add(shelf);

  // Đồ decor trên kệ: bình hoa mini & tượng nhỏ
  const miniVase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.06, 0.32, 24),
    ceramicMaterial
  );
  miniVase.position.set(2.0, 2.3, -4.26);
  miniVase.castShadow = true;
  room.add(miniVase);

  const miniBookGeo = new THREE.BoxGeometry(0.24, 0.08, 0.18);
  const miniBook = new THREE.Mesh(
    miniBookGeo,
    new THREE.MeshStandardMaterial({ color: 0x3d434f, roughness: 0.6 })
  );
  miniBook.position.set(2.8, 2.18, -4.26);
  miniBook.castShadow = true;
  room.add(miniBook);

  return room;
}

// --- B. SOFA CAO CẤP "LUNA CURVE LOUNGE" ---
function buildSofa() {
  const sofa = new THREE.Group();
  sofa.position.set(-0.2, 0, -0.6);

  // Khung đế sofa
  const baseGeo = new RoundedBoxGeometry(2.36, 0.2, 0.95, 6, 0.08);
  const baseMesh = new THREE.Mesh(baseGeo, sofaMaterial);
  baseMesh.position.y = 0.24;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  sofa.add(baseMesh);

  // 3 Đệm ngồi (Seat Cushions) bo góc phồng êm ái
  const cushionWidth = 0.72;
  const cushionGeo = new RoundedBoxGeometry(cushionWidth, 0.24, 0.88, 8, 0.09);
  [-0.74, 0, 0.74].forEach((xPos) => {
    const cushion = new THREE.Mesh(cushionGeo, sofaMaterial);
    cushion.position.set(xPos, 0.44, 0.02);
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    sofa.add(cushion);
  });

  // Tựa lưng chính (Backrest)
  const backGeo = new RoundedBoxGeometry(2.36, 0.52, 0.26, 8, 0.1);
  const backMesh = new THREE.Mesh(backGeo, sofaMaterial);
  backMesh.position.set(0, 0.68, -0.36);
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;
  sofa.add(backMesh);

  // 2 Đệm tựa lưng êm ái phía trước
  const backPillowGeo = new RoundedBoxGeometry(1.08, 0.38, 0.16, 8, 0.07);
  [-0.56, 0.56].forEach((xPos) => {
    const backPillow = new THREE.Mesh(backPillowGeo, sofaMaterial);
    backPillow.position.set(xPos, 0.64, -0.22);
    backPillow.rotation.x = -0.12;
    backPillow.castShadow = true;
    sofa.add(backPillow);
  });

  // 2 Tay vịn bo cong mềm mại (Armrests)
  const armGeo = new RoundedBoxGeometry(0.24, 0.42, 0.94, 8, 0.09);
  const armLeft = new THREE.Mesh(armGeo, sofaMaterial);
  armLeft.position.set(-1.18, 0.48, 0.0);
  armLeft.castShadow = true;
  armLeft.receiveShadow = true;
  sofa.add(armLeft);

  const armRight = new THREE.Mesh(armGeo, sofaMaterial);
  armRight.position.set(1.18, 0.48, 0.0);
  armRight.castShadow = true;
  armRight.receiveShadow = true;
  sofa.add(armRight);

  // Gối tựa trang trí (Accent Throw Pillows)
  const pillowGeo = new RoundedBoxGeometry(0.38, 0.38, 0.16, 6, 0.07);

  const pillowA = new THREE.Mesh(pillowGeo, pillowMaterialA);
  pillowA.position.set(-0.95, 0.56, -0.12);
  pillowA.rotation.set(0.1, 0.3, -0.25);
  pillowA.castShadow = true;
  sofa.add(pillowA);

  const pillowB = new THREE.Mesh(pillowGeo, pillowMaterialB);
  pillowB.position.set(0.95, 0.56, -0.12);
  pillowB.rotation.set(0.1, -0.3, 0.25);
  pillowB.castShadow = true;
  sofa.add(pillowB);

  // 4 Chân sofa kim loại đồng thau tiện tròn vát côn
  const legGeo = new THREE.CylinderGeometry(0.024, 0.016, 0.16, 16);
  const legPositions = [
    [-1.05, 0.08, 0.36],
    [1.05, 0.08, 0.36],
    [-1.05, 0.08, -0.36],
    [1.05, 0.08, -0.36],
  ];

  legPositions.forEach(([lx, ly, lz]) => {
    const leg = new THREE.Mesh(legGeo, brassMaterial);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    sofa.add(leg);
  });

  return sofa;
}

// --- C. BÀN TRÀ NGHỆ THUẬT "ARLO FLUTED TABLE" ---
function buildCoffeeTable() {
  const table = new THREE.Group();
  table.position.set(-0.2, 0, 0.82);

  // Thân bàn gân sọc bo tròn (Fluted Wood Base)
  const baseCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.42, 0.34, 36),
    new THREE.MeshStandardMaterial({
      color: 0x936848,
      roughness: 0.45,
    })
  );
  baseCylinder.position.y = 0.17;
  baseCylinder.castShadow = true;
  baseCylinder.receiveShadow = true;
  table.add(baseCylinder);

  // Mặt bàn đá cẩm thạch bo tròn viền
  const topGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.04, 48);
  const topMat = new THREE.MeshStandardMaterial({
    map: marbleTexture,
    roughness: 0.2,
    metalness: 0.05,
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.position.y = 0.36;
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  table.add(topMesh);

  // Lọ gốm trang trí trên bàn
  const vaseGeo = new THREE.CylinderGeometry(0.09, 0.13, 0.26, 24);
  const vase = new THREE.Mesh(vaseGeo, ceramicMaterial);
  vase.position.set(-0.16, 0.51, -0.08);
  vase.castShadow = true;
  table.add(vase);

  // Cành hoa khô trong lọ
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x6e5843, roughness: 0.9 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8), stemMat);
  stem.position.set(-0.16, 0.72, -0.08);
  stem.rotation.z = 0.2;
  table.add(stem);

  // Sách bìa cứng phong cách nghệ thuật (Art Coffee Book)
  const bookGeo = new THREE.BoxGeometry(0.26, 0.04, 0.36);
  const book = new THREE.Mesh(
    bookGeo,
    new THREE.MeshStandardMaterial({ color: 0x222429, roughness: 0.6 })
  );
  book.position.set(0.18, 0.4, 0.06);
  book.rotation.y = 0.3;
  book.castShadow = true;
  table.add(book);

  // Nến thơm cao cấp
  const candleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.09, 18);
  const candle = new THREE.Mesh(
    candleGeo,
    new THREE.MeshStandardMaterial({ color: 0xd6c0a0, roughness: 0.3 })
  );
  candle.position.set(0.12, 0.42, -0.16);
  candle.castShadow = true;
  table.add(candle);

  return table;
}

// --- D. GHẾ THƯ GIÃN "TERRA NORDIC ARMCHAIR" ---
function buildLoungeChair() {
  const chair = new THREE.Group();
  chair.position.set(-1.85, 0, 0.45);
  chair.rotation.y = Math.PI / 4.2;

  const chairClothMat = new THREE.MeshStandardMaterial({
    color: 0xc89874,
    roughness: 0.82,
    metalness: 0.0,
  });

  // Đệm ngồi ghế đơn
  const seatGeo = new RoundedBoxGeometry(0.72, 0.16, 0.7, 6, 0.07);
  const seat = new THREE.Mesh(seatGeo, chairClothMat);
  seat.position.y = 0.38;
  seat.castShadow = true;
  seat.receiveShadow = true;
  chair.add(seat);

  // Tựa lưng uốn cong nhẹ
  const backGeo = new RoundedBoxGeometry(0.7, 0.52, 0.14, 6, 0.06);
  const back = new THREE.Mesh(backGeo, chairClothMat);
  back.position.set(0, 0.66, -0.28);
  back.rotation.x = -0.18;
  back.castShadow = true;
  back.receiveShadow = true;
  chair.add(back);

  // Khung chân gỗ sồi nghiêng thanh thoát
  const chairLegGeo = new THREE.CylinderGeometry(0.022, 0.016, 0.42, 14);
  const chairLegMat = new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.5 });

  const legs = [
    [-0.3, 0.19, 0.28, 0.12, 0, 0.12],
    [0.3, 0.19, 0.28, 0.12, 0, -0.12],
    [-0.3, 0.19, -0.28, -0.12, 0, 0.12],
    [0.3, 0.19, -0.28, -0.12, 0, -0.12],
  ];

  legs.forEach(([lx, ly, lz, rx, ry, rz]) => {
    const leg = new THREE.Mesh(chairLegGeo, chairLegMat);
    leg.position.set(lx, ly, lz);
    leg.rotation.set(rx, ry, rz);
    leg.castShadow = true;
    chair.add(leg);
  });

  return chair;
}

// --- E. ĐÈN CÂY UỐN CONG "HALO BRASS ARC LAMP" ---
function buildFloorLamp() {
  const lamp = new THREE.Group();
  lamp.position.set(2.1, 0, -0.8);

  // Đế đá cẩm thạch tròn nặng giữ thăng bằng
  const baseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32);
  const baseMat = new THREE.MeshStandardMaterial({
    map: marbleTexture,
    roughness: 0.25,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.03;
  base.castShadow = true;
  base.receiveShadow = true;
  lamp.add(base);

  // Cột đứng thẳng bằng đồng thau
  const poleLower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 1.8, 16),
    brassMaterial
  );
  poleLower.position.y = 0.93;
  poleLower.castShadow = true;
  lamp.add(poleLower);

  // Cần vòm uốn cong vươn ra (Arc curve) tạo bằng Torus uốn 1/4 cung tròn
  const arcCurve = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.016, 12, 32, Math.PI / 2),
    brassMaterial
  );
  arcCurve.position.set(-0.7, 1.83, 0);
  arcCurve.rotation.z = Math.PI;
  arcCurve.castShadow = true;
  lamp.add(arcCurve);

  // Chao đèn kim loại hình nón chuông (Lamp Shade)
  const shadeGeo = new THREE.ConeGeometry(0.22, 0.24, 28, 1, true);
  lampShadeMaterial = new THREE.MeshStandardMaterial({
    color: 0xcca368,
    metalness: 0.7,
    roughness: 0.25,
    emissive: 0x000000,
    emissiveIntensity: 1.0,
    side: THREE.DoubleSide,
  });
  const shade = new THREE.Mesh(shadeGeo, lampShadeMaterial);
  shade.position.set(-0.7, 2.3, 0);
  shade.rotation.x = Math.PI;
  shade.castShadow = true;
  lamp.add(shade);

  // Bóng đèn phát sáng bên trong chao
  const bulbGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.set(-0.7, 2.22, 0);
  lamp.add(bulb);

  return lamp;
}

// --- F. CÂY XANH NỘI THẤT "FIDDLE-LEAF FIG PLANT" ---
function buildPlant() {
  const plant = new THREE.Group();
  plant.position.set(-2.8, 0, -2.6);

  // Đôn gỗ 3 chân kê chậu cây
  const standMat = new THREE.MeshStandardMaterial({ color: 0x6e4a2c, roughness: 0.6 });
  const standTop = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24), standMat);
  standTop.position.y = 0.22;
  standTop.castShadow = true;
  plant.add(standTop);

  [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach((angle) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24, 12), standMat);
    leg.position.set(Math.cos(angle) * 0.2, 0.12, Math.sin(angle) * 0.2);
    leg.castShadow = true;
    plant.add(leg);
  });

  // Chậu sứ trắng trụ đứng
  const potGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.44, 28);
  const pot = new THREE.Mesh(potGeo, ceramicMaterial);
  pot.position.y = 0.46;
  pot.castShadow = true;
  pot.receiveShadow = true;
  plant.add(pot);

  // Đất trong chậu
  const soilGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24);
  const soil = new THREE.Mesh(
    soilGeo,
    new THREE.MeshStandardMaterial({ color: 0x241d17, roughness: 0.95 })
  );
  soil.position.y = 0.64;
  plant.add(soil);

  // Thân cây & các nhánh
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a4837, roughness: 0.8 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.03, 1.1, 10), trunkMat);
  trunk.position.y = 1.15;
  trunk.castShadow = true;
  plant.add(trunk);

  // Các phiến lá Fiddle-leaf xanh tươi
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x2e5c38,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });

  const leafGeo = new RoundedBoxGeometry(0.28, 0.01, 0.42, 4, 0.06);

  const leavesConfig = [
    { y: 0.95, rz: 0.5, rx: 0.2, ry: 0 },
    { y: 1.15, rz: -0.6, rx: 0.3, ry: 1.2 },
    { y: 1.35, rz: 0.4, rx: -0.4, ry: 2.3 },
    { y: 1.5, rz: -0.5, rx: -0.2, ry: 3.5 },
    { y: 1.65, rz: 0.3, rx: 0.4, ry: 4.6 },
    { y: 1.78, rz: 0.1, rx: 0.1, ry: 5.8 },
  ];

  leavesConfig.forEach((cfg) => {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0, cfg.y, 0);
    leaf.rotation.set(cfg.rx, cfg.ry, cfg.rz);
    leaf.translateZ(0.2);
    leaf.castShadow = true;
    plant.add(leaf);
  });

  return plant;
}

// --- G. THƯỚC ĐO KÍCH THƯỚC 3D (3D Dimension Guide) ---
function buildDimensionsGuide() {
  const guide = new THREE.Group();
  guide.position.set(-0.2, 0, -0.6);
  guide.visible = false;

  const lineMat = new THREE.LineDashedMaterial({
    color: 0xa85d3c,
    dashSize: 0.08,
    gapSize: 0.05,
    linewidth: 2,
  });

  // Đường đo chiều rộng (Width 220cm)
  const widthPoints = [
    new THREE.Vector3(-1.18, 0.05, 0.55),
    new THREE.Vector3(1.18, 0.05, 0.55),
  ];
  const widthGeo = new THREE.BufferGeometry().setFromPoints(widthPoints);
  const widthLine = new THREE.Line(widthGeo, lineMat);
  widthLine.computeLineDistances();
  guide.add(widthLine);

  // Đường đo chiều sâu (Depth 95cm)
  const depthPoints = [
    new THREE.Vector3(1.25, 0.05, -0.45),
    new THREE.Vector3(1.25, 0.05, 0.5),
  ];
  const depthGeo = new THREE.BufferGeometry().setFromPoints(depthPoints);
  const depthLine = new THREE.Line(depthGeo, lineMat);
  depthLine.computeLineDistances();
  guide.add(depthLine);

  // Đường đo chiều cao (Height 82cm)
  const heightPoints = [
    new THREE.Vector3(-1.25, 0.0, -0.36),
    new THREE.Vector3(-1.25, 0.82, -0.36),
  ];
  const heightGeo = new THREE.BufferGeometry().setFromPoints(heightPoints);
  const heightLine = new THREE.Line(heightGeo, lineMat);
  heightLine.computeLineDistances();
  guide.add(heightLine);

  return guide;
}

// Khởi tạo các thành phần nội thất vào Scene
sceneGroup.add(buildRoom());
const sofaMesh = buildSofa();
sceneGroup.add(sofaMesh);
const tableMesh = buildCoffeeTable();
sceneGroup.add(tableMesh);
const chairMesh = buildLoungeChair();
sceneGroup.add(chairMesh);
const lampMesh = buildFloorLamp();
sceneGroup.add(lampMesh);
const plantMesh = buildPlant();
sceneGroup.add(plantMesh);
const dimensionsGuide = buildDimensionsGuide();
sceneGroup.add(dimensionsGuide);

// ============================================================================
// 6. HỆ THỐNG HOTSPOTS 3D (Điểm tương tác gắn trên mô hình)
// ============================================================================

export const hotspotsData = [
  {
    id: 'hotspot-sofa',
    name: 'Sofa Luna Curve Lounge',
    category: 'Sofa 3 Chỗ Cao Cấp',
    price: '$1,499',
    position: new THREE.Vector3(-0.2, 0.75, -0.5),
    cameraPos: new THREE.Vector3(0.7, 1.6, 2.6),
    cameraTarget: new THREE.Vector3(-0.2, 0.7, -0.4),
    description:
      'Đệm mút đàn hồi đa tầng bọc vải Bouclé Bỉ êm ái, khung gỗ tự nhiên chống mối mọt kết hợp chân đồng thau tinh tế.',
    specs: {
      'Kích thước': '220 x 95 x 82 cm',
      'Chất liệu bọc': 'Bouclé / Da Bò / Nhung',
      'Khung chịu lực': 'Gỗ Sồi Tự Nhiên & Thép',
      'Bảo hành': '10 năm chính hãng',
    },
  },
  {
    id: 'hotspot-table',
    name: 'Bàn Trà Arlo Fluted',
    category: 'Bàn Trà Điêu Khắc',
    price: '$480',
    position: new THREE.Vector3(-0.2, 0.42, 0.82),
    cameraPos: new THREE.Vector3(-0.1, 1.4, 1.9),
    cameraTarget: new THREE.Vector3(-0.2, 0.38, 0.82),
    description:
      'Mặt bàn đá cẩm thạch trắng Calacatta phủ chống ố, kết hợp thân gỗ sồi gân sọc điêu khắc nghệ thuật.',
    specs: {
      'Đường kính': '68 cm',
      'Chiều cao': '38 cm',
      'Mặt bàn': 'Đá Cẩm Thạch Tự Nhiên',
      'Thân bàn': 'Gỗ Sồi Gân Sọc',
    },
  },
  {
    id: 'hotspot-lamp',
    name: 'Đèn Cây Halo Arc Brass',
    category: 'Đèn Sàn Nghệ Thuật',
    price: '$320',
    position: new THREE.Vector3(1.4, 2.2, -0.8),
    cameraPos: new THREE.Vector3(2.4, 2.0, 1.2),
    cameraTarget: new THREE.Vector3(1.4, 1.7, -0.8),
    description:
      'Cần vòm đồng thau xước thanh mảnh, đế đá tự nhiên nặng giữ cân bằng, ánh sáng ấm 2700K dịu nhẹ thư thái.',
    specs: {
      'Chiều cao': '210 cm',
      'Độ vươn vòm': '120 cm',
      'Đế đèn': 'Đá Cẩm Thạch Nguyên Khối',
      'Bóng đèn': 'LED Warm White 2700K',
    },
  },
  {
    id: 'hotspot-chair',
    name: 'Ghế Thư Giãn Terra Nordic',
    category: 'Ghế Tựa Đơn (Armchair)',
    price: '$590',
    position: new THREE.Vector3(-1.85, 0.72, 0.45),
    cameraPos: new THREE.Vector3(-2.6, 1.7, 1.8),
    cameraTarget: new THREE.Vector3(-1.85, 0.55, 0.45),
    description:
      'Thiết kế công thái học ôm trọn lưng, đệm mút mềm bọc nỉ ấm cúng, chân gỗ sồi tiện vát thanh lịch.',
    specs: {
      'Kích thước': '78 x 82 x 78 cm',
      'Độ ngả lưng': 'Công thái học 105°',
      'Chất liệu': 'Vải dệt cao cấp & Gỗ Sồi',
      'Tải trọng': '180 kg',
    },
  },
];

const hotspotElements = [];
const hotspotContainer = document.getElementById('hotspots-overlay');

function initHotspots() {
  if (!hotspotContainer) return;
  hotspotContainer.innerHTML = '';

  hotspotsData.forEach((item, index) => {
    const el = document.createElement('button');
    el.className = 'hotspot-pin';
    el.setAttribute('data-id', item.id);
    el.setAttribute('aria-label', `Xem ${item.name}`);
    el.innerHTML = `
      <span class="hotspot-pulse"></span>
      <span class="hotspot-dot"></span>
      <span class="hotspot-label">${item.name}</span>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      focusHotspot(item);
    });

    hotspotContainer.appendChild(el);
    hotspotElements.push({ el, position: item.position });
  });
}

function updateHotspotsPosition() {
  if (!hotspotElements.length) return;

  const tempV = new THREE.Vector3();
  const widthHalf = container.clientWidth / 2;
  const heightHalf = container.clientHeight / 2;

  hotspotElements.forEach(({ el, position }) => {
    tempV.copy(position);
    tempV.project(camera);

    // Kiểm tra nếu điểm ở phía sau camera
    const isBehind = tempV.z > 1;
    if (isBehind) {
      el.style.display = 'none';
      return;
    }

    el.style.display = 'flex';
    const x = tempV.x * widthHalf + widthHalf;
    const y = -(tempV.y * heightHalf) + heightHalf;
    el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  });
}

// ============================================================================
// 7. CAMERA PRESETS & TWEENING (Chuyển góc camera mượt mà)
// ============================================================================

export const cameraPresets = {
  overview: {
    name: 'Toàn cảnh',
    position: new THREE.Vector3(4.5, 3.0, 5.8),
    target: new THREE.Vector3(-0.2, 0.9, 0.2),
  },
  sofa: {
    name: 'Cận cảnh Sofa',
    position: new THREE.Vector3(0.6, 1.6, 2.7),
    target: new THREE.Vector3(-0.2, 0.65, -0.5),
  },
  lounge: {
    name: 'Góc Thư Giãn',
    position: new THREE.Vector3(-2.8, 1.8, 2.4),
    target: new THREE.Vector3(-1.2, 0.65, 0.3),
  },
  topdown: {
    name: 'Góc Mặt Bằng',
    position: new THREE.Vector3(-0.1, 7.2, 0.2),
    target: new THREE.Vector3(-0.1, 0.2, 0.1),
  },
};

let tweenActive = false;
let tweenProgress = 0;
const tweenDuration = 1.2;
const startPos = new THREE.Vector3();
const endPos = new THREE.Vector3();
const startTarget = new THREE.Vector3();
const endTarget = new THREE.Vector3();

function setCameraView(presetKey) {
  const preset = cameraPresets[presetKey];
  if (!preset) return;

  startPos.copy(camera.position);
  endPos.copy(preset.position);

  startTarget.copy(controls.target);
  endTarget.copy(preset.target);

  tweenProgress = 0;
  tweenActive = true;
}

function focusHotspot(item) {
  startPos.copy(camera.position);
  endPos.copy(item.cameraPos);

  startTarget.copy(controls.target);
  endTarget.copy(item.cameraTarget);

  tweenProgress = 0;
  tweenActive = true;

  showProductModal(item);
}

// Easing Function mượt (easeInOutCubic)
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================================================
// 8. PRODUCT MODAL & SPECS DRAWER (Hiển thị chi tiết sản phẩm)
// ============================================================================

const productModal = document.getElementById('product-modal');

function showProductModal(item) {
  if (!productModal) return;

  const titleEl = productModal.querySelector('.modal-title');
  const catEl = productModal.querySelector('.modal-category');
  const priceEl = productModal.querySelector('.modal-price');
  const descEl = productModal.querySelector('.modal-desc');
  const specsEl = productModal.querySelector('.modal-specs-list');

  if (titleEl) titleEl.textContent = item.name;
  if (catEl) catEl.textContent = item.category;
  if (priceEl) priceEl.textContent = item.price;
  if (descEl) descEl.textContent = item.description;

  if (specsEl && item.specs) {
    specsEl.innerHTML = Object.entries(item.specs)
      .map(
        ([key, val]) => `
          <div class="spec-row">
            <span class="spec-label">${key}</span>
            <span class="spec-val">${val}</span>
          </div>
        `
      )
      .join('');
  }

  productModal.classList.add('active');
}

function closeProductModal() {
  if (productModal) {
    productModal.classList.remove('active');
  }
}

// ============================================================================
// 9. EVENT LISTENERS & UI BINDING
// ============================================================================

function setupUIBindings() {
  // A. Nút chọn góc Camera
  document.querySelectorAll('[data-camera-preset]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-camera-preset]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setCameraView(btn.getAttribute('data-camera-preset'));
    });
  });

  // B. Nút chọn màu / chất liệu Sofa
  document.querySelectorAll('[data-finish]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-finish]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const finishKey = btn.getAttribute('data-finish');
      applySofaFinish(finishKey);

      // Cập nhật tooltip/tên chất liệu hiển thị
      const finishInfoEl = document.getElementById('current-finish-name');
      if (finishInfoEl && sofaFinishes[finishKey]) {
        finishInfoEl.textContent = sofaFinishes[finishKey].name;
      }
    });
  });

  // C. Nút chọn ánh sáng (Day / Sunset / Night)
  document.querySelectorAll('[data-lighting]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-lighting]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setLightingMode(btn.getAttribute('data-lighting'));
    });
  });

  // D. Nút bật/tắt Thước đo 3D
  const dimBtn = document.getElementById('btn-toggle-dimensions');
  if (dimBtn) {
    dimBtn.addEventListener('click', () => {
      dimensionsGuide.visible = !dimensionsGuide.visible;
      dimBtn.classList.toggle('active', dimensionsGuide.visible);
    });
  }

  // E. Nút bật/tắt Tự động xoay 360° (Auto-rotate)
  const autoRotateBtn = document.getElementById('btn-toggle-autorotate');
  if (autoRotateBtn) {
    autoRotateBtn.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      controls.autoRotateSpeed = 1.0;
      autoRotateBtn.classList.toggle('active', controls.autoRotate);
    });
  }

  // F. Nút bật/tắt đèn cây độc lập
  const lampToggleBtn = document.getElementById('btn-toggle-lamp');
  if (lampToggleBtn) {
    lampToggleBtn.addEventListener('click', () => {
      const isOn = lampLight.intensity > 0;
      lampLight.intensity = isOn ? 0 : 3.8;
      if (lampShadeMaterial) {
        lampShadeMaterial.emissive.setHex(isOn ? 0x000000 : 0xffbe76);
      }
      lampToggleBtn.classList.toggle('active', !isOn);
    });
  }

  // G. Nút Toàn màn hình (Fullscreen)
  const fullscreenBtn = document.getElementById('btn-toggle-fullscreen');
  const viewportCard = document.getElementById('showroom-viewport');
  if (fullscreenBtn && viewportCard) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        viewportCard.requestFullscreen().catch(() => {});
        fullscreenBtn.classList.add('active');
      } else {
        document.exitFullscreen().catch(() => {});
        fullscreenBtn.classList.remove('active');
      }
    });
  }

  // H. Đóng modal sản phẩm
  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProductModal);
  }

  // I. Đồng bộ thẻ sản phẩm Catalog dưới chân trang
  document.querySelectorAll('[data-catalog-target]').forEach((card) => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-catalog-target');
      const item = hotspotsData.find((h) => h.id === targetId);
      if (item) {
        focusHotspot(item);
        // Scroll mượt lên khu vực 3D nếu người dùng ở phía dưới
        viewportCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

// ============================================================================
// 10. RESIZE & RENDER LOOP
// ============================================================================

function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', onWindowResize);

// Hỗ trợ ResizeObserver cho container linh hoạt
if (window.ResizeObserver) {
  const ro = new ResizeObserver(() => {
    onWindowResize();
  });
  ro.observe(container);
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Xử lý camera tweening
  if (tweenActive) {
    tweenProgress += delta / tweenDuration;
    if (tweenProgress >= 1.0) {
      tweenProgress = 1.0;
      tweenActive = false;
    }
    const t = easeInOutCubic(tweenProgress);
    camera.position.lerpVectors(startPos, endPos, t);
    controls.target.lerpVectors(startTarget, endTarget, t);
  }

  controls.update();
  updateHotspotsPosition();
  renderer.render(scene, camera);
}

// Khởi chạy
initHotspots();
setupUIBindings();
setLightingMode('day');
animate();
