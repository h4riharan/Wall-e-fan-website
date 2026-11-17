import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { UNIVERSE_CHAPTERS } from '../data/universe'
import type { UniverseChapter } from '../data/types'

/* ------------------------------------------------------------------ */
/* Original generative SVG scene art per chapter                       */
/* ------------------------------------------------------------------ */

const SKY: Record<UniverseChapter['scene'], [string, string]> = {
  earth: ['#8a6a3a', '#3a2c18'],
  city: ['#5a4a30', '#2a2014'],
  work: ['#7a5a2e', '#332615'],
  plant: ['#4a5a3a', '#1a2418'],
  axiom: ['#3a5a6a', '#182430'],
  home: ['#6a8a4a', '#243018'],
}

function SceneArt({ scene }: { scene: UniverseChapter['scene'] }) {
  const [skyTop, skyBottom] = SKY[scene]
  return (
    <svg viewBox="0 0 600 420" className="h-full w-full" role="img" aria-label={`Illustration: ${scene} scene`}>
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <radialGradient id={`glow-${scene}`} cx="0.7" cy="0.25" r="0.6">
          <stop offset="0%" stopColor="#f0b310" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f0b310" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`plantglow-${scene}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7fb069" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7fb069" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="420" fill={`url(#sky-${scene})`} />
      <rect width="600" height="420" fill={`url(#glow-${scene})`} />

      {scene === 'earth' && (
        <g>
          <circle cx="430" cy="110" r="46" fill="#e8c877" opacity="0.85" />
          <circle cx="430" cy="110" r="62" fill="#e8c877" opacity="0.15" />
          {/* trash towers */}
          <g fill="#241c10">
            <rect x="40" y="200" width="70" height="220" />
            <rect x="125" y="160" width="55" height="260" />
            <rect x="200" y="230" width="80" height="190" />
            <rect x="310" y="180" width="50" height="240" />
            <rect x="380" y="140" width="60" height="280" />
            <rect x="470" y="215" width="70" height="205" />
          </g>
          {/* stacked cubes detail */}
          <g stroke="#f0b310" strokeOpacity="0.25" strokeWidth="1.5">
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x="382" y={340 - i * 26} width="56" height="24" fill="none" />
            ))}
          </g>
          {/* dust haze */}
          <rect y="300" width="600" height="120" fill="#c9a15a" opacity="0.14" />
          <rect y="330" width="600" height="90" fill="#c9a15a" opacity="0.18" />
          {/* tiny WALL·E silhouette */}
          <g fill="#17130d">
            <rect x="286" y="366" width="28" height="20" rx="4" />
            <rect x="292" y="358" width="16" height="9" rx="3" />
            <circle cx="296" cy="362" r="2" fill="#fdf6e3" />
            <circle cx="304" cy="362" r="2" fill="#fdf6e3" />
          </g>
        </g>
      )}

      {scene === 'city' && (
        <g>
          {/* BnL skyline */}
          <g fill="#1d150b">
            <rect x="30" y="180" width="60" height="240" />
            <rect x="110" y="120" width="70" height="300" />
            <rect x="200" y="200" width="55" height="220" />
            <rect x="290" y="90" width="80" height="330" />
            <rect x="400" y="160" width="65" height="260" />
            <rect x="490" y="210" width="75" height="210" />
          </g>
          {/* BnL billboard */}
          <g>
            <rect x="255" y="55" width="150" height="60" rx="6" fill="#241c10" stroke="#f0b310" strokeOpacity="0.4" strokeWidth="2" />
            <text x="330" y="93" textAnchor="middle" fontFamily="Archivo Black, sans-serif" fontSize="30" fill="#f0b310">
              BnL
            </text>
            <rect x="322" y="115" width="16" height="90" fill="#241c10" />
          </g>
          {/* scattered trash dunes */}
          <path d="M0 340 Q150 300 300 340 T600 335 V420 H0 Z" fill="#191307" />
          <path d="M0 370 Q200 330 420 370 T600 365 V420 H0 Z" fill="#0f0b05" />
        </g>
      )}

      {scene === 'work' && (
        <g>
          <circle cx="140" cy="100" r="40" fill="#e8c877" opacity="0.7" />
          {/* conveyor of trash */}
          <g fill="#241c10">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={30 + i * 55} y={330 - (i % 2) * 8} width="40" height="30" rx="3" />
            ))}
          </g>
          <rect x="0" y="364" width="600" height="10" fill="#464035" />
          {/* WALL·E with cube */}
          <g>
            <rect x="470" y="270" width="90" height="66" rx="10" fill="#e7ae0c" />
            <rect x="470" y="322" width="90" height="8" fill="#8a3c07" />
            <rect x="490" y="250" width="50" height="22" rx="6" fill="#e7ae0c" />
            <ellipse cx="503" cy="261" rx="6" ry="5" fill="#fdf6e3" />
            <ellipse cx="527" cy="261" rx="6" ry="5" fill="#fdf6e3" />
            <circle cx="503" cy="261" r="2.4" fill="#17130d" />
            <circle cx="527" cy="261" r="2.4" fill="#17130d" />
            <rect x="482" y="300" width="24" height="26" rx="4" fill="#464035" />
            <rect x="546" y="296" width="20" height="24" rx="3" fill="#241c10" />
            <rect x="460" y="340" width="46" height="26" rx="12" fill="#2b2720" />
            <rect x="556" y="340" width="46" height="26" rx="12" fill="#2b2720" />
          </g>
          {/* floating specks */}
          <g fill="#e8c877">
            {[[80, 220], [180, 180], [260, 250], [340, 160], [420, 210]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.6 + (i % 2)} opacity="0.5" />
            ))}
          </g>
        </g>
      )}

      {scene === 'plant' && (
        <g>
          <rect width="600" height="420" fill="#1a2418" />
          <circle cx="300" cy="250" r="180" fill={`url(#plantglow-${scene})`} />
          {/* the boot */}
          <path d="M240 320 q-8 -70 10 -95 q20 -28 55 -25 q35 3 40 30 l15 60 q40 8 45 30 l-165 0 Z" fill="#4a3a26" />
          <path d="M240 320 h165 v14 a8 8 0 0 1 -8 8 h-149 a8 8 0 0 1 -8 -8 Z" fill="#332616" />
          {/* soil + seedling */}
          <ellipse cx="318" cy="232" rx="26" ry="10" fill="#33261a" />
          <path d="M318 226 q-2 -26 -14 -34 M318 226 q4 -30 18 -36 M318 226 v-30" stroke="#7fb069" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="300" cy="188" rx="10" ry="6" fill="#7fb069" transform="rotate(-30 300 188)" />
          <ellipse cx="336" cy="186" rx="10" ry="6" fill="#7fb069" transform="rotate(25 336 186)" />
          <ellipse cx="318" cy="188" rx="7" ry="9" fill="#8fc47a" />
          {/* scan ring */}
          <ellipse cx="318" cy="210" rx="90" ry="26" fill="none" stroke="#63c7e8" strokeWidth="2" strokeDasharray="8 8" opacity="0.8" />
        </g>
      )}

      {scene === 'axiom' && (
        <g>
          {/* deck */}
          <rect y="330" width="600" height="90" fill="#182430" />
          <rect y="326" width="600" height="8" fill="#3a5a6a" />
          {/* windows */}
          <g fill="#63c7e8" opacity="0.5">
            {[60, 140, 220, 300, 380, 460, 540].map((x) => (
              <rect key={x} x={x} y="30" width="34" height="16" rx="8" />
            ))}
          </g>
          {/* hover chair + human silhouette */}
          <g>
            <ellipse cx="230" cy="300" rx="60" ry="12" fill="#2a3a48" />
            <rect x="215" y="255" width="30" height="42" rx="12" fill="#3a5a6a" />
            <circle cx="230" cy="242" r="12" fill="#3a5a6a" />
            <rect x="252" y="252" width="22" height="26" rx="4" fill="#63c7e8" opacity="0.85" />
            <path d="M215 297 h30 M205 300 h50" stroke="#2a3a48" strokeWidth="6" strokeLinecap="round" />
          </g>
          {/* second chair */}
          <g opacity="0.7">
            <ellipse cx="390" cy="316" rx="52" ry="10" fill="#2a3a48" />
            <rect x="376" y="278" width="28" height="36" rx="11" fill="#3a5a6a" />
            <circle cx="390" cy="266" r="10" fill="#3a5a6a" />
          </g>
          {/* AUTO's red eye watching */}
          <circle cx="540" cy="120" r="14" fill="#1a0d0a" stroke="#3a3a3a" strokeWidth="6" />
          <circle cx="540" cy="120" r="6" fill="#ff2b1f">
            <animate attributeName="r" values="6;7.4;6" dur="2.6s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {scene === 'home' && (
        <g>
          <circle cx="470" cy="100" r="40" fill="#e8c877" opacity="0.8" />
          {/* overgrown skyline */}
          <g fill="#1d2410">
            <rect x="40" y="190" width="60" height="230" />
            <rect x="130" y="150" width="55" height="270" />
            <rect x="215" y="215" width="70" height="205" />
            <rect x="470" y="185" width="55" height="235" />
          </g>
          {/* vines */}
          <g stroke="#5a7a3a" strokeWidth="3" fill="none" opacity="0.8">
            <path d="M160 150 q-14 40 6 78 q14 34 -6 70" />
            <path d="M240 215 q18 30 -4 66 q-16 30 6 60" />
          </g>
          {/* the boot garden */}
          <path d="M300 330 q-8 -60 8 -80 q16 -22 44 -20 q30 2 34 24 l10 46 q34 8 38 28 l-134 2 Z" fill="#4a3a26" />
          <g stroke="#7fb069" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M330 258 q-2 -20 -10 -28 M350 256 q2 -22 12 -30 M368 258 q0 -18 8 -26" />
          </g>
          <ellipse cx="330" cy="228" rx="8" ry="5" fill="#7fb069" transform="rotate(-24 330 228)" />
          <ellipse cx="364" cy="226" rx="8" ry="5" fill="#7fb069" transform="rotate(20 364 226)" />
          <ellipse cx="347" cy="222" rx="6" ry="8" fill="#8fc47a" />
          {/* small tree growing beside */}
          <path d="M440 336 v-60 M440 296 q-16 -10 -20 -28 M440 288 q16 -8 22 -30" stroke="#5a7a3a" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="416" cy="262" r="12" fill="#7fb069" />
          <circle cx="466" cy="252" r="14" fill="#8fc47a" />
        </g>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Chapter layout                                                      */
/* ------------------------------------------------------------------ */

export function Universe() {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reduced) return
    let disposed = false
    let cleanup: (() => void) | undefined
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        // StrictMode remount: skip stale inits resolved after unmount
        if (disposed) return
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>('.universe-chapter').forEach((chapter) => {
            gsap.fromTo(
              chapter.querySelector('[data-universe-art]'),
              { y: 70, opacity: 0.4 },
              {
                y: -70,
                ease: 'none',
                scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
              },
            )
            gsap.fromTo(
              chapter.querySelectorAll('[data-universe-reveal]'),
              { y: 44, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: { trigger: chapter, start: 'top 72%' },
              },
            )
          })
        }, rootRef)
        cleanup = () => ctx.revert()
      },
    )
    return () => {
      disposed = true
      cleanup?.()
    }
  }, [reduced])

  return (
    <section
      id="universe"
      ref={rootRef}
      className="relative bg-charcoal-soft py-24 sm:py-32"
      aria-labelledby="universe-title"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          label="Explore His World"
          title={
            <span id="universe-title">
              Six scenes from a <span className="text-yellow-walle">forgotten Earth</span>
            </span>
          }
          lead="Six chapters that walk through the entire film - with badges telling verified production facts from in-universe fiction. The whole story is on the table; that's the point."
        />

        <div className="mt-20 space-y-24 sm:space-y-32">
          {UNIVERSE_CHAPTERS.map((ch, i) => (
            <article
              key={ch.id}
              className={`universe-chapter grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
              aria-label={`${ch.index} - ${ch.title}`}
            >
              {/* art */}
              <div data-universe-art className="relative">
                <div className="overflow-hidden rounded-sm border border-cream/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
                  <SceneArt scene={ch.scene} />
                </div>
                <span className="text-editorial pointer-events-none absolute -top-10 left-2 text-7xl text-cream/8 sm:text-8xl">
                  {ch.index}
                </span>
              </div>

              {/* copy */}
              <div>
                <div data-universe-reveal className="mb-4 flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.18em] uppercase ${
                      ch.kind === 'movie-fact'
                        ? 'border-eveblue/40 bg-eveblue/10 text-eveblue'
                        : 'border-plant/40 bg-plant/10 text-plant'
                    }`}
                  >
                    {ch.kind === 'movie-fact' ? 'Verified fact' : 'In-universe fiction'}
                  </span>
                </div>
                <h3
                  data-universe-reveal
                  className="text-editorial text-3xl text-cream sm:text-4xl"
                >
                  {ch.title}
                </h3>
                <p data-universe-reveal className="mt-2 font-mono text-[0.68rem] tracking-[0.24em] text-yellow-walle uppercase">
                  {ch.subtitle}
                </p>
                <p data-universe-reveal className="mt-5 max-w-xl text-base leading-relaxed text-cream/70">
                  {ch.body}
                </p>
                {ch.stats && (
                  <dl data-universe-reveal className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
                    {ch.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="font-mono text-[0.58rem] tracking-[0.2em] text-cream/40 uppercase">
                          {s.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-cream/90">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
