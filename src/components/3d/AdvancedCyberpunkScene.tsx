import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import AsciiHead from './AsciiHead';
import { TextureAsciiEffect } from './TextureAsciiEffect';

// Performance-optimized Floating Particles with GPU Instancing
const FloatingParticles: React.FC = React.memo(() => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const PARTICLE_COUNT = 100;
  const lastUpdateRef = useRef(0);
  const tempObject = useRef(new THREE.Object3D());

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

  // Initialize instanced mesh positions
  React.useEffect(() => {
    if (!instancedMeshRef.current) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      tempObject.current.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      tempObject.current.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, tempObject.current.matrix);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  useFrame((state, delta) => {
    if (!instancedMeshRef.current) return;

    // Ogranicz aktualizacje do 30 FPS dla particli
    const now = state.clock.elapsedTime * 1000;
    if (now - lastUpdateRef.current < 33) return; // ~30 FPS
    lastUpdateRef.current = now;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Move particles down
      positions[i * 3 + 1] -= speeds[i] * delta * 2;

      // Reset to top when reaching bottom
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 10;
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }

      // Zmniejszony horizontal drift
      positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.0005;

      // Update instance matrix
      tempObject.current.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      tempObject.current.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, tempObject.current.matrix);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
});

// Grid Floor
const GridFloor: React.FC = React.memo(() => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
    </mesh>
  );
});

// Holographic Rings
const HolographicRings: React.FC = React.memo(() => {
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
});

// Scene Content
const SceneContent: React.FC<{ modelPath: string; enableHolographicRings: boolean }> = ({
  modelPath,
  enableHolographicRings,
}) => {
  return (
    <>
      {/* Zoptymalizowane oświetlenie - mniej świateł i mniejsza intensywność */}
      <ambientLight intensity={0.15} />
      <pointLight position={[-3, 3, -3]} color="#00aaff" intensity={2} distance={15} />
      <pointLight position={[3, 0, 0]} color="#ff00ff" intensity={3} distance={20} />

      {/* Usunięto spotLight który był najbardziej kosztowny */}

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
      {enableHolographicRings && <HolographicRings />}

      {/* Environment - mniejsza intensywność */}
      <Environment preset="city" environmentIntensity={0.5} />
    </>
  );
};

// Main Component
interface AdvancedCyberpunkSceneProps {
  enableAscii?: boolean;
  enableBloom?: boolean;
  enableParticles?: boolean;
  enableHolographicRings?: boolean;
  modelPath?: string;
  backgroundColor?: string;
}

const AdvancedCyberpunkScene: React.FC<AdvancedCyberpunkSceneProps> = ({
  enableAscii = true,
  enableBloom = true,
  enableHolographicRings = true,
  modelPath = '/models/head2.glb',
  backgroundColor = '#000000',
}) => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);

  // Wykryj urządzenia o niższej wydajności
  React.useEffect(() => {
    const checkPerformance = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) {
        setIsLowPerformance(true);
        return;
      }

      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(
          debugInfo.UNMASKED_RENDERER_WEBGL
        );
        // Wykryj integracje karty graficzne (słabsze urządzenia)
        if (renderer.includes('Intel') && !renderer.includes('Iris')) {
          setIsLowPerformance(true);
        }
      }

      // Sprawdź liczbę rdzeni CPU
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        setIsLowPerformance(true);
      }
    };

    checkPerformance();

    // Debug mode - naciśnij 'P' 3x aby przełączyć
    const pressCount = { current: 0 };
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        pressCount.current++;
        if (pressCount.current >= 3) {
          setIsDebugMode((prev) => !prev);
          pressCount.current = 0;
          console.log('🎮 Debug mode:', !isDebugMode ? 'enabled' : 'disabled');
        }
      }
      // Reset po 1 sekundzie
      setTimeout(() => {
        pressCount.current = 0;
      }, 1000);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Debug Panel */}
      {isDebugMode && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#00ff00',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 1000,
            border: '1px solid #00ff00',
            minWidth: '200px',
          }}
        >
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
            🎮 DEBUG MODE
          </div>
          <div style={{ marginBottom: '8px' }}>
            CPU Cores: {navigator.hardwareConcurrency || 'unknown'}
          </div>
          <div style={{ marginBottom: '8px' }}>
            GPU: {(navigator as any).gpu?.vendor || 'unknown'}
          </div>
          <div style={{ marginBottom: '8px' }}>
            Device: {isLowPerformance ? '🐌 LOW PERFORMANCE' : '🚀 HIGH PERFORMANCE'}
          </div>
          <div style={{ marginBottom: '8px' }}>
            DPI: {isLowPerformance ? 1 : window.devicePixelRatio}
          </div>
          <div style={{ marginBottom: '8px' }}>
            Antialias: {!isLowPerformance ? '✅ ON' : '❌ OFF'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            Holographic Rings: {!isLowPerformance && enableHolographicRings ? '✅ ON' : '❌ OFF'}
          </div>
          <div style={{ borderTop: '1px solid #00ff00', paddingTop: '10px', marginBottom: '10px' }}>
            <button
              onClick={() => setIsLowPerformance(!isLowPerformance)}
              style={{
                background: isLowPerformance ? '#ff0000' : '#00ff00',
                color: '#000',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold',
              }}
            >
              {isLowPerformance ? 'FORCE HIGH PERF' : 'FORCE LOW PERF'}
            </button>
          </div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Press 'P' 3x to close</div>
        </div>
      )}

      {/* 3D Canvas z optymalizacjami */}
      <Canvas
        gl={{
          antialias: !isLowPerformance, // Wyłącz antialiasing na słabszych urządzeniach
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: backgroundColor }}
        dpr={isLowPerformance ? 1 : Math.min(window.devicePixelRatio, 2)} // Ogranicz DPI na słabszych urządzeniach
        performance={{ min: 0.5 }} // Ustaw minimalną jakość
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

        <SceneContent
          modelPath={modelPath}
          enableHolographicRings={enableHolographicRings && !isLowPerformance}
        />

        {/* Post-processing z adaptacyjną jakością */}
        <EffectComposer>
          {enableAscii && !isLowPerformance ? (
            <TextureAsciiEffect
              cellSize={[8, 12]}
              brightness={2.9}
              color1={[0.0, 0.4, 0.6]}
              color2={[0.0, 0.8, 1.0]}
            />
          ) : null}
          {enableBloom ? (
            <Bloom
              intensity={isLowPerformance ? 0.25 : 0.3}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.ADD}
              height={isLowPerformance ? 150 : 300}
            />
          ) : null}
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
