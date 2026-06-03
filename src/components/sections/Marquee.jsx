const ROW1 =
  'KECEPATAN · PRESISI · INOVASI · PERFORMA · TEKNOLOGI · DESAIN · '.repeat(3)
const ROW2 =
  'PERFORMANCE · PRECISION · INNOVATION · ENGINEERING · '.repeat(4)

export default function Marquee() {
  return (
    <section className="marquee-section relative flex min-h-[55vh] flex-col justify-center gap-8 overflow-hidden border-y border-electric/20 py-16">
      {/* Row 1 — drifts left, large condensed */}
      <div className="marquee-row flex w-full select-none overflow-hidden">
        <div className="animate-marquee-left flex shrink-0 flex-nowrap">
          <span className="whitespace-nowrap font-display text-fluid-h1 leading-none tracking-[0.04em] text-chrome/20">
            {ROW1}
          </span>
          <span
            aria-hidden="true"
            className="whitespace-nowrap font-display text-fluid-h1 leading-none tracking-[0.04em] text-chrome/20"
          >
            {ROW1}
          </span>
        </div>
      </div>

      {/* Row 2 — drifts right, fine spaced accent */}
      <div className="marquee-row flex w-full select-none overflow-hidden">
        <div className="animate-marquee-right flex shrink-0 flex-nowrap">
          <span className="whitespace-nowrap font-accent text-caption font-extralight uppercase tracking-macro text-electric/40">
            {ROW2}
          </span>
          <span
            aria-hidden="true"
            className="whitespace-nowrap font-accent text-caption font-extralight uppercase tracking-macro text-electric/40"
          >
            {ROW2}
          </span>
        </div>
      </div>
    </section>
  )
}
