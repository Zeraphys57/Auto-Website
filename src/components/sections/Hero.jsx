import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import FrameSequence from '../canvas/FrameSequence'
import { useApp } from '../../context/AppContext'
import { registerParallax } from '../../lib/pointer'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'
import { lenis } from '../../main.jsx'

const HEADLINE = ['UNTUK YANG', 'TAK PERNAH', 'CUKUP']

const SPECS = [
  { label: '0–100 KM/H', value: '3.2 DETIK' },
  { label: 'TOP SPEED', value: '320 KM/H' },
  { label: 'MESIN', value: '4.0L V8 BITURBO' },
]

export default function Hero() {
  const { isLoaded } = useApp()
  const sectionRef  = useRef(null)
  const pinRef      = useRef(null)
  const contentRef  = useRef(null)
  const headlineRef = useRef(null)
  const subRef      = useRef(null)
  const identityRef = useRef(null)
  const ctaRef      = useRef(null)
  const topRef      = useRef(null)
  const specRef     = useRef(null)
  const hintRef     = useRef(null)
  const frameWrapRef = useRef(null)

  // Intro choreography — runs only once the loader has lifted.
  useGSAP(
    () => {
      if (prefersReducedMotion) return

      if (!isLoaded) {
        gsap.set(
          [headlineRef.current, subRef.current, identityRef.current, ctaRef.current, topRef.current, hintRef.current],
          { autoAlpha: 0 }
        )
        return
      }

      gsap.set(headlineRef.current, { perspective: 800, autoAlpha: 1 })
      const split = new SplitText(headlineRef.current.querySelectorAll('.h-line'), {
        type: 'chars',
      })

      const tl = gsap.timeline({ delay: 0.15 })

      // Chars: fly in from below with mechanical heavy ease, then rotateX overshoot-settle
      const staggerIn  = { each: 0.022, ease: 'power2.in',  from: 'start' }
      const staggerOut = { each: 0.016, ease: 'power2.out', from: 'start' }

      tl.from(split.chars, {
        autoAlpha: 0,
        rotateX: 90,
        y: 60,
        transformOrigin: '50% 50% -24px',
        stagger: staggerIn,
        duration: 0.9,
        ease: 'velox',
      })
        .to(
          split.chars,
          { rotateX: -6, y: 0, stagger: staggerOut, duration: 0.25, ease: 'power2.out' },
          '-=0.3'
        )
        .to(
          split.chars,
          { rotateX: 0, stagger: staggerOut, duration: 0.35, ease: 'elastic.out(1, 0.5)' },
          '-=0.15'
        )
        .from(
          [subRef.current, identityRef.current, ctaRef.current],
          { autoAlpha: 0, filter: 'blur(16px)', stagger: 0.12, duration: 0.9, ease: 'velox' },
          '-=0.5'
        )
        .from(
          topRef.current,
          { autoAlpha: 0, filter: 'blur(10px)', duration: 0.8, ease: 'velox' },
          '-=0.85'
        )
        .from(hintRef.current, { autoAlpha: 0, duration: 0.8, ease: 'velox' }, '-=0.5')
    },
    { dependencies: [isLoaded], scope: sectionRef }
  )

  // Pin + scrubbed reveal/exit tied to the frame sequence range.
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const end = () => `+=${window.innerHeight * 3}`

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end,
        pin: pinRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      tl.to({}, { duration: 1, ease: 'none' })
      tl.fromTo(
        specRef.current,
        { autoAlpha: 0, yPercent: 70, filter: 'blur(12px)' },
        { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.22 },
        0.5
      )
      tl.to(hintRef.current, { autoAlpha: 0, duration: 0.15 }, 0.45)
      tl.to(
        contentRef.current,
        { autoAlpha: 0, filter: 'blur(16px)', scale: 1.06, ease: 'veloxIn', duration: 0.24 },
        0.78
      )
    },
    { scope: sectionRef }
  )

  // Mouse-parallax — each layer drifts at its own rate for 3D depth. The frame
  // canvas moves opposite (and is over-scanned 6% so edges never show).
  useEffect(() => {
    const cleanups = [
      registerParallax(frameWrapRef.current, { strength: 14, invert: true, lerp: 0.08 }),
      registerParallax(topRef.current, { strength: 10 }),
      registerParallax(headlineRef.current, { strength: 8 }),
      registerParallax(subRef.current, { strength: 16 }),
      registerParallax(identityRef.current, { strength: 18 }),
      registerParallax(ctaRef.current, { strength: 16 }),
      registerParallax(specRef.current, { strength: 24 }),
    ]
    return () => cleanups.forEach((c) => c())
  }, [])

  // Live-readout flicker on the last glyph of each spec value.
  useEffect(() => {
    if (prefersReducedMotion) return
    const tweens = gsap.utils.toArray('.spec-flicker').map((el) =>
      gsap.to(el, {
        opacity: 0.4,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
        delay: Math.random() * 0.9,
      })
    )
    return () => tweens.forEach((t) => t.kill())
  }, [])

  const goToModels = (e) => {
    e.preventDefault()
    const el = document.querySelector('#models')
    if (!el) return
    if (lenis) lenis.scrollTo(el, { duration: 1.6 })
    else el.scrollIntoView()
  }

  return (
    <section ref={sectionRef} id="top" className="hero-section relative">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Layer 1 — frame sequence (mouse-parallax wrapper, over-scanned) */}
        <div ref={frameWrapRef} className="absolute inset-0">
          <div className="absolute inset-0" style={{ transform: 'scale(1.06)' }}>
            <FrameSequence frameCount={240} />
          </div>
        </div>

        {/* Layer 2 — content overlay */}
        <div
          ref={contentRef}
          className="hero-content absolute inset-0 z-10 px-6 py-24 md:px-12 md:py-10"
        >
          {/* Top bar */}
          <div ref={topRef} className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="font-display text-xl leading-none tracking-wide-caps text-chrome">
                VELOX
              </span>
              <span className="h-px w-10 bg-electric" />
            </div>
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-chrome/50">
              Jakarta · Indonesia
            </span>
          </div>

          {/* Headline */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 md:left-12">
            <h1
              ref={headlineRef}
              className="font-display text-chrome"
              style={{ lineHeight: 0.84, letterSpacing: '0.01em' }}
            >
              {HEADLINE.map((line) => (
                <span
                  key={line}
                  className="h-line block"
                  style={{ fontSize: 'clamp(5rem, 14vw, 13rem)' }}
                >
                  {line}
                </span>
              ))}
            </h1>

            <p
              ref={subRef}
              className="mt-6 max-w-md font-serif text-lg italic text-chrome/70 md:text-xl"
            >
              Beberapa orang melihat jalan. Anda melihat undangan.
            </p>

            <p
              ref={identityRef}
              className="mt-4 max-w-sm font-accent text-caption font-extralight uppercase leading-relaxed tracking-macro text-muted"
            >
              Bukan untuk semua orang. Dan justru itulah maksudnya.
            </p>

            <a
              ref={ctaRef}
              href="#models"
              onClick={goToModels}
              data-cursor="hover"
              data-magnetic
              data-magnetic-strength="0.4"
              className="group mt-8 inline-flex items-center gap-3 font-accent text-caption font-light uppercase tracking-macro text-electric"
            >
              Jelajahi Koleksi
              <span className="transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>
          </div>

          {/* Spec teaser bar — bottom-left */}
          <div
            ref={specRef}
            className="absolute bottom-10 left-6 flex divide-x divide-silver/30 md:left-12"
          >
            {SPECS.map((s) => (
              <div key={s.label} className="px-5 first:pl-0">
                <div className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-fluid-h3 leading-none text-chrome">
                  {s.value.slice(0, -1)}
                  <span className="spec-flicker text-electric">{s.value.slice(-1)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll hint — bottom-right, vertical */}
          <div
            ref={hintRef}
            className="absolute bottom-10 right-8 hidden md:block"
            style={{ writingMode: 'vertical-rl' }}
          >
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
              Scroll untuk menjelajahi
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
