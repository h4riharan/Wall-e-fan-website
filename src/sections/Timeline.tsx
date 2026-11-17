import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { motion } from 'motion/react'
import { TIMELINE_EVENTS } from '../data/characters'

/**
 * Scroll-driven timeline: pinned horizontal track on desktop, graceful
 * vertical list on mobile / reduced motion.
 */
export function Timeline() {
  const reduced = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window === 'undefined' || window.matchMedia('(min-width: 1024px)').matches,
  )
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced || !isDesktop) return
    let disposed = false
    let cleanup: (() => void) | undefined
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        // StrictMode remount: skip stale inits resolved after unmount
        if (disposed) return
        gsap.registerPlugin(ScrollTrigger)
        const track = trackRef.current
        const root = rootRef.current
        if (!track || !root) return

        const ctx = gsap.context(() => {
          const distance = () => track.scrollWidth - window.innerWidth

          const scrollTween = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${self.progress})`
                }
              },
            },
          })

          // per-card reveal inside the horizontally-moving container
          gsap.utils.toArray<HTMLElement>('.timeline-card').forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0.3, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: scrollTween,
                  start: 'left 88%',
                  toggleActions: 'play none none reverse',
                },
              },
            )
          })
        }, root)

        cleanup = () => ctx.revert()
      },
    )
    return () => {
      disposed = true
      cleanup?.()
    }
  }, [reduced, isDesktop])

  const isHorizontal = !reduced && isDesktop

  const Card = ({ ev, i }: { ev: (typeof TIMELINE_EVENTS)[number]; i: number }) => (
    <div
      className={`timeline-card group relative flex-shrink-0 ${
        isHorizontal
          ? 'w-[300px] sm:w-[360px]'
          : 'w-full'
      }`}
    >
      {/* node */}
      <div className="mb-5 flex items-center gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-yellow-walle/60 bg-yellow-walle/10 font-mono text-xs font-bold text-yellow-walle">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="text-label text-cream/50">{ev.year}</span>
        <span className="h-px flex-1 bg-cream/10" aria-hidden="true" />
      </div>

      <div className="glass-panel h-full rounded-sm p-5 transition-colors duration-300 group-hover:border-yellow-walle/30">
        <span className="font-mono text-[0.6rem] tracking-[0.22em] text-cream/45 uppercase">
          {ev.era}
        </span>
        <h3 className="text-editorial mt-2.5 text-lg text-cream sm:text-xl">{ev.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-cream/65">{ev.text}</p>
      </div>
    </div>
  )

  /* Compact heading so the pinned viewport always fits everything. */
  const Heading = () => (
    <div>
      <p className="text-label mb-3 flex items-center gap-3 text-yellow-walle">
        <span className="inline-block h-px w-10 bg-yellow-walle/60" aria-hidden="true" />
        05 · Timeline
      </p>
      <h2 id="timeline-title" className="text-editorial text-3xl text-cream sm:text-5xl">
        From <span className="text-yellow-walle">2105 to forever</span>
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/60 sm:text-base">
        Scroll to travel through the film's major events - the whole story, start to finish.
      </p>
    </div>
  )

  return (
    <section
      id="timeline"
      ref={rootRef}
      className="relative overflow-hidden bg-charcoal-soft"
      aria-labelledby="timeline-title"
    >
      {isHorizontal ? (
        /* Pinned mode: everything must fit inside one viewport - no extra padding. */
        <div className="h-screen overflow-hidden">
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
            <Heading />

            {/* progress rail */}
            <div className="relative mt-7 mb-7 h-[2px] w-full bg-cream/10" aria-hidden="true">
              <div
                ref={progressRef}
                className="absolute inset-0 origin-left scale-x-0 bg-yellow-walle"
              />
            </div>

            <div className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex w-max gap-6 pr-[18vw]"
                aria-label="Timeline events, scroll horizontally"
              >
                {TIMELINE_EVENTS.map((ev, i) => (
                  <Card key={ev.id} ev={ev} i={i} />
                ))}
              </div>
            </div>

            <p className="mt-5 font-mono text-[0.62rem] tracking-[0.24em] text-cream/35 uppercase">
              Keep scrolling - the timeline drives itself
            </p>
          </div>
        </div>
      ) : (
        /* Vertical mode (mobile / reduced motion) */
        <div className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Heading />
            <motion.ol
              initial={false}
              className="relative mt-12 space-y-10 border-l border-cream/10 pl-8"
              aria-label="Timeline events"
            >
              {TIMELINE_EVENTS.map((ev, i) => (
                <li key={ev.id}>
                  <Card ev={ev} i={i} />
                </li>
              ))}
            </motion.ol>
          </div>
        </div>
      )}
    </section>
  )
}
