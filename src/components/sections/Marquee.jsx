const ROW1 =
  'UNYIELDING POWER · AERODYNAMIC SUPREMACY · CARBON FIBRE SCULPTURE · APEX ENGINEERING · '.repeat(3)
const ROW2 =
  'UNCOMPROMISING · AGGRESSIVE · ELEGANT · FUTURISTIC · '.repeat(4)

export default function Marquee() {
  return (
    <section className="marquee-section relative flex min-h-[55vh] flex-col justify-center gap-8 overflow-hidden border-y border-electric/20 py-16">
      {/* Row 1 — drifts left, large condensed */}
      <div className="marquee-row flex w-full select-none overflow-hidden">
        <div className="animate-marquee-left flex shrink-0 flex-nowrap">
          <span className="whitespace-nowrap font-display text-fluid-h1 leading-none tracking-[0.06em] text-chrome/10 transition-colors duration-500 hover:text-chrome/30">
            {ROW1}
          </span>
          <span
            aria-hidden="true"
            className="whitespace-nowrap font-display text-fluid-h1 leading-none tracking-[0.06em] text-chrome/10 transition-colors duration-500 hover:text-chrome/30"
          >
            {ROW1}
          </span>
        </div>
      </div>

      {/* Row 2 — drifts right, fine spaced accent */}
      <div className="marquee-row flex w-full select-none overflow-hidden">
        <div className="animate-marquee-right flex shrink-0 flex-nowrap">
          <span className="whitespace-nowrap font-accent text-caption font-light uppercase tracking-[0.3em] text-electric/30 transition-colors duration-500 hover:text-electric/60">
            {ROW2}
          </span>
          <span
            aria-hidden="true"
            className="whitespace-nowrap font-accent text-caption font-light uppercase tracking-[0.3em] text-electric/30 transition-colors duration-500 hover:text-electric/60"
          >
            {ROW2}
          </span>
        </div>
      </div>
    </section>
  )
}
