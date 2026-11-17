/**
 * Generates all original, procedurally-synthesized audio for the site into
 * public/sounds/ as 16-bit mono WAV files. Run once:
 *
 *   node scripts/generate-sounds.mjs
 *
 * Sound design notes: everything is built from pure/few-harmonic sine tones
 * with vibrato and amplitude "tremolo" texture — the mechanical chirp language
 * of a certain trash-compacting robot. NO filtered-noise sweeps (those buzz).
 * 100% original audio; no copyrighted movie sound is redistributed.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SR = 22050
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sounds')
mkdirSync(OUT, { recursive: true })

const TAU = Math.PI * 2

/** One expressive robotic tone: glide + vibrato + harmonics + tremolo. */
function tone(t0, dur, freq, opts = {}) {
  const {
    gain = 0.3,
    glideTo,            // end frequency (Hz) — linear glide
    vibrato = 6,        // Hz
    vibratoDepth = 0.015, // fraction of freq
    tremolo = 0,        // Hz amplitude wobble (mechanical texture)
    harmonics = [1, 0.25, 0.08], // relative partial gains
    attack = 0.012,
    release = 0.85,     // fraction of dur where decay happens
    seed = 7,           // unused, kept for API compat
  } = opts
  return (s) => {
    const start = Math.floor(t0 * SR)
    const len = Math.floor(dur * SR)
    let phase = 0
    for (let i = 0; i < len; i++) {
      const p = i / len
      const f = glideTo ? freq + (glideTo - freq) * p : freq
      phase += (TAU * f) / SR
      const vib = Math.sin(TAU * vibrato * p) * vibratoDepth
      let v = 0
      for (let h = 0; h < harmonics.length; h++) {
        v += Math.sin(phase * (h + 1) * (1 + vib)) * harmonics[h]
      }
      let env = Math.min(1, i / (attack * SR))
      const relStart = 1 - release
      if (p > relStart) env *= Math.pow(1 - (p - relStart) / release, 1.4)
      if (tremolo > 0) env *= 0.78 + 0.22 * Math.sin(TAU * tremolo * p)
      const idx = start + i
      if (idx < s.length) s[idx] += v * env * gain
    }
  }
}

/** Clean "beep-boop" glissando — the workhorse. */
function chirp(t0, dur, from, to, opts = {}) {
  return tone(t0, dur, from, { glideTo: to, ...opts })
}

function make(duration, builders, peak = 0.85) {
  const s = new Float64Array(Math.ceil(duration * SR))
  builders.forEach((b) => b(s))
  let max = 0
  for (const v of s) max = Math.max(max, Math.abs(v))
  if (max > 0) for (let i = 0; i < s.length; i++) s[i] = (s[i] / max) * peak
  return Array.from(s)
}

const sounds = {
  // UI feedback — tiny clean blip
  'click.wav': make(0.09, [chirp(0, 0.08, 1500, 1000, { gain: 0.5, harmonics: [1, 0.15] })]),

  // Servo — smooth two-phase glide whine, no noise
  'servo.wav': make(0.5, [
    chirp(0, 0.22, 240, 480, { gain: 0.32, vibrato: 9, vibratoDepth: 0.02, tremolo: 14, harmonics: [1, 0.35, 0.1] }),
    chirp(0.24, 0.24, 480, 300, { gain: 0.28, vibrato: 9, vibratoDepth: 0.02, tremolo: 14, harmonics: [1, 0.3, 0.08] }),
  ]),

  // Greet — "wa-ALL-E" sung by a binocular robot
  'greet.wav': make(0.95, [
    chirp(0, 0.2, 392, 494, { gain: 0.34, vibrato: 7, vibratoDepth: 0.02, harmonics: [1, 0.3, 0.1] }),
    chirp(0.22, 0.22, 587, 659, { gain: 0.36, vibrato: 7, vibratoDepth: 0.02, harmonics: [1, 0.3, 0.1] }),
    chirp(0.48, 0.42, 659, 440, { gain: 0.36, vibrato: 6, vibratoDepth: 0.025, tremolo: 9, harmonics: [1, 0.32, 0.12] }),
  ]),

  // Happy — bright rising arpeggio with a joyful wobble
  'happy.wav': make(1.0, [
    tone(0, 0.14, 523, { gain: 0.3, tremolo: 12, harmonics: [1, 0.28, 0.1] }),
    tone(0.15, 0.14, 659, { gain: 0.3, tremolo: 12, harmonics: [1, 0.28, 0.1] }),
    tone(0.3, 0.14, 784, { gain: 0.32, tremolo: 12, harmonics: [1, 0.28, 0.1] }),
    chirp(0.45, 0.5, 784, 1047, { gain: 0.34, vibrato: 10, vibratoDepth: 0.02, tremolo: 10, harmonics: [1, 0.3, 0.12] }),
  ]),

  // Curious — rising question, then a thoughtful lower hum
  'curious.wav': make(0.95, [
    chirp(0, 0.3, 622, 932, { gain: 0.34, vibrato: 8, vibratoDepth: 0.03, harmonics: [1, 0.28, 0.1] }),
    tone(0.34, 0.16, 932, { gain: 0.24, vibrato: 8, vibratoDepth: 0.03, harmonics: [1, 0.25] }),
    chirp(0.52, 0.4, 622, 466, { gain: 0.28, vibrato: 6, vibratoDepth: 0.03, tremolo: 8, harmonics: [1, 0.3, 0.12] }),
  ]),

  // Sleep — slow soft descending lull with a low hum underneath
  'sleep.wav': make(2.4, [
    chirp(0, 1.1, 523, 392, { gain: 0.2, vibrato: 4, vibratoDepth: 0.02, attack: 0.2, harmonics: [1, 0.2, 0.06] }),
    chirp(1.15, 1.1, 392, 262, { gain: 0.18, vibrato: 3.5, vibratoDepth: 0.02, attack: 0.25, harmonics: [1, 0.2, 0.06] }),
    tone(0, 2.3, 131, { gain: 0.1, vibrato: 2, vibratoDepth: 0.01, attack: 0.5, harmonics: [1, 0.3] }),
  ]),

  // Explore — rolling treads beeps + a scanning sweep
  'explore.wav': make(1.7, [
    tone(0.05, 0.1, 220, { gain: 0.26, tremolo: 16, harmonics: [1, 0.4, 0.15] }),
    tone(0.4, 0.1, 262, { gain: 0.26, tremolo: 16, harmonics: [1, 0.4, 0.15] }),
    tone(0.75, 0.1, 220, { gain: 0.26, tremolo: 16, harmonics: [1, 0.4, 0.15] }),
    tone(1.1, 0.12, 294, { gain: 0.26, tremolo: 16, harmonics: [1, 0.4, 0.15] }),
    chirp(0.15, 0.25, 880, 1175, { gain: 0.24, vibrato: 10, vibratoDepth: 0.02, harmonics: [1, 0.25] }),
    chirp(0.8, 0.3, 988, 1319, { gain: 0.24, vibrato: 10, vibratoDepth: 0.02, harmonics: [1, 0.25] }),
    tone(1.35, 0.3, 1568, { gain: 0.26, tremolo: 8, harmonics: [1, 0.25, 0.1] }),
  ]),

  // Dance — bouncy little mechanical jig (minor-leaning, playful)
  'dance.wav': make(2.8, [
    tone(0.0, 0.16, 587, { gain: 0.3, tremolo: 10, harmonics: [1, 0.3, 0.12] }),
    tone(0.18, 0.16, 698, { gain: 0.3, tremolo: 10, harmonics: [1, 0.3, 0.12] }),
    tone(0.36, 0.16, 587, { gain: 0.3, tremolo: 10, harmonics: [1, 0.3, 0.12] }),
    tone(0.54, 0.3, 880, { gain: 0.32, vibrato: 8, vibratoDepth: 0.02, tremolo: 8, harmonics: [1, 0.3, 0.12] }),
    tone(0.92, 0.16, 784, { gain: 0.3, tremolo: 10, harmonics: [1, 0.3, 0.12] }),
    tone(1.1, 0.16, 988, { gain: 0.3, tremolo: 10, harmonics: [1, 0.3, 0.12] }),
    tone(1.28, 0.16, 880, { gain: 0.3, tremolo: 10, harmonics: [1, 0.3, 0.12] }),
    tone(1.46, 0.4, 1175, { gain: 0.32, vibrato: 8, vibratoDepth: 0.02, tremolo: 8, harmonics: [1, 0.3, 0.12] }),
    chirp(1.95, 0.75, 880, 587, { gain: 0.28, vibrato: 6, vibratoDepth: 0.025, tremolo: 7, harmonics: [1, 0.32, 0.12] }),
  ]),

  // Ambience — seamless ~8 s loop: soft desert wind + distant machine hum
  'ambience.wav': (() => {
    const dur = 8
    const s = new Float64Array(dur * SR)
    // pink-ish noise via cascaded one-pole lowpasses (deep, non-buzzy rumble)
    let randState = 12345
    const rand = () => {
      randState = (randState * 1103515245 + 12345) & 0x7fffffff
      return randState / 0x3fffffff - 1
    }
    let lp1 = 0
    let lp2 = 0
    for (let i = 0; i < s.length; i++) {
      lp1 += 0.012 * (rand() - lp1)
      lp2 += 0.05 * (lp1 - lp2)
      s[i] = lp2
    }
    // hums at integer multiples of 1/dur → seamless loop, with slow tremolo
    const hums = [
      [1, 0.4, 0.08],
      [2, 0.55, 0.04],
      [4, 0.25, 0.05],
    ]
    for (const [harm, gain, wob] of hums) {
      for (let i = 0; i < s.length; i++) {
        const p = i / s.length
        const wobV = Math.sin(TAU * 2 * p) * wob
        const trem = 0.8 + 0.2 * Math.sin(TAU * 2 * p + harm)
        s[i] += Math.sin(TAU * harm * p + wobV) * gain * 0.5 * trem
      }
    }
    // crossfade tail into head for a perfect loop
    const xf = Math.floor(0.5 * SR)
    for (let i = 0; i < xf; i++) {
      const p = i / xf
      s[i] = s[i] * p + s[s.length - xf + i] * (1 - p)
    }
    let peak = 0
    for (const v of s) peak = Math.max(peak, Math.abs(v))
    for (let i = 0; i < s.length; i++) s[i] = (s[i] / peak) * 0.42
    return toWav(Array.from(s))
  })(),
}

function toWav(samples) {
  const n = samples.length
  const buf = Buffer.alloc(44 + n * 2)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + n * 2, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20) // PCM
  buf.writeUInt16LE(1, 22) // mono
  buf.writeUInt32LE(SR, 24)
  buf.writeUInt32LE(SR * 2, 28)
  buf.writeUInt16LE(2, 32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36)
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]))
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2)
  }
  return buf
}

for (const [name, samples] of Object.entries(sounds)) {
  const wav = toWav(samples)
  writeFileSync(join(OUT, name), wav)
  console.log(`wrote public/sounds/${name} (${(wav.length / 1024).toFixed(1)} KB)`)
}
