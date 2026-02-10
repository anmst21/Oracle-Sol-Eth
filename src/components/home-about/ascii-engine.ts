import * as THREE from "three/webgpu";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { getAsciiAtlas, CHAR_COUNT } from "./ascii-texture";
import { createAsciiMaterial } from "./ascii-material";
import { DragControls } from "./drag-controls";

const CAMERA_Z = 2;
const CAMERA_FOV = 70;
const GRID_ROWS = 65;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export interface AsciiEngineOptions {
  container: HTMLElement;
  modelUrl: string;
  colorTop: string;
  colorBottom: string;
}

export class AsciiEngine {
  private container: HTMLElement;
  private width: number;
  private height: number;

  private renderer!: InstanceType<typeof THREE.WebGPURenderer>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  // Pass 1 — model scene
  private modelScene!: THREE.Scene;
  private modelCamera!: THREE.PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private renderTarget!: any;
  private model: THREE.Group | null = null;
  private modelPivot!: THREE.Group;

  // ASCII grid
  private instancedMesh!: THREE.InstancedMesh;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private material!: any;

  // Controls & animation
  private drag!: DragControls;
  private time = 0;
  private isPlaying = true;
  private animId = 0;
  private lastFrame = 0;
  private rows: number;
  private columns: number;
  private cellSize: number;
  private instances: number;

  private modelUrl: string;

  // Bound handlers
  private boundResize: () => void;

  constructor(opts: AsciiEngineOptions) {
    this.container = opts.container;
    this.modelUrl = opts.modelUrl;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // Compute grid to exactly fill the camera view
    const aspect = this.width / this.height;
    const visibleHeight = 2 * CAMERA_Z * Math.tan((CAMERA_FOV / 2) * Math.PI / 180);
    const visibleWidth = visibleHeight * aspect;
    this.rows = GRID_ROWS;
    this.columns = Math.floor(this.rows / aspect);
    this.cellSize = visibleWidth / this.rows;
    this.instances = this.rows * this.columns;

    this.boundResize = this.resize.bind(this);

    this.init();
  }

  private async init() {
    // WebGPU renderer
    this.renderer = new THREE.WebGPURenderer({ antialias: false, alpha: true });
    await this.renderer.init();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.cursor = "grab";

    // Scenes & cameras
    this.setupModelScene();
    this.setupAsciiScene();

    // Load GLB + create ASCII grid
    await this.loadModel();
    await this.addAsciiGrid();

    // Controls
    this.drag = new DragControls(this.renderer.domElement);

    // Events
    window.addEventListener("resize", this.boundResize);

    // Start
    this.render(0);
  }

  private setupModelScene() {
    this.modelScene = new THREE.Scene();
    this.modelCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    this.modelCamera.position.set(0, 0, 5);
    this.modelCamera.lookAt(0, 0, 0);
    this.renderTarget = new THREE.RenderTarget(512, 512);

    // Pivot group for drag rotation
    this.modelPivot = new THREE.Group();
    this.modelScene.add(this.modelPivot);

    // Lighting — strong directional + ambient so model details are prominent
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.modelScene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(1, 1, 1);
    this.modelScene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight2.position.set(-1, -0.5, 0.5);
    this.modelScene.add(dirLight2);
  }

  private setupAsciiScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, this.width / this.height, 0.01, 1000);
    this.camera.position.set(0, 0, CAMERA_Z);
  }

  private async loadModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const gltf = await loader.loadAsync(this.modelUrl);
    this.model = gltf.scene;

    const whiteMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
    this.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = whiteMat;
      }
    });

    // Center & scale to fill the camera view
    const box = new THREE.Box3().setFromObject(this.model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.2 / maxDim;
    this.model.scale.setScalar(scale);
    this.model.position.copy(center).multiplyScalar(-scale);

    this.modelPivot.add(this.model);
  }

  private async addAsciiGrid() {
    const asciiTexture = await getAsciiAtlas();

    this.material = createAsciiMaterial({
      asciiTexture,
      charCount: CHAR_COUNT,
      sceneTexture: this.renderTarget.texture,
    });

    const s = this.cellSize;
    const geometry = new THREE.PlaneGeometry(s, s, 1, 1);
    this.instancedMesh = new THREE.InstancedMesh(geometry, this.material, this.instances);

    const uvArr = new Float32Array(this.instances * 2);
    const randomArr = new Float32Array(this.instances);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const idx = i * this.columns + j;

        uvArr[idx * 2] = i / (this.rows - 1);
        // Flip Y so render target maps correctly
        uvArr[idx * 2 + 1] = 1.0 - j / (this.columns - 1);
        randomArr[idx] = Math.random();

        const m = new THREE.Matrix4();
        m.setPosition(
          i * s - s * (this.rows - 1) / 2,
          j * s - s * (this.columns - 1) / 2,
          0
        );
        this.instancedMesh.setMatrixAt(idx, m);
      }
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    geometry.setAttribute("aPixelUV", new THREE.InstancedBufferAttribute(uvArr, 2));
    geometry.setAttribute("aRandom", new THREE.InstancedBufferAttribute(randomArr, 1));

    this.scene.add(this.instancedMesh);
  }

  private resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    if (!this.renderer) return;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  private render = (timestamp: number) => {
    if (!this.isPlaying) return;
    this.animId = requestAnimationFrame(this.render);

    // Throttle to target FPS
    const delta = timestamp - this.lastFrame;
    if (delta < FRAME_INTERVAL) return;
    this.lastFrame = timestamp - (delta % FRAME_INTERVAL);

    this.time += 0.01;

    // Update time uniform
    if (this.material?.userData?.uTime) {
      (this.material.userData.uTime as { value: number }).value = this.time;
    }

    // Gentle levitate
    if (this.modelPivot) {
      this.modelPivot.position.y = Math.sin(this.time * 1.2) * 0.12;
    }

    // Drag spring
    this.drag?.update();
    if (this.drag && this.modelPivot) {
      this.modelPivot.rotation.x = this.drag.rotX;
      this.modelPivot.rotation.y += this.drag.rotY * 0.1;
    }

    // Pass 1: render model into render target
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.modelScene, this.modelCamera);
    this.renderer.setRenderTarget(null);

    // Pass 2: render ASCII grid to screen
    this.renderer.render(this.scene, this.camera);
  };

  pause() {
    this.isPlaying = false;
  }

  resume() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrame = 0;
    this.render(0);
  }

  dispose() {
    this.isPlaying = false;
    cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.boundResize);
    this.drag?.dispose();
    this.renderer?.dispose();
    this.renderTarget?.dispose();
    if (this.renderer?.domElement?.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
