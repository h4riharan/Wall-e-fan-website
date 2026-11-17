import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Volume2, VolumeX } from 'lucide-react'
import { scrollToSection } from '../../hooks/useLenis'
import { useInteractionStore } from '../../store/useInteractionStore'
import { playClick } from '../../hooks/useSoundBus'

const LINKS: Array<{ id: string; label: string }> = [
  { id: 'movie', label: 'The Film' },
  { id: 'universe', label: 'Universe' },
  { id: 'characters', label: 'Characters' },
  { id: 'playground', label: 'Play' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'trivia', label: 'Trivia' },
]

/** Fixed top navigation: robot-eye logo, section links, sound toggle. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const soundEnabled = useInteractionStore((s) => s.soundEnabled)
  const toggleSound = useInteractionStore((s) => s.toggleSound)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    playClick()
    scrollToSection(id)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-500 ${
        scrolled ? 'glass-panel border-b border-cream/10' : 'border-b border-transparent'
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8"
        aria-label="Main navigation"
      >
        {/* Logo - a pair of binocular eyes */}
        <button
          onClick={() => go('hero')}
          className="group flex cursor-pointer items-center gap-3"
          aria-label="Back to top"
        >
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="grid h-7 w-9 place-items-center rounded-full border border-cream/20 bg-charcoal-raised transition-transform duration-300 group-hover:-translate-y-px">
              <span className="h-2.5 w-2.5 rounded-full bg-warmwhite transition-all duration-300 group-hover:translate-x-[3px]" />
            </span>
            <span className="grid h-7 w-9 place-items-center rounded-full border border-cream/20 bg-charcoal-raised transition-transform duration-300 group-hover:-translate-y-px">
              <span className="h-2.5 w-2.5 rounded-full bg-warmwhite transition-all duration-300 group-hover:-translate-x-[3px]" />
            </span>
          </span>
          <span className="font-mono text-[0.68rem] font-semibold tracking-[0.3em] text-cream/90 uppercase">
            WALL·E <span className="text-yellow-walle">/ Beyond</span>
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="cursor-pointer font-mono text-[0.66rem] tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-yellow-walle"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Sound toggle lives here too for reachability */}
          <button
            onClick={() => {
              toggleSound()
              playClick()
            }}
            aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            aria-pressed={soundEnabled}
            className="grid h-10 w-10 cursor-pointer place-items-center border border-cream/15 text-cream/70 transition-colors hover:border-yellow-walle hover:text-yellow-walle"
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-10 w-10 cursor-pointer place-items-center border border-cream/15 text-cream/80 transition-colors hover:border-yellow-walle hover:text-yellow-walle lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel overflow-hidden border-t border-cream/10 lg:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className="w-full cursor-pointer py-2.5 text-left font-mono text-[0.7rem] tracking-[0.24em] text-cream/75 uppercase transition-colors hover:text-yellow-walle"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
