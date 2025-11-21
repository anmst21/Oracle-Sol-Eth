"use client";

import { Canvas } from "@react-three/fiber";
import {
  Center,
  PresentationControls,
  useGLTF,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

const material = new THREE.MeshToonMaterial({ color: "white" });

const Animation = () => {
  // scene is your full model root
  const { scene } = useGLTF("/objects/cup.glb");

  // optional: set a toon material on all meshes

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <div className="home-dashboard__animation">
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 0.1,
          far: 200,
          position: [1, 2, 6],
        }}
        // style={{
        //   width: "100%",
        //   height: "100%",
        // }}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#56EB00", "#9500EB", 3]} />
        <PresentationControls
          snap
          global
          cursor
          polar={[-Math.PI / 6, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          speed={1}
        >
          <Center>
            <Float rotationIntensity={1}>
              {/* put the whole gltf scene into the canvas */}
              <primitive object={scene} scale={2.7} castShadow receiveShadow />
            </Float>
          </Center>
        </PresentationControls>
      </Canvas>
    </div>
  );
};

useGLTF.preload("/objects/cup.glb");

export default Animation;
