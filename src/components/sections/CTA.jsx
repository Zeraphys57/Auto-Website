import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { lazy, Suspense } from 'react'
const CTAOrb = lazy(() => import('../canvas/CTAOrb'))
import { useMagnetic } from '../../hooks/useMagnetic'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

export default function CTA() {
  const sectionRef  = useRef(null)
  const line1Ref    = useRef(null)
  const line2Ref    = useRef(null)
  const subRef      = useRef(null)
  const btnRef      = useRef(null)
  const primaryBtn  = useMagnetic(0.4)
  const secondaryBtn = useMagnetic(0.4)

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const split = new SplitText(line1Ref.current, { type: 'chars' })
      gsap.set(sectionRef.current, { perspective: 800 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })

      // Headline chars — mechanical heavy ease with rotateX overshoot-settle
      tl.from(split.chars, {
        autoAlpha: 0,
        rotateX: 90,
        y: 60,
        transformOrigin: '50% 50% -24px',
        stagger: 0.02,
        duration: 0.9,
        ease: 'expo.out',
      })
        .to(
          split.chars,
          { rotateX: -6, y: 0, stagger: 0.02, duration: 0.25, ease: 'power2.out' },
          '-=0.3'
        )
        .to(
          split.chars,
          { rotateX: 0, stagger: 0.02, duration: 0.35, ease: 'elastic.out(1, 0.5)' },
          '-=0.15'
        )
        .from(
          line2Ref.current,
          { autoAlpha: 0, filter: 'blur(16px)', duration: 1, ease: 'velox' },
          '-=0.5'
        )
        .from(
          [subRef.current, btnRef.current],
          { autoAlpha: 0, filter: 'blur(12px)', stagger: 0.12, duration: 0.9, ease: 'velox' },
          '-=0.7'
        )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="cta-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230,0,0,0.04) 0%, transparent 65%)',
        }}
      />

      {/* Orb */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[80vh] w-[80vh] max-w-[90vw]">
          <Suspense fallback={null}>
            <CTAOrb />
          </Suspense>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-center gap-2 font-accent text-micro font-extralight uppercase tracking-macro text-crimson">
          <span className="text-base leading-none">·</span>
          Undangan Privat
        </div>

        <h2 className="font-display text-chrome" style={{ lineHeight: 0.9 }}>
          <span
            ref={line1Ref}
            className="block text-fluid-display"
          >
            BEBERAPA HAL
          </span>
          <span
            ref={line2Ref}
            className="mt-2 block font-serif italic text-crimson text-fluid-h1"
          >
            tak perlu dipikir dua kali
          </span>
        </h2>

        <p ref={subRef} className="mx-auto mt-8 max-w-md text-muted">
          Datang. Rasakan. Sisanya akan jelas dengan sendirinya.
        </p>

        <div ref={btnRef} className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <a
            ref={primaryBtn}
            href="#cta"
            data-cursor="cta"
            className="group inline-block bg-electric px-9 py-4"
          >
            <span className="block font-accent text-caption font-medium uppercase tracking-macro text-carbon transition-transform duration-300 group-hover:scale-[1.02]">
              Rasakan Sendiri
            </span>
          </a>
          <a
            ref={secondaryBtn}
            href="#cta"
            data-cursor="hover"
            className="group inline-block border border-silver/60 px-9 py-4"
          >
            <span className="block font-accent text-caption font-light uppercase tracking-macro text-chrome transition-transform duration-300 group-hover:scale-[1.02]">
              Mulai Percakapan
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
