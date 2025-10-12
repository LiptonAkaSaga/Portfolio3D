import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import AsciiHead from './AsciiHead';

const HomeFullscreen3D: React.FC = () => {
  return (
    <section
      id="home"
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 3D Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          {/* ... lights, model, effects ... */}
        </Canvas>
      </div>

      {/* Text Overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1
                style={{
                  color: '#00ffff',
                  textShadow: '0 0 20px #00ffff',
                }}
              >
                I'm a <strong>Web Designer</strong>
                <br />
                <strong>Front-end developer</strong>
              </h1>
              <p style={{ color: '#ffffff' }}>Your description here...</p>
              <a href="#contact-me" className="btn btn-outline-primary">
                Contact me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFullscreen3D;
