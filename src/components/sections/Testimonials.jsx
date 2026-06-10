import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { applyTilt } from '../../lib/tilt'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

const DATA = [
  {
    quote: [
      'People ask why, when I already own three.',
      'They will never understand.',
      "And I don't need to explain.",
    ],
    name: 'James Sterling',
    role: 'Founder & Investor',
    owned: 'VELOX RS · Owner since 2019',
  },
  {
    quote: [
      'Twelve cars in my garage.',
      'Only one key stays in my pocket.',
      'You can guess which one.',
    ],
    name: 'Maria Chen',
    role: 'Private Collector',
    owned: 'VELOX S · Private Garage, Sydney',
  },
  {
    quote: [
      'Above 250, the engine cannot lie.',
      'VELOX tells the truth,',
      'and I believe every word of it.',
    ],
    name: 'Oliver Wright',
    role: 'Racer & Entrepreneur',
    owned: 'VELOX GT · 40,000 km in two years',
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const cardRef = useRef(null)
  const glareRef = useRef(null)

  const go = (dir) => setIndex((i) => (i + dir + DATA.length) % DATA.length)

  // Auto-advance — reschedules whenever the index changes or interaction pauses.
  useEffect(() => {
    if (prefersReducedMotion || paused) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % DATA.length), 5000)
    return () => clearTimeout(id)
  }, [index, paused])

  // 3D tilt (no-op on touch / reduced-motion).
  useEffect(() => {
    return applyTilt(cardRef.current, { max: 9, glare: glareRef.current })
  }, [])

  // Drag / swipe to change quote — works for both mouse and touch.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    let startX = null

    const down = (e) => {
      startX = e.clientX
      setPaused(true)
      el.setPointerCapture?.(e.pointerId)
    }
    const up = (e) => {
      if (startX === null) return
      const dx = e.clientX - startX
      startX = null
      setPaused(false)
      if (Math.abs(dx) > 55) go(dx < 0 ? 1 : -1)
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [])

  const active = DATA[index]

  return (
    <section className="testimonials-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      {/* Eyebrow */}
      <span
        data-speed="0.85"
        className="absolute top-[14%] left-1/2 -translate-x-1/2 font-accent text-micro font-extralight uppercase tracking-macro text-muted"
      >
        Testimonials
      </span>

      {/* Decorative quote mark — slight faster parallax */}
      <span
        aria-hidden="true"
        data-speed="0.6"
        className="pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 font-display leading-none text-crimson"
        style={{ fontSize: '12rem', opacity: 0.15 }}
      >
        &rdquo;
      </span>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Tiltable / draggable card */}
        <div
          ref={cardRef}
          data-cursor="drag"
          className="relative cursor-grab select-none active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          <span
            ref={glareRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{ opacity: 0, mixBlendMode: 'overlay' }}
          />
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={prefersReducedMotion ? false : { opacity: 0, filter: 'blur(12px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="font-serif italic text-offwhite"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', lineHeight: 1.5 }}
              >
                {active.quote.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>

              <footer className="mt-10">
                <div className="font-accent text-sm font-light tracking-wide-caps text-gold">
                  — {active.name}
                </div>
                <div className="mt-1 font-accent text-caption font-extralight uppercase tracking-macro text-muted">
                  {active.role}
                </div>
                <div className="mt-5 font-mono text-micro uppercase tracking-macro text-gold/70">
                  {active.owned}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Dot navigation */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {DATA.map((_, i) => (
            <button
              key={i}
              type="button"
              data-cursor="hover"
              data-magnetic
              data-magnetic-strength="0.6"
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all duration-500 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
              style={{
                width: i === index ? 28 : 8,
                backgroundColor: i === index ? '#C9A96E' : 'rgba(201,169,110,0.3)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>

        {/* Swipe hint */}
        <div className="mt-5 font-accent text-micro uppercase tracking-macro text-muted/60">
          Swipe to navigate
        </div>
      </div>
    </section>
  )
}
