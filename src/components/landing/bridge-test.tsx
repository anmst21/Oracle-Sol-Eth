"use client";

import React, { Suspense, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  AsciiRenderer,
} from "@react-three/drei";

function MouseTiltBox({
  maxTilt = 1,
  ease = 0.15,
  targetXY,
  hovered,
}: {
  maxTilt?: number;
  ease?: number;
  targetXY: { x: number; y: number }; // normalized [-1..1]
  hovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const rotTarget = useRef({ x: 0, y: 0 });

  // Update rotation target from normalized pointer (container-based)
  if (hovered) {
    rotTarget.current.y = targetXY.x * maxTilt; // rotateY with mouse X
    rotTarget.current.x = -targetXY.y * maxTilt; // rotateX with mouse Y (invert for natural feel)
  } else {
    rotTarget.current.x = 0;
    rotTarget.current.y = 0;
  }

  useFrame(() => {
    if (!meshRef.current) return;
    const r = meshRef.current.rotation;
    r.x = THREE.MathUtils.lerp(r.x, rotTarget.current.x, ease);
    r.y = THREE.MathUtils.lerp(r.y, rotTarget.current.y, ease);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
}

const Bridge = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [targetXY, setTargetXY] = useState({ x: 0, y: 0 }); // normalized [-1..1]

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1..1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1..1
      setTargetXY({
        x: THREE.MathUtils.clamp(x, -1, 1),
        y: THREE.MathUtils.clamp(y, -1, 1),
      });
    },
    []
  );

  const handleEnter = () => setHovered(true);
  const handleLeave = () => {
    setHovered(false);
    setTargetXY({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={{
        width: 644,
        height: 483,
        borderWidth: 2,
        borderColor: "red",
        borderStyle: "solid",
      }}
    >
      <Canvas shadows>
        <AsciiRenderer
          color
          invert
          characters="$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^`'. "
        />

        <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={50} />

        {/* Lights */}
        <directionalLight position={[0, 3, 2]} color="#00E639" intensity={1} />
        <directionalLight
          position={[-2, 0, 2]}
          color="#E600AC"
          intensity={0.8}
        />
        <directionalLight
          position={[2, -3, 2]}
          color="#3900E6"
          intensity={0.8}
        />
        <ambientLight intensity={0.8} />

        <Suspense>
          <MouseTiltBox
            maxTilt={0.35}
            ease={0.15}
            targetXY={targetXY}
            hovered={hovered}
          />
        </Suspense>

        {/* Optional: disable dragging while hovered so tilt is the only motion */}
        <OrbitControls enableDamping enabled={!hovered} />
      </Canvas>
    </div>
  );
};

export default Bridge;
