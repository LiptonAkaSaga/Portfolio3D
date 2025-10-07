// App.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';

const App: React.FC = () => {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 100, position: [0, 0, 10] }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Scene />
    </Canvas>
  );
};

export default App;
