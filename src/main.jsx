import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import App from './App.jsx'
import './index.css'
import { prefersReducedMotion } from './lib/prefersReducedMotion.js'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Lenis drives smooth scroll and feeds ScrollTrigger. Disabled entirely when
// the user prefers reduced motion (native scroll + skipped animations).
let lenis = null

if (!prefersReducedMotion) {
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

createRoot(document.getElementById('root')).render(<App />)

export { lenis }
