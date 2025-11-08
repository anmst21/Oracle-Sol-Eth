"use client";

import React, { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  AsciiRenderer,
  Image,
  MeshDistortMaterial,
  OrthographicCamera,
} from "@react-three/drei";

function CoverImage({ url }: { url: string }) {
  // World-space size of the canvas
  const { width, height } = useThree((s) => s.viewport);
  return (
    <Image
      color={"#ADE800"}
      url={url}
      scale={[width, height, 1]}
      toneMapped={true}
      //grayscale={17.5}
    />
  );
}

export default function Lading() {
  return (
    <div style={{ width: "100%", height: 480 }}>
      <Canvas dpr={[1, 2]}>
        {/* Or keep perspective; ortho keeps 2D images undistorted */}
        {/* <OrthographicCamera makeDefault position={[0, 0, 10]} /> */}
        <Suspense fallback={null}>
          <mesh>
            <AsciiRenderer invert characters="┃║╻╹    " />
            <CoverImage url="/sky.avif" />
            <meshStandardMaterial speed={10} color={"red"} wireframe />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}

// <Suspense fallback={null}>
//   <mesh>
//     <AsciiRenderer invert characters="▉▋▚▎  │" />
//     <CoverImage url="/sky.avif" />
//     {/* <MeshDistortMaterial distort={0.5} speed={10} /> */}
//   </mesh>
// </Suspense>;
