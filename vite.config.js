import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GLSL shaders are imported via Vite's native `?raw` suffix (see CTAOrb),
// so no dedicated glsl plugin is required (and none currently supports Vite 8).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
