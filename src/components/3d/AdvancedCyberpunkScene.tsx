import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import AsciiHead from './AsciiHead';
import { TextureAsciiEffect } from './TextureAsciiEffect';

// Performance-optimized Floating Particles with adaptive count
interface FloatingParticlesProps {
  isLowPerformance: boolean;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = React.memo(({ isLowPerformance }) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const PARTICLE_COUNT = isLowPerformance ? 20 : 100;
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
  }, [PARTICLE_COUNT]);

  // Initialize instanced mesh positions
  React.useEffect(() => {
    if (!instancedMeshRef.current) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      tempObject.current.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      tempObject.current.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, tempObject.current.matrix);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, PARTICLE_COUNT]);

  useFrame((state, delta) => {
    if (!instancedMeshRef.current) return;

    // Ogranicz aktualizacje do 30 FPS dla particli (lub 20 FPS na low-end)
    const updateInterval = isLowPerformance ? 50 : 33;
    const now = state.clock.elapsedTime * 1000;
    if (now - lastUpdateRef.current < updateInterval) return;
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

// Scene Content - receives isLowPerformance to adapt rendering
const SceneContent: React.FC<{ modelPath: string; enableHolographicRings: boolean; isLowPerformance: boolean }> = ({
  modelPath,
  enableHolographicRings,
  isLowPerformance,
}) => {
  return (
    <>
      {/* Zoptymalizowane oświetlenie */}
      <ambientLight intensity={0.15} />
      <pointLight position={[-3, 3, -3]} color="#00aaff" intensity={2} distance={15} />
      <pointLight position={[3, 0, 0]} color="#ff00ff" intensity={3} distance={20} />

      {/* Usunięto Environment preset - oszczędza 1-2MB HDR load na GPU */}

      {/* Main Model - wolniejsza rotacja na low-end */}
      <Suspense fallback={null}>
        <AsciiHead
          modelPath={modelPath}
          position={[0, -1.25, 0]}
          scale={0.13}
          rotationSpeed={isLowPerformance ? 0.005 : 0.01}
          maxRotationX={Math.PI / 30}
          maxRotationY={Math.PI / 4}
        />
      </Suspense>

      {/* Adaptive particle count */}
      <FloatingParticles isLowPerformance={isLowPerformance} />
      <GridFloor />
      {enableHolographicRings && <HolographicRings />}
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

// Enhanced performance detection
const detectLowPerformance = (): boolean => {
  // No WebGL = definitely low performance
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return true;

  // Check GPU renderer
  const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    // Integrated Intel GPUs (except Iris) are weak
    if (renderer.includes('Intel') && !renderer.includes('Iris') && !renderer.includes('Arc')) {
      return true;
    }
    // Mali/Adreno in low-power mode indicators
    if (renderer.includes('Mali-4') || renderer.includes('Adreno (TM) 3')) {
      return true;
    }
  }

  // Low CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true;
  }

  // Low device memory (Chrome only)
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (deviceMemory !== undefined && deviceMemory < 4) {
    return true;
  }

  // Battery saver mode (Chrome only)
  if (
    (navigator as Navigator & { getBattery?: () => Promise<{ charging: boolean; level: number }> })
      .getBattery
  ) {
    // Will be checked async below
  }

  // High DPI screens need more GPU power
  if (window.devicePixelRatio > 2 && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 6) {
    return true;
  }

  return false;
};

// Battery check async
const checkBatterySaver = async (): Promise<boolean> => {
  try {
    const nav = navigator as Navigator & { getBattery?: () => Promise<{ charging: boolean; level: number }> };
    if (nav.getBattery) {
      const battery = await nav.getBattery();
      // Battery saver: not charging and low battery
      return !battery.charging && battery.level < 0.2;
    }
  } catch {
    // Battery API not available
  }
  return false;
};

// FPS Monitor hook component
const FPSMonitor: React.FC<{
  onDegrade: () => void;
  isLowPerformance: boolean;
}> = ({ onDegrade, isLowPerformance }) => {
  const frameTimesRef = useRef<number[]>([]);
  const degradeCountRef = useRef(0);
  const lastDegradeRef = useRef(0);

  useFrame((_, delta) => {
    // Skip if already in low performance mode
    if (isLowPerformance) return;

    const frameTime = delta * 1000; // Convert to ms
    frameTimesRef.current.push(frameTime);

    // Keep only last 60 frames
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    // Check every 60 frames
    if (frameTimesRef.current.length === 60) {
      const avgFrameTime =
        frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;

      // Degrade if average frame time > 20ms (below 50 FPS) for 60 consecutive frames
      if (avgFrameTime > 20) {
        degradeCountRef.current++;
        // Require sustained bad performance before degrading (prevents false positives)
        if (degradeCountRef.current >= 2 && Date.now() - lastDegradeRef.current > 5000) {
          onDegrade();
          lastDegradeRef.current = Date.now();
          degradeCountRef.current = 0;
        }
      } else {
        degradeCountRef.current = 0;
      }
    }
  });

  return null;
};

const AdvancedCyberpunkScene: React.FC<AdvancedCyberpunkSceneProps> = ({
  enableAscii = true,
  enableBloom = true,
  enableHolographicRings = true,
  modelPath = '/models/head2.glb',
  backgroundColor = '#000000',
}) => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isRuntimeLowPerformance, setIsRuntimeLowPerformance] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [batteryLow, setBatteryLow] = useState(false);
  const [fps, setFps] = useState(60);

  // Combined low performance state
  const isEffectivelyLowPerf = isLowPerformance || isRuntimeLowPerformance || batteryLow;

  // Enhanced performance detection on mount
  React.useEffect(() => {
    setIsLowPerformance(detectLowPerformance());

    // Check battery status async
    checkBatterySaver().then(setBatteryLow);

    // Debug mode - press 'P' 3x
    const pressCount = { current: 0 };
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        pressCount.current++;
        if (pressCount.current >= 3) {
          setIsDebugMode((prev) => !prev);
          pressCount.current = 0;
        }
      }
      setTimeout(() => {
        pressCount.current = 0;
      }, 1000);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  // FPS counter for debug display
  const fpsRef = useRef<number[]>([]);
  useEffect(() => {
    if (!isDebugMode) return;
    let rafId: number;
    let lastTime = performance.now();
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;
      fpsRef.current.push(1000 / delta);
      if (fpsRef.current.length > 30) fpsRef.current.shift();
      const avgFps = Math.round(fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length);
      setFps(avgFps);
      rafId = requestAnimationFrame(measureFPS);
    };
    rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [isDebugMode]);

  const handleRuntimeDegrade = useCallback(() => {
    setIsRuntimeLowPerformance(true);
  }, []);

  // Determine DPR based on device
  const getDPR = (): number => {
    if (isEffectivelyLowPerf) return 1;
    if (window.devicePixelRatio > 2) return 1.5;
    return Math.min(window.devicePixelRatio, 1.5); // Cap at 1.5 instead of 2
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* CSS glow fallback - replaces Bloom on very low-end */}
      {isEffectivelyLowPerf && enableBloom && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

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
            minWidth: '220px',
          }}
        >
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>DEBUG MODE</div>
          <div style={{ marginBottom: '4px' }}>CPU: {navigator.hardwareConcurrency || '?'} cores</div>
          <div style={{ marginBottom: '4px' }}>
            RAM:{' '}
            {(navigator as Navigator & { deviceMemory?: number }).deviceMemory
              ? `${(navigator as Navigator & { deviceMemory?: number }).deviceMemory}GB`
              : '?'}
          </div>
          <div style={{ marginBottom: '4px' }}>Battery: {batteryLow ? 'SAVER' : 'OK'}</div>
          <div style={{ marginBottom: '4px' }}>FPS: {fps}</div>
          <div style={{ marginBottom: '8px' }}>
            Mode:{' '}
            {isEffectivelyLowPerf ? (
              <span style={{ color: '#ff6b6b' }}>LOW {isRuntimeLowPerformance ? '(AUTO)' : '(STATIC)'}</span>
            ) : (
              <span style={{ color: '#00ff00' }}>HIGH</span>
            )}
          </div>
          <div style={{ borderTop: '1px solid #00ff00', paddingTop: '10px', marginBottom: '10px' }}>
            <button
              onClick={() => setIsLowPerformance((prev) => !prev)}
              style={{
                background: isLowPerformance ? '#ff0000' : '#00ff00',
                color: '#000',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold',
                fontSize: '11px',
              }}
            >
              {isLowPerformance ? 'FORCE HIGH' : 'FORCE LOW'}
            </button>
          </div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>Press P 3x to close</div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        gl={{
          antialias: !isEffectivelyLowPerf,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: backgroundColor }}
        dpr={getDPR()}
        performance={{ min: isEffectivelyLowPerf ? 0.25 : 0.5 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

        <SceneContent
          modelPath={modelPath}
          enableHolographicRings={enableHolographicRings && !isEffectivelyLowPerf}
          isLowPerformance={isEffectivelyLowPerf}
        />

        {/* Runtime FPS monitor */}
        {!isRuntimeLowPerformance && (
          <FPSMonitor onDegrade={handleRuntimeDegrade} isLowPerformance={isEffectivelyLowPerf} />
        )}

        {/* Post-processing - more aggressive reduction on low-end */}
        <EffectComposer>
          {enableAscii && !isEffectivelyLowPerf ? (
            <TextureAsciiEffect
              cellSize={[8, 12]}
              brightness={2.9}
              color1={[0.0, 0.4, 0.6]}
              color2={[0.0, 0.8, 1.0]}
            />
          ) : undefined as unknown as React.ReactElement}
          {enableBloom ? (
            <Bloom
              intensity={isEffectivelyLowPerf ? 0.15 : 0.3}
              luminanceThreshold={isEffectivelyLowPerf ? 0.4 : 0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.ADD}
              height={isEffectivelyLowPerf ? 100 : 300}
            />
          ) : undefined as unknown as React.ReactElement}
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
