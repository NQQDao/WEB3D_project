import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { sofaFinishes, hotspotsData } from '../stores/useShowroomStore.js';

// ============================================================================
// PROCEDURAL TEXTURE GENERATORS
// ============================================================================

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

      const toneVariation = (Math.sin(r * 3.7 + c * 5.1) * 0.5 + 0.5) * 24 - 12;
      const baseR = Math.min(255, Math.max(0, 180 + toneVariation));
      const baseG = Math.min(255, Math.max(0, 138 + toneVariation * 0.9));
      const baseB = Math.min(255, Math.max(0, 95 + toneVariation * 0.7));

      ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
      ctx.fillRect(x + 1, y + 1, plankWidth - 2, plankHeight - 2);

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

function createRugTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ded5c7';
  ctx.fillRect(0, 0, 512, 512);

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

  ctx.strokeStyle = 'rgba(120, 105, 90, 0.5)';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 472, 472);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8f7f4';
  ctx.fillRect(0, 0, 512, 512);

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

  return new THREE.CanvasTexture(canvas);
}

function createArtCanvasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f1ece4';
  ctx.fillRect(0, 0, 512, 768);

  ctx.fillStyle = '#b76543';
  ctx.beginPath();
  ctx.arc(256, 320, 160, 0, Math.PI);
  ctx.fill();

  ctx.fillStyle = '#656f5a';
  ctx.beginPath();
  ctx.arc(320, 220, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d3a059';
  ctx.beginPath();
  ctx.arc(180, 420, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#23201d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 380, 190, Math.PI, 0, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(256, 80);
  ctx.lineTo(256, 680);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

// ============================================================================
// CAMERA PRESETS
// ============================================================================

export const cameraPresets = {
  overview: {
    name: 'Toàn cảnh',
    position: [4.5, 3.0, 5.8],
    target: [-0.2, 0.9, 0.2],
  },
  sofa: {
    name: 'Cận cảnh Sofa',
    position: [0.6, 1.6, 2.7],
    target: [-0.2, 0.65, -0.5],
  },
  lounge: {
    name: 'Góc Thư Giãn',
    position: [-2.8, 1.8, 2.4],
    target: [-1.2, 0.65, 0.3],
  },
  topdown: {
    name: 'Góc Mặt Bằng',
    position: [-0.1, 7.2, 0.2],
    target: [-0.1, 0.2, 0.1],
  },
};

export const lightingPresets = {
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

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================================================
// SHOWROOM ENGINE CLASS
// ============================================================================

export class ShowroomEngine {
  constructor(container, onHotspotsUpdate = null) {
    this.container = container;
    this.onHotspotsUpdate = onHotspotsUpdate;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xefeae2);
    this.scene.fog = new THREE.FogExp2(0xefeae2, 0.035);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(4.5, 3.0, 5.8);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.set(-0.2, 0.9, 0.2);
    this.controls.minDistance = 2.4;
    this.controls.maxDistance = 10.5;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minPolarAngle = 0.15;
    this.controls.enablePan = true;

    this.clock = new THREE.Clock();
    this.animationFrameId = null;

    // Tweening
    this.tweenActive = false;
    this.tweenProgress = 0;
    this.tweenDuration = 1.2;
    this.startPos = new THREE.Vector3();
    this.endPos = new THREE.Vector3();
    this.startTarget = new THREE.Vector3();
    this.endTarget = new THREE.Vector3();

    this.initLighting();
    this.initMaterials();
    this.buildScene();

    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  initLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xfff7ea, 0x8a7d72, 0.7);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfff4e6, 2.2);
    this.sunLight.position.set(-6, 7, 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.shadow.radius = 2.2;
    this.scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight(0xe8eeff, 0.6);
    this.fillLight.position.set(5, 4, 4);
    this.scene.add(this.fillLight);

    this.lampLight = new THREE.PointLight(0xffb86c, 0, 6, 1.8);
    this.lampLight.position.set(2.35, 2.2, -0.6);
    this.lampLight.castShadow = true;
    this.lampLight.shadow.bias = -0.001;
    this.scene.add(this.lampLight);
  }

  initMaterials() {
    this.woodTexture = createWoodTexture();
    this.rugTexture = createRugTexture();
    this.marbleTexture = createMarbleTexture();
    this.artTexture = createArtCanvasTexture();

    this.floorMaterial = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.38,
      metalness: 0.05,
    });

    this.rugMaterial = new THREE.MeshStandardMaterial({
      map: this.rugTexture,
      roughness: 0.95,
      metalness: 0.0,
    });

    this.wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4eee6,
      roughness: 0.9,
    });

    this.brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xcca368,
      metalness: 0.88,
      roughness: 0.28,
    });

    this.blackMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2022,
      metalness: 0.7,
      roughness: 0.35,
    });

    this.ceramicMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf9f6,
      roughness: 0.25,
      metalness: 0.05,
    });

    const initFinish = sofaFinishes.cream;
    this.sofaMaterial = new THREE.MeshStandardMaterial({
      color: initFinish.color,
      roughness: initFinish.roughness,
      metalness: initFinish.metalness,
    });

    this.pillowMaterialA = new THREE.MeshStandardMaterial({
      color: initFinish.pillowColorA,
      roughness: 0.75,
    });

    this.pillowMaterialB = new THREE.MeshStandardMaterial({
      color: initFinish.pillowColorB,
      roughness: 0.8,
    });

    this.lampShadeMaterial = new THREE.MeshStandardMaterial({
      color: 0xcca368,
      metalness: 0.7,
      roughness: 0.25,
      emissive: 0x000000,
      side: THREE.DoubleSide,
    });
  }

  buildScene() {
    this.sceneGroup = new THREE.Group();
    this.scene.add(this.sceneGroup);

    // 1. Room
    const room = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), this.floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);

    const rug = new THREE.Mesh(new RoundedBoxGeometry(3.6, 0.02, 2.6, 6, 0.08), this.rugMaterial);
    rug.position.set(-0.2, 0.01, 0.2);
    rug.receiveShadow = true;
    room.add(rug);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 0.2), this.wallMaterial);
    backWall.position.set(0, 2.5, -4.5);
    backWall.receiveShadow = true;
    room.add(backWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 10), this.wallMaterial);
    rightWall.position.set(5.5, 2.5, 0);
    rightWall.receiveShadow = true;
    room.add(rightWall);

    // Baseboard
    const baseboard = new THREE.Mesh(
      new THREE.BoxGeometry(12, 0.18, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xe8e2d8, roughness: 0.5 })
    );
    baseboard.position.set(0, 0.09, -4.38);
    room.add(baseboard);

    // Window
    const windowGroup = new THREE.Group();
    windowGroup.position.set(-5.2, 2.4, 0);
    windowGroup.rotation.y = Math.PI / 2;

    const frame = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.8, 0.12), this.blackMetalMaterial);
    windowGroup.add(frame);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      transmission: 0.9,
      roughness: 0.05,
    });
    windowGroup.add(new THREE.Mesh(new THREE.PlaneGeometry(5.0, 3.6), glassMat));
    room.add(windowGroup);

    // Wall Art
    const artGroup = new THREE.Group();
    artGroup.position.set(-0.3, 2.6, -4.38);
    artGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.05), this.brassMaterial));
    const artCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(1.48, 2.08),
      new THREE.MeshStandardMaterial({ map: this.artTexture, roughness: 0.7 })
    );
    artCanvas.position.z = 0.03;
    artGroup.add(artCanvas);
    room.add(artGroup);

    // Shelf
    const shelf = new THREE.Mesh(
      new RoundedBoxGeometry(2.4, 0.06, 0.28, 4, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x936848, roughness: 0.4 })
    );
    shelf.position.set(2.6, 2.1, -4.26);
    shelf.castShadow = true;
    room.add(shelf);
    this.sceneGroup.add(room);

    // 2. Sofa
    const sofa = new THREE.Group();
    sofa.position.set(-0.2, 0, -0.6);

    const sofaBase = new THREE.Mesh(new RoundedBoxGeometry(2.36, 0.2, 0.95, 6, 0.08), this.sofaMaterial);
    sofaBase.position.y = 0.24;
    sofaBase.castShadow = true;
    sofaBase.receiveShadow = true;
    sofa.add(sofaBase);

    const cushionGeo = new RoundedBoxGeometry(0.72, 0.24, 0.88, 8, 0.09);
    [-0.74, 0, 0.74].forEach((xPos) => {
      const cushion = new THREE.Mesh(cushionGeo, this.sofaMaterial);
      cushion.position.set(xPos, 0.44, 0.02);
      cushion.castShadow = true;
      cushion.receiveShadow = true;
      sofa.add(cushion);
    });

    const sofaBack = new THREE.Mesh(new RoundedBoxGeometry(2.36, 0.52, 0.26, 8, 0.1), this.sofaMaterial);
    sofaBack.position.set(0, 0.68, -0.36);
    sofaBack.castShadow = true;
    sofa.add(sofaBack);

    const armGeo = new RoundedBoxGeometry(0.24, 0.42, 0.94, 8, 0.09);
    const armL = new THREE.Mesh(armGeo, this.sofaMaterial);
    armL.position.set(-1.18, 0.48, 0);
    armL.castShadow = true;
    sofa.add(armL);

    const armR = new THREE.Mesh(armGeo, this.sofaMaterial);
    armR.position.set(1.18, 0.48, 0);
    armR.castShadow = true;
    sofa.add(armR);

    const pillowGeo = new RoundedBoxGeometry(0.38, 0.38, 0.16, 6, 0.07);
    const pA = new THREE.Mesh(pillowGeo, this.pillowMaterialA);
    pA.position.set(-0.95, 0.56, -0.12);
    pA.rotation.set(0.1, 0.3, -0.25);
    pA.castShadow = true;
    sofa.add(pA);

    const pB = new THREE.Mesh(pillowGeo, this.pillowMaterialB);
    pB.position.set(0.95, 0.56, -0.12);
    pB.rotation.set(0.1, -0.3, 0.25);
    pB.castShadow = true;
    sofa.add(pB);

    const legGeo = new THREE.CylinderGeometry(0.024, 0.016, 0.16, 16);
    [[-1.05, 0.08, 0.36], [1.05, 0.08, 0.36], [-1.05, 0.08, -0.36], [1.05, 0.08, -0.36]].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.brassMaterial);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      sofa.add(leg);
    });
    this.sceneGroup.add(sofa);

    // 3. Coffee Table
    const table = new THREE.Group();
    table.position.set(-0.2, 0, 0.82);

    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.42, 0.34, 36),
      new THREE.MeshStandardMaterial({ color: 0x936848, roughness: 0.45 })
    );
    tableBase.position.y = 0.17;
    tableBase.castShadow = true;
    table.add(tableBase);

    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.68, 0.04, 48),
      new THREE.MeshStandardMaterial({ map: this.marbleTexture, roughness: 0.2 })
    );
    tableTop.position.y = 0.36;
    tableTop.castShadow = true;
    table.add(tableTop);

    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.26, 24), this.ceramicMaterial);
    vase.position.set(-0.16, 0.51, -0.08);
    vase.castShadow = true;
    table.add(vase);

    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.04, 0.36),
      new THREE.MeshStandardMaterial({ color: 0x222429, roughness: 0.6 })
    );
    book.position.set(0.18, 0.4, 0.06);
    book.castShadow = true;
    table.add(book);
    this.sceneGroup.add(table);

    // 4. Lounge Chair
    const chair = new THREE.Group();
    chair.position.set(-1.85, 0, 0.45);
    chair.rotation.y = Math.PI / 4.2;

    const chairClothMat = new THREE.MeshStandardMaterial({ color: 0xc89874, roughness: 0.82 });
    const seat = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.16, 0.7, 6, 0.07), chairClothMat);
    seat.position.y = 0.38;
    seat.castShadow = true;
    chair.add(seat);

    const chairBack = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.52, 0.14, 6, 0.06), chairClothMat);
    chairBack.position.set(0, 0.66, -0.28);
    chairBack.rotation.x = -0.18;
    chairBack.castShadow = true;
    chair.add(chairBack);
    this.sceneGroup.add(chair);

    // 5. Floor Lamp
    const lamp = new THREE.Group();
    lamp.position.set(2.1, 0, -0.8);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32), new THREE.MeshStandardMaterial({ map: this.marbleTexture }));
    lampBase.position.y = 0.03;
    lamp.add(lampBase);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.8, 16), this.brassMaterial);
    pole.position.y = 0.93;
    lamp.add(pole);

    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.016, 12, 32, Math.PI / 2), this.brassMaterial);
    arc.position.set(-0.7, 1.83, 0);
    arc.rotation.z = Math.PI;
    lamp.add(arc);

    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.24, 28, 1, true), this.lampShadeMaterial);
    shade.position.set(-0.7, 2.3, 0);
    shade.rotation.x = Math.PI;
    shade.castShadow = true;
    lamp.add(shade);
    this.sceneGroup.add(lamp);

    // 6. Dimensions Guide
    this.dimensionsGuide = new THREE.Group();
    this.dimensionsGuide.position.set(-0.2, 0, -0.6);
    this.dimensionsGuide.visible = false;

    const lineMat = new THREE.LineDashedMaterial({ color: 0xa85d3c, dashSize: 0.08, gapSize: 0.05 });
    const widthLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.18, 0.05, 0.55), new THREE.Vector3(1.18, 0.05, 0.55)]), lineMat);
    widthLine.computeLineDistances();
    this.dimensionsGuide.add(widthLine);

    const heightLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.25, 0, -0.36), new THREE.Vector3(-1.25, 0.82, -0.36)]), lineMat);
    heightLine.computeLineDistances();
    this.dimensionsGuide.add(heightLine);

    this.sceneGroup.add(this.dimensionsGuide);
  }

  applySofaFinish(key) {
    const finish = sofaFinishes[key];
    if (!finish) return;
    this.sofaMaterial.color.setHex(finish.color);
    this.sofaMaterial.roughness = finish.roughness;
    this.sofaMaterial.metalness = finish.metalness;
    this.pillowMaterialA.color.setHex(finish.pillowColorA);
    this.pillowMaterialB.color.setHex(finish.pillowColorB);
  }

  setLightingMode(mode) {
    const cfg = lightingPresets[mode] || lightingPresets.day;
    this.scene.background.setHex(cfg.bg);
    this.scene.fog.color.setHex(cfg.fog);
    this.hemiLight.color.setHex(cfg.hemiSky);
    this.hemiLight.groundColor.setHex(cfg.hemiGround);
    this.hemiLight.intensity = cfg.hemiInt;
    this.ambientLight.intensity = cfg.ambient;
    this.sunLight.color.setHex(cfg.sunCol);
    this.sunLight.intensity = cfg.sunInt;
    this.sunLight.position.set(...cfg.sunPos);
    this.fillLight.color.setHex(cfg.fillCol);
    this.fillLight.intensity = cfg.fillInt;
    this.lampLight.intensity = cfg.lampInt;
    this.lampShadeMaterial.emissive.setHex(cfg.lampEmissive);
    this.renderer.toneMappingExposure = cfg.exposure;
  }

  setCameraView(presetKey) {
    const preset = cameraPresets[presetKey];
    if (!preset) return;
    this.startPos.copy(this.camera.position);
    this.endPos.set(...preset.position);
    this.startTarget.copy(this.controls.target);
    this.endTarget.set(...preset.target);
    this.tweenProgress = 0;
    this.tweenActive = true;
  }

  focusHotspot(item) {
    this.startPos.copy(this.camera.position);
    this.endPos.set(...item.cameraPos);
    this.startTarget.copy(this.controls.target);
    this.endTarget.set(...item.cameraTarget);
    this.tweenProgress = 0;
    this.tweenActive = true;
  }

  toggleLamp(isOn) {
    this.lampLight.intensity = isOn ? 3.8 : 0;
    this.lampShadeMaterial.emissive.setHex(isOn ? 0xffbe76 : 0x000000);
  }

  toggleDimensions(isVisible) {
    if (this.dimensionsGuide) {
      this.dimensionsGuide.visible = isVisible;
    }
  }

  toggleAutoRotate(isRotating) {
    this.controls.autoRotate = isRotating;
    this.controls.autoRotateSpeed = 1.0;
  }

  onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  updateHotspots() {
    if (!this.onHotspotsUpdate) return;
    const tempV = new THREE.Vector3();
    const widthHalf = this.container.clientWidth / 2;
    const heightHalf = this.container.clientHeight / 2;

    const projected = hotspotsData.map((item) => {
      tempV.set(...item.position);
      tempV.project(this.camera);

      const isBehind = tempV.z > 1;
      const x = tempV.x * widthHalf + widthHalf;
      const y = -(tempV.y * heightHalf) + heightHalf;

      return {
        id: item.id,
        name: item.name,
        visible: !isBehind,
        x,
        y,
        item,
      };
    });

    this.onHotspotsUpdate(projected);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();

    if (this.tweenActive) {
      this.tweenProgress += delta / this.tweenDuration;
      if (this.tweenProgress >= 1.0) {
        this.tweenProgress = 1.0;
        this.tweenActive = false;
      }
      const t = easeInOutCubic(this.tweenProgress);
      this.camera.position.lerpVectors(this.startPos, this.endPos, t);
      this.controls.target.lerpVectors(this.startTarget, this.endTarget, t);
    }

    this.controls.update();
    this.updateHotspots();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
