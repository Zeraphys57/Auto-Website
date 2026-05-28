import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../../context/AppContext'
import { lenis } from '../../main.jsx'

const LINKS = [
  { label: 'Model', target: '#models' },
  { label: 'Spesifikasi', target: '#specs' },
  { label: 'Warisan', target: '#legacy' },
  { label: 'Kontak', target: '#cta' },
]

export default function Navbar() {
  const navRef = useRef(null)
  const { currentAct } = useApp()
  const isAct3 = currentAct === 3
  const accent = isAct3 ? 'text-gold' : 'text-electric'
  const accentBorder = isAct3 ? 'border-gold/60' : 'border-electric/60'
  const accentBg = isAct3 ? 'after:bg-gold' : 'after:bg-electric'

  useGSAP(() => {
    const nav = navRef.current
    const setSolid = (solid) =>
      gsap.to(nav, {
        backgroundColor: solid ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0)',
        backdropFilter: solid ? 'blur(12px)' : 'blur(0px)',
        borderColor: solid ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0)',
        duration: 0.4,
        ease: 'power2.out',
      })

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top -80',
      end: 'max',
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    })
    return () => st.kill()
  }, [])

  const handleNav = (e, target) => {
    e.preventDefault()
    const el = document.querySelector(target)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.4 })
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
          data-cursor="hover"
          className="font-display text-[1.8rem] leading-none tracking-[0.1em] text-chrome transition-colors"
        >
          VELOX
        </a>

        {/* Center links */}
        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.target}
                onClick={(e) => handleNav(e, link.target)}
                data-cursor="hover"
                className={`group relative font-accent text-[0.72rem] font-light uppercase tracking-[0.2em] text-chrome/70 transition-colors duration-300 hover:text-chrome after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100 hover:after:scale-x-100 ${accentBg}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Test Drive CTA */}
        <a
          href="#cta"
          onClick={(e) => handleNav(e, '#cta')}
          data-magnetic
          data-cursor="hover"
          className={`group relative hidden overflow-hidden border ${accentBorder} px-6 py-2.5 font-accent text-[0.7rem] font-light uppercase tracking-[0.22em] ${accent} transition-colors duration-300 sm:inline-block`}
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-carbon">
            Test Drive
          </span>
          <span
            className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100 ${
              isAct3 ? 'bg-gold' : 'bg-electric'
            }`}
          />
        </a>
      </div>
    </nav>
  )
}
