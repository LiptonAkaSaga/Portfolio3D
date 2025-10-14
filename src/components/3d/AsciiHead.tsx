// src/components/3d/AsciiHead.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AsciiHeadProps {
  modelPath?: string;
  rotationSpeed?: number;
  scale?: number;
  position?: [number, number, number];
}

const AsciiHead: React.FC<AsciiHeadProps> = ({
  modelPath = '/models/head.glb',
  rotationSpeed = 0.00001,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Ładowanie modelu GLB
  const { scene } = useGLTF(modelPath);

  // Klonowanie sceny aby uniknąć problemów z re-renderem
  const clonedScene = scene.clone();

  // Automatyczna rotacja
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;

      // Subtelne wychylenie na podstawie pozycji myszy
      const mouseX = (state.mouse.x * Math.PI) / 10;
      const mouseY = (state.mouse.y * Math.PI) / 10;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX + groupRef.current.rotation.y,
        0.05
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
useGLTF.preload('/models/head.glb');

export default AsciiHead;
