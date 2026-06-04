/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#050505',
        carbon2: '#0A0A0A',
        carbon3: '#121212',
        electric: '#00C8FF',
        'electric-dim': '#0085A8',
        chrome: '#F2F2F2',
        silver: '#D1D5DB',
        crimson: '#FF1E1E',
        'crimson-dim': '#A30000',
        gold: '#D4AF37',
        offwhite: '#E5E5E5',
        muted: '#6B7280',
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
