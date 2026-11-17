import { motion, useReducedMotion } from 'motion/react'
import { Film, Quote, Lightbulb } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { MOVIE_FACTS, MOVIE_TRIVIA } from '../data/movie'

const SYNOPSIS = [
  'After seven hundred years of doing what he was built for - compacting trash on an abandoned Earth - a small yellow robot has become something more: curious, sentimental, and quietly lonely. He collects treasures, keeps a pet cockroach, and rewatches one old musical every evening.',
  'Then a sleek probe descends from the sky. Her name is EVE, and she is searching for exactly one thing: proof that plant life has returned. When WALL·E shows her a seedling he found, his quiet world - and humanity’s drift among the stars - begins to change.',
]

const STORY_BEATS = [
  {
    title: 'Act I - An empty planet',
    text: 'WALL·E works, collects, watches, waits. Almost no dialogue; pure cinema.',
  },
  {
    title: 'Act II - EVE arrives',
    text: 'Discovery, friendship, and a one-way ride into space to bring the plant home.',
  },
  {
    title: 'Act III - The Axiom',
    text: 'Aboard humanity’s starliner, one plant forces everyone to remember Earth.',
  },
]

/** Editorial overview: verified facts, synopsis, accessible story map, trivia. */
export function MovieOverview() {
  const reduced = useReducedMotion()

  return (
    <section id="movie" className="relative bg-charcoal py-24 sm:py-32" aria-labelledby="movie-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          label="The Film"
          title={
            <span id="movie-title">
              A love story <span className="text-yellow-walle">among the stars</span>
            </span>
          }
          lead="Pixar’s ninth feature film - part science-fiction epic, part silent romance - told mostly without words."
        />

        {/* big year numeral + facts */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass-panel relative overflow-hidden rounded-sm p-8 sm:p-10">
              <p className="text-editorial text-[5.5rem] text-yellow-walle sm:text-[7rem]">2008</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream/60">
                Released June 27, 2008, in the United States. The film holds a rare
                spot among animated classics for its nearly dialogue-free first act.
              </p>

              {/* facts grid */}
              <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2">
                {MOVIE_FACTS.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 border-b border-cream/10 py-2.5"
                  >
                    <dt className="font-mono text-[0.6rem] tracking-[0.18em] text-cream/45 uppercase">
                      {f.label}
                    </dt>
                    <dd className="text-right text-sm font-medium text-cream/90">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="hazard-stripes mt-8 h-1.5 w-full opacity-70" aria-hidden="true" />
            </div>
          </motion.div>

          {/* synopsis */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[0.62rem] tracking-[0.2em] text-cream/40 uppercase">
                The synopsis - told in full
              </span>
            </div>

            {SYNOPSIS.map((p, i) => (
              <p key={i} className="mb-5 text-lg leading-relaxed text-cream/75">
                {p}
              </p>
            ))}

            {/* accessible story overview */}
            <div className="mt-8 border-l-2 border-yellow-walle/50 pl-5">
              <p className="text-label mb-4 flex items-center gap-2 text-yellow-walle">
                <Film size={13} aria-hidden="true" /> Story in three beats
              </p>
              <ol className="space-y-4">
                {STORY_BEATS.map((b) => (
                  <li key={b.title} className="text-sm leading-relaxed text-cream/70">
                    <span className="font-semibold text-cream/90">{b.title}.</span> {b.text}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>

        {/* trivia strip */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {MOVIE_TRIVIA.map((t, i) => (
            <motion.article
              key={t.title}
              initial={reduced ? false : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={reduced ? undefined : { y: -6 }}
              className="group glass-panel relative rounded-sm p-7 transition-colors hover:border-yellow-walle/30"
            >
              <Lightbulb
                size={20}
                className="text-yellow-walle transition-transform duration-300 group-hover:rotate-12"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-semibold text-cream/95">{t.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">{t.text}</p>
              <Quote
                size={56}
                className="absolute right-4 top-4 text-cream/5"
                aria-hidden="true"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
