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
  { sel: '.hero-section', color: '#0A0A0A' },
  { sel: '.marquee-section', color: '#0C0C0C' },
  { sel: '.models-section', color: '#111111' },
  { sel: '.specs-section', color: '#121214' },
  { sel: '.legacy-section', color: '#171717' },
  { sel: '.testimonials-section', color: '#0D0D0D' },
  { sel: '.cta-section', color: '#0D0D0D' },
]

function Experience() {
  const { setCurrentAct } = useApp()
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
    return () => {
      a2.kill()
      a3.kill()
    }
  }, [])

  // Recompute pinned/scrubbed layouts once webfonts settle (text metrics shift).
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

      <div ref={bgRef} aria-hidden="true" className="fixed inset-0 -z-10" />

      <main>
        <Hero />
        <SectionTransition trigger=".marquee-section" color="#0A0A0A" accent="#00D4FF" />
        <Marquee />
        <Models />
        <SectionTransition trigger=".specs-section" color="#111111" accent="#FF2D2D" />
        <Specs />
        <Legacy />
        <SectionTransition trigger=".testimonials-section" color="#1A1A1A" accent="#C9A96E" />
        <Testimonials />
        <CTA />
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
