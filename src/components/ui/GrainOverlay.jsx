// Site-wide film grain + cinematic vignette. Grain is animated (grainShift
// keyframes in index.css) for a living-film feel; vignette darkens the frame
// edges to draw the eye inward. Both are purely decorative overlays.
export default function GrainOverlay() {
  return (
    <>
      <div aria-hidden="true" className="grain-overlay" />
      <div aria-hidden="true" className="vignette-overlay" />
    </>
  )
}
