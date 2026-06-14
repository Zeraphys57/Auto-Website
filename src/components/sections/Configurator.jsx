import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useIntersectionPause } from '../../hooks/useIntersectionPause'
import { useMagnetic } from '../../hooks/useMagnetic'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'
import { useApp } from '../../context/AppContext'

// Lazy — keeps drei / the configurator scene out of the initial bundle.
const ConfiguratorCar = lazy(() => import('../canvas/ConfiguratorCar'))

const PAINTS = [
  { name: 'Nero Assoluto',   hex: '#0A0A0C' },
  { name: 'Bianco Avus',     hex: '#F2F3F4' },
  { name: 'Rosso Scuderia',  hex: '#C8102E' },
  { name: 'Azzurro Dino',    hex: '#00548F' },
  { name: 'Verde Pino',      hex: '#0F2C23' },
  { name: 'Grigio Scuro',    hex: '#3E424B' },
]
const WHEELS = [
  { name: 'Sport',       add: 0 },
  { name: 'Performance', add: 0.12 },
  { name: 'Carbon',      add: 0.28 },
]
const VARIANTS = [
  { code: 'GT', name: 'VELOX GT', accel: 3.2, hp: 580, top: 320, base: 7.4 },
  { code: 'RS', name: 'VELOX RS', accel: 2.8, hp: 720, top: 340, base: 9.1 },
  { code: 'S',  name: 'VELOX S',  accel: 3.0, hp: 620, top: 330, base: 8.2 },
]
const INTERIORS = [
  { name: 'Nero Alcantara', add: 0 },
  { name: 'Cognac Nappa',   add: 0.15 },
  { name: 'Rosso Nappa',    add: 0.15 },
]

const hexToRgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}
const fmtBillion = (v) => `$${(v * 100).toFixed(0)},000`

export default function Configurator() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const stageRef = useRef(null)
  const glowRef = useRef(null)
  const panelRef = useRef(null)

  const accelRef = useRef(null)
  const hpRef = useRef(null)
  const topRef = useRef(null)
  const priceRef = useRef(null)

  const { showToast } = useApp()
  const prev = useRef({ accel: 3.2, hp: 580, top: 320, price: 7.4 })

  const [paint, setPaint] = useState(0)
  const [wheel, setWheel] = useState(2)
  const [variant, setVariant] = useState(1)
  const [interior, setInterior] = useState(0)

  const saveBtn = useMagnetic(0.4)
  const meetBtn = useMagnetic(0.4)

  const [carRef, carActive] = useIntersectionPause()
  const rm = prefersReducedMotion

  const total = VARIANTS[variant].base + WHEELS[wheel].add + INTERIORS[interior].add

  // Roll a numeric readout from its previous value to the next.
  const roll = (el, from, to, fmt) => {
    if (!el) return
    if (rm) { el.textContent = fmt(to); return }
    const o = { v: from }
    gsap.to(o, { v: to, duration: 0.7, ease: 'velox', onUpdate: () => (el.textContent = fmt(to === from ? to : o.v)) })
  }

  // Variant drives the performance numbers.
  useEffect(() => {
    const v = VARIANTS[variant]
    roll(accelRef.current, prev.current.accel, v.accel, (x) => x.toFixed(1).replace('.', ',') + ' SEC')
    roll(hpRef.current, prev.current.hp, v.hp, (x) => Math.round(x) + ' HP')
    roll(topRef.current, prev.current.top, v.top, (x) => Math.round(x) + ' KM/H')
    prev.current.accel = v.accel
    prev.current.hp = v.hp
    prev.current.top = v.top
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  // Any choice can change the running total.
  useEffect(() => {
    roll(priceRef.current, prev.current.price, total, fmtBillion)
    prev.current.price = total
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, wheel, interior])

  // Selecting a paint shifts the ambient glow to match.
  useEffect(() => {
    if (!glowRef.current) return
    const tint = hexToRgba(PAINTS[paint].hex, 0.22)
    if (rm) {
      glowRef.current.style.background = `radial-gradient(circle at 50% 55%, ${tint} 0%, transparent 60%)`
      return
    }
    gsap.to(glowRef.current, {
      background: `radial-gradient(circle at 50% 55%, ${tint} 0%, rgba(0,0,0,0) 60%)`,
      duration: 0.8,
      ease: 'velox',
    })
  }, [paint, rm])

  // Entrance.
  useGSAP(
    () => {
      if (rm) return
      gsap.from(headRef.current.children, {
        autoAlpha: 0, y: 26, filter: 'blur(8px)', stagger: 0.1, duration: 1, ease: 'velox',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      })
      gsap.from([stageRef.current, panelRef.current], {
        autoAlpha: 0, y: 40, duration: 1.1, ease: 'velox', stagger: 0.12,
        scrollTrigger: { trigger: stageRef.current, start: 'top 80%' },
      })
    },
    { scope: sectionRef, dependencies: [rm] }
  )

  const v = VARIANTS[variant]

  return (
    <section
      ref={sectionRef}
      id="configurator"
      className="configurator-section relative overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        {/* Header */}
        <div ref={headRef} className="mb-12 max-w-2xl md:mb-16">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-electric/60" />
            <span className="font-accent text-micro font-extralight uppercase tracking-macro text-muted">
              Configurator
            </span>
          </div>
          <h2 className="font-display text-chrome" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 0.95 }}>
            BUILD YOUR VELOX
          </h2>
          <p className="mt-4 font-serif text-lg italic text-chrome/60">
            Every detail is your decision. See it change instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* Car stage */}
          <div
            ref={stageRef}
            data-cursor="hover"
            className="relative min-h-[44vh] overflow-hidden border border-white/5 lg:min-h-[62vh]"
            style={{ background: 'radial-gradient(ellipse at 50% 70%, #15161a 0%, #0a0a0b 75%)' }}
          >
            <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />

            {rm ? (
              // Reduced-motion fallback — a tinted panel that recolors with paint.
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-[40%] w-[70%] rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${PAINTS[paint].hex} 0%, #0a0a0b 120%)`,
                    boxShadow: `0 30px 80px -20px ${hexToRgba(PAINTS[paint].hex, 0.5)}`,
                  }}
                />
                {/* IMAGE: render mobil — {VARIANTS[variant].name} / {PAINTS[paint].name} */}
              </div>
            ) : (
              <div ref={carRef} className="absolute inset-0">
                <Suspense fallback={<ConfiguratorFallback />}>
                  <ConfiguratorCar
                    paintHex={PAINTS[paint].hex}
                    wheelIdx={wheel}
                    hasWing={variant === 1}
                    active={carActive}
                  />
                </Suspense>
              </div>
            )}

            {/* Stage label */}
            <div className="pointer-events-none absolute bottom-5 left-6 font-mono text-micro uppercase tracking-macro text-muted">
              {v.name} · {PAINTS[paint].name}
            </div>
          </div>

          {/* Control panel + spec sheet */}
          <div ref={panelRef}>
            {/* VARIANT */}
            <ControlGroup label="Variant">
              <div className="flex gap-2">
                {VARIANTS.map((vr, i) => (
                  <button
                    key={vr.code}
                    type="button"
                    data-cursor="hover"
                    aria-pressed={variant === i}
                    onClick={() => setVariant(i)}
                    className={`flex-1 border px-4 py-3 font-display text-xl tracking-wide transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon ${
                      variant === i
                        ? 'border-electric bg-electric/10 text-chrome'
                        : 'border-white/10 text-muted hover:border-white/30 hover:text-chrome'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                  >
                    {vr.code}
                  </button>
                ))}
              </div>
            </ControlGroup>

            {/* PAINT */}
            <ControlGroup label={`Paint — ${PAINTS[paint].name}`}>
              <div className="flex flex-wrap gap-3">
                {PAINTS.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    data-cursor="hover"
                    aria-label={`Paint ${p.name}`}
                    aria-pressed={paint === i}
                    onClick={() => setPaint(i)}
                    className="relative h-9 w-9 rounded-full transition-transform duration-300 hover:scale-110 outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
                    style={{
                      background: p.hex,
                      boxShadow:
                        paint === i
                          ? `0 0 0 2px #0a0a0a, 0 0 0 3px ${p.hex}, 0 0 18px ${hexToRgba(p.hex, 0.6)}`
                          : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
                      transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                ))}
              </div>
            </ControlGroup>

            {/* WHEELS */}
            <ControlGroup label="Wheels">
              <div className="flex gap-2">
                {WHEELS.map((w, i) => (
                  <button
                    key={w.name}
                    type="button"
                    data-cursor="hover"
                    aria-pressed={wheel === i}
                    onClick={() => setWheel(i)}
                    className={`flex-1 border px-3 py-2.5 font-accent text-caption uppercase tracking-wide-caps transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon ${
                      wheel === i
                        ? 'border-electric bg-electric/10 text-chrome'
                        : 'border-white/10 text-muted hover:border-white/30 hover:text-chrome'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            </ControlGroup>

            {/* INTERIOR */}
            <ControlGroup label="Interior">
              <div className="flex gap-2">
                {INTERIORS.map((it, i) => (
                  <button
                    key={it.name}
                    type="button"
                    data-cursor="hover"
                    aria-pressed={interior === i}
                    onClick={() => setInterior(i)}
                    className={`flex-1 border px-3 py-2.5 font-accent text-micro uppercase tracking-wide-caps transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-carbon ${
                      interior === i
                        ? 'border-gold bg-gold/10 text-chrome'
                        : 'border-white/10 text-muted hover:border-white/30 hover:text-chrome'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                  >
                    {it.name}
                  </button>
                ))}
              </div>
            </ControlGroup>

            {/* SPEC SHEET */}
            <div className="mt-8 border-t border-white/10 pt-6 font-mono text-caption tracking-[0.04em]">
              <SpecLine k="MODEL"     v={v.name} />
              <SpecLine k="PAINT"     v={PAINTS[paint].name} />
              <SpecLine k="WHEELS"      v={WHEELS[wheel].name} />
              <SpecLine k="INTERIOR"  v={INTERIORS[interior].name} />
              <SpecLine k="0–100"     refEl={accelRef} fallback="2.8 SEC" />
              <SpecLine k="TENAGA"    refEl={hpRef} fallback="720 HP" />
              <SpecLine k="TOP SPEED" refEl={topRef} fallback="340 KM/H" />
              <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
                <span className="text-muted">TOTAL</span>
                <span ref={priceRef} className="font-display text-2xl tracking-wide text-electric">
                  {fmtBillion(total)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                ref={saveBtn}
                href="#cta"
                onClick={() => {
                  // We let the default routing happen, but trigger the toast as well
                  showToast('Configuration saved successfully');
                }}
                data-cursor="cta"
                className="bg-electric px-7 py-3.5 transition-transform duration-300 hover:scale-[1.02] outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
              >
                <span className="font-accent text-caption font-medium uppercase tracking-macro text-carbon">
                  Save Configuration
                </span>
              </a>
              <a ref={meetBtn} href="#experience" data-cursor="hover" className="border border-gold/40 px-7 py-3.5 transition-transform duration-300 hover:scale-[1.02] outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-carbon">
                <span className="font-accent text-caption font-light uppercase tracking-macro text-offwhite">
                  Schedule a Meeting
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ControlGroup({ label, children }) {
  return (
    <div className="mb-7">
      <div className="mb-3 font-accent text-micro font-extralight uppercase tracking-macro text-muted">
        {label}
      </div>
      {children}
    </div>
  )
}

function SpecLine({ k, v, refEl, fallback }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2">
      <span className="text-muted">{k}</span>
      {refEl ? (
        <span ref={refEl} className="text-chrome">{fallback}</span>
      ) : (
        <span className="text-chrome">{v}</span>
      )}
    </div>
  )
}

function ConfiguratorFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-4 h-5 w-5 animate-spin rounded-full border-2 border-electric border-t-transparent" />
        <div className="font-accent text-micro uppercase tracking-macro text-muted">
          Preparing 3D Engine...
        </div>
      </div>
    </div>
  )
}
