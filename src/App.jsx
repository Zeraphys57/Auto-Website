import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AppProvider, useApp } from './context/AppContext'
import { prefersReducedMotion } from './lib/prefersReducedMotion'

import Cursor from './components/ui/Cursor'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import SectionTransition from './components/ui/SectionTransition'
import GrainOverlay from './components/ui/GrainOverlay'
import HUD from './components/ui/HUD'

import Loader from './components/sections/Loader'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import Models from './components/sections/Models'
import Specs from './components/sections/Specs'
import Legacy from './components/sections/Legacy'
import Testimonials from './components/sections/Testimonials'
import CTA from './components/sections/CTA'

// Each section morphs the fixed background toward its base color as it enters,
// so the three acts blend with zero hard cuts.
const ACTS = [
  { sel: '.hero-section',         color: '#0A0A0A' },
  { sel: '.marquee-section',      color: '#0C0C0C' },
  { sel: '.models-section',       color: '#111111' },
  { sel: '.specs-section',        color: '#121214' },
  { sel: '.legacy-section',       color: '#171717' },
  { sel: '.testimonials-section', color: '#0D0D0D' },
  { sel: '.cta-section',          color: '#0D0D0D' },
]

function Experience() {
  const { setCurrentAct, isLoaded } = useApp()
  const bgRef = useRef(null)

  useGSAP(() => {
    gsap.set(bgRef.current, { backgroundColor: ACTS[0].color })
    if (prefersReducedMotion) return

    ACTS.forEach((a, i) => {
      if (i === 0) return
      gsap.to(bgRef.current, {
        backgroundColor: a.color,
        ease: 'none',
        scrollTrigger: {
          trigger: a.sel,
          start: 'top 80%',
          end: 'top 30%',
          scrub: true,
        },
      })
    })

    const a2 = ScrollTrigger.create({
      trigger: '.models-section',
      start: 'top 55%',
      onEnter: () => setCurrentAct(2),
      onLeaveBack: () => setCurrentAct(1),
    })
    const a3 = ScrollTrigger.create({
      trigger: '.testimonials-section',
      start: 'top 55%',
      onEnter: () => setCurrentAct(3),
      onLeaveBack: () => setCurrentAct(2),
    })

    // data-speed depth parallax — elements move at differential scroll rates
    // to create natural Z-depth. Runs after DOM is ready via the useGSAP scope.
    if (!prefersReducedMotion) {
      gsap.utils.toArray('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.speed)
        gsap.to(el, {
          y: () => (1 - speed) * ScrollTrigger.maxScroll(window) * 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
    }

    return () => {
      a2.kill()
      a3.kill()
    }
  }, [])

  // Recompute after loader lifts (body overflow restored → scroll height changes)
  // and again after fonts settle.
  useEffect(() => {
    if (!isLoaded) return
    ScrollTrigger.refresh()
  }, [isLoaded])

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Cursor />
      <Navbar />
      <Loader />
      <HUD />

      <div ref={bgRef} aria-hidden="true" className="fixed inset-0 -z-10" />
      <GrainOverlay />

      <main>
        {/* Hero is pinned — excluded from skew-wrap to avoid pin conflicts */}
        <Hero />

        <SectionTransition trigger=".marquee-section" color="#0A0A0A" accent="#00D4FF" />
        {/* Non-pinned sections wrapped for scroll-velocity skew */}
        <div className="skew-wrap">
          <Marquee />
        </div>

        {/* Models is pinned — excluded from skew-wrap */}
        <Models />

        <SectionTransition trigger=".specs-section" color="#111111" accent="#FF2D2D" />
        <div className="skew-wrap">
          <Specs />
          <Legacy />
        </div>

        <SectionTransition trigger=".testimonials-section" color="#1A1A1A" accent="#C9A96E" />
        <div className="skew-wrap">
          <Testimonials />
          <CTA />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Experience />
    </AppProvider>
  )
}
