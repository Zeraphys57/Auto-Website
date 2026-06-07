import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../../context/AppContext'
import { lenis } from '../../main.jsx'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const LINKS = [
  { label: 'Models',    target: '#models' },
  { label: 'Philosophy', target: '#philosophy' },
  { label: 'Legacy',  target: '#legacy' },
  { label: 'Contact',   target: '#cta' },
]

// The desktop bar only surfaces four primary links; a phone has both the room
// and the need for the full journey, so the overlay carries the complete map.
const MOBILE_LINKS = [
  { label: 'Manifesto',   target: '#manifesto' },
  { label: 'Models',      target: '#models' },
  { label: 'Configure',   target: '#configurator' },
  { label: 'Philosophy',  target: '#philosophy' },
  { label: 'Performance', target: '#performance' },
  { label: 'Legacy',      target: '#legacy' },
  { label: 'Experience',  target: '#experience' },
  { label: 'Contact',     target: '#cta' },
]

export default function Navbar() {
  const navRef    = useRef(null)
  const hiddenRef = useRef(false)
  const menuRef   = useRef(null)
  const itemsRef  = useRef(null)
  const burgerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentAct, isLoaded } = useApp()
  const isAct3 = currentAct === 3
  const accent       = isAct3 ? 'text-gold'          : 'text-electric'
  const accentBorder = isAct3 ? 'border-gold/60'     : 'border-electric/60'
  const accentBg     = isAct3 ? 'after:bg-gold'      : 'after:bg-electric'
  const accentHover  = isAct3 ? 'group-hover:text-gold' : 'group-hover:text-electric'

  // Entrance — slides down after loader lifts
  useGSAP(() => {
    if (prefersReducedMotion) return
    if (!isLoaded) {
      gsap.set(navRef.current, { yPercent: -110, autoAlpha: 0 })
      return
    }
    gsap.to(navRef.current, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 1,
      ease: 'velox',
      delay: 0.25,
    })
  }, { dependencies: [isLoaded] })

  // Background solidify on scroll depth
  useGSAP(() => {
    const nav = navRef.current
    const setSolid = (solid) =>
      gsap.to(nav, {
        backgroundColor: solid ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0)',
        backdropFilter:  solid ? 'blur(12px)'          : 'blur(0px)',
        borderColor:     solid ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0)',
        duration: 0.4,
        ease: 'velox',
      })

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top -80',
      end: 'max',
      onEnter:     () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    })
    return () => st.kill()
  }, [])

  // Hide on scroll-down, reveal on scroll-up — classic luxury nav behaviour
  useEffect(() => {
    if (prefersReducedMotion || !lenis) return

    const onScroll = ({ scroll, velocity }) => {
      if (menuOpen) return // never retract while the overlay owns the screen
      const goingDown = velocity > 0.8
      const goingUp   = velocity < -0.8
      const nearTop   = scroll < 120

      if (nearTop && hiddenRef.current) {
        hiddenRef.current = false
        gsap.to(navRef.current, { yPercent: 0, duration: 0.5, ease: 'velox' })
        return
      }
      if (goingDown && !hiddenRef.current && !nearTop) {
        hiddenRef.current = true
        gsap.to(navRef.current, { yPercent: -110, duration: 0.35, ease: 'veloxIn' })
        return
      }
      if (goingUp && hiddenRef.current) {
        hiddenRef.current = false
        gsap.to(navRef.current, { yPercent: 0, duration: 0.5, ease: 'velox' })
      }
    }

    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [menuOpen])

  // Lock the page behind the overlay (pause Lenis + native scroll), and make
  // sure the bar itself is visible so the close affordance is always reachable.
  useEffect(() => {
    if (menuOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
      hiddenRef.current = false
      gsap.set(navRef.current, { yPercent: 0, autoAlpha: 1 })
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Escape closes the overlay.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Crossing into desktop width dismisses the overlay so the scroll lock can
  // never strand a user who rotated or resized mid-menu.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => { if (e.matches) setMenuOpen(false) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Open / close choreography.
  useGSAP(() => {
    const menu = menuRef.current
    if (!menu) return
    const items = itemsRef.current ? itemsRef.current.children : []

    if (prefersReducedMotion) {
      gsap.set(menu, { autoAlpha: menuOpen ? 1 : 0 })
      return
    }

    if (menuOpen) {
      gsap.set(menu, { visibility: 'visible' })
      gsap.to(menu, { autoAlpha: 1, duration: 0.4, ease: 'velox' })
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.6, ease: 'velox', delay: 0.08 }
      )
    } else {
      gsap.to(menu, {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'veloxIn',
        onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
      })
    }
  }, { dependencies: [menuOpen] })

  const handleNav = (e, target) => {
    e.preventDefault()
    const el = document.querySelector(target)
    if (!el) return
    if (menuOpen) {
      setMenuOpen(false)
      lenis?.start() // ensure scroll is live before the programmatic glide
    }
    // Reveal navbar before scrolling so user doesn't lose orientation
    if (hiddenRef.current) {
      hiddenRef.current = false
      gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: 'velox' })
    }
    if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.4, force: true })
    else el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 z-[100] w-full border-b"
      style={{ backgroundColor: 'rgba(10,10,10,0)', borderColor: 'rgba(255,255,255,0)' }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        {/* Wordmark */}
        <a
          href="#top"
          onClick={(e) => handleNav(e, '#top')}
          data-magnetic
          data-magnetic-strength="0.6"
          data-cursor="link"
          className="relative z-[120] font-display text-fluid-h3 leading-none tracking-wide-caps text-chrome transition-colors hover:text-electric"
        >
          VELOX
        </a>

        {/* Center links — desktop */}
        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.target}
                onClick={(e) => handleNav(e, link.target)}
                data-magnetic
                data-magnetic-strength="0.3"
                data-cursor="link"
                className={`group relative font-accent text-caption font-light uppercase tracking-macro text-chrome/70 transition-colors duration-300 hover:text-chrome after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100 hover:after:scale-x-100 ${accentBg}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Test Drive CTA — desktop */}
        <a
          href="#experience"
          onClick={(e) => handleNav(e, '#experience')}
          data-magnetic
          data-magnetic-strength="0.5"
          data-cursor="cta"
          className={`group relative hidden overflow-hidden border ${accentBorder} px-6 py-2.5 font-accent text-caption font-light uppercase tracking-macro ${accent} transition-colors duration-300 md:inline-block`}
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-carbon">
            Private Experience
          </span>
          <span
            className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100 ${
              isAct3 ? 'bg-gold' : 'bg-electric'
            }`}
          />
        </a>

        {/* Hamburger — mobile only. Morphs into an X while the overlay is open. */}
        <button
          ref={burgerRef}
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="relative z-[120] -mr-2 flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span
            className={`block h-px w-7 transition-all duration-300 ${menuOpen ? 'translate-y-[3.5px] rotate-45 bg-electric' : 'bg-chrome'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          />
          <span
            className={`block h-px w-7 transition-all duration-300 ${menuOpen ? '-translate-y-[3.5px] -rotate-45 bg-electric' : 'bg-chrome'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          />
        </button>
      </div>

      {/* Mobile overlay menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-0 z-[110] flex flex-col md:hidden"
        style={{
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
          backgroundColor: 'rgba(8,8,9,0.98)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Brand row (the X lives in the bar above, aligned to this spacer) */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-display text-fluid-h3 leading-none tracking-wide-caps text-chrome">
            VELOX
          </span>
          <span aria-hidden="true" className="h-10 w-10" />
        </div>

        {/* Primary navigation */}
        <nav ref={itemsRef} className="flex flex-1 flex-col justify-center gap-1 px-6">
          {MOBILE_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.target}
              onClick={(e) => handleNav(e, link.target)}
              className="group flex items-baseline gap-4 py-2"
            >
              <span className="font-mono text-micro tracking-macro text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`font-display uppercase tracking-wide text-chrome/80 transition-colors duration-300 ${accentHover}`}
                style={{ fontSize: 'clamp(2rem, 11vw, 3rem)', lineHeight: 1.05 }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        {/* CTA + footprint */}
        <div className="px-6 pb-10">
          <a
            href="#experience"
            onClick={(e) => handleNav(e, '#experience')}
            className={`block border ${accentBorder} px-6 py-4 text-center font-accent text-caption font-light uppercase tracking-macro ${accent}`}
          >
            Private Experience
          </a>
          <p className="mt-6 font-accent text-micro font-extralight uppercase tracking-macro text-muted">
            Sydney · Melbourne · Brisbane
          </p>
        </div>
      </div>
    </nav>
  )
}
