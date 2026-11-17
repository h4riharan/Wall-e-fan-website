import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CHARACTERS } from '../data/characters'
import type { CharacterProfile } from '../data/types'

/* ------------------------------------------------------------------ */
/* Original SVG character portraits                                    */
/* ------------------------------------------------------------------ */

function CharacterArt({ c }: { c: CharacterProfile }) {
  return (
    <svg viewBox="0 0 240 220" className="h-full w-full" role="img" aria-label={`Illustration of ${c.name}`}>
      {/* backdrop glow in the character's accent */}
      <circle cx="120" cy="112" r="96" fill={c.accent} opacity="0.09" />
      <circle cx="120" cy="112" r="66" fill={c.accent} opacity="0.08" />

      {c.id === 'wall-e' && (
        <g className="transition-transform duration-500 group-hover:-translate-y-2">
          <rect x="72" y="152" width="34" height="26" rx="13" fill="#2b2720" />
          <rect x="134" y="152" width="34" height="26" rx="13" fill="#2b2720" />
          <rect x="90" y="138" width="60" height="18" fill="#241f17" />
          <rect x="72" y="86" width="96" height="56" rx="10" fill={c.body} />
          <rect x="72" y="130" width="96" height="7" fill="#8a3c07" />
          <rect x="102" y="98" width="36" height="26" rx="4" fill="#464035" />
          <circle cx="128" cy="106" r="3.6" fill="#e04f39" />
          <circle cx="128" cy="116" r="2.8" fill="#63c7e8" />
          <rect x="104" y="78" width="20" height="10" rx="3" fill="#464035" />
          <rect x="84" y="52" width="72" height="30" rx="8" fill={c.body} />
          <ellipse cx="104" cy="68" rx="9" ry="8" fill="#fdf6e3" />
          <ellipse cx="136" cy="68" rx="9" ry="8" fill="#fdf6e3" />
          <circle cx="106" cy="68" r="3.6" fill={c.eye} />
          <circle cx="134" cy="68" r="3.6" fill={c.eye} />
          <rect x="60" y="96" width="12" height="30" rx="6" fill="#a4531b" />
          <rect x="168" y="96" width="12" height="30" rx="6" fill="#a4531b" />
        </g>
      )}

      {c.id === 'eve' && (
        <g className="transition-transform duration-500 group-hover:-translate-y-2">
          <ellipse cx="120" cy="110" rx="52" ry="70" fill={c.body} />
          <ellipse cx="120" cy="110" rx="52" ry="70" fill="none" stroke="#c8d4de" strokeWidth="2" />
          {/* screen face */}
          <ellipse cx="120" cy="102" rx="34" ry="26" fill="#0b1420" />
          <circle cx="120" cy="102" r="12" fill={c.accent}>
            <animate attributeName="r" values="12;14;12" dur="2.8s" repeatCount="indefinite" />
          </circle>
          {/* arms */}
          <path d="M72 128 q-22 6 -30 22" stroke={c.body} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M168 128 q22 6 30 22" stroke={c.body} strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* hover glow */}
          <ellipse cx="120" cy="192" rx="40" ry="7" fill={c.accent} opacity="0.35" />
        </g>
      )}

      {c.id === 'm-o' && (
        <g className="transition-transform duration-500 group-hover:-translate-y-2">
          <ellipse cx="120" cy="196" rx="34" ry="10" fill="#241f17" />
          <rect x="86" y="130" width="68" height="52" rx="14" fill={c.body} />
          <rect x="80" y="176" width="80" height="18" rx="9" fill="#3a3a3a" />
          <circle cx="120" cy="185" r="7" fill="#241f17" />
          {/* dome head */}
          <path d="M92 130 a28 30 0 0 1 56 0 Z" fill={c.body} />
          <ellipse cx="120" cy="112" rx="18" ry="12" fill="#0b1420" />
          <circle cx="120" cy="112" r="5" fill={c.eye} />
          {/* sanitizer brush */}
          <rect x="150" y="140" width="10" height="26" rx="4" fill="#9de24f" opacity="0.8" />
          {/* bubbles */}
          <g fill="#9de24f" opacity="0.6">
            <circle cx="80" cy="90" r="4" />
            <circle cx="70" cy="106" r="2.6" />
            <circle cx="162" cy="98" r="3.4" />
          </g>
        </g>
      )}

      {c.id === 'auto' && (
        <g className="transition-transform duration-500 group-hover:rotate-6" style={{ transformOrigin: '120px 110px' }}>
          {/* wheel body */}
          <circle cx="120" cy="112" r="64" fill={c.body} />
          <circle cx="120" cy="112" r="64" fill="none" stroke="#565048" strokeWidth="6" />
          <circle cx="120" cy="112" r="34" fill="#2e2b26" />
          {/* red lens */}
          <circle cx="120" cy="112" r="18" fill="#0d0605" stroke="#4a4a4a" strokeWidth="4" />
          <circle cx="120" cy="112" r="8" fill={c.eye}>
            <animate attributeName="r" values="8;10;8" dur="2.4s" repeatCount="indefinite" />
          </circle>
          {/* wheel spokes */}
          <g stroke="#565048" strokeWidth="5">
            <line x1="120" y1="30" x2="120" y2="70" />
            <line x1="120" y1="154" x2="120" y2="194" />
            <line x1="38" y1="112" x2="78" y2="112" />
            <line x1="162" y1="112" x2="202" y2="112" />
          </g>
        </g>
      )}

      {c.id === 'captain' && (
        <g className="transition-transform duration-500 group-hover:-translate-y-1.5">
          {/* hover chair */}
          <ellipse cx="120" cy="188" rx="52" ry="11" fill="#2a3a48" />
          <rect x="94" y="120" width="52" height="64" rx="16" fill="#3a5a6a" />
          {/* body */}
          <rect x="100" y="76" width="40" height="52" rx="12" fill={c.accent} />
          <circle cx="120" cy="58" r="17" fill="#e8b88a" />
          <path d="M103 52 a17 17 0 0 1 34 0 l0 4 q-17 -8 -34 0 Z" fill="#d8cfc0" />
          <circle cx="114" cy="58" r="2" fill={c.eye} />
          <circle cx="126" cy="58" r="2" fill={c.eye} />
          {/* captain's badge */}
          <rect x="126" y="90" width="10" height="14" rx="2" fill="#f0b310" />
          {/* screen in hand */}
          <rect x="146" y="98" width="22" height="26" rx="3" fill="#63c7e8" opacity="0.85" transform="rotate(8 157 111)" />
          {/* chair glow */}
          <ellipse cx="120" cy="196" rx="30" ry="5" fill="#63c7e8" opacity="0.3" />
        </g>
      )}
      {c.id === 'john' && (
        <g className="transition-transform duration-500 group-hover:-translate-y-1.5">
          {/* hover chair */}
          <ellipse cx="120" cy="188" rx="48" ry="10" fill="#2a3a48" />
          <rect x="92" y="118" width="56" height="62" rx="18" fill="#3a5a6a" />
          {/* blue suit */}
          <rect x="100" y="80" width="40" height="56" rx="14" fill={c.accent} />
          <rect x="100" y="136" width="40" height="12" rx="6" fill="#2b3b4a" />
          {/* head */}
          <circle cx="120" cy="62" r="18" fill={c.body} />
          <path d="M102 58 a18 18 0 0 1 36 0 l0 4 q-18 -9 -36 0 Z" fill="#4a3826" />
          {/* mustache */}
          <rect x="111" y="71" width="18" height="4.5" rx="2.2" fill="#4a3826" />
          <circle cx="113" cy="62" r="2" fill={c.eye} />
          <circle cx="127" cy="62" r="2" fill={c.eye} />
          {/* drink cup in hand */}
          <rect x="140" y="94" width="12" height="18" rx="3" fill="#e8e2d2" transform="rotate(10 146 103)" />
          {/* chair glow */}
          <ellipse cx="120" cy="196" rx="28" ry="5" fill="#63c7e8" opacity="0.3" />
        </g>
      )}

      {c.id === 'mary' && (
        <g className="transition-transform duration-500 group-hover:-translate-y-1.5">
          {/* hover chair */}
          <ellipse cx="120" cy="188" rx="48" ry="10" fill="#2a3a48" />
          <rect x="92" y="118" width="56" height="62" rx="18" fill="#3a5a6a" />
          {/* long auburn hair behind the shoulders */}
          <path d="M100 62 q-9 36 1 48 l38 0 q10 -12 1 -48 Z" fill="#a4531b" />
          {/* blue suit */}
          <rect x="100" y="80" width="40" height="56" rx="14" fill={c.accent} />
          <rect x="100" y="136" width="40" height="12" rx="6" fill="#2b3b4a" />
          {/* head + fringe */}
          <circle cx="120" cy="62" r="17" fill={c.body} />
          <path d="M103 56 a17 17 0 0 1 34 0 l0 3 q-17 -8 -34 0 Z" fill="#a4531b" />
          {/* big white sunglasses */}
          <circle cx="112" cy="62" r="7" fill="#fdf6e3" stroke="#d8d3c8" strokeWidth="1.5" />
          <circle cx="128" cy="62" r="7" fill="#fdf6e3" stroke="#d8d3c8" strokeWidth="1.5" />
          <line x1="118" y1="61" x2="122" y2="61" stroke="#d8d3c8" strokeWidth="2.5" />
          {/* headphones */}
          <path d="M101 58 a19 19 0 0 1 38 0" stroke="#3a3a3a" strokeWidth="3" fill="none" />
          <rect x="98" y="56" width="6" height="10" rx="2" fill="#3a3a3a" />
          <rect x="136" y="56" width="6" height="10" rx="2" fill="#3a3a3a" />
          {/* chair glow */}
          <ellipse cx="120" cy="196" rx="28" ry="5" fill="#63c7e8" opacity="0.3" />
        </g>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */

export function Characters() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="characters" className="relative bg-charcoal py-24 sm:py-32" aria-labelledby="characters-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          label="Characters"
          title={
            <span id="characters-title">
              The crew of the <span className="text-yellow-walle">story</span>
            </span>
          }
          lead="Seven personalities carry the whole film - most of them barely speak. Hover a portrait to bring each one to life."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CHARACTERS.map((c, i) => {
            const isActive = active === c.id
            return (
              <motion.article
                key={c.id}
                tabIndex={0}
                onFocus={() => setActive(c.id)}
                onBlur={() => setActive(null)}
                onMouseEnter={() => setActive(c.id)}
                onMouseLeave={() => setActive(null)}
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`group glass-panel relative flex flex-col overflow-hidden rounded-sm outline-none transition-all duration-300 ${
                  isActive ? 'border-yellow-walle/40' : 'border-cream/10'
                }`}
                aria-label={`${c.name} - ${c.role}`}
              >
                {/* accent rail */}
                <div
                  className="absolute left-0 top-0 h-full w-1 transition-all duration-300"
                  style={{ background: c.accent, opacity: isActive ? 1 : 0.35 }}
                  aria-hidden="true"
                />

                <div className="p-5 pb-0">
                  <div className="relative aspect-square w-full">
                    <CharacterArt c={c} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 pt-4">
                  <h3 className="text-editorial text-xl text-cream">{c.name}</h3>
                  <p className="mt-1 font-mono text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: c.accent }}>
                    {c.tagline}
                  </p>

                  <p className="mt-3 text-[0.8rem] leading-relaxed text-cream/60">{c.role}</p>

                  {/* description reveals on hover / focus */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isActive ? 'auto' : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-[0.8rem] leading-relaxed text-cream/70">{c.description}</p>
                  </motion.div>

                  <p className="mt-auto pt-4 text-[0.78rem] italic text-cream/45">{c.quote}</p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
