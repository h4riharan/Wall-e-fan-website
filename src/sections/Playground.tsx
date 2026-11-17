import { useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Hand, Smile, Search, Moon, ArrowLeft, ArrowRight, Compass, Music,
  Mic, MicOff, AlertCircle, MessageCircleQuestion,
} from 'lucide-react'
import { RobotStage } from '../three/RobotStage'
import { SectionHeading } from '../components/ui/SectionHeading'
import { PLAYGROUND_COMMANDS } from '../data/engineering'
import { useInteractionStore, type RobotMood } from '../store/useInteractionStore'
import { playSfx } from '../hooks/useSoundBus'
import { useVoiceCommands } from '../hooks/useVoiceCommands'

const ICONS: Record<string, typeof Hand> = {
  hand: Hand,
  smile: Smile,
  search: Search,
  moon: Moon,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  compass: Compass,
  music: Music,
}

/** Speak a reply in a low, slow, robotic-ish tone (browser TTS, no API key). */
function speakRobotic(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.pitch = 0.45
  u.rate = 0.88
  u.volume = 0.9
  // iOS Safari: a tiny delay after cancel() - otherwise the new utterance
  // can be silently dropped while the engine resets.
  window.setTimeout(() => window.speechSynthesis.speak(u), 60)
}

/**
 * iOS Safari only allows speech synthesis after the engine has been started
 * from inside a user gesture at least once. Calling this on the first tap
 * (mic button, command button, chip) "unlocks" TTS for the whole session.
 */
function unlockSpeech() {
  if (!('speechSynthesis' in window)) return
  const warm = new SpeechSynthesisUtterance(' ')
  warm.volume = 0.01
  window.speechSynthesis.speak(warm)
}

export function Playground() {
  const reduced = useReducedMotion()
  const setMood = useInteractionStore((s) => s.setMood)
  const soundEnabled = useInteractionStore((s) => s.soundEnabled)
  const caption = useInteractionStore((s) => s.caption)
  const mood = useInteractionStore((s) => s.mood)

  /** Fire an intent: sound effect + mood + caption + optional spoken reply. */
  const fire = useCallback(
    (m: RobotMood, caption: string, sound: string, reply?: string) => {
      playSfx(sound)
      setMood(m, reply ?? caption)
      if (soundEnabled && reply) speakRobotic(reply)
    },
    [setMood, soundEnabled],
  )

  const onMood = useCallback(
    (m: RobotMood, label: string, reply: string) => {
      const cmd = PLAYGROUND_COMMANDS.find((c) => c.mood === m)
      fire(m, `${label} - voice command!`, cmd?.sound ?? 'servo', reply)
    },
    [fire],
  )

  const voice = useVoiceCommands(onMood)

  /** Any first gesture in the playground unlocks iOS speech synthesis. */
  const unlockTTSOnce = useCallback(() => unlockSpeech(), [])

  const toggleVoice = () => {
    unlockTTSOnce()
    voice.toggle()
  }

  const trigger = (id: string) => {
    unlockTTSOnce()
    const cmd = PLAYGROUND_COMMANDS.find((c) => c.id === id)
    if (!cmd) return
    playSfx(cmd.sound)
    setMood(cmd.mood, cmd.caption)
  }

  return (
    <section
      id="playground"
      className="relative overflow-hidden bg-charcoal-soft py-24 sm:py-32"
      aria-labelledby="playground-title"
    >
      {/* ambient backdrop glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,179,16,0.08)_0%,transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          label="Play With WALL·E"
          title={
            <span id="playground-title">
              Say hello to <span className="text-yellow-walle">the little robot</span>
            </span>
          }
          lead="Every button and quick action triggers a real character animation. Enable sound in the top bar to hear him talk."
        />

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-[1fr_1.15fr]">
          {/* ---- command deck ---- */}
          <div className="flex flex-col">
            <div className="glass-panel rounded-sm p-6 sm:p-8">
              <p className="text-label mb-5 flex items-center justify-between text-yellow-walle">
                Command Deck
                <span className="text-cream/35">08 modes</span>
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {PLAYGROUND_COMMANDS.map((cmd, i) => {
                  const Icon = ICONS[cmd.icon] ?? Hand
                  const isActive = mood === cmd.mood
                  return (
                    <motion.button
                      key={cmd.id}
                      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={reduced ? undefined : { y: -3 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => trigger(cmd.id)}
                      aria-label={`${cmd.label} - ${cmd.caption}`}
                      aria-pressed={isActive}
                      className={`group flex cursor-pointer flex-col items-center gap-2 border px-3 py-4 outline-none transition-colors duration-200 ${
                        isActive
                          ? 'border-yellow-walle bg-yellow-walle/10 text-yellow-walle'
                          : 'border-cream/12 bg-charcoal/60 text-cream/75 hover:border-yellow-walle/50 hover:text-yellow-walle'
                      }`}
                    >
                      <Icon
                        size={20}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                      />
                      <span className="text-center font-mono text-[0.58rem] leading-tight tracking-[0.14em] uppercase">
                        {cmd.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* quick action chips - the classic command set */}
              <div className="mt-6 border-t border-cream/10 pt-5">
                <p className="text-label mb-3 flex items-center gap-2 text-eveblue">
                  <MessageCircleQuestion size={13} aria-hidden="true" /> Quick Actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {PLAYGROUND_COMMANDS.map((cmd) => (
                    <motion.button
                      key={cmd.id}
                      whileHover={reduced ? undefined : { y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => trigger(cmd.id)}
                      aria-label={`Quick action: ${cmd.label}`}
                      className="cursor-pointer border border-cream/12 bg-charcoal/60 px-3.5 py-2 font-mono text-[0.6rem] tracking-[0.12em] text-cream/70 uppercase transition-colors hover:border-eveblue/60 hover:text-eveblue"
                    >
                      {cmd.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* voice controls */}
              <div className="mt-5 border-t border-cream/10 pt-5">
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVoice}
                    aria-pressed={voice.listening}
                    aria-label={
                      voice.supported
                        ? voice.listening
                          ? 'Stop voice commands'
                          : 'Start voice commands'
                        : 'Voice commands unavailable in this browser'
                    }
                    className={`inline-flex cursor-pointer items-center gap-2.5 border px-4 py-2.5 font-mono text-[0.62rem] tracking-[0.18em] uppercase transition-colors ${
                      voice.listening
                        ? 'border-plant bg-plant/15 text-plant'
                        : 'border-cream/15 text-cream/70 hover:border-yellow-walle hover:text-yellow-walle'
                    } ${!voice.supported ? 'opacity-60' : ''}`}
                  >
                    {voice.listening ? <Mic size={15} aria-hidden="true" /> : <MicOff size={15} aria-hidden="true" />}
                    {voice.supported
                      ? voice.listening
                        ? 'Listening… tap to stop'
                        : 'Try voice commands'
                      : 'Voice: not supported'}
                  </motion.button>
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] text-cream/40 uppercase">
                    Try: “hello” · “dance” · “sleep” · “look left”
                  </p>
                </div>

                {(voice.error || (voice.listening && voice.lastHeard)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 flex items-start gap-2 border px-3 py-2 text-xs ${
                      voice.error
                        ? 'border-rust/40 bg-rust/10 text-rust'
                        : 'border-cream/15 bg-charcoal/60 text-cream/60'
                    }`}
                    role="status"
                  >
                    {voice.error ? (
                      <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <Mic size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {voice.error ?? `Heard: “${voice.lastHeard}”`}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* live caption */}
            <div className="glass-panel mt-5 flex items-center gap-4 rounded-sm px-6 py-4" role="status" aria-live="polite">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  mood === 'sleep' ? 'bg-cream/30' : 'bg-plant animate-pulse'
                }`}
                aria-hidden="true"
              />
              <p className="font-mono text-[0.68rem] leading-relaxed tracking-[0.14em] text-cream/75 uppercase">
                {caption}
              </p>
            </div>
          </div>

          {/* ---- the robot ---- */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[460px] border border-cream/10 bg-[radial-gradient(90%_80%_at_50%_20%,#2c2416_0%,#1a150c_70%)] sm:h-[540px] lg:h-[640px]"
          >
            {/* corner brackets - industrial frame */}
            <div className="pointer-events-none absolute inset-3" aria-hidden="true">
              {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map(
                (pos) => (
                  <span key={pos} className={`absolute h-6 w-6 border-yellow-walle/40 ${pos}`} />
                ),
              )}
            </div>
            <RobotStage className="h-full w-full" showCaption={false} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
