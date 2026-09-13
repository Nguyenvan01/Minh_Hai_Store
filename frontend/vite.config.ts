import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Xuat ra <goc repo>/dist - dung cho Vercel tim khi Root Directory la goc repo.
    // Neu de mac dinh (frontend/dist) thi Vercel bao:
    //   No Output Directory named "dist" found after the Build completed.
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
