"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

type Props = {
  imageUrl?: string; // e.g. "/images/sample.jpg"
  rows?: number; // grid rows
  cols?: number; // grid cols
  cellSize?: number; // world-units per cell
  className?: string;
  style?: React.CSSProperties;
};

const AsciiPlane: React.FC<Props> = ({
  imageUrl = "/sky.avif",
  rows = 100,
  cols = 100,
  cellSize = 0.1,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Sizes ---
    const container = containerRef.current;
    const getSize = () => {
      const r = container.getBoundingClientRect();
      return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
    };
    let { w, h } = getSize();

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // --- Scene/Camera ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);

    // --- Texture ---
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl, () => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    });

    // --- Geometry ---
    const width = cols * cellSize;
    const height = rows * cellSize;
    const geometry = new THREE.PlaneGeometry(width, height, cols, rows);

    // --- Shaders ---
    const vertexShader = `
      uniform vec2 u_mouse;   // in plane local space (x,y)
      uniform float u_time;
      varying vec2 vUv;

      void main() {
        vUv = uv;

        vec3 newPosition = position;
        float dist = distance(newPosition.xy, u_mouse);
        newPosition.z += sin(dist * 10.0 + u_time * 2.0) * 0.1;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    // Note: true ASCII in a fragment shader needs a glyph atlas; here we quantize gray for a "blocky" look.
    const fragmentShader = `
      precision mediump float;
      uniform sampler2D u_texture;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(u_texture, vUv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

        float levels = 12.0;                 // "ASCII-like" steps
        float q = floor(gray * (levels - 1.0)) / (levels - 1.0);
        gl_FragColor = vec4(vec3(q), 1.0);   // quantized grayscale
      }
    `;

    const uniforms = {
      u_texture: { value: texture },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_time: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      wireframe: true, // grid lines for an "ASCII-ish" vibe
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // --- Mouse handling (raycast to plane to get local-space mouse) ---
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const localPoint = new THREE.Vector3();

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObject(plane, false)[0];
      if (hit) {
        localPoint.copy(hit.point);
        plane.worldToLocal(localPoint);
        uniforms.u_mouse.value.set(localPoint.x, localPoint.y);
      }
    };
    renderer.domElement.addEventListener("mousemove", onMouseMove);

    // --- Resize ---
    const onResize = () => {
      const s = getSize();
      w = s.w;
      h = s.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // --- Animate ---
    let raf = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("mousemove", onMouseMove);

      controls.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl, rows, cols, cellSize]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
};

export default AsciiPlane;
