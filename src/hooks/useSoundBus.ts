import { Howl, Howler } from 'howler'
import { useInteractionStore } from '../store/useInteractionStore'

let clickHowl: Howl | null = null

/**
 * Module-level click sound, independent of React lifecycle so any UI element
 * can play it. Honors the sound toggle in the interaction store.
 */
export function playClick(): void {
  if (!useInteractionStore.getState().soundEnabled) return
  if (!clickHowl) {
    clickHowl = new Howl({ src: ['/sounds/click.wav'], volume: 0.5 })
  }
  clickHowl.play()
}

/** Fire-and-forget playback of any /sounds/<key>.wav by key. */
const cache = new Map<string, Howl>()
export function playSfx(key: string, volume = 0.9): void {
  if (!useInteractionStore.getState().soundEnabled) return
  let h = cache.get(key)
  if (!h) {
    h = new Howl({ src: [`/sounds/${key}.wav`], volume })
    cache.set(key, h)
  }
  if (!h.playing()) h.play()
}

/** Keep global Howler volume in sync with the toggle (no React needed). */
useInteractionStore.subscribe((state) => {
  Howler.volume(state.soundEnabled ? 0.8 : 0)
  if (!state.soundEnabled) Howler.stop()
})
