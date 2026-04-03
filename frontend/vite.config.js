import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcjs from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcjs()
  ],
  build: {
    // Re-enable module preload for optimal browser prefetching
    modulePreload: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached separately, rarely changes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI icon library — large but static
          'vendor-ui': ['lucide-react'],
          // Auth & state — changes independently of UI
          'vendor-auth': ['@react-oauth/google', 'zustand'],
          // HTTP & analytics
          'vendor-utils': ['axios', '@vercel/analytics'],
        },
      },
    },
  },
})

