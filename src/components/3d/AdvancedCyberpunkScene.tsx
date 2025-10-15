import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import AsciiHead from './AsciiHead';
import { TextureAsciiEffect } from './TextureAsciiEffect';

// Floating Particles
const FloatingParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const PARTICLE_COUNT = 250;

  const [positions, speeds] = React.useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = Math.random() * 15 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 0.5 + Math.random() * 2;
    }

    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Move particles down
      posArray[i * 3 + 1] -= speeds[i] * delta * 2;

      // Reset to top when reaching bottom
      if (posArray[i * 3 + 1] < -10) {
        posArray[i * 3 + 1] = 10;
        posArray[i * 3] = (Math.random() - 0.5) * 15;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }

      // Slight horizontal drift
      posArray[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.001;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Grid Floor
const GridFloor: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
    </mesh>
  );
};

// Holographic Rings
const HolographicRings: React.FC = () => {
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = state.clock.elapsedTime * 0.5;
        ring.rotation.y = state.clock.elapsedTime * 0.3 + i;
        ring.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime + i) * 0.1);
      }
    });
  });

  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ringRefs.current[i] = el;
          }}
          position={[0, 0, -2 - i * 0.5]}
        >
          <torusGeometry args={[2 + i * 0.3, 0.02, 16, 100]} />
          <meshBasicMaterial
            color={i === 0 ? '#00ffff' : i === 1 ? '#ff00ff' : '#00ff00'}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
};

// Scene Content
const SceneContent: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  return (
    <>
      {/* Cyberpunk Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[-5, 5, -5]} color="#00aaff" intensity={4} distance={20} />
      <pointLight position={[-5, 0, 5]} color="#00aaff" intensity={1} distance={20} />
      <pointLight position={[5, 0, 0]} color="#ff00ff" intensity={6} distance={30} />
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#00ffff"
        castShadow
      />

      {/* Main Model - z ograniczoną rotacją */}
      <Suspense fallback={null}>
        <AsciiHead
          modelPath={modelPath}
          position={[0, -1.25, 0]}
          scale={0.13}
          rotationSpeed={0.01}
          maxRotationX={Math.PI / 30}
          maxRotationY={Math.PI / 4}
        />
      </Suspense>

      {/* Additional Visual Elements */}
      <FloatingParticles />
      <GridFloor />
      <HolographicRings />

      {/* Environment */}
      <Environment preset="city" />
    </>
  );
};

// Main Component
interface AdvancedCyberpunkSceneProps {
  enableAscii?: boolean;
  enableBloom?: boolean;
  enableParticles?: boolean;
  modelPath?: string;
  backgroundColor?: string;
}

const AdvancedCyberpunkScene: React.FC<AdvancedCyberpunkSceneProps> = ({
  enableAscii = true,
  enableBloom = true,
  modelPath = '/models/head.glb',
  backgroundColor = '#000000',
}) => {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* 3D Canvas */}
      <Canvas gl={{ antialias: true, alpha: false }} style={{ background: backgroundColor }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

        <SceneContent modelPath={modelPath} />

        {/* Post-processing */}
        <EffectComposer>
          {enableAscii && (
            <TextureAsciiEffect
              cellSize={[8, 12]}
              brightness={2.9}
              color1={[0.0, 0.4, 0.6]}
              color2={[0.0, 0.8, 1.0]}
            />
          )}

          {enableBloom && (
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.ADD}
            />
          )}
        </EffectComposer>
      </Canvas>

      {/* Scan Lines Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Vignette Effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default AdvancedCyberpunkScene;
