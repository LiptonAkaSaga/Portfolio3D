import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AsciiHeadProps {
  modelPath?: string;
  rotationSpeed?: number;
  scale?: number;
  position?: [number, number, number];
  maxRotationX?: number; // Maksymalny kąt wychylenia w osi X (góra-dół)
  maxRotationY?: number; // Maksymalny kąt wychylenia w osi Y (lewo-prawo)
}

const AsciiHead: React.FC<AsciiHeadProps> = ({
  modelPath = '/models/head2.glb',
  rotationSpeed = 0.05, // Teraz to jest prędkość lerp, nie prędkość rotacji
  scale = 1,
  position = [0, 0, 0],
  maxRotationX = Math.PI / 6, // 30 stopni
  maxRotationY = Math.PI / 4, // 45 stopni
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frameSkipRef = useRef(0);

  // Ładowanie modelu GLB
  const { scene } = useGLTF(modelPath);

  // Klonowanie sceny tylko raz z useMemo
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();

    // Optymalizuj materiały tylko raz podczas klonowania
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Klonuj materiał tylko jeśli to konieczne
        child.material = child.material.clone();

        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = 0.7;
          child.material.roughness = 0.3;
          child.material.emissive = new THREE.Color(0x0088ff);
          child.material.emissiveIntensity = 0.2;

          // Optymalizacje renderowania
          child.material.needsUpdate = false;
          child.material.transparent = false;
          child.material.alphaTest = 0.01;
        }
      }
    });

    return cloned;
  }, [scene]);

  // Wychylenie na podstawie pozycji myszy - z optymalizacją FPS
  useFrame((state) => {
    if (!groupRef.current) return;

    // Ogranicz aktualizacje do 30 FPS dla płynności
    frameSkipRef.current++;
    if (frameSkipRef.current % 2 !== 0) return; // Co drugą klatkę

    // Normalizujemy pozycję myszy (-1 do 1) i mnożymy przez maksymalny kąt
    const targetRotationX = state.mouse.y * maxRotationX;
    const targetRotationY = state.mouse.x * maxRotationY;

    // Płynne przejście do docelowej rotacji używając lerp
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      rotationSpeed
    );

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      rotationSpeed
    );
  });

  return (
    <group position={position} ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload model
useGLTF.preload('/models/head2.glb');

export default AsciiHead;
