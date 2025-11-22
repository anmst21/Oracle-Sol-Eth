"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  PresentationControls,
  useGLTF,
  Float,
} from "@react-three/drei";
// import { EffectComposer, ASCII } from "@react-three/postprocessing";

import * as THREE from "three";

const material = new THREE.MeshToonMaterial({ color: "white" });

type Props = {
  objectUri: string;
  colorTop: string;
  rotation: number[];
  position: number[];
  colorBottom: string;
};

const ItemObject = ({
  objectUri,
  colorTop,
  colorBottom,
  // rotation,
  // position,
}: Props) => {
  const { scene } = useGLTF(objectUri);

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
    <Canvas
      flat
      camera={{
        fov: 60,
        near: 0.1,
        far: 200,
        position: [1, 2, 6],
      }}
      style={{
        width: "100%",
        height: "100%",
        zIndex: 50,
      }}
    >
      {/* <color args={["#fff"]} attach="background" /> */}
      {/* <OrbitControls makeDefault /> */}
      <ambientLight intensity={0.7} />
      <hemisphereLight args={[colorTop, colorBottom, 3]} />
      {/* <PresentationControls> */}
      <PresentationControls
        // makes it spring back to the initial rotation when you release
        snap
        global
        // pointer cursor on hover
        cursor
        // starting rotation (same as your prop, but you can hardcode too)

        // how far user can tilt vertically
        // config={{ mass: 1, tension: 170, friction: 26 }}
        polar={[-Math.PI / 6, Math.PI / 4]}
        // how far user can rotate horizontally
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        // spring config (tweak feel here)
        //    config={{ mass: 1, tension: 170, friction: 26 }}
        // how fast it reacts to drag
        speed={1}
      >
        <Center>
          <Float rotationIntensity={1}>
            <primitive object={scene} scale={2.5} castShadow receiveShadow />
          </Float>
        </Center>
      </PresentationControls>
      {/* <EffectComposer>
        <ASCII />
      </EffectComposer> */}
      {/* </PresentationControls> */}
    </Canvas>
  );
};

export default ItemObject;
//  font?: string;
//     characters?: string;
//     fontSize?: number;
//     cellSize?: number;
//     color?: string;
//     invert?: boolean;
