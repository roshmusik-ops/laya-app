import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

function Particles(props) {
  const ref = useRef();
  
  // Generate random points in a sphere
  const sphere = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Use spherical coordinates for uniform distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.4 * Math.cbrt(Math.random());
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#d4af37" size={0.012} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.6} />
      </Points>
    </group>
  );
}

function GlowingRings() {
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref1.current) {
      ref1.current.rotation.x = Math.sin(t / 4);
      ref1.current.rotation.y = Math.sin(t / 2);
    }
    if (ref2.current) {
      ref2.current.rotation.x = Math.cos(t / 4);
      ref2.current.rotation.y = Math.sin(t / 3);
    }
  });

  return (
    <>
      <mesh ref={ref1}>
        <torusGeometry args={[1.5, 0.003, 16, 100]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ref2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.003, 16, 100]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}

export default function FuturisticOrb() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(circle at center, #1a0505 0%, #050000 100%)", overflow: "hidden" }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Particles />
          <GlowingRings />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
