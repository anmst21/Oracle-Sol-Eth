/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "three/webgpu" {
  export * from "three";
  export class WebGPURenderer {
    constructor(parameters?: {
      canvas?: HTMLCanvasElement;
      antialias?: boolean;
      alpha?: boolean;
      powerPreference?: string;
      forceWebGL?: boolean;
    });
    domElement: HTMLCanvasElement;
    init(): Promise<void>;
    setSize(width: number, height: number): void;
    setPixelRatio(ratio: number): void;
    setClearColor(color: number, alpha?: number): void;
    render(scene: any, camera: any): void;
    setRenderTarget(target: any): void;
    dispose(): void;
    setAnimationLoop(callback: ((time: number) => void) | null): void;
  }
  export class NodeMaterial {
    constructor(parameters?: Record<string, any>);
    outputNode: any;
    userData: Record<string, any>;
    transparent: boolean;
    side: number;
    depthWrite: boolean;
    [key: string]: any;
  }
  export class RenderTarget {
    constructor(width: number, height: number, options?: Record<string, any>);
    texture: any;
    setSize(width: number, height: number): void;
    dispose(): void;
  }
}

declare module "three/tsl" {
  export function color(value: string | number): any;
  export function Fn(callback: () => any): () => any;
  export function uniform(value: any): any;
  export function vec2(x: any, y: any): any;
  export function vec4(...args: any[]): any;
  export function floor(value: any): any;
  export function uv(): any;
  export function texture(tex: any, uvCoord: any): any;
  export function attribute(name: string): any;
  export function pow(base: any, exponent: any): any;
  export function mix(a: any, b: any, factor: any): any;
  export function step(edge: number, value: any): any;
  export function sin(value: any): any;
}
