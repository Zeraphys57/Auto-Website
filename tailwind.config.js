/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0A0E14',
        carbon2: '#111111',
        carbon3: '#1A1A1A',
        electric: '#00D2FF',
        'electric-dim': '#0099BB',
        chrome: '#FFFFFF',
        silver: '#E2E8F0',
        crimson: '#FF2D2D',
        'crimson-dim': '#CC1111',
        gold: '#D4AF37',
        offwhite: '#F0EDE8',
        muted: '#8B98A5',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        serif: ['Space Grotesk', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
        accent: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'micro': ['0.65rem', { lineHeight: '1.2' }],
        'caption': ['0.8rem', { lineHeight: '1.4' }],
        'fluid-h3': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3' }],
        'fluid-h2': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1' }],
        'fluid-h1': ['clamp(3rem, 6vw, 4.5rem)', { lineHeight: '1' }],
        'fluid-display': ['clamp(4rem, 8vw, 6rem)', { lineHeight: '0.9' }],
      },
      letterSpacing: {
        'wide-caps': '0.15em',
        'macro': '0.25em',
      },
    },
  },
  plugins: [],
}
