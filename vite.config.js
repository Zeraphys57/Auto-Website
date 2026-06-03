import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GLSL shaders are imported via Vite's native `?raw` suffix (see CTAOrb),
// so no dedicated glsl plugin is required (and none currently supports Vite 8).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/'))                       return 'vendor-three'
          if (id.includes('node_modules/@react-three/fiber/'))          return 'vendor-r3f'
          if (id.includes('node_modules/@react-three/postprocessing/') ||
              id.includes('node_modules/postprocessing/'))              return 'vendor-postprocessing'
          if (id.includes('node_modules/@react-three/drei/'))           return 'vendor-drei'
          if (id.includes('node_modules/gsap/'))                        return 'vendor-gsap'
          if (id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react/'))                       return 'vendor-react'
        },
      },
    },
  },
})
