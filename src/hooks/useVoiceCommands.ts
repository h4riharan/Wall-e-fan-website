import { useEffect, useRef, useState, useCallback } from 'react'
import { VOICE_INTENTS } from '../data/engineering'
import type { RobotMood } from '../store/useInteractionStore'

/** Minimal structural typing for the Web Speech API (not in TS lib by default). */
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((e: SpeechRecognitionResultEventData) => void) | null
  onerror: ((e: { error?: string }) => void) | null
  onend: (() => void) | null
}
interface SpeechRecognitionResultEventData {
  results: { length: number; [i: number]: { [j: number]: { transcript: string } } }
  resultIndex: number
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

export interface VoiceState {
  supported: boolean
  listening: boolean
  lastHeard: string
  error: string | null
  toggle: () => void
  stop: () => void
}

/**
 * Optional voice commands via the browser SpeechRecognition API.
 * Works on Chrome, Edge and Safari/iOS (`webkitSpeechRecognition`).
 * Gracefully reports `supported: false` on Firefox or permission denied
 * so the UI can fall back to plain buttons.
 */
export function useVoiceCommands(onMood: (mood: RobotMood, label: string, reply: string) => void): VoiceState {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [lastHeard, setLastHeard] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const onMoodRef = useRef(onMood)
  onMoodRef.current = onMood

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor
      webkitSpeechRecognition?: SpeechRecognitionCtor
    }
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition
    if (!Ctor) return
    setSupported(true)

    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.continuous = true
    rec.interimResults = false

    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0]?.transcript ?? ''
        setLastHeard(transcript)
        for (const intent of VOICE_INTENTS) {
          if (intent.match.test(transcript)) {
            onMoodRef.current(intent.mood, intent.label, intent.reply)
            break
          }
        }
      }
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('Microphone permission denied - use the buttons instead.')
      } else if (e.error === 'no-speech') {
        setError(null)
      } else if (e.error === 'aborted') {
        // Safari/iOS aborts on interruptions (Siri, phone calls, tab switches).
        // onend will restart recognition if the user still expects listening mode.
        setError(null)
      } else {
        setError('Voice input hiccup - try the buttons instead.')
      }
      if (e.error !== 'no-speech' && e.error !== 'aborted') setListening(false)
    }
    rec.onend = () => {
      // Chrome stops after silence; Safari/iOS stops after nearly every phrase.
      // Restart with a short delay - an immediate start() can throw on iOS.
      if (recognitionRef.current === rec && listeningRef.current) {
        restartTimerRef.current = window.setTimeout(() => {
          if (recognitionRef.current !== rec || !listeningRef.current) return
          try {
            rec.start()
          } catch {
            // One retry shortly after; give up quietly if it still refuses.
            retryTimerRef.current = window.setTimeout(() => {
              if (recognitionRef.current !== rec || !listeningRef.current) return
              try {
                rec.start()
              } catch {
                setListening(false)
              }
            }, 500)
          }
        }, 250)
      }
    }

    recognitionRef.current = rec
    return () => {
      recognitionRef.current = null
      window.clearTimeout(restartTimerRef.current)
      window.clearTimeout(retryTimerRef.current)
      try {
        rec.stop()
      } catch {
        /* noop */
      }
    }
  }, [])

  const listeningRef = useRef(false)
  const restartTimerRef = useRef(0)
  const retryTimerRef = useRef(0)

  const stop = useCallback(() => {
    listeningRef.current = false
    setListening(false)
    setError(null)
    window.clearTimeout(restartTimerRef.current)
    window.clearTimeout(retryTimerRef.current)
    try {
      recognitionRef.current?.stop()
    } catch {
      /* noop */
    }
  }, [])

  const toggle = useCallback(() => {
    const rec = recognitionRef.current
    if (!rec) {
      setError('Voice input is not supported in this browser.')
      return
    }
    if (listeningRef.current) {
      stop()
      return
    }
    setError(null)
    try {
      rec.start()
      listeningRef.current = true
      setListening(true)
    } catch {
      setError('Could not start the microphone.')
      setListening(false)
    }
  }, [stop])

  return { supported, listening, lastHeard, error, toggle, stop }
}
