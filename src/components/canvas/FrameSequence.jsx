import { useCallback, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../../context/AppContext'
import { useFramePreloader } from '../../hooks/useFramePreloader'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

// Generate real frames when a hero video exists:
//   ffmpeg -i input.mp4 -vf "fps=24,scale=1920:-1" -quality 85 public/frames/frame_%04d.webp
//
// With no frames present (the default), a cinematic placeholder is drawn — a
// car silhouette emerging from darkness, scrubbed by the hero ScrollTrigger.

const DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1

export default function FrameSequence({
  frameCount = 120,
  basePath = '/frames',
  trigger = '.hero-section',
}) {
  const canvasRef = useRef(null)
  const currentFrame = useRef(0)
  const { frames, ready } = useFramePreloader(frameCount, basePath)
  const { setFramesReady } = useApp()

  // Cinematic placeholder: a low, wide car form lit by an electric rim.
  const drawPlaceholder = useCallback((progress) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const reveal = Math.min(1, Math.max(0, (progress - 0.05) / 0.7))

    // Base
    ctx.fillStyle = '#070708'
    ctx.fillRect(0, 0, w, h)

    const cx = w * 0.5
    const groundY = h * 0.66

    // Garage spotlight pooling on the floor
    const pool = ctx.createRadialGradient(cx, groundY, 0, cx, groundY, w * 0.6)
    pool.addColorStop(0, `rgba(30,40,48,${0.18 + reveal * 0.22})`)
    pool.addColorStop(1, 'rgba(7,7,8,0)')
    ctx.fillStyle = pool
    ctx.fillRect(0, 0, w, h)

    // Car silhouette (sleek, low) — a form catching light
    const bodyW = w * 0.62
    const bodyH = h * 0.2
    const left = cx - bodyW / 2
    const right = cx + bodyW / 2
    const roofY = groundY - bodyH

    ctx.beginPath()
    ctx.moveTo(left, groundY)
    ctx.bezierCurveTo(left + bodyW * 0.06, roofY + bodyH * 0.35, left + bodyW * 0.24, roofY, cx - bodyW * 0.04, roofY - bodyH * 0.06)
    ctx.bezierCurveTo(cx + bodyW * 0.16, roofY - bodyH * 0.05, right - bodyW * 0.18, roofY + bodyH * 0.2, right - bodyW * 0.02, groundY - bodyH * 0.35)
    ctx.lineTo(right, groundY)
    ctx.closePath()

    const bodyGrad = ctx.createLinearGradient(0, roofY, 0, groundY)
    bodyGrad.addColorStop(0, '#16181c')
    bodyGrad.addColorStop(1, '#0a0a0b')
    ctx.fillStyle = bodyGrad
    ctx.fill()

    // Electric rim light tracing the roofline
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(left + bodyW * 0.06, roofY + bodyH * 0.35)
    ctx.bezierCurveTo(left + bodyW * 0.24, roofY, cx - bodyW * 0.04, roofY - bodyH * 0.06, cx + bodyW * 0.16, roofY - bodyH * 0.05)
    ctx.bezierCurveTo(right - bodyW * 0.18, roofY + bodyH * 0.2, right - bodyW * 0.02, groundY - bodyH * 0.35, right, groundY)
    const rim = ctx.createLinearGradient(left, 0, right, 0)
    rim.addColorStop(0, 'rgba(0,212,255,0)')
    rim.addColorStop(0.5, `rgba(0,212,255,${reveal * 0.9})`)
    rim.addColorStop(1, 'rgba(0,212,255,0)')
    ctx.strokeStyle = rim
    ctx.lineWidth = Math.max(1.5, h * 0.0025)
    ctx.shadowColor = `rgba(0,212,255,${reveal * 0.6})`
    ctx.shadowBlur = 24 * reveal
    ctx.stroke()
    ctx.restore()

    // Headlight slashes emerging late
    const hl = Math.max(0, (reveal - 0.4) / 0.6)
    if (hl > 0) {
      ctx.save()
      ctx.fillStyle = `rgba(180,235,255,${hl * 0.85})`
      ctx.shadowColor = `rgba(0,212,255,${hl})`
      ctx.shadowBlur = 30 * hl
      const lhX = right - bodyW * 0.12
      const lhY = groundY - bodyH * 0.42
      ctx.fillRect(lhX, lhY, bodyW * 0.1, Math.max(2, h * 0.004))
      ctx.restore()
    }

    // Ground reflection
    const refl = ctx.createLinearGradient(0, groundY, 0, h)
    refl.addColorStop(0, `rgba(0,212,255,${reveal * 0.14})`)
    refl.addColorStop(1, 'rgba(0,212,255,0)')
    ctx.fillStyle = refl
    ctx.fillRect(left, groundY, bodyW, h - groundY)

    // Vignette
    const vig = ctx.createRadialGradient(cx, h * 0.5, h * 0.2, cx, h * 0.5, h * 0.85)
    vig.addColorStop(0, 'rgba(7,7,8,0)')
    vig.addColorStop(1, 'rgba(7,7,8,0.85)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, w, h)
  }, [])

  const drawFrame = useCallback(
    (index) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const img = frames.current[index]
      if (img) {
        const w = canvas.width
        const h = canvas.height
        const ir = img.width / img.height
        const cr = w / h
        let dw, dh, dx, dy
        if (cr > ir) {
          dw = w
          dh = w / ir
          dx = 0
          dy = (h - dh) / 2
        } else {
          dh = h
          dw = h * ir
          dx = (w - dw) / 2
          dy = 0
        }
        ctx.fillStyle = '#070708'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, dx, dy, dw, dh)
      } else {
        drawPlaceholder(index / Math.max(1, frameCount - 1))
      }
    },
    [frames, frameCount, drawPlaceholder]
  )

  useEffect(() => {
    if (ready) setFramesReady(true)
  }, [ready, setFramesReady])

  // Size the canvas to the viewport (device-pixel sharp) and redraw.
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = Math.floor(window.innerWidth * DPR)
      canvas.height = Math.floor(window.innerHeight * DPR)
      drawFrame(currentFrame.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  // Scrub the sequence across the pinned hero. Reduced motion → static frame.
  useGSAP(
    () => {
      if (prefersReducedMotion) {
        currentFrame.current = Math.round(0.62 * (frameCount - 1))
        drawFrame(currentFrame.current)
        return
      }
      ScrollTrigger.create({
        trigger,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (frameCount - 1))
          if (index !== currentFrame.current) {
            currentFrame.current = index
            drawFrame(index)
          }
        },
      })
    },
    { dependencies: [ready, drawFrame, trigger, frameCount] }
  )

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
