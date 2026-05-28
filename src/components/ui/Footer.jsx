import { lenis } from '../../main.jsx'

const NAV = [
  { label: 'Model', target: '#models' },
  { label: 'Spesifikasi', target: '#specs' },
  { label: 'Warisan', target: '#legacy' },
  { label: 'Kontak', target: '#cta' },
  { label: 'Test Drive', target: '#cta' },
]

const SOCIAL = [
  {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s-.01 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.9.07s-3.6-.01-4.86-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52.01-4.76.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.21 8.48 3.2 8.85 3.2 12s.01 3.52.06 4.76c.04.9.2 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.39-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.2-1.39-.32-1.71a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.52 4.01 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 12 16.94 4.94 4.94 0 0 1 12 7.06Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.13-3.27a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z',
  },
  {
    label: 'YouTube',
    path: 'M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z',
  },
  {
    label: 'WhatsApp',
    path: 'M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.4A9.9 9.9 0 1 0 12 2Zm0 1.8a8.1 8.1 0 0 1 6.9 12.4l-.2.3.8 2.9-3-.8-.3.2A8.1 8.1 0 1 1 12 3.8Zm-3.4 4c-.2 0-.5.06-.7.3-.2.24-.9.86-.9 2.1s.92 2.43 1.05 2.6c.13.17 1.8 2.86 4.46 3.9 2.2.86 2.65.7 3.13.66.48-.04 1.55-.63 1.77-1.25.22-.62.22-1.15.16-1.25-.07-.1-.24-.16-.5-.28-.26-.13-1.55-.77-1.79-.85-.24-.09-.41-.13-.59.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.3-.78-.69-1.3-1.55-1.45-1.81-.15-.26-.02-.4.11-.53.12-.12.26-.3.4-.46.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.06-.13-.58-1.42-.8-1.94-.2-.5-.42-.44-.58-.44h-.5Z',
  },
]

export default function Footer() {
  const handleNav = (e, target) => {
    e.preventDefault()
    const el = document.querySelector(target)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.4 })
    else el.scrollIntoView()
  }

  return (
    <footer className="relative" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
        <div className="flex flex-col justify-between gap-12 border-t border-gold/20 pt-12 md:flex-row">
          {/* Wordmark */}
          <div>
            <div className="font-display text-3xl tracking-[0.1em] text-gold">VELOX</div>
            <p className="mt-3 max-w-xs font-serif text-sm italic text-chrome/40">
              Kecepatan yang sempurna.
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-16">
            <ul className="space-y-3">
              {NAV.slice(0, 3).map((l) => (
                <li key={l.label}>
                  <a
                    href={l.target}
                    onClick={(e) => handleNav(e, l.target)}
                    data-cursor="hover"
                    className="font-accent text-[0.72rem] font-extralight uppercase tracking-[0.2em] text-chrome/60 transition-colors duration-300 hover:text-gold"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {NAV.slice(3).map((l) => (
                <li key={l.label}>
                  <a
                    href={l.target}
                    onClick={(e) => handleNav(e, l.target)}
                    data-cursor="hover"
                    className="font-accent text-[0.72rem] font-extralight uppercase tracking-[0.2em] text-chrome/60 transition-colors duration-300 hover:text-gold"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="flex items-start gap-5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href="#cta"
                onClick={(e) => handleNav(e, '#cta')}
                aria-label={s.label}
                data-cursor="hover"
                className="text-chrome/60 transition-colors duration-300 hover:text-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 font-accent text-[0.62rem] font-extralight uppercase tracking-[0.2em] text-muted sm:flex-row">
          <span>© 2026 VELOX AUTO. All rights reserved.</span>
          <span>Jakarta · Bali</span>
        </div>
      </div>
    </footer>
  )
}
