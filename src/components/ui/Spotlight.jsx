import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../../context/AppContext'
import { pointer, pointerEnabled } from '../../lib/pointer'

// A soft radial glow that follows the cursor across the dark sections — like a
// light grazing carbon fibre. Sits behind all content (atmosphere, not a
// flashlight). Electric on ACT 1–2, gold on ACT 3. Disabled on touch / RM.
export default function Spotlight() {
  const ref = useRef(null)
  const { currentAct } = useApp()

  useEffect(() => {
    if (!pointerEnabled || !ref.current) return
    const el = ref.current
    gsap.set(el, { xPercent: -50, yPercent: -50, x: pointer.x, y: pointer.y })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const update = () => {
      xTo(pointer.x)
      yTo(pointer.y)
    }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  // Re-tint to the act accent.
  useEffect(() => {
    if (!pointerEnabled || !ref.current) return
    const tint =
      currentAct === 3 ? 'rgba(201,169,110,0.16)' : 'rgba(0,212,255,0.14)'
    gsap.to(ref.current, {
      background: `radial-gradient(circle, ${tint} 0%, rgba(0,0,0,0) 60%)`,
      duration: 0.8,
      ease: 'velox',
    })
  }, [currentAct])

  if (!pointerEnabled) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0"
      style={{
        zIndex: -9,
        width: 680,
        height: 680,
        borderRadius: '50%',
        mixBlendMode: 'screen',
        background: 'radial-gradient(circle, rgba(0,212,255,0.14) 0%, rgba(0,0,0,0) 60%)',
      }}
    />
  )
}
