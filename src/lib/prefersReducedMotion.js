// Single source of truth for the user's motion preference.
// This module imports nothing, so it can be read safely from anywhere
// (including main.jsx) without circular-dependency or eval-order issues.
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
