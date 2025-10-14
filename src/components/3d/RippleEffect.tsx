import React, { useMemo, useEffect, useRef } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
import * as THREE from 'three';

// Shader dla ripple effect
const rippleShader = `
  uniform vec2 resolution;
  uniform float time;
  uniform vec3 ripplePositions[10];
  uniform float rippleAges[10];
  uniform int rippleCount;
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 fragCoord = uv * resolution;
    vec4 color = inputColor; // Używamy inputColor zamiast texture2D
    
    // Ripple effect
    float totalRipple = 0.0;
    
    for (int i = 0; i < 10; i++) {
      if (i >= rippleCount) break;
      
      vec2 ripplePos = ripplePositions[i].xy;
      float age = rippleAges[i];
      
      if (age < 1.0) {
        float dist = distance(fragCoord, ripplePos);
        float rippleSize = resolution.y * age;
        
        // Kilka fal - mniejsza amplituda
        float wave1 = sin((dist - rippleSize * 0.3) * 0.1);
        float wave2 = sin((dist - rippleSize * 0.6) * 0.08);
        float wave3 = sin((dist - rippleSize * 1.0) * 0.05);
        
        // Fade out
        float fadeOut = age < 0.2 ? age / 0.2 : 1.0 - (age - 0.2) / 0.8;
        fadeOut = smoothstep(0.0, 1.0, fadeOut);
        
        // Distance falloff - bardziej agresywny
        float distanceFalloff = 1.0 - smoothstep(rippleSize * 0.3, rippleSize * 0.7, dist);
        
        float rippleIntensity = (wave1 * 0.3 + wave2 * 0.2 + wave3 * 0.1) * fadeOut * distanceFalloff;
        totalRipple += rippleIntensity * 0.3; // Dodatkowe zmniejszenie
      }
    }
    
    // Subtelny efekt - tylko dodaj trochę cyan do istniejącego koloru
    vec3 rippleColor = vec3(0.0, 1.0, 1.0); // Cyan
    vec3 finalColor = color.rgb + rippleColor * totalRipple * 0.1; // Bardzo subtelne
    
    outputColor = vec4(finalColor, 1.0);
  }
`;

// Interfejs dla pojedynczego ripple
interface Ripple {
  position: THREE.Vector3;
  age: number;
  maxAge: number;
}

class RippleEffectImpl extends Effect {
  private ripples: Ripple[] = [];
  private maxRipples = 10;
  private rippleSpeed = 0.3;

  constructor() {
    // Inicjalizuj uniformy
    const uniforms = new Map([
      ['resolution', new Uniform(new Vector2(window.innerWidth, window.innerHeight))],
      ['time', new Uniform(0)],
      ['ripplePositions', new Uniform(Array(10).fill(new THREE.Vector3(0, 0, 0)))],
      ['rippleAges', new Uniform(Array(10).fill(0))],
      ['rippleCount', new Uniform(0)],
    ]);

    super('RippleEffect', rippleShader, {
      uniforms,
    });

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('click', this.handleClick);
  }

  handleResize() {
    const resolution = this.uniforms.get('resolution')?.value;
    if (resolution instanceof Vector2) {
      resolution.set(window.innerWidth, window.innerHeight);
    }
  }

  handleClick(event: MouseEvent) {
    // Dodaj nowy ripple
    if (this.ripples.length < this.maxRipples) {
      this.ripples.push({
        position: new THREE.Vector3(event.clientX, window.innerHeight - event.clientY, 0),
        age: 0,
        maxAge: 1,
      });
    } else {
      // Zastąp najstarszy ripple
      const oldestIndex = this.ripples.findIndex(
        (r) => r.age === Math.max(...this.ripples.map((r) => r.age))
      );
      if (oldestIndex !== -1) {
        this.ripples[oldestIndex] = {
          position: new THREE.Vector3(event.clientX, window.innerHeight - event.clientY, 0),
          age: 0,
          maxAge: 1,
        };
      }
    }
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    // Update time
    const timeUniform = this.uniforms.get('time');
    if (timeUniform) {
      timeUniform.value += deltaTime;
    }

    // Update ripples
    this.ripples = this.ripples.filter((ripple) => {
      ripple.age += deltaTime * this.rippleSpeed;
      return ripple.age < ripple.maxAge;
    });

    // Update uniforms
    const positions = this.uniforms.get('ripplePositions')?.value;
    const ages = this.uniforms.get('rippleAges')?.value;
    const countUniform = this.uniforms.get('rippleCount');

    if (positions && ages && countUniform) {
      // Reset arrays
      for (let i = 0; i < 10; i++) {
        if (i < this.ripples.length) {
          positions[i].copy(this.ripples[i].position);
          ages[i] = this.ripples[i].age / this.ripples[i].maxAge;
        } else {
          positions[i].set(0, 0, 0);
          ages[i] = 1; // Fully aged out
        }
      }
      countUniform.value = this.ripples.length;
    }
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('click', this.handleClick);
    super.dispose();
  }
}

// React component
export const RippleEffect: React.FC = () => {
  const effectRef = useRef<RippleEffectImpl | null>(null);

  useEffect(() => {
    effectRef.current = new RippleEffectImpl();

    return () => {
      if (effectRef.current) {
        effectRef.current.dispose();
      }
    };
  }, []);

  const effect = useMemo(() => {
    return effectRef.current || new RippleEffectImpl();
  }, []);

  return <primitive object={effect} />;
};

export default RippleEffect;
