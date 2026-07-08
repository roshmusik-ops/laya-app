import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function AudioBars({ count = 15 }) {
  const group = useRef();
  const bars = useRef([]);
  
  // Randomize initial heights and animation speeds
  const barData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      height: 0.5 + Math.random() * 2.5,
      speed: 1 + Math.random() * 3,
      offset: Math.random() * Math.PI * 2
    }));
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    bars.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = barData[i];
      // Simulate beating to music
      const scaleY = 0.2 + (Math.sin(time * data.speed + data.offset) + 1) * 0.5 * data.height;
      mesh.scale.y = scaleY;
      mesh.position.y = scaleY / 2 - 1.5;
      
      // Pulse color
      const hue = (time * 0.1 + i * 0.05) % 1;
      mesh.material.color.setHSL(hue, 1, 0.5);
    });
    
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {barData.map((_, i) => (
        <mesh 
          key={i} 
          ref={(el) => (bars.current[i] = el)} 
          position={[(i - count / 2) * 0.3, 0, 0]}
        >
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial metalness={0.8} roughness={0.2} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingVinyl() {
  const vinyl = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (vinyl.current) {
      vinyl.current.rotation.z = -time; // spin like a record
      vinyl.current.rotation.x = Math.PI / 2.5 + Math.sin(time * 0.5) * 0.1;
      vinyl.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1} position={[0, 2, -1]}>
      <group ref={vinyl}>
        {/* Record body */}
        <mesh>
          <cylinderGeometry args={[1.2, 1.2, 0.05, 64]} />
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.4} />
        </mesh>
        {/* Grooves */}
        {[0.4, 0.6, 0.8, 1.0].map((r, i) => (
          <mesh key={i} position={[0, 0.03, 0]}>
            <torusGeometry args={[r, 0.01, 16, 64]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
        {/* Center Label */}
        <mesh position={[0, 0.026, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Center Hole */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      </group>
    </Float>
  );
}

export default function FloatingBeats() {
  return (
    <div style={{
      position: "fixed",
      bottom: "70px", // Just above bottom nav
      right: "10px",
      width: "120px",
      height: "180px",
      zIndex: 50,
      pointerEvents: "none", // so it doesn't block clicks
      filter: "drop-shadow(0 0 20px rgba(212,175,55,0.3))"
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#d4af37" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff4444" />
        
        <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
          <AudioBars count={10} />
          <FloatingVinyl />
        </Float>
      </Canvas>
    </div>
  );
}
