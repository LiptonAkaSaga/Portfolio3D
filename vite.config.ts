import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          react: ['react', 'react-dom'],
          // Three.js ecosystem
          'three-core': ['three'],
          'three-r3f': ['@react-three/fiber', '@react-three/drei'],
          'three-postprocessing': ['@react-three/postprocessing', 'postprocessing'],
          // Routing
          router: ['react-router-dom'],
          // UI frameworks
          bootstrap: ['bootstrap'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Enable source maps for debugging (disable in production if needed)
    sourcemap: false,
  },
});
