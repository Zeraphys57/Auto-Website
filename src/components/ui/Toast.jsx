import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../../context/AppContext'
import { prefersReducedMotion } from '../../lib/prefersReducedMotion'

export default function Toast() {
  const { toasts, removeToast } = useApp()
  const containerRef = useRef(null)

  // Animate newly added toasts
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || toasts.length === 0) return

    const toastEls = containerRef.current.children
    const latestToast = toastEls[toastEls.length - 1]

    // Only animate if it hasn't been animated yet (we can check inline styles)
    if (!latestToast.style.opacity) {
      gsap.fromTo(
        latestToast,
        { autoAlpha: 0, y: 20, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
      )
    }
  }, [toasts])

  // Listen for the custom event to trigger exit animations
  useEffect(() => {
    const handleDismiss = (e) => {
      const { id } = e.detail
      const el = document.getElementById(`toast-${id}`)
      if (el) {
        gsap.to(el, {
          autoAlpha: 0,
          y: -10,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => removeToast(id)
        })
      } else {
        removeToast(id)
      }
    }

    window.addEventListener('dismiss-toast', handleDismiss)
    return () => window.removeEventListener('dismiss-toast', handleDismiss)
  }, [removeToast])

  if (toasts.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto flex items-center justify-between gap-4 px-6 py-4 bg-carbon2/90 backdrop-blur-md border border-white/10 text-chrome font-sans text-sm tracking-wide shadow-2xl rounded-sm"
          style={{ minWidth: '300px' }}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'error' && (
              <span className="w-2 h-2 rounded-full bg-crimson" />
            )}
            {toast.type === 'success' && (
              <span className="w-2 h-2 rounded-full bg-electric" />
            )}
            {toast.type === 'info' && (
              <span className="w-2 h-2 rounded-full bg-gold" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('dismiss-toast', { detail: { id: toast.id } }))
            }}
            className="text-muted hover:text-chrome transition-colors font-accent text-xs uppercase tracking-widest"
          >
            Close
          </button>
        </div>
      ))}
    </div>
  )
}
