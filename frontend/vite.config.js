import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcjs from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcjs(),
  ],

  build: {
    modulePreload: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':    ['lucide-react'],
          'vendor-auth':  ['@react-oauth/google', 'zustand'],
          'vendor-utils': ['axios'],
        },
      },
    },
  },
});
