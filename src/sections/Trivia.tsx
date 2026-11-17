import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Check, X, RotateCcw, Trophy, Brain } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { MechaButton } from '../components/ui/MechaButton'
import { TRIVIA_QUESTIONS } from '../data/movie'
import { playSfx } from '../hooks/useSoundBus'

interface QuizState {
  index: number
  selected: number | null
  score: number
  finished: boolean
}

const INITIAL: QuizState = { index: 0, selected: null, score: 0, finished: false }

export function Trivia() {
  const reduced = useReducedMotion()
  const [quiz, setQuiz] = useState<QuizState>(INITIAL)
  const [pickedHistory, setPickedHistory] = useState<number[]>([])

  const question = TRIVIA_QUESTIONS[quiz.index]
  const answered = quiz.selected !== null
  const isLast = quiz.index === TRIVIA_QUESTIONS.length - 1
  const grade = useMemo(() => {
    const pct = quiz.score / TRIVIA_QUESTIONS.length
    if (pct === 1) return 'Perfect - the Axiom would be proud.'
    if (pct >= 0.7) return 'Great memory, Captain.'
    if (pct >= 0.4) return 'Not bad - WALL·E would keep watching with you.'
    return 'Time for a re-watch. Hello, Dolly!'
  }, [quiz.score])

  const pick = (i: number) => {
    if (answered) return
    const correct = i === question.answerIndex
    if (correct) playSfx('happy')
    else playSfx('curious')
    setQuiz((q) => ({
      ...q,
      selected: i,
      score: q.score + (correct ? 1 : 0),
    }))
    setPickedHistory((h) => [...h.slice(0, quiz.index), i])
  }

  const next = () => {
    playSfx('click')
    if (isLast) {
      setQuiz((q) => ({ ...q, finished: true }))
    } else {
      setQuiz((q) => ({ ...q, index: q.index + 1, selected: null }))
    }
  }

  const restart = () => {
    playSfx('greet')
    setQuiz(INITIAL)
    setPickedHistory([])
  }

  return (
    <section id="trivia" className="relative bg-charcoal py-24 sm:py-32" aria-labelledby="trivia-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="07"
          label="Trivia"
          title={
            <span id="trivia-title">
              How well do you know <span className="text-yellow-walle">WALL·E?</span>
            </span>
          }
          lead={`${TRIVIA_QUESTIONS.length} questions. No timer, no pressure - the little robot is patient.`}
        />

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="glass-panel relative overflow-hidden rounded-sm">
            {/* progress */}
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-4 sm:px-8">
              <span className="font-mono text-[0.62rem] tracking-[0.2em] text-cream/50 uppercase">
                Question {quiz.finished ? TRIVIA_QUESTIONS.length : quiz.index + 1} / {TRIVIA_QUESTIONS.length}
              </span>
              <span className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-yellow-walle uppercase">
                <Trophy size={13} aria-hidden="true" /> Score {quiz.score}
              </span>
            </div>
            <div
              className="h-[3px] w-full bg-cream/10"
              role="progressbar"
              aria-valuenow={(quiz.finished ? TRIVIA_QUESTIONS.length : quiz.index) * 100 / TRIVIA_QUESTIONS.length}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quiz progress"
            >
              <motion.div
                className="h-full bg-yellow-walle"
                animate={{
                  width: `${((quiz.finished ? TRIVIA_QUESTIONS.length : quiz.index) / TRIVIA_QUESTIONS.length) * 100}%`,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {quiz.finished ? (
                  <motion.div
                    key="result"
                    initial={reduced ? false : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-yellow-walle bg-yellow-walle/10">
                      <Brain size={34} className="text-yellow-walle" aria-hidden="true" />
                    </div>
                    <p className="text-editorial mt-6 text-4xl text-cream sm:text-5xl">
                      {quiz.score} / {TRIVIA_QUESTIONS.length}
                    </p>
                    <p className="mt-3 text-lg text-cream/70">{grade}</p>

                    {/* answer recap */}
                    <ul className="mt-8 w-full max-w-md space-y-1.5 text-left">
                      {TRIVIA_QUESTIONS.map((q, i) => {
                        const ok = pickedHistory[i] === q.answerIndex
                        return (
                          <li
                            key={q.question}
                            className="flex items-center gap-3 border-b border-cream/10 pb-1.5 text-xs text-cream/60"
                          >
                            {ok ? (
                              <Check size={14} className="shrink-0 text-plant" aria-label="Correct" />
                            ) : (
                              <X size={14} className="shrink-0 text-rust" aria-label="Incorrect" />
                            )}
                            <span className="truncate">{q.question}</span>
                          </li>
                        )
                      })}
                    </ul>

                    <MechaButton onClick={restart} className="mt-9" ariaLabel="Restart the quiz">
                      <RotateCcw size={14} aria-hidden="true" /> Play again
                    </MechaButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key={quiz.index}
                    initial={reduced ? false : { opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="text-xl font-semibold leading-snug text-cream sm:text-2xl">
                      {question.question}
                    </h3>

                    <div className="mt-7 grid gap-3">
                      {question.options.map((opt, i) => {
                        const isCorrect = i === question.answerIndex
                        const isPicked = quiz.selected === i
                        const showState = answered && (isPicked || isCorrect)
                        return (
                          <motion.button
                            key={opt}
                            onClick={() => pick(i)}
                            disabled={answered}
                            whileHover={answered ? undefined : { x: 6 }}
                            transition={{ duration: 0.2 }}
                            aria-label={`Answer option: ${opt}`}
                            className={`flex cursor-pointer items-center justify-between gap-4 border px-5 py-4 text-left text-sm transition-colors duration-200 sm:text-[0.95rem] ${
                              showState
                                ? isCorrect
                                  ? 'border-plant bg-plant/12 text-plant'
                                  : 'border-rust bg-rust/12 text-rust'
                                : answered
                                  ? 'border-cream/10 text-cream/40'
                                  : 'border-cream/15 text-cream/80 hover:border-yellow-walle/60 hover:bg-yellow-walle/5 hover:text-yellow-walle'
                            } ${answered ? 'cursor-default' : ''}`}
                          >
                            <span className="flex items-center gap-4">
                              <span className="font-mono text-[0.62rem] tracking-[0.2em] opacity-60 uppercase">
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                            </span>
                            {showState &&
                              (isCorrect ? (
                                <Check size={17} aria-hidden="true" />
                              ) : isPicked ? (
                                <X size={17} aria-hidden="true" />
                              ) : null)}
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* feedback + next */}
                    <AnimatePresence>
                      {answered && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 flex flex-col gap-4 border-l-2 border-yellow-walle/60 bg-yellow-walle/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                          role="status"
                        >
                          <p className="text-sm leading-relaxed text-cream/75">
                            <span className="font-semibold text-yellow-walle">
                              {quiz.selected === question.answerIndex ? 'Correct! ' : 'Not quite. '}
                            </span>
                            {question.explanation}
                          </p>
                          <MechaButton
                            onClick={next}
                            variant="ghost"
                            className="shrink-0"
                            ariaLabel={isLast ? 'See results' : 'Next question'}
                          >
                            {isLast ? 'See results' : 'Next question'}
                          </MechaButton>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
