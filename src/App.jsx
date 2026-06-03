import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AppProvider, useApp } from './context/AppContext'
import { prefersReducedMotion } from './lib/prefersReducedMotion'

import Cursor from './components/ui/Cursor'
import Spotlight from './components/ui/Spotlight'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import SectionTransition from './components/ui/SectionTransition'
import GrainOverlay from './components/ui/GrainOverlay'
import HUD from './components/ui/HUD'

import Loader from './components/sections/Loader'
import Hero from './components/sections/Hero'
import Manifesto from './components/sections/Manifesto'
import Marquee from './components/sections/Marquee'
import Models from './components/sections/Models'
import Configurator from './components/sections/Configurator'
import DesignPhilosophy from './components/sections/DesignPhilosophy'
import DragExplore from './components/sections/DragExplore'
import Specs from './components/sections/Specs'
import Performance from './components/sections/Performance'
import Legacy from './components/sections/Legacy'
import Heritage from './components/sections/Heritage'
import Experience from './components/sections/Experience'
import Testimonials from './components/sections/Testimonials'
import CTA from './components/sections/CTA'

// Each section morphs the fixed background toward its base color as it enters,
// so the acts blend with zero hard cuts. Warm tones creep in around Experience
// where ACT 3 (gold) begins.
const ACTS = [
  { sel: '.hero-section',         color: '#FDFDFD' },
  { sel: '.manifesto-section',    color: '#F9FAFB' },
  { sel: '.marquee-section',      color: '#F3F4F6' },
  { sel: '.models-section',       color: '#E5E7EB' },
  { sel: '.configurator-section', color: '#FDFDFD' },
  { sel: '.philosophy-section',   color: '#F4F5F7' },
  { sel: '.explore-section',      color: '#E5E7EB' },
  { sel: '.specs-section',        color: '#FDFDFD' },
  { sel: '.performance-section',  color: '#F9FAFB' },
  { sel: '.legacy-section',       color: '#F3F4F6' },
  { sel: '.heritage-section',     color: '#E5E7EB' },
  { sel: '.experience-section',   color: '#FEF3C7' }, // Warm gold hint for ACT 3
  { sel: '.testimonials-section', color: '#FFFBEB' },
  { sel: '.cta-section',          color: '#FDFDFD' },
]

function Experience3Act() {
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
          scrub: 1.5,
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
      trigger: '.experience-section',
      start: 'top 55%',
      onEnter: () => setCurrentAct(3),
      onLeaveBack: () => setCurrentAct(2),
    })

    // data-speed depth parallax — elements move at differential scroll rates
    // to create natural Z-depth. Excludes anything inside pinned sections.
    gsap.utils.toArray('[data-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.speed)
      gsap.to(el, {
        y: () => (1 - speed) * ScrollTrigger.maxScroll(window) * 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      })
    })

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

  // Global resize and image load listener to ensure ScrollTrigger stays accurate
  useEffect(() => {
    let timeoutId = null
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 250)
    }
    
    const handleImgLoad = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        handleResize()
      }
    }

    window.addEventListener('resize', handleResize)
    // Use capture phase to catch load events from all images
    window.addEventListener('load', handleImgLoad, true)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleImgLoad, true)
      clearTimeout(timeoutId)
    }
  }, [])

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
      <Spotlight />
      <Navbar />
      <Loader />
      <HUD />

      <div ref={bgRef} aria-hidden="true" className="fixed inset-0 -z-10" />
      <GrainOverlay />

      <main>
        {/* ACT 1 — arrival. Hero is pinned, excluded from skew-wrap. */}
        <Hero />

        <div className="skew-wrap">
          <Manifesto />
        </div>

        <SectionTransition trigger=".marquee-section" color="#FDFDFD" accent="#E60000" />
        <div className="skew-wrap">
          <Marquee />
        </div>

        {/* ACT 2 — the machine. Models is pinned, excluded from skew-wrap. */}
        <Models />

        {/* CENTERPIECE 1 — live configurator */}
        <div className="skew-wrap">
          <Configurator />
        </div>

        <div className="skew-wrap">
          <DesignPhilosophy />
        </div>

        {/* CENTERPIECE 2 — drag-to-explore */}
        <div className="skew-wrap">
          <DragExplore />
        </div>

        <SectionTransition trigger=".specs-section" color="#E5E7EB" accent="#E60000" />
        <div className="skew-wrap">
          <Specs />
        </div>
        <div className="skew-wrap">
          <Performance />
        </div>
        <div className="skew-wrap">
          <Legacy />
        </div>
        <div className="skew-wrap">
          <Heritage />
        </div>

        {/* ACT 3 — belonging. Gold warmth enters with Experience. */}
        <SectionTransition trigger=".experience-section" color="#FDFDFD" accent="#D4AF37" />
        <div className="skew-wrap">
          <Experience />
        </div>
        <div className="skew-wrap">
          <Testimonials />
        </div>
        <div className="skew-wrap">
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
      <Experience3Act />
    </AppProvider>
  )
}
