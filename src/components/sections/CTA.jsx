import { useRef, lazy, Suspense } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useMagnetic } from '../../hooks/useMagnetic'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const CTAOrb = lazy(() => import('../canvas/CTAOrb'))

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

      const staggerIn  = { each: 0.022, ease: 'power2.in',  from: 'start' }
      const staggerOut = { each: 0.016, ease: 'power2.out', from: 'start' }

      tl.from(split.chars, {
        autoAlpha: 0,
        rotateX: 90,
        y: 60,
        transformOrigin: '50% 50% -24px',
        stagger: staggerIn,
        duration: 0.9,
        ease: 'expo.out',
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
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.10) 0%, transparent 65%)',
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
        <div className="mb-8 flex items-center justify-center gap-2 font-accent text-micro font-extralight uppercase tracking-macro text-gold">
          <span className="text-base leading-none">·</span>
          Private Invitation
        </div>

        <h2 className="font-display text-chrome" style={{ lineHeight: 0.9 }}>
          <span
            ref={line1Ref}
            className="block text-[clamp(4rem,10vw,9rem)]"
          >
            SOME THINGS
          </span>
          <span
            ref={line2Ref}
            className="mt-2 block font-serif italic text-gold text-[clamp(3rem,7vw,6rem)] leading-tight"
            style={{ lineHeight: 1.1 }}
          >
            require no second thoughts
          </span>
        </h2>

        <p ref={subRef} className="mx-auto mt-8 max-w-md text-offwhite/60">
          Arrive. Experience. The rest speaks for itself.
        </p>

        <div ref={btnRef} className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <a
            ref={primaryBtn}
            href="#cta"
            data-cursor="cta"
            className="group inline-block bg-electric px-9 py-4"
          >
            <span className="block font-accent text-caption font-medium uppercase tracking-macro text-carbon transition-transform duration-300 group-hover:scale-[1.02]">
              Experience It
            </span>
          </a>
          <a
            ref={secondaryBtn}
            href="#cta"
            data-cursor="hover"
            className="group inline-block border border-gold/40 px-9 py-4"
          >
            <span className="block font-accent text-caption font-light uppercase tracking-macro text-offwhite transition-transform duration-300 group-hover:scale-[1.02]">
              Start a Conversation
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
