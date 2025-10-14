import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF } from '@react-three/drei';
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from 'three/examples/jsm/postprocessing/EffectComposer';
import {
  WebGLRenderTarget,
  DepthTexture,
  UnsignedShortType,
  Vector2,
  Color,
  ShaderMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  Group,
  Mesh,
} from 'three';
import * as THREE from 'three';

// ASCII Shader Material
const createAsciiShader = (
  lowResTexture: THREE.Texture,
  depthTexture: THREE.Texture,
  fontTexture: THREE.Texture
) => {
  return {
    uniforms: {
      tLowRes: { value: lowResTexture },
      tDepth: { value: depthTexture },
      tFont: { value: fontTexture },
      fontCharSize: { value: new Vector2(1 / 11, 1) },
      fontCharCount: { value: new Vector2(11, 1) },
      fontCharTotalCount: { value: 11 },
      renderCharSize: { value: new Vector2(1 / 160, 1 / 90) },
      renderCharCount: { value: new Vector2(160, 90) },
      cameraNear: { value: 0.1 },
      cameraFar: { value: 20 },
      color1: { value: new Vector2(0.0, 0.3) },
      color2: { value: new Vector2(0.0, 1.0) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tLowRes;
      uniform sampler2D tDepth;
      uniform sampler2D tFont;
      uniform vec2 fontCharSize;
      uniform vec2 fontCharCount;
      uniform float fontCharTotalCount;
      uniform vec2 renderCharSize;
      uniform vec2 renderCharCount;
      uniform float cameraNear;
      uniform float cameraFar;
      uniform vec3 color1;
      uniform vec3 color2;
      
      varying vec2 vUv;
      
      float readDepth(sampler2D depthSampler, vec2 coord) {
        float fragCoordZ = texture2D(depthSampler, coord).x;
        float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
        return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
      }
      
      void main() {
        vec2 roundedUv = vec2(
          floor(vUv.x * renderCharCount.x),
          floor(vUv.y * renderCharCount.y)
        ) * renderCharSize;
        
        float depth = readDepth(tDepth, roundedUv);
        vec4 color = texture2D(tLowRes, roundedUv);
        
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        float charIndex = gray * fontCharTotalCount;
        
        vec2 fontUv = vec2(
          mod(vUv.x, renderCharSize.x),
          mod(vUv.y, renderCharSize.y)
        ) * renderCharCount * fontCharSize + vec2(
          floor(mod(charIndex, fontCharCount.x)) * fontCharSize.x,
          floor(charIndex * fontCharSize.x) * fontCharSize.y
        );
        
        vec4 fontColor = texture2D(tFont, fontUv);
        vec3 finalColor = mix(color1, color2, gray);
        
        gl_FragColor = vec4(fontColor.rgb * finalColor, 1.0);
      }
    `,
  };
};

// Font Texture Generator
function createFontTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const chars = ' .:!*oe&#%@';
  const fontSize = 16;
  const charWidth = fontSize * 0.6;

  canvas.width = charWidth * chars.length;
  canvas.height = fontSize;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.textBaseline = 'top';

  chars.split('').forEach((char, i) => {
    ctx.fillText(char, i * charWidth + 1, 0);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  return texture;
}

// Model Component
interface ModelProps {
  position?: [number, number, number];
  scale?: number;
  modelPath?: string;
}

const Model: React.FC<ModelProps> = ({
  position = [0, 0, 0],
  scale = 2,
  modelPath = '/models/head.glb',
}) => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtelna rotacja bazująca na myszy
      const mouseX = (state.mouse.x * Math.PI) / 10;
      const mouseY = (state.mouse.y * Math.PI) / 10;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
    }
  });

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        child.material = (child.material as THREE.Material).clone();
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = 0.7;
          child.material.roughness = 0.3;
          child.material.emissive = new Color(0x0088ff);
          child.material.emissiveIntensity = 0.2;
        }
      }
    });
  }, [clonedScene]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Particles Component
const Particles: React.FC = () => {
  const particlesRef = useRef<Points>(null);
  const PARTICLE_COUNT = 200;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 1 + Math.random() * 2;
    }

    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3 + 1] -= speeds[i] * delta;
        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = 10;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
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
      <pointsMaterial size={0.05} color="#00ffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

// Scene Setup Component
const SceneContent: React.FC<{ modelPath?: string }> = ({ modelPath }) => {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <pointLight position={[-5, 5, -5]} color="#00aaff" intensity={3} distance={20} />
      <pointLight position={[-5, 0, 5]} color="#00aaff" intensity={0.7} distance={20} />
      <pointLight position={[5, 0, 0]} color="#ff00ff" intensity={2} distance={20} />

      {/* Model */}
      <Model position={[0, 0, 0]} scale={2} modelPath={modelPath} />

      {/* Particles */}
      <Particles />
    </>
  );
};

// Main Scene Component
interface CompleteCyberpunkSceneProps {
  modelPath?: string;
  backgroundColor?: string;
  enableControls?: boolean;
}

const CompleteCyberpunkScene: React.FC<CompleteCyberpunkSceneProps> = ({
  modelPath = '/models/head.glb',
  backgroundColor = '#000000',
}) => {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas gl={{ antialias: true, alpha: false }} style={{ background: backgroundColor }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={20} near={0.1} far={20} />
        <SceneContent modelPath={modelPath} />
      </Canvas>

      {/* UI Overlay */}
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
        <p style={{ margin: '5px 0' }}>CYBERPUNK PORTFOLIO 3.0</p>
        <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.7 }}>ASCII + 3D + WebGL</p>
      </div>
    </div>
  );
};

export default CompleteCyberpunkScene;
