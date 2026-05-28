/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0A0A0A',
        carbon2: '#111111',
        carbon3: '#1A1A1A',
        electric: '#00D4FF',
        'electric-dim': '#0099BB',
        chrome: '#E8E8E8',
        silver: '#C0C0C0',
        crimson: '#FF2D2D',
        'crimson-dim': '#CC1111',
        gold: '#C9A96E',
        offwhite: '#F0EDE8',
        muted: '#666666',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        accent: ['Jost', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
