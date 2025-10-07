import React from 'react';
import { Text } from '@react-three/drei';

const terminalLines = [
  '[user@localhost ~]$ ssh root@192.168.0.1',
  'Connecting to 192.168.0.1...',
  'Password:',
  'Access granted.',
  '[root@server ~]$ ./upload.sh --inject payload.exe',
  'Uploading...',
  '[####################] 100%',
  'Upload complete.',
  '[root@server ~]$ exit',
  'Connection closed.',
];

const Terminal2D: React.FC = () => {
  return (
    <>
      {/* Czarny panel terminala */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Linie tekstu */}
      {terminalLines.map((line, index) => (
        <Text
          key={index}
          position={[-3.7, 2.0 - index * 0.45, 0.01]}
          fontSize={0.25}
          color="#00ff00"
          fontStyle="normal"
          fontFamily="monospace"
          anchorX="left"
          anchorY="top"
        >
          {line}
        </Text>
      ))}
    </>
  );
};

export default Terminal2D;
