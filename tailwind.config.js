/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#FDFDFD', // Was dark, now Pearl White background
        carbon2: '#F4F5F7', // Slightly darker (Grigio)
        carbon3: '#E2E6EA',
        electric: '#E60000', // Was cyan, now Monza Red (Primary Accent)
        'electric-dim': '#B30000',
        chrome: '#0F1115', // Was white, now deep Carbon Black text
        silver: '#64748B', // Darker silver for borders
        crimson: '#E60000',
        'crimson-dim': '#B30000',
        gold: '#D4AF37',
        offwhite: '#1A1D24', // Was light, now dark
        muted: '#475569', // Dark slate for readable muted text
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
