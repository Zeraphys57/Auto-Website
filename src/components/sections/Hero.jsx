import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import FrameSequence from '../canvas/FrameSequence'
import { useApp } from '../../context/AppContext'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'
import { lenis } from '../../main.jsx'

const HEADLINE = ['KECEPATAN', 'YANG', 'SEMPURNA']

const SPECS = [
  { label: '0–100 KM/H', value: '3.2 DETIK' },
  { label: 'TOP SPEED', value: '320 KM/H' },
  { label: 'ENGINE', value: '4.0L V8 BITURBO' },
]

export default function Hero() {
  const { isLoaded } = useApp()
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const contentRef = useRef(null)
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const topRef = useRef(null)
  const specRef = useRef(null)
  const hintRef = useRef(null)

  // Intro choreography — runs only once the loader has lifted. The headline is
  // split exactly once (in the loaded branch) to avoid double-wrapping the DOM.
  useGSAP(
    () => {
      if (prefersReducedMotion) return

      if (!isLoaded) {
        gsap.set(
          [headlineRef.current, subRef.current, ctaRef.current, topRef.current, hintRef.current],
          { autoAlpha: 0 }
        )
        return
      }

      gsap.set(headlineRef.current, { perspective: 800, autoAlpha: 1 })
      const split = new SplitText(headlineRef.current.querySelectorAll('.h-line'), {
        type: 'chars',
      })
      const tl = gsap.timeline({ delay: 0.15 })
      tl.from(split.chars, {
        autoAlpha: 0,
        rotateX: 90,
        transformOrigin: '50% 50% -24px',
        stagger: 0.015,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          [subRef.current, ctaRef.current],
          { autoAlpha: 0, filter: 'blur(16px)', stagger: 0.12, duration: 0.9, ease: 'power2.out' },
          '-=0.4'
        )
        .from(
          topRef.current,
          { autoAlpha: 0, filter: 'blur(10px)', duration: 0.8, ease: 'power2.out' },
          '-=0.8'
        )
        .from(hintRef.current, { autoAlpha: 0, duration: 0.8 }, '-=0.5')
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
      tl.to({}, { duration: 1, ease: 'none' }) // backbone → maps scroll 0–1
      tl.fromTo(
        specRef.current,
        { autoAlpha: 0, yPercent: 70, filter: 'blur(12px)' },
        { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.22 },
        0.5
      )
      tl.to(hintRef.current, { autoAlpha: 0, duration: 0.15 }, 0.45)
      tl.to(
        contentRef.current,
        { autoAlpha: 0, filter: 'blur(16px)', scale: 1.06, ease: 'power2.in', duration: 0.24 },
        0.78
      )
    },
    { scope: sectionRef }
  )

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
        {/* Layer 1 — frame sequence */}
        <FrameSequence frameCount={240} />

        {/* Layer 2 — content overlay */}
        <div
          ref={contentRef}
          className="hero-content absolute inset-0 z-10 px-6 py-24 md:px-12 md:py-10"
        >
          {/* Top bar */}
          <div ref={topRef} className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="font-display text-xl leading-none tracking-[0.12em] text-chrome">
                VELOX
              </span>
              <span className="h-px w-10 bg-electric" />
            </div>
            <span className="font-accent text-[0.62rem] font-extralight uppercase tracking-[0.35em] text-chrome/50">
              Jakarta · Indonesia
            </span>
          </div>

          {/* Headline — asymmetric, center-left */}
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
              Engineered for those who refuse to compromise.
            </p>

            <a
              ref={ctaRef}
              href="#models"
              onClick={goToModels}
              data-cursor="hover"
              data-magnetic
              className="group mt-8 inline-flex items-center gap-3 font-accent text-[0.78rem] font-light uppercase tracking-[0.25em] text-electric"
            >
              Jelajahi Model
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
                <div className="font-accent text-[0.6rem] font-extralight uppercase tracking-[0.2em] text-muted">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-[1.4rem] leading-none text-chrome">
                  {s.value}
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
            <span className="font-accent text-[0.6rem] font-extralight uppercase tracking-[0.35em] text-muted">
              Scroll untuk menjelajahi
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
