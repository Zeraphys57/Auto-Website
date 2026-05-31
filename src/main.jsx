import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import App from './App.jsx'
import './index.css'
import { prefersReducedMotion } from './lib/prefersReducedMotion.js'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

// Signature easing curves — used globally across all entrance/exit animations.
CustomEase.create('velox', '0.16, 1, 0.3, 1')   // smooth expo-like entrance
CustomEase.create('veloxIn', '0.87, 0, 0.13, 1') // dramatic in-out for transitions

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

  // Scroll-velocity skew — the page subtly leans into fast scroll and snaps
  // back when still. Targets only .skew-wrap containers (never pinned tracks).
  let targetSkew = 0
  let currentSkew = 0
  const skewClamp = gsap.utils.clamp(-6, 6)
  const skewSetter = gsap.quickSetter('.skew-wrap', 'skewY', 'deg')

  lenis.on('scroll', ({ velocity }) => {
    targetSkew = skewClamp(velocity * 0.35)
  })

  gsap.ticker.add(() => {
    currentSkew += (targetSkew - currentSkew) * 0.12
    targetSkew *= 0.88
    if (Math.abs(currentSkew) > 0.004) skewSetter(currentSkew)
  })
}

createRoot(document.getElementById('root')).render(<App />)

export { lenis }
