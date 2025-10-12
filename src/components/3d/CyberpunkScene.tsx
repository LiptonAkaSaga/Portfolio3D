// src/components/3d/CyberpunkScene.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import AsciiHead from './AsciiHead';
import { AdvancedAsciiEffect } from './AsciiEffectAdvanced';

interface CyberpunkSceneProps {
  enableAscii?: boolean;
  enableBloom?: boolean;
  enableControls?: boolean;
  modelPath?: string;
  backgroundColor?: string;
}

const CyberpunkScene: React.FC<CyberpunkSceneProps> = ({
  enableAscii = true,
  enableBloom = true,
  enableControls = false,
  modelPath = '/models/head.glb',
  backgroundColor = '#000000',
}) => {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
        }}
        style={{ background: backgroundColor }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={35} />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          color="#00ffff"
          castShadow
        />

        {/* Model */}
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#00ffff" wireframe />
            </mesh>
          }
        >
          <AsciiHead modelPath={modelPath} scale={0.1} rotationSpeed={0.002} />
        </Suspense>

        {/* Environment dla lepszych refleksji */}
        <Environment preset="city" />

        {/* Controls (opcjonalne) */}
        {enableControls && (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        )}

        {/* Post-processing effects */}
        <EffectComposer>
          {/* ASCII Effect */}
          {enableAscii && (
            <AdvancedAsciiEffect
              pixelSize={6}
              brightness={1.8}
              color1={[0.0, 0.2, 0.6]}
              color2={[0.0, 0.8, 1.0]}
            />
          )}

          {/* Bloom dla świecących elementów */}
          {enableBloom && (
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.ADD}
            />
          )}

          {/* ChromaticAberration dla cyberpunk vibe */}
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.001, 0.001]} />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay - instrukcje */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ffff',
          fontFamily: 'monospace',
          fontSize: '14px',
          textAlign: 'center',
          textShadow: '0 0 10px #00ffff',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <p style={{ margin: '5px 0' }}>MOVE MOUSE TO INTERACT</p>
        <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.7 }}>
          CYBERPUNK PORTFOLIO • 3D + ASCII
        </p>
      </div>
    </div>
  );
};

export default CyberpunkScene;
