import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../../context/AppContext'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

export default function Toast() {
  const { toast, hideToast, currentAct } = useApp()
  const toastRef = useRef(null)
  const progressRef = useRef(null)
  const timelineRef = useRef(null)

  // Decide the accent color based on act. ACT 3 uses gold, otherwise electric.
  // Values mirror the `gold` / `electric` tokens in tailwind.config.js.
  const accentColor = currentAct === 3 ? '#D4AF37' : '#00D2FF'
  const accentBgColor = currentAct === 3 ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 210, 255, 0.1)'

  useEffect(() => {
    if (toast.isVisible) {
      // Clear previous timeline if it exists
      if (timelineRef.current) {
        timelineRef.current.kill()
      }

      // Reduced motion: show the toast instantly and auto-dismiss after a
      // beat, with no slide / scale / countdown animation.
      if (prefersReducedMotion) {
        gsap.set(toastRef.current, { y: 0, autoAlpha: 1, scale: 1 })
        gsap.set(progressRef.current, { scaleX: 1 })
        timelineRef.current = gsap.delayedCall(3, hideToast)
        return () => {
          if (timelineRef.current) timelineRef.current.kill()
        }
      }

      // Initial state
      gsap.set(toastRef.current, { y: 100, autoAlpha: 0, scale: 0.9 })
      gsap.set(progressRef.current, { scaleX: 1 })

      // Create new timeline
      const tl = gsap.timeline({
        onComplete: hideToast
      })

      // Animate in
      tl.to(toastRef.current, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power4.out',
      })

      // Animate progress bar shrinking (this dictates the display time, e.g., 3s)
      tl.to(progressRef.current, {
        scaleX: 0,
        duration: 3,
        ease: 'none',
      }, '-=0.2')

      // Animate out
      tl.to(toastRef.current, {
        y: 50,
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.5,
        ease: 'power3.in',
      })

      timelineRef.current = tl
    } else if (toastRef.current && gsap.getProperty(toastRef.current, "opacity") > 0) {
       // If it was already active, ensure we transition out elegantly.
       if (timelineRef.current) {
         timelineRef.current.kill()
       }
       if (prefersReducedMotion) {
         gsap.set(toastRef.current, { autoAlpha: 0 })
       } else {
         gsap.to(toastRef.current, {
             y: 50,
             autoAlpha: 0,
             scale: 0.95,
             duration: 0.3,
             ease: 'power3.in'
         })
       }
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [toast.isVisible, toast.message, hideToast])

  // Prevent interactions from hiding when hovering? Optional.

  return (
    <div
      ref={toastRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-8 left-1/2 z-[10000] flex -translate-x-1/2 flex-col overflow-hidden border backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.85)',
        borderColor: accentColor,
        boxShadow: `0 10px 40px -10px ${accentBgColor}`,
        opacity: 0,
        visibility: 'hidden',
        minWidth: '280px',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Animated checkmark or generic dot */}
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
          <span className="font-accent text-sm font-medium uppercase tracking-widest text-chrome">
            {toast.message}
          </span>
        </div>

        {/* Optional close button */}
        <button
          onClick={hideToast}
          className="ml-6 text-muted transition-all hover:text-white hover:scale-110 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-carbon rounded-sm"
          aria-label="Close notification"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-0.5 w-full origin-left"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  )
}
