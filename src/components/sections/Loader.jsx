import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useApp } from '../../context/AppContext'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

export default function Loader() {
  const { setIsLoaded, framesReady } = useApp()
  const rootRef = useRef(null)
  const contentRef = useRef(null)
  const logoRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)
  const subRef = useRef(null)

  const [countDone, setCountDone] = useState(false)
  const [done, setDone] = useState(false)
  const exitedRef = useRef(false)

  // Reduced motion: no loader theatre — flag loaded before first paint.
  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
        setDone(true)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [setIsLoaded])

  // Intro: lock scroll, draw logo, count up, fill the progress bar.
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      document.body.style.overflow = 'hidden'

      const len = 1500
      gsap.set(logoRef.current, {
        strokeDasharray: len,
        strokeDashoffset: len,
      })

      const counter = { v: 0 }
      const tl = gsap.timeline()
      tl.to(logoRef.current, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'power2.inOut',
      }, 0)
        .to(counter, {
          v: 100,
          duration: 2.3,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = String(
                Math.round(counter.v)
              ).padStart(3, '0')
          },
        }, 0)
        .fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 2.3, ease: 'power1.inOut' },
          0
        )
        .fromTo(
          subRef.current,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          0.7
        )
        .eventCallback('onComplete', () => setCountDone(true))
    },
    { scope: rootRef }
  )

  // Exit: once the count is done AND frames are ready (with a safety timeout),
  // fade the content and lift the curtain.
  useEffect(() => {
    if (prefersReducedMotion || !countDone) return

    const doExit = () => {
      if (exitedRef.current) return
      exitedRef.current = true
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          setIsLoaded(true)
          setDone(true)
        },
      })
      tl.to(contentRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: 'velox',
      }).to(
        rootRef.current,
        { yPercent: -100, duration: 0.9, ease: 'veloxIn' },
        '-=0.1'
      )
    }

    if (framesReady) {
      doExit()
      return
    }
    const safety = setTimeout(doExit, 4000)
    return () => clearTimeout(safety)
  }, [countDone, framesReady, setIsLoaded])

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-carbon"
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center"
      >
        {/* Wordmark — stroke draw-in */}
        <svg
          viewBox="0 0 640 130"
          className="w-[min(70vw,440px)]"
          role="img"
          aria-label="VELOX AUTO"
        >
          <text
            ref={logoRef}
            x="320"
            y="92"
            textAnchor="middle"
            fill="transparent"
            stroke="#00D4FF"
            strokeWidth="1.2"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '92px',
              letterSpacing: '0.14em',
            }}
          >
            VELOX·AUTO
          </text>
        </svg>

        {/* Counter */}
        <div
          ref={counterRef}
          className="font-display leading-none text-chrome"
          style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.04em',
          }}
        >
          000
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-px w-[min(60vw,220px)] overflow-hidden bg-chrome/10">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-electric"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Sub-text */}
        <div
          ref={subRef}
          className="mt-5 font-accent text-micro font-extralight uppercase tracking-macro text-muted"
          style={{ opacity: 0 }}
        >
          Loading Experience
        </div>
      </div>
    </div>
  )
}
