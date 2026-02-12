import * as THREE from "three/webgpu";
import { getCtaAtlases } from "./cta-ascii-texture";
import { createCtaAsciiMaterial } from "./cta-ascii-material";

const CAMERA_Z = 2;
const CAMERA_FOV = 70;
const CELL_SIZE = 0.03;
const GLOW_SIZE = 0.15;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

function range(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export interface CtaAsciiEngineOptions {
  container: HTMLElement;
  imageUrl: string;
}

export class CtaAsciiEngine {
  private container: HTMLElement;
  private width: number;
  private height: number;

  private renderer!: InstanceType<typeof THREE.WebGPURenderer>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  // Pass 1 — cubes scene
  private scene2!: THREE.Scene;
  private camera2!: THREE.PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private renderTarget!: any;
  private cubes: THREE.Mesh[] = [];

  // ASCII grid
  private instancedMesh!: THREE.InstancedMesh;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private material!: any;

  // Displacement
  private displacement!: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    glowImage: HTMLImageElement;
    interactivePlane: THREE.Mesh;
    raycaster: THREE.Raycaster;
    screenCursor: THREE.Vector2;
    canvasCursor: THREE.Vector2;
    hasPointer: boolean;
    texture: THREE.CanvasTexture;
  };

  // Animation
  private revealed = false;
  private time = 0;
  private isPlaying = true;
  private animId = 0;
  private lastFrame = 0;
  private rows: number;
  private columns: number;
  private cellSize: number;
  private instances: number;
  private imageUrl: string;

  // Bound handlers
  private boundResize: () => void;
  private boundPointerMove: (e: PointerEvent) => void;

  constructor(opts: CtaAsciiEngineOptions) {
    this.container = opts.container;
    this.imageUrl = opts.imageUrl;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // Compute grid to fill the camera view (fixed cell size like the original)
    const aspect = this.width / this.height;
    const visibleHeight =
      2 * CAMERA_Z * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180));
    const visibleWidth = visibleHeight * aspect;
    this.cellSize = CELL_SIZE;
    this.rows = Math.ceil(visibleWidth / this.cellSize);
    this.columns = Math.ceil(visibleHeight / this.cellSize);
    this.instances = this.rows * this.columns;

    this.boundResize = this.resize.bind(this);
    this.boundPointerMove = this.onPointerMove.bind(this);

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

    // Position canvas absolutely within container
    const canvas = this.renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "0";

    // Setup scenes
    this.setupAsciiScene();
    this.setupCubeScene();
    this.createDisplacement();

    // Build ASCII grid
    await this.addAsciiGrid();

    // Events — listen on window so overlapping elements don't block
    window.addEventListener("resize", this.boundResize);
    window.addEventListener("pointermove", this.boundPointerMove);

    // Start
    this.render(0);
  }

  private setupAsciiScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      this.width / this.height,
      0.01,
      1000
    );
    this.camera.position.set(0, 0, CAMERA_Z);
  }

  private setupCubeScene() {
    this.scene2 = new THREE.Scene();
    this.camera2 = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    );
    this.camera2.position.set(0, 0, 5.8);
    this.renderTarget = new THREE.RenderTarget(this.width, this.height);

    const num = 50;
    for (let i = 0; i < num; i++) {
      const size = range(0.5, 0.9);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff })
      );
      mesh.position.set(range(-3, 3), range(-3, 3), range(-3, 3));
      mesh.rotation.set(
        range(0, Math.PI),
        range(0, Math.PI),
        range(0, Math.PI)
      );
      this.scene2.add(mesh);
      this.cubes.push(mesh);
    }

    // Lights for cube scene
    const ambient = new THREE.AmbientLight(0xffffff, 0.05);
    this.scene2.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(1, 0, 0.866);
    this.scene2.add(dirLight);
  }

  private createDisplacement() {
    const canvas = document.createElement("canvas");
    canvas.width = this.rows;
    canvas.height = this.columns;

    const context = canvas.getContext("2d")!;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const glowImage = new Image();
    glowImage.src = "/images/glow.png";

    // Interactive plane for raycasting
    const planeWidth = this.rows * this.cellSize;
    const planeHeight = this.columns * this.cellSize;
    const geo = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const interactivePlane = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: "red",
        transparent: true,
        opacity: 0.5,
      })
    );
    interactivePlane.visible = false;
    interactivePlane.position.z = 0.01;
    this.scene.add(interactivePlane);

    this.displacement = {
      canvas,
      context,
      glowImage,
      interactivePlane,
      raycaster: new THREE.Raycaster(),
      screenCursor: new THREE.Vector2(9999, 9999),
      canvasCursor: new THREE.Vector2(9999, 9999),
      hasPointer: false,
      texture: new THREE.CanvasTexture(canvas),
    };
  }

  private onPointerMove(event: PointerEvent) {
    if (!this.revealed) return;
    const rect = this.container.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      // Outside container — reset
      this.displacement.screenCursor.set(9999, 9999);
      this.displacement.canvasCursor.set(9999, 9999);
      this.displacement.hasPointer = false;
      return;
    }

    this.displacement.screenCursor.x =
      ((x - rect.left) / rect.width) * 2 - 1;
    this.displacement.screenCursor.y =
      -((y - rect.top) / rect.height) * 2 + 1;
    this.displacement.hasPointer = true;
  }

  private async addAsciiGrid() {
    const { atlasA, atlasB, length } = getCtaAtlases();

    // Load image texture
    const imageTexture = await new THREE.TextureLoader().loadAsync(
      this.imageUrl
    );

    this.material = createCtaAsciiMaterial({
      asciiTexture: atlasA,
      asciiTextureAlt: atlasB,
      length,
      displacementTexture: this.displacement.texture,
      imageTexture,
    });

    const s = this.cellSize;
    const geometry = new THREE.PlaneGeometry(s, s, 1, 1);
    this.instancedMesh = new THREE.InstancedMesh(
      geometry,
      this.material,
      this.instances
    );

    const uvArr = new Float32Array(this.instances * 2);
    const randomArr = new Float32Array(this.instances);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const idx = i * this.columns + j;

        uvArr[idx * 2] = i / (this.rows - 1);
        uvArr[idx * 2 + 1] = j / (this.columns - 1);
        randomArr[idx] = Math.random();

        const m = new THREE.Matrix4();
        m.setPosition(
          i * s - (s * (this.rows - 1)) / 2,
          j * s - (s * (this.columns - 1)) / 2,
          0
        );
        this.instancedMesh.setMatrixAt(idx, m);
      }
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    geometry.setAttribute(
      "aPixelUV",
      new THREE.InstancedBufferAttribute(uvArr, 2)
    );
    geometry.setAttribute(
      "aRandom",
      new THREE.InstancedBufferAttribute(randomArr, 1)
    );

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

    // Animate cubes
    this.cubes.forEach((cube, i) => {
      cube.rotation.x = Math.sin(this.time * cube.position.x);
      cube.rotation.y = Math.sin(this.time * cube.position.y);
      cube.rotation.z = Math.sin(this.time * cube.position.z);
      cube.position.y = 2 * Math.sin(this.time + i);
    });

    // Pass 1: render cubes into render target
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene2, this.camera2);
    this.renderer.setRenderTarget(null);

    // Displacement raycaster
    if (this.displacement.hasPointer) {
      this.displacement.raycaster.setFromCamera(
        this.displacement.screenCursor,
        this.camera
      );
      const intersections = this.displacement.raycaster.intersectObject(
        this.displacement.interactivePlane
      );
      if (intersections.length) {
        const hitUV = intersections[0].uv!;
        this.displacement.canvasCursor.x =
          hitUV.x * this.displacement.canvas.width;
        this.displacement.canvasCursor.y =
          (1 - hitUV.y) * this.displacement.canvas.height;
      }
    }

    // Fade displacement canvas
    this.displacement.context.globalCompositeOperation = "source-over";
    this.displacement.context.globalAlpha = 0.02;
    this.displacement.context.fillRect(
      0,
      0,
      this.displacement.canvas.width,
      this.displacement.canvas.height
    );

    // Draw glow at cursor
    const glowSize = this.displacement.canvas.width * GLOW_SIZE;
    this.displacement.context.globalCompositeOperation = "lighten";
    this.displacement.context.globalAlpha = 1;
    this.displacement.context.drawImage(
      this.displacement.glowImage,
      this.displacement.canvasCursor.x - glowSize * 0.5,
      this.displacement.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    );

    this.displacement.texture.needsUpdate = true;

    // Pass 2: render ASCII grid to screen
    this.renderer.render(this.scene, this.camera);
  };

  setReveal(value: number) {
    if (this.material?.userData?.uReveal) {
      (this.material.userData.uReveal as { value: number }).value = value;
    }
    if (value >= 1) {
      this.revealed = true;
    }
  }

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
    window.removeEventListener("pointermove", this.boundPointerMove);
    this.renderer?.dispose();
    this.renderTarget?.dispose();
    if (this.renderer?.domElement?.parentNode) {
      this.renderer.domElement.parentNode.removeChild(
        this.renderer.domElement
      );
    }
  }
}
