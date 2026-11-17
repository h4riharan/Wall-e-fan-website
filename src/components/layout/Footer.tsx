import { ArrowUp, Volume2, VolumeX } from 'lucide-react'
import { scrollToSection } from '../../hooks/useLenis'
import { useInteractionStore } from '../../store/useInteractionStore'
import { playClick } from '../../hooks/useSoundBus'

/** Footer: project credits, disclaimer, sound toggle, back-to-top. */
export function Footer() {
  const soundEnabled = useInteractionStore((s) => s.soundEnabled)
  const toggleSound = useInteractionStore((s) => s.toggleSound)

  return (
    <footer className="relative border-t border-cream/10 bg-charcoal-soft">
      {/* hazard stripe top edge */}
      <div className="hazard-stripes h-2 w-full opacity-80" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <p className="text-editorial text-2xl text-cream">
              WALL·E <span className="text-yellow-walle">- Beyond the Screen</span>
            </p>
          </div>

          {/* Credits */}
          <div>
            <p className="text-label mb-4 text-yellow-walle">Project Credits</p>
            <ul className="space-y-2 text-sm text-cream/60">
              <li>Indhu &amp; Team</li>
            </ul>
          </div>

          {/* Controls */}
          <div>
            <p className="text-label mb-4 text-yellow-walle">Controls</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  toggleSound()
                  playClick()
                }}
                aria-pressed={soundEnabled}
                className="inline-flex w-fit cursor-pointer items-center gap-3 border border-cream/15 px-4 py-2.5 font-mono text-[0.66rem] tracking-[0.2em] text-cream/70 uppercase transition-colors hover:border-yellow-walle hover:text-yellow-walle"
              >
                {soundEnabled ? <Volume2 size={15} aria-hidden="true" /> : <VolumeX size={15} aria-hidden="true" />}
                Sound {soundEnabled ? 'on' : 'off'}
              </button>
              <button
                onClick={() => {
                  playClick()
                  scrollToSection('hero')
                }}
                className="inline-flex w-fit cursor-pointer items-center gap-3 border border-cream/15 px-4 py-2.5 font-mono text-[0.66rem] tracking-[0.2em] text-cream/70 uppercase transition-colors hover:border-yellow-walle hover:text-yellow-walle"
              >
                <ArrowUp size={15} aria-hidden="true" /> Back to top
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-6">
          <p className="font-mono text-[0.6rem] tracking-[0.25em] text-cream/35 uppercase">
            © 2026 · Indhu & Team · Made with curiosity
          </p>
        </div>
      </div>
    </footer>
  )
}
