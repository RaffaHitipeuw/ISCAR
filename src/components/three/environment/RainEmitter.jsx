"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function RainEmitter({
  count = 80,
  area = 10,
  height = 120,
  speed = 35,
  length = 1.2,
}) {
  const lines = useRef(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 6);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * area;
      const y = Math.random() * height;
      const z = (Math.random() - 0.5) * area;

      const i6 = i * 6;
      pos[i6 + 0] = x;
      pos[i6 + 1] = y;
      pos[i6 + 2] = z;
      pos[i6 + 3] = x;
      pos[i6 + 4] = y - length;
      pos[i6 + 5] = z;

      vel[i] = speed * (0.6 + Math.random() * 0.8);
    }

    return { positions: pos, velocities: vel };
  }, [count, area, height, length, speed]);

  useFrame((_, delta) => {
    if (!lines.current) return;

    const dt = Math.min(delta, 0.033);
    const attr = lines.current.geometry.attributes.position;
    const pos = attr.array;
    const max = pos.length / 6;

    for (let i = 0; i < max; i++) {
      const v = velocities[i] * dt;
      const i6 = i * 6;

      pos[i6 + 1] -= v;
      pos[i6 + 4] -= v;

      if (pos[i6 + 1] < -height) {
        pos[i6 + 1] = 0;
        pos[i6 + 4] = -length;
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <lineSegments ref={lines}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <lineBasicMaterial
        color="#bcdcff"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </lineSegments>
  );
}
