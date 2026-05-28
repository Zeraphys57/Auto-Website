// Site-wide film grain. Masks softness from the upscaled hero frames and adds
// texture to the flat dark backgrounds. Pure CSS/SVG noise — no asset weight.
export default function GrainOverlay() {
  return <div aria-hidden="true" className="grain-overlay" />
}
