// EXAMPLE: Section3D z interaktywnym panelem pozycjonowania
// Użyj tego do znalezienia idealnych wartości, potem skopiuj je do finalnego kodu

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Import komponentu modelu
import AsciiHead from './AsciiHead';

const Section3DWithControls: React.FC = () => {
  // State dla pozycji
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [posZ, setPosZ] = useState(0);

  // State dla rotacji
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  // State dla skali
  const [scale, setScale] = useState(2);

  // State dla kamery
  const [cameraZ, setCameraZ] = useState(5);
  const [fov, setFov] = useState(50);

  // Funkcja do logowania ustawień
  const logSettings = () => {
    console.log('===== MODEL SETTINGS =====');
    console.log(
      'position={[' + posX.toFixed(2) + ', ' + posY.toFixed(2) + ', ' + posZ.toFixed(2) + ']}'
    );
    console.log(
      'rotation={[' + rotX.toFixed(2) + ', ' + rotY.toFixed(2) + ', ' + rotZ.toFixed(2) + ']}'
    );
    console.log('scale={' + scale.toFixed(2) + '}');
    console.log('');
    console.log('===== CAMERA SETTINGS =====');
    console.log('position={[0, 0, ' + cameraZ.toFixed(2) + ']}');
    console.log('fov={' + fov + '}');
    console.log('========================');
  };

  // Funkcja do kopiowania kodu
  const copyCode = () => {
    const code = `<AsciiHead
  position={[${posX.toFixed(2)}, ${posY.toFixed(2)}, ${posZ.toFixed(2)}]}
  rotation={[${rotX.toFixed(2)}, ${rotY.toFixed(2)}, ${rotZ.toFixed(2)}]}
  scale={${scale.toFixed(2)}}
  modelPath="/models/head.glb"
/>

<PerspectiveCamera 
  makeDefault 
  position={[0, 0, ${cameraZ.toFixed(2)}]}
  fov={${fov}}
/>`;

    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <section
      id="showcase-3d"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#1a1a1a',
        padding: '80px 0',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* 3D Canvas */}
        <div
          style={{
            width: '100%',
            height: '600px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #3a29f5',
            position: 'relative',
            background: '#0a0a0a',
          }}
        >
          <Canvas gl={{ antialias: true, alpha: false }} style={{ background: '#0a0a0a' }}>
            <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={fov} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3a29f5" />

            {/* Model */}
            {/* Odkomentuj gdy masz komponent AsciiHead: */}
            {
              <AsciiHead
                position={[posX, posY, posZ]}
                rotation={[rotX, rotY, rotZ]}
                scale={scale}
                modelPath="/models/head.glb"
              />
            }

            {/* Placeholder cube - usuń gdy masz model */}
            {/* <mesh position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]} scale={scale}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#00ffff"
                wireframe
                emissive="#3a29f5"
                emissiveIntensity={0.5}
              />
            </mesh> */}

            <Environment preset="city" />

            {/* Effects */}
            <EffectComposer>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                blendFunction={BlendFunction.ADD}
              />
            </EffectComposer>
          </Canvas>
        </div>

        {/* Control Panel */}
        <div
          style={{
            marginTop: '20px',
            background: 'rgba(0,0,0,0.8)',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #3a29f5',
            color: '#00ffff',
            fontFamily: 'Fira Code, monospace',
          }}
        >
          <h2
            style={{
              color: '#ff00ff',
              marginBottom: '20px',
              fontSize: '20px',
            }}
          >
            🎮 MODEL POSITION CONTROLS
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Position Controls */}
            <div>
              <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '15px' }}>
                📍 Position
              </h3>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>X (←→):</span>
                <span style={{ color: '#ffffff' }}>{posX.toFixed(2)}</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>Y (↑↓):</span>
                <span style={{ color: '#ffffff' }}>{posY.toFixed(2)}</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>Z (⇄):</span>
                <span style={{ color: '#ffffff' }}>{posZ.toFixed(2)}</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={posZ}
                  onChange={(e) => setPosZ(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>
            </div>

            {/* Rotation Controls */}
            <div>
              <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '15px' }}>
                🔄 Rotation
              </h3>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>X (Pitch):</span>
                <span style={{ color: '#ffffff' }}>{((rotX * 180) / Math.PI).toFixed(0)}°</span>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 2}
                  step="0.1"
                  value={rotX}
                  onChange={(e) => setRotX(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>Y (Yaw):</span>
                <span style={{ color: '#ffffff' }}>{((rotY * 180) / Math.PI).toFixed(0)}°</span>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 2}
                  step="0.1"
                  value={rotY}
                  onChange={(e) => setRotY(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>Z (Roll):</span>
                <span style={{ color: '#ffffff' }}>{((rotZ * 180) / Math.PI).toFixed(0)}°</span>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 2}
                  step="0.1"
                  value={rotZ}
                  onChange={(e) => setRotZ(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>
            </div>

            {/* Scale & Camera */}
            <div>
              <h3 style={{ color: '#00ffff', fontSize: '16px', marginBottom: '15px' }}>
                📏 Scale & Camera
              </h3>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>Scale:</span>
                <span style={{ color: '#ffffff' }}>{scale.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>Cam Z:</span>
                <span style={{ color: '#ffffff' }}>{cameraZ.toFixed(1)}</span>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={cameraZ}
                  onChange={(e) => setCameraZ(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '80px' }}>FOV:</span>
                <span style={{ color: '#ffffff' }}>{fov}°</span>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={fov}
                  onChange={(e) => setFov(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={logSettings}
              style={{
                padding: '10px 20px',
                background: '#3a29f5',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '4px',
                fontFamily: 'Fira Code',
                fontSize: '14px',
                flex: '1',
                minWidth: '150px',
              }}
            >
              📋 Log to Console
            </button>

            <button
              onClick={copyCode}
              style={{
                padding: '10px 20px',
                background: '#00e061',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '4px',
                fontFamily: 'Fira Code',
                fontSize: '14px',
                flex: '1',
                minWidth: '150px',
              }}
            >
              📄 Copy Code
            </button>

            <button
              onClick={() => {
                setPosX(0);
                setPosY(0);
                setPosZ(0);
                setRotX(0);
                setRotY(0);
                setRotZ(0);
                setScale(2);
                setCameraZ(5);
                setFov(50);
              }}
              style={{
                padding: '10px 20px',
                background: '#747474',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '4px',
                fontFamily: 'Fira Code',
                fontSize: '14px',
                flex: '1',
                minWidth: '150px',
              }}
            >
              🔄 Reset
            </button>
          </div>

          {/* Tips */}
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(58, 41, 245, 0.1)',
              borderRadius: '4px',
              border: '1px solid #3a29f5',
              fontSize: '12px',
              lineHeight: '1.6',
            }}
          >
            <strong style={{ color: '#ff00ff' }}>💡 Tips:</strong>
            <br />
            • Use sliders to find perfect position
            <br />
            • Click "Copy Code" to get ready-to-use component code
            <br />
            • Check console for exact values
            <br />
            • Position: X=left/right, Y=up/down, Z=near/far
            <br />• Rotation: X=pitch, Y=yaw, Z=roll
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section3DWithControls;
