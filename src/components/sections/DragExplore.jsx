import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// Drag-to-rotate showcase — a layered CSS-3D car the user grabs and turns,
// with release momentum and a gentle snap back to centre. Contained to one
// viewport. Reduced-motion / touch get arrow buttons instead of drag.
const HOTSPOTS = [
  { x: 30, y: 58, label: 'ENGINE', detail: '4.0L V8 Biturbo · 720 HP' },
  { x: 60, y: 34, label: 'AERODYNAMICS', detail: 'Downforce 320 kg @ 300 km/h' },
  { x: 72, y: 64, label: 'BRAKES', detail: '410 mm carbon-ceramic discs' },
]
const CLAMP = 55

export default function DragExplore() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const stageRef = useRef(null)
  const carRef = useRef(null)
  const hintRef = useRef(null)
  const [hintGone, setHintGone] = useState(false)
  const rm = prefersReducedMotion

  // Imperative rotation state (no React re-render per frame).
  const state = useRef({ rotY: -16, vel: 0, dragging: false, lastX: 0, raf: 0 })

  const apply = () => {
    if (carRef.current)
      carRef.current.style.transform = `rotateY(${state.current.rotY}deg) rotateX(4deg)`
  }

  useEffect(() => {
    apply()
    if (rm) return
    const stage = stageRef.current
    if (!stage) return

    const momentum = () => {
      const s = state.current
      if (s.dragging) return
      s.rotY = gsap.utils.clamp(-CLAMP, CLAMP, s.rotY + s.vel)
      s.vel *= 0.92
      s.rotY += (0 - s.rotY) * 0.025 // gentle snap toward centre
      apply()
      if (Math.abs(s.vel) > 0.05 || Math.abs(s.rotY) > 0.4) {
        s.raf = requestAnimationFrame(momentum)
      }
    }

    const down = (e) => {
      if (e.pointerType === 'touch' && e.cancelable) e.preventDefault()
      const s = state.current
      s.dragging = true
      s.lastX = e.clientX
      s.vel = 0
      cancelAnimationFrame(s.raf)
      stage.setPointerCapture?.(e.pointerId)
      if (!hintGone) setHintGone(true)
    }
    const move = (e) => {
      const s = state.current
      if (!s.dragging) return
      const dx = e.clientX - s.lastX
      s.lastX = e.clientX
      s.rotY = gsap.utils.clamp(-CLAMP, CLAMP, s.rotY + dx * 0.4)
      s.vel = dx * 0.4
      apply()
    }
    const up = () => {
      const s = state.current
      if (!s.dragging) return
      s.dragging = false
      s.raf = requestAnimationFrame(momentum)
    }

    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    
    const currentState = state.current
    return () => {
      cancelAnimationFrame(currentState.raf)
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [rm, hintGone])

  // Arrow controls (reduced-motion / keyboard / touch).
  const nudge = (dir) => {
    const s = state.current
    s.rotY = gsap.utils.clamp(-CLAMP, CLAMP, s.rotY + dir * 22)
    if (carRef.current) {
      carRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)'
      apply()
      setTimeout(() => carRef.current && (carRef.current.style.transition = ''), 650)
    }
    if (!hintGone) setHintGone(true)
  }

  useGSAP(
    () => {
      if (rm) return
      gsap.from(headRef.current.children, {
        autoAlpha: 0, y: 24, filter: 'blur(8px)', stagger: 0.1, duration: 1, ease: 'velox',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      })
      gsap.from(stageRef.current, {
        autoAlpha: 0, scale: 0.96, duration: 1.1, ease: 'velox',
        scrollTrigger: { trigger: stageRef.current, start: 'top 80%' },
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  return (
    <section ref={sectionRef} id="explore" className="explore-section relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div ref={headRef} className="mb-10 max-w-2xl md:mb-14">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-electric/60" />
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
              Explore
            </span>
          </div>
          <h2 className="font-serif italic text-chrome" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Rotate. Observe. Understand.
          </h2>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          data-cursor="drag"
          className="relative h-[52vh] w-full select-none overflow-hidden border border-white/5 md:h-[64vh]"
          style={{ perspective: '1400px', background: 'radial-gradient(ellipse at 50% 65%, #141519 0%, #0a0a0b 75%)', touchAction: 'pan-y' }}
        >
          {/* Layered CSS-3D car (stylized — swap for real 360 frames later) */}
          <div
            ref={carRef}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-16deg) rotateX(4deg)', translate: '-50% -50%' }}
          >
            {/* IMAGE: 360° render frames go here (reuse useFramePreloader, map drag → frame) */}
            {/* shadow pool — deepest layer */}
            <div className="absolute left-1/2 top-[58%] h-10 w-[420px] -translate-x-1/2 rounded-[50%]"
              style={{ transform: 'translateZ(-60px)', background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)' }} />
            {/* body */}
            <div className="relative h-[150px] w-[440px]"
              style={{ transform: 'translateZ(0px)' }}>
              <div className="absolute bottom-0 h-[78px] w-full rounded-[40px]"
                style={{ background: 'linear-gradient(135deg, #2a2d33 0%, #15171b 55%, #0c0c0e 100%)', boxShadow: 'inset 0 2px 14px rgba(255,255,255,0.06)' }} />
              {/* cabin */}
              <div className="absolute bottom-[52px] left-1/2 h-[64px] w-[230px] -translate-x-1/2 rounded-t-[60px] rounded-b-[20px]"
                style={{ background: 'linear-gradient(135deg, #1a1c22 0%, #0b0c10 100%)' }} />
              {/* rim light */}
              <div className="absolute bottom-[112px] left-1/2 h-px w-[200px] -translate-x-1/2"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.8), transparent)', filter: 'blur(0.5px)' }} />
              {/* headlight */}
              <div className="absolute bottom-[40px] right-2 h-2 w-12 rounded-full"
                style={{ background: '#bfe9ff', boxShadow: '0 0 16px #00D4FF', transform: 'translateZ(20px)' }} />
            </div>
            {/* wheels — front layer */}
            <div className="absolute bottom-[2px] left-[58px] h-[58px] w-[58px] rounded-full"
              style={{ transform: 'translateZ(40px)', background: 'radial-gradient(circle at 40% 40%, #2c2f35, #050506 70%)', boxShadow: '0 0 0 4px #0a0a0b' }} />
            <div className="absolute bottom-[2px] right-[58px] h-[58px] w-[58px] rounded-full"
              style={{ transform: 'translateZ(40px)', background: 'radial-gradient(circle at 40% 40%, #2c2f35, #050506 70%)', boxShadow: '0 0 0 4px #0a0a0b' }} />
          </div>

          {/* Hotspots */}
          {HOTSPOTS.map((h) => (
            <button
              key={h.label}
              type="button"
              data-cursor="hover"
              aria-label={`${h.label}: ${h.detail}`}
              className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon transition-all duration-300 ease-out hover:scale-110"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span className="relative block h-3 w-3 rounded-full bg-electric">
                <span className="absolute inset-0 animate-ping rounded-full bg-electric/60" />
              </span>
              {/* callout */}
              <span className="pointer-events-none absolute left-1/2 top-1/2 hidden w-max -translate-y-1/2 translate-x-4 group-hover:block group-focus-visible:block">
                <span className="block h-px w-8 bg-electric/60" />
                <span className="mt-[-1px] block border border-electric/30 bg-carbon/90 px-3 py-2 text-left backdrop-blur">
                  <span className="block font-accent text-micro uppercase tracking-macro text-electric">{h.label}</span>
                  <span className="mt-1 block font-mono text-micro text-chrome/80">{h.detail}</span>
                </span>
              </span>
            </button>
          ))}

          {/* Drag hint */}
          {!rm && (
            <div
              ref={hintRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-accent text-micro uppercase tracking-macro text-muted transition-opacity duration-500"
              style={{ opacity: hintGone ? 0 : 1 }}
            >
              ← Drag to rotate →
            </div>
          )}

          {/* Arrow controls (always present; the only control under reduced-motion) */}
          <div className="absolute bottom-5 right-5 flex gap-2">
            <button type="button" data-cursor="hover" aria-label="Rotate left" onClick={() => nudge(-1)}
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-chrome/70 transition-all duration-300 ease-out hover:scale-105 hover:border-electric hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon">
              ←
            </button>
            <button type="button" data-cursor="hover" aria-label="Rotate right" onClick={() => nudge(1)}
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-chrome/70 transition-all duration-300 ease-out hover:scale-105 hover:border-electric hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
