import React, { useRef, useEffect } from 'react';
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

  // Ładowanie modelu GLB
  const { scene } = useGLTF(modelPath);

  // Klonowanie sceny aby uniknąć problemów z re-renderem
  const clonedScene = scene.clone();

  // Wychylenie na podstawie pozycji myszy - BEZ nieskończonych obrotów
  useFrame((state) => {
    if (groupRef.current) {
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
    }
  });

  // Modyfikacja materiałów dla lepszego wyglądu
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Sprawdź czy materiał istnieje
        if (child.material) {
          // Klonuj materiał aby móc go modyfikować
          child.material = child.material.clone();

          // Ustaw podstawowe właściwości dla cyberpunk looku
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.metalness = 0.7;
            child.material.roughness = 0.3;

            // Dodaj subtelną emisję (poświatę)
            child.material.emissive = new THREE.Color(0x0088ff);
            child.material.emissiveIntensity = 0.2;
          }
        }
      }
    });
  }, [clonedScene]);

  return (
    <group position={position} ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload model
useGLTF.preload('/models/head2.glb');

export default AsciiHead;
