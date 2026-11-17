import { useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import { Wrench, Cpu, BatteryCharging, Radio, Camera, Gamepad2, Zap, MoveHorizontal, CircuitBoard, Quote } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ENGINEERING_PARTS } from '../data/engineering'
import type { EngineeringPart } from '../data/types'

/* ------------------------------------------------------------------ */
/* Original interactive SVG diagram per part                           */
/* ------------------------------------------------------------------ */

function PartDiagram({ icon, active }: { icon: string; active: boolean }) {
  const accent = active ? '#f0b310' : '#8a7a4a'
  const pulse = active ? <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" /> : null

  const inner = () => {
    switch (icon) {
      case 'tracks':
        return (
          <g>
            <circle cx="60" cy="90" r="34" fill="none" stroke={accent} strokeWidth="10" strokeDasharray="10 7" />
            <circle cx="140" cy="90" r="34" fill="none" stroke={accent} strokeWidth="10" strokeDasharray="10 7" />
            <rect x="60" y="82" width="80" height="16" fill={accent} opacity="0.3" />
            <circle cx="60" cy="90" r="12" fill="#464035" stroke={accent} strokeWidth="3" />
            <circle cx="140" cy="90" r="12" fill="#464035" stroke={accent} strokeWidth="3" />
            <rect x="90" y="20" width="70" height="40" rx="8" fill="#e7ae0c" opacity="0.9" />
            {pulse && <rect x="90" y="20" width="70" height="40" rx="8" fill="#f7cf5e" opacity="0.25">{pulse}</rect>}
          </g>
        )
      case 'motor':
        return (
          <g>
            <rect x="70" y="55" width="60" height="70" rx="10" fill="#464035" stroke={accent} strokeWidth="3" />
            <rect x="85" y="35" width="30" height="22" rx="4" fill="#2b2720" stroke={accent} strokeWidth="2" />
            <g style={{ transformOrigin: '130px 90px' }}>
              <rect x="126" y="84" width="55" height="12" rx="6" fill={accent}>
                <animate attributeName="opacity" values="1;0.55;1" dur="0.5s" repeatCount="indefinite" />
              </rect>
            </g>
            <path d="M100 25 v-12 h40 v12" stroke={accent} strokeWidth="3" fill="none" />
            <text x="100" y="105" textAnchor="middle" fontSize="11" fill="#fbf7ec" fontFamily="IBM Plex Mono, monospace">+DC−</text>
          </g>
        )
      case 'driver':
        return (
          <g>
            <rect x="60" y="45" width="90" height="80" rx="6" fill="#1f4d3a" stroke={accent} strokeWidth="3" />
            <g fill={accent} opacity="0.85">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={68 + i * 20} y="52" width="12" height="8" rx="1" />
              ))}
            </g>
            <text x="105" y="95" textAnchor="middle" fontSize="13" fill="#fbf7ec" fontFamily="IBM Plex Mono, monospace">H-BRIDGE</text>
            <path d="M40 85 h20 M150 85 h25" stroke={accent} strokeWidth="4" />
            <circle cx="185" cy="85" r="12" fill="none" stroke={accent} strokeWidth="4" />
            {/* small logic signal */}
            <path d="M20 30 h14 v14 h10 v-14 h12" stroke="#63c7e8" strokeWidth="2.5" fill="none" />
            <path d="M20 60 h14 v14 h10 v-14 h12" stroke="#63c7e8" strokeWidth="2.5" fill="none" />
            <path d="M56 37 q18 10 18 40" stroke="#63c7e8" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            <path d="M56 67 q18 -8 18 -18" stroke="#63c7e8" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          </g>
        )
      case 'brain':
        return (
          <g>
            <rect x="70" y="50" width="70" height="80" rx="8" fill="#1a2a3a" stroke={accent} strokeWidth="3" />
            <rect x="88" y="68" width="34" height="34" rx="4" fill="#464035" stroke={accent} strokeWidth="2" />
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <line x1="70" y1={60 + i * 15} x2="52" y2={60 + i * 15} stroke={accent} strokeWidth="3" />
                <line x1="140" y1={60 + i * 15} x2="158" y2={60 + i * 15} stroke={accent} strokeWidth="3" />
              </g>
            ))}
            <text x="105" y="150" textAnchor="middle" fontSize="10" fill="#fbf7ec" fontFamily="IBM Plex Mono, monospace">MCU</text>
            {pulse && <circle cx="105" cy="85" r="8" fill="none" stroke={accent} strokeWidth="2">{pulse}</circle>}
          </g>
        )
      case 'sonar':
        return (
          <g>
            <circle cx="70" cy="90" r="26" fill="#464035" stroke={accent} strokeWidth="3" />
            <circle cx="70" cy="90" r="10" fill="#241f17" stroke={accent} strokeWidth="2" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="70" cy="90" r={26 + i * 24} fill="none" stroke={accent} strokeWidth="2" opacity="0.5">
                <animate attributeName="r" values={`${30 + i * 24};${58 + i * 24}`} dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              </circle>
            ))}
            <rect x="185" y="70" width="26" height="40" rx="4" fill="#2b2720" stroke={accent} strokeWidth="2" />
            <text x="70" y="160" textAnchor="middle" fontSize="10" fill="#fbf7ec" fontFamily="IBM Plex Mono, monospace">ECHO→DISTANCE</text>
          </g>
        )
      case 'servo':
        return (
          <g>
            <rect x="60" y="60" width="50" height="60" rx="6" fill="#1f4d6a" stroke={accent} strokeWidth="3" />
            <circle cx="85" cy="115" r="8" fill={accent} />
            <rect x="85" y="108" width="55" height="10" rx="4" fill={accent} />
            <g style={{ transformOrigin: '85px 113px' }}>
              <animateTransform attributeName="transform" type="rotate" values="0;24;-8;0" dur="2.4s" repeatCount="indefinite" />
              <rect x="85" y="108" width="55" height="10" rx="4" fill={accent} />
              <circle cx="140" cy="113" r="5" fill="#fbf7ec" />
            </g>
            <path d="M60 70 h-16 M60 85 h-16 M60 100 h-16" stroke="#63c7e8" strokeWidth="2.5" />
            <text x="85" y="150" textAnchor="middle" fontSize="10" fill="#fbf7ec" fontFamily="IBM Plex Mono, monospace">PWM 1-2 ms</text>
          </g>
        )
      case 'camera':
        return (
          <g>
            <rect x="55" y="55" width="90" height="70" rx="10" fill="#464035" stroke={accent} strokeWidth="3" />
            <circle cx="100" cy="90" r="26" fill="#241f17" stroke={accent} strokeWidth="4" />
            <circle cx="100" cy="90" r="14" fill="#0b0a08" stroke={accent} strokeWidth="2" />
            <circle cx="94" cy="84" r="4" fill="#fbf7ec" opacity="0.7" />
            {/* view frustum */}
            <path d="M126 70 L185 45 L185 135 L126 110 Z" fill={accent} opacity="0.12" stroke={accent} strokeWidth="1.5" strokeDasharray="5 5" />
            <circle cx="165" cy="90" r="7" fill="none" stroke="#7fb069" strokeWidth="2.5" />
            <path d="M158 84 h14 M158 96 h14 M165 77 v14 M165 89 v14" stroke="#7fb069" strokeWidth="1.6" />
          </g>
        )
      default: // battery
        return (
          <g>
            <rect x="55" y="60" width="90" height="60" rx="8" fill="#241f17" stroke={accent} strokeWidth="3" />
            <rect x="145" y="78" width="12" height="24" rx="2" fill={accent} />
            <g stroke="#7fb069" strokeWidth="4">
              <line x1="70" y1="90" x2="86" y2="90" />
              <line x1="78" y1="82" x2="78" y2="98" />
            </g>
            <rect x="96" y="72" width="34" height="36" rx="3" fill="none" stroke="#7fb069" strokeWidth="2" />
            <rect x="96" y="72" width="22" height="36" fill="#7fb069" opacity="0.35">
              <animate attributeName="width" values="6;30;6" dur="3s" repeatCount="indefinite" />
            </rect>
            <path d="M20 90 h30" stroke={accent} strokeWidth="4" />
            <path d="M170 90 h20" stroke={accent} strokeWidth="4" />
            <text x="100" y="150" textAnchor="middle" fontSize="10" fill="#fbf7ec" fontFamily="IBM Plex Mono, monospace">LI-ION + REGULATOR</text>
          </g>
        )
    }
  }

  return (
    <svg viewBox="0 0 210 180" className="h-full w-full" role="img" aria-label={`Diagram of ${icon}`}>
      {inner()}
    </svg>
  )
}

/* ------------------------------------------------------------------ */

const ICONS: Record<string, typeof Cpu> = {
  tracks: MoveHorizontal,
  motor: Zap,
  driver: CircuitBoard,
  brain: Cpu,
  sonar: Radio,
  servo: Gamepad2,
  camera: Camera,
  battery: BatteryCharging,
}

function PartCard({ part, index }: { part: EngineeringPart; index: number }) {
  const [active, setActive] = useState(false)
  const Icon = ICONS[part.icon] ?? Cpu

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={() => setActive((a) => !a)}
      aria-label={`${part.name} - activate for details`}
      aria-expanded={active}
      className={`glass-panel group flex w-full flex-col rounded-sm p-6 text-left outline-none transition-all duration-300 ${
        active ? 'border-yellow-walle/50 shadow-[0_0_40px_-12px_rgba(240,179,16,0.35)]' : 'border-cream/10'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="grid h-14 w-14 place-items-center border border-cream/15 bg-charcoal transition-colors group-hover:border-yellow-walle/40">
          <Icon size={22} className="text-yellow-walle" aria-hidden="true" />
        </div>
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-cream/30 uppercase">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="text-editorial mt-5 text-lg text-cream">{part.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cream/60">{part.short}</p>

      {/* diagram */}
      <div className="mt-4 h-32 w-full border-t border-cream/10 pt-4">
        <PartDiagram icon={part.icon} active={active} />
      </div>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-sm leading-relaxed text-cream/75">{part.detail}</p>
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-cream/45">
              <Quote size={12} className="mt-0.5 shrink-0 text-yellow-walle/70" aria-hidden="true" />
              {part.movieNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */

const BUILD_LOG = [
  {
    phase: 'Phase 1 · Chassis & Drive',
    status: 'In progress',
    text: '3D-printed track links around geared DC motors on a plywood chassis - sized so the robot can climb a small stack of (empty) boxes.',
  },
  {
    phase: 'Phase 2 · Brain & Senses',
    status: 'Planned',
    text: 'A microcontroller running a behavior loop, ultrasonic sensors for obstacle dodging, and servo-driven arms with a grab claw.',
  },
  {
    phase: 'Phase 3 · Personality',
    status: 'Dreaming',
    text: 'Binocular eyes with expressive aperture movement, servo neck, sound effects - the tiny details that make it feel like him.',
  },
]

export function Engineering() {
  const reduced = useReducedMotion()

  return (
    <section id="engineering" className="relative bg-charcoal py-24 sm:py-32" aria-labelledby="engineering-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          label="Engineering"
          title={
            <span id="engineering-title">
              How a robot like <span className="text-yellow-walle">WALL·E works</span>
            </span>
          }
          lead="The real robotics concepts behind a compactor-style robot - hover or tap each module to expand the explanation. Fiction is kept clearly separate from hardware."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ENGINEERING_PARTS.map((part, i) => (
            <PartCard key={part.id} part={part} index={i} />
          ))}
        </div>

        {/* ---- Building Our Own WALL-E ---- */}
        <div className="mt-24" id="building-our-wall-e">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="glass-panel relative overflow-hidden rounded-sm p-8 sm:p-12"
          >
            <div className="hazard-stripes absolute left-0 top-0 h-1.5 w-full opacity-70" aria-hidden="true" />
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="text-label flex items-center gap-2 text-yellow-walle">
                  <Wrench size={13} aria-hidden="true" /> Special section
                </p>
                <h3 className="text-editorial mt-4 text-3xl text-cream sm:text-4xl">
                  Building our own WALL·E
                </h3>
                <p className="mt-4 max-w-md font-mono text-[0.62rem] leading-relaxed tracking-[0.14em] text-cream/40 uppercase">
                  Disclaimer: inspired by the character's look - no studio specs,
                  no exact replica, just our own engineering homework.
                </p>
              </div>

              <ol className="space-y-4">
                {BUILD_LOG.map((p, i) => (
                  <motion.li
                    key={p.phase}
                    initial={reduced ? false : { opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    className="flex gap-5 border border-cream/10 bg-charcoal/60 p-5 transition-colors hover:border-yellow-walle/30"
                  >
                    <span className="font-mono text-[0.6rem] tracking-[0.16em] text-yellow-walle/80 uppercase">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-semibold text-cream/95">{p.phase}</h4>
                        <span
                          className={`border px-2 py-0.5 font-mono text-[0.55rem] tracking-[0.16em] uppercase ${
                            p.status === 'In progress'
                              ? 'border-plant/40 bg-plant/10 text-plant'
                              : p.status === 'Planned'
                                ? 'border-yellow-walle/40 bg-yellow-walle/10 text-yellow-walle'
                                : 'border-cream/20 bg-cream/5 text-cream/50'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-cream/65">{p.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
