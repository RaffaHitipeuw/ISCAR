"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Stats, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import CameraController from "./CameraController";
import Map from "../map/Map";
import KF3UI from "../ui/KF3UI";
import Navbar from "../ui/Navbar";
import Desc from "../ui/Desc";

export default function Scene() {
  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.8, 6], fov: 45 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <color attach="background" args={["#000000"]} />
        <spotLight
          position={[0, 5, 5]}
          angle={0.35}
          penumbra={0.5}
          intensity={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Stats />
        <Map />
        <CameraController />

        <EffectComposer disableNormalPass>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.2}
            radius={0.4}
          />
        </EffectComposer>
      </Canvas>

      <KF3UI />
      <Desc />
      <Navbar />
    </>
  );
}