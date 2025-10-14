import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import AsciiHead from './AsciiHead';
import { TextureAsciiEffect } from './TextureAsciiEffect';

interface SimpleCyberpunkSceneProps {
  enableAscii?: boolean;
  enableBloom?: boolean;
  modelPath?: string;
  backgroundColor?: string;
  showOverlay?: boolean;
}

const SimpleCyberpunkScene: React.FC<SimpleCyberpunkSceneProps> = ({
  enableAscii = true,
  enableBloom = true,
  modelPath = '/models/head.glb',
  backgroundColor = '#000000',
  showOverlay = true,
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
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />

        {/* Cyberpunk Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[-5, 5, -5]} color="#00aaff" intensity={3} distance={20} />
        <pointLight position={[-5, 0, 5]} color="#00aaff" intensity={0.7} distance={20} />
        <pointLight position={[5, 0, 0]} color="#ff00ff" intensity={2} distance={20} />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          color="#00ffff"
          castShadow
        />

        {/* 3D Model */}
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

        {/* Post-processing effects */}
        <EffectComposer>
          {/* ASCII Effect - używa tekstury z fontami */}
          {enableAscii && (
            <TextureAsciiEffect
              cellSize={[8, 12]}
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
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      {showOverlay && (
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
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
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>MOVE MOUSE TO INTERACT</p>
          <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.7 }}>
            CYBERPUNK PORTFOLIO • ASCII + 3D
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleCyberpunkScene;
