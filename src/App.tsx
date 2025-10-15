import React from 'react';
import { Canvas } from '@react-three/fiber';

const App: React.FC = () => {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 100, position: [0, 0, 10] }}
      style={{ width: '100vw', height: '100vh' }}
    ></Canvas>
  );
};

export default App;
