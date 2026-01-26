"use client";

import * as THREE from "three";
import { useMemo } from "react";
import RainEmitter from "./RainEmitter";

const CLOUD_COUNT = 60;
const AREA_SIZE = 400;
const CLOUD_HEIGHT = 300;

export default function CloudGroup() {
  const clouds = useMemo(() => {
    return Array.from({ length: CLOUD_COUNT }).map(() => {
      const scale = THREE.MathUtils.randFloat(40, 80);
      return {
        position: [
          THREE.MathUtils.randFloatSpread(AREA_SIZE),
          CLOUD_HEIGHT + THREE.MathUtils.randFloat(-10, 15),
          THREE.MathUtils.randFloatSpread(AREA_SIZE),
        ],
        scale,
        rainStrength: Math.random(),
      };
    });
  }, []);

  return (
    <group>
      {clouds.map((cloud, index) => (
        <group key={index} position={cloud.position}>
          <mesh scale={cloud.scale} frustumCulled={false}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.22}
              depthWrite={false}
              roughness={1}
            />
          </mesh>

          {cloud.rainStrength > 0.45 && (
            <RainEmitter
              count={Math.floor(40 + cloud.rainStrength * 120)}
              area={cloud.scale * 0.4}
              height={140}
            />
          )}
        </group>
      ))}
    </group>
  );
}