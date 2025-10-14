import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import AsciiHead from './AsciiHead';
import { TextureAsciiEffect } from './TextureAsciiEffect';

// Scan Effect Shader
const ScanEffect = ({ scanProgress = 0 }: { scanProgress: number }) => {
  return null; // Implement later with custom shader
};

// Ripple Effect Component
interface Ripple {
  age: number;
  position: THREE.Vector2;
  color: THREE.Vector2;
}

const RippleSystem: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      setRipples((prev) => [
        ...prev,
        {
          age: 0,
          position: new THREE.Vector2(event.clientX, event.clientY),
          color: new THREE.Vector2(
            (event.clientX / window.innerWidth) * 255,
            (event.clientY / window.innerHeight) * 255
          ),
        },
      ]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const RIPPLE_SPEED = 0.3;
    const RIPPLE_PEAK = 0.2;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      setRipples((prev) => {
        const updated = prev
          .map((ripple) => ({
            ...ripple,
            age: ripple.age + 0.016 * RIPPLE_SPEED, // ~60fps
          }))
          .filter((ripple) => ripple.age < 1);

        // Draw each ripple
        updated.forEach((ripple) => {
          const size = canvas.height * easeOutQuart(ripple.age);
          const alpha =
            ripple.age < RIPPLE_PEAK
              ? easeOutQuart(ripple.age / RIPPLE_PEAK)
              : 1 - (ripple.age - RIPPLE_PEAK) / (1 - RIPPLE_PEAK);

          const gradient = ctx.createRadialGradient(
            ripple.position.x,
            ripple.position.y,
            size * 0.25,
            ripple.position.x,
            ripple.position.y,
            size
          );

          gradient.addColorStop(1, 'rgba(0, 255, 255, 0.5)');
          gradient.addColorStop(0.8, `rgba(0, 255, 255, ${alpha})`);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(ripple.position.x, ripple.position.y, size, 0, Math.PI * 2);
          ctx.fill();
        });

        return updated;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
};

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

// Floating Particles
const FloatingParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const PARTICLE_COUNT = 150;

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
        ring.scale.setScalar(1 + Math.sin(state.clock.elapsedTime + i) * 0.1);
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
      <pointLight position={[5, 0, 0]} color="#ff00ff" intensity={3} distance={20} />
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#00ffff"
        castShadow
      />

      {/* Main Model */}
      <Suspense fallback={null}>
        <AsciiHead
          modelPath={modelPath}
          position={[2, -1, 0]}
          scale={0.13}
          rotationSpeed={0.00001}
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
  enableRipples?: boolean;
  enableParticles?: boolean;
  modelPath?: string;
  backgroundColor?: string;
}

const AdvancedCyberpunkScene: React.FC<AdvancedCyberpunkSceneProps> = ({
  enableAscii = true,
  enableBloom = true,
  enableRipples = true,
  modelPath = '/models/head.glb',
  backgroundColor = '#000000',
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Ripple Effect Overlay */}
      {enableRipples && <RippleSystem />}

      {/* 3D Canvas */}
      <Canvas gl={{ antialias: true, alpha: false }} style={{ background: backgroundColor }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

        <SceneContent modelPath={modelPath} />

        {/* Post-processing */}
        <EffectComposer>
          {enableAscii && (
            <TextureAsciiEffect
              cellSize={[8, 12]}
              brightness={1.8}
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

      {/* Info Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ffff',
          fontFamily: 'Fira Code, monospace',
          fontSize: '12px',
          textAlign: 'center',
          textShadow: '0 0 10px #00ffff',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
          CLICK TO CREATE RIPPLES • MOVE MOUSE TO INTERACT
        </p>
        <p style={{ margin: '5px 0', opacity: 0.7 }}>
          ADVANCED CYBERPUNK SCENE • ASCII + 3D + EFFECTS
        </p>
      </div>
    </div>
  );
};
export default AdvancedCyberpunkScene;
