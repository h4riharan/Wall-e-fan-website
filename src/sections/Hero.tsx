import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { RobotStage } from '../three/RobotStage'
import { MechaButton } from '../components/ui/MechaButton'
import { scrollToSection } from '../hooks/useLenis'
import { useInteractionStore } from '../store/useInteractionStore'
import { playSfx } from '../hooks/useSoundBus'

/* CSS dust motes - cheap, layered over the backdrop */
const DUST = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  top: `${20 + ((i * 37) % 70)}%`,
  size: 2 + (i % 3),
  delay: `${(i * 1.7) % 14}s`,
  duration: `${12 + (i % 5) * 3}s`,
}))

function DustMotes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {DUST.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cream/50"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animation: `dust ${d.duration} linear ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}

/** Cinematic hero: full-screen, robot right, editorial copy left. */
export function Hero() {
  const reduced = useReducedMotion()
  const setMood = useInteractionStore((s) => s.setMood)

  const meetWallE = () => {
    playSfx('greet')
    setMood('greet', "WALL·E? Hello! (Click his head, chest or treads too.)")
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden pt-24 pb-10"
      aria-label="Introduction"
    >
      {/* ---- cinematic backdrop ---- */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* hazy sky */}
        <div className="absolute inset-0 bg-[radial-gradient(140%_110%_at_70%_0%,#4a3a1c_0%,#241d12_45%,#17130d_100%)]" />
        {/* low sun glow */}
        <div className="absolute right-[8%] top-[16%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(240,179,16,0.28)_0%,rgba(226,113,42,0.12)_38%,transparent_70%)] blur-2xl" />
        {/* distant ruined skyline */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-70"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
        >
          <path
            d="M0 220 L0 150 60 150 60 120 90 120 90 160 150 160 150 100 170 100 170 90 185 90 185 130 240 130 240 155 320 155 320 110 360 110 360 95 380 95 380 135 470 135 470 158 560 158 560 105 600 105 600 88 618 88 618 128 700 128 700 152 820 152 820 118 850 118 850 100 866 100 866 140 960 140 960 160 1060 160 1060 112 1100 112 1100 96 1116 96 1116 132 1200 132 1200 155 1300 155 1300 125 1340 125 1340 108 1358 108 1358 145 1440 145 1440 220 Z"
            fill="#221b10"
          />
        </svg>
        <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-charcoal to-transparent" />
        <DustMotes />
      </div>

      {/* ---- content ---- */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* copy */}
        <div className="pt-6 lg:pt-0">
          <h1 className="text-editorial text-[2.6rem] leading-[0.95] text-warmwhite sm:text-6xl xl:text-7xl">
            {['EXPLORING A', 'WORLD WORTH', 'SAVING.'].map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={reduced ? false : { opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 2 ? (
                  <span className="text-yellow-walle">SAVING.</span>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-cream/70"
          >
            A little robot. A forgotten planet. An extraordinary story.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MechaButton onClick={meetWallE} ariaLabel="Greet the interactive WALL-E robot">
              Meet WALL·E
            </MechaButton>
            <MechaButton variant="outline" onClick={() => scrollToSection('universe')} ariaLabel="Scroll to explore the WALL-E universe">
              Explore His World
            </MechaButton>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-7 font-mono text-[0.62rem] tracking-[0.2em] text-cream/40 uppercase"
          >
            He responds to your cursor - try clicking his head, chest or treads
          </motion.p>
        </div>

        {/* robot */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[420px] sm:h-[500px] lg:h-[560px]"
        >
          <RobotStage className="h-full w-full" />
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.button
        onClick={() => scrollToSection('movie')}
        aria-label="Scroll down to the movie overview"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="relative z-10 mx-auto mt-4 flex cursor-pointer flex-col items-center gap-2 text-cream/50 transition-colors hover:text-yellow-walle"
      >
        <span className="text-label">Scroll</span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </motion.span>
      </motion.button>
    </section>
  )
}
