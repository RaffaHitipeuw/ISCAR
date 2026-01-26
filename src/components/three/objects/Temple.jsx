"use client";

export default function Temple({ position = [0, 0, -80] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[20, 1, 14]} />
        <meshStandardMaterial color="#cfcfcf" />
      </mesh>

      {[-7, -3, 3, 7].map((x, i) => (
        <mesh key={i} position={[x, 4, 5]}>
          <cylinderGeometry args={[0.6, 0.6, 7, 16]} />
          <meshStandardMaterial color="#e5e5e5" />
        </mesh>
      ))}

      {[-7, -3, 3, 7].map((x, i) => (
        <mesh key={`b-${i}`} position={[x, 4, -5]}>
          <cylinderGeometry args={[0.6, 0.6, 7, 16]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
      ))}

      <mesh position={[0, 8.5, 0]}>
        <boxGeometry args={[22, 1.2, 16]} />
        <meshStandardMaterial color="#bcbcbc" />
      </mesh>
    </group>
  );
}