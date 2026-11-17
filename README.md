# WALL·E - Beyond the Screen

An interactive, cinematic fan website for the Disney·Pixar film **WALL·E (2008)**, built for the
office **Desathon** competition. The centerpiece is a virtual, original WALL·E-inspired robot you
can play with - it follows your cursor, blinks, waves, dances, answers questions out loud, and
reacts when you click its head, chest, lid or treads.

> **Project Credits: Indhu & Team**
>
> Unofficial fan project. Not affiliated with, endorsed by, or sponsored by Disney or Pixar.
> All 3D art, illustrations and audio on this site are original; no movie footage or audio is
> redistributed.

---

## Tech stack - and how each piece is used

| Layer | Tool (version) | How it is used here |
| --- | --- | --- |
| Framework | React 19.3 + TypeScript 7 + Vite 8 (rolldown) | SPA with lazy-loaded route-level chunks; `React.lazy` keeps Three.js (~950 kB) out of the first paint. StrictMode-safe effects everywhere. |
| Styling | Tailwind CSS v4.3 (`@tailwindcss/vite`) | CSS-first `@theme` design tokens in `src/styles/index.css`: the charcoal/amber "rust" palette, mono label type, hazard-stripe and glass-panel utilities. No config file - the theme IS the CSS. |
| Animation (UI) | Motion 14 (`motion/react`) | Section/element entrances (`whileInView`), micro-interactions (`whileHover` / `whileTap`), and `useReducedMotion` gating for every animated element. |
| Scroll choreography | GSAP 3.15 + ScrollTrigger, Lenis 1.3 | Lenis drives smooth wheel scrolling and exposes `window.__lenis` for programmatic scroll. ScrollTrigger powers the pinned horizontal Timeline and parallax in the Universe section. Every GSAP context is reverted on cleanup and guarded for StrictMode double-invoke. |
| 3D | Three.js 0.187 + @react-three/fiber 9.8 + Drei 10.7 | The robot is 100% procedural - no external models. Geometry primitives + canvas-generated texture maps (weathered paint, rust, roughness). Drei provides `RoundedBox`, `OrbitControls` (damped, angle-limited) and `ContactShadows`. Rendered in a lazy chunk with a `Suspense` SVG fallback while loading. |
| Audio | Howler.js 2.2 | Global sound bus (`useSoundBus`): play SFX by name, global volume synced to the sound toggle. All WAVs are synthesized offline (see below), sound is OFF by default. |
| Voice | Web Speech API (built-in) | `SpeechRecognition` for commands (Chrome/Edge; graceful "not supported" elsewhere) and `SpeechSynthesis` for WALL·E's spoken replies - pitched to 0.45 / rate 0.88 for a robotic voice. No keys, no cloud SDKs. |
| State | Zustand 5.1 | One tiny store (`useInteractionStore`): current mood, gaze target, sound enabled, caption text, reduced-motion flag. The 3D robot, SVG robot and caption bar all subscribe to it. |
| Icons | lucide-react 1.73 | All UI iconography (no brand icons). |

---

## Architecture

```
                              BROWSER
                                 |
        +------------------------+--------------------------+
        |                        |                          |
   INPUT LAYER             REACT APP (Vite)              PRESENTATION
        |                        |                          |
  wheel / touch            sections/ (9 sections)      3D: RobotScene
  microphone               components/ (layout,          (R3F Canvas, lazy)
  clicks / taps               character, ui)               - procedural geometry
        |                        |                          - canvas textures
        v                        v                          - hotspots, eyes, arms
  +-----------+          +----------------+                 |
  |   Lenis   |          |     Zustand    |<----------------+  reads mood/gaze
  |  smooth   |<---------|  useInteraction|  caption text       (useFrame loop)
  |  scroll   |  scroll  |     Store      |
  +-----------+  events  |  mood | gaze |          SVG: SVGRobot
        |                |  sound| cap  |          (WebGL fallback)
        v                +---+---+--------+
  GSAP ScrollTrigger         |                      AUDIO PIPELINE
  - pinned horizontal    dispatches                    scripts/generate-sounds.mjs
    Timeline (desktop)       |                         (offline, node) -->
  - Universe parallax        |                           public/sounds/*.wav
  - reveal animations        |                                 |
        |                    |                                 v
        +--------------------+------------  Howler (useSoundBus) --> speakers
                             |
                    POSE ENGINE (shared)
                    RobotAnimations.ts
                    computePose(mood, t, look)
                             |
             +---------------+----------------+
             |                                |
       3D apply loop                    SVG apply loop
       RobotModel.tsx                   SVGRobot.tsx
       (arm z-rotation, head            (transform attributes,
        yaw/pitch, eye lids,            mirrored y-axis)
        pupils, treads, body bob)
             |
        SPEECH PIPELINE
        Web Speech API
        transcript -> VOICE_INTENTS
        (regex, first match wins)
             |                        |
        matched intent           no match -> ignored
        mood + caption +
        SpeechSynthesis reply
        (pitch 0.45, rate 0.88)
```

### Key architectural decisions

- **One pose engine, two renderers.** `RobotAnimations.ts` computes a declarative `RobotPose`
  (head angles, eye lids, arm raise, body bob, tread spin) every frame. `RobotModel.tsx` and
  `SVGRobot.tsx` only *apply* it - so the WebGL robot and the accessibility fallback always
  behave identically.
- **Arm sign convention.** In three.js a positive Z-rotation swings a downward-pointing arm to
  the RIGHT, so the right arm raises outward with `+` and the left with `-`; the SVG robot
  mirrors both because its y-axis points down. This keeps the plate-fork claws clear of the
  torso during the wave and dance.
- **Plate-fork gripper hands.** Matching the team's physical prototype: wrist disc, vertical
  back plate, flat top/bottom prongs, bent tips, and a rust thumb plate - no fingers.
- **Responsive camera framing.** A `Framing` component sets camera distance
  `max(3.6, 3.55 / aspect)` so portrait canvases (phones) pull back and the outstretched arms
  stay in frame; desktop keeps the cinematic 3.6.
- **Procedural everything.** Body/roughness textures are painted onto canvases at runtime;
  sounds are synthesized offline. Zero binary assets beyond favicon + generated WAVs.
- **Data-driven content.** All copy lives in typed files under `src/data/`; sections are
  presentational and map over it.

---

## Getting started

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # type-check + production build
npm run preview   # preview the production build
```

Regenerate the synthesized sound files (only needed if you change the script):

```bash
node scripts/generate-sounds.mjs
```

---

## What's inside

- **Cinematic hero** - full-screen dusk intro with the interactive 3D robot, dust motes, SVG
  ruined skyline, animated scroll cue and dual CTAs.
- **Virtual WALL·E** (`src/three/`) - original procedural robot with weathered-yellow canvas
  textures, blinking binocular eyes that track the cursor, clickable hotspots (head = happy,
  chest = curious, solar lid = greet, treads = explore), and 9 moods: idle, greet, happy,
  curious, sleep, lookLeft/Right, explore, dance.
- **Movie overview** - verified production facts and the full synopsis (no spoiler gates - the
  whole story is on the table).
- **Universe** - six illustrated chapters with badges separating *verified facts* from
  *in-universe fiction*, with GSAP parallax backdrops.
- **Characters** - WALL·E, EVE, M-O, AUTO and Captain McCrea as original SVG portraits with
  hover reveals.
- **Timeline** - GSAP-pinned horizontal scroll on desktop (compact heading, progress rail,
  slim cards so everything fits one viewport); vertical card list on mobile / reduced motion.
- **Engineering** - real robotics concepts (tracked movement, DC motors, motor drivers, MCUs,
  ultrasonic sensors, servos, vision, power budget) with interactive SVG diagrams, plus
  **"Building Our Own WALL·E"** documenting the team's physical prototype. Fiction is never
  presented as hardware specification.
- **Playground** - command deck of 8 mood buttons, the same 8 as quick-action chips, a mic
  button for spoken commands, and a live caption bar.
- **Voice** - WALL·E understands conversational questions ("who are you?", "who is EVE?",
  "who is AUTO?", "what's your directive?", "sing!", "goodbye"...) matched before action words.
  Answers appear as captions and are spoken aloud (browser TTS) when sound is on. Limits: the
  recognizer is Chrome/Edge-only and matching is regex-based over a fixed intent list, so
  unlisted phrasings are ignored silently.
- **Trivia** - 10-question quiz with instant feedback, explanations, scoring and a restart.
- **Sound** - disabled by default; toggle in the navbar or footer. Nine synthesized WAVs
  (click, servo, greet, happy, curious, sleep, explore, dance, ambience) built from pure
  harmonic tones with vibrato and tremolo - deliberately no filtered-noise sweeps (they buzz).

---

## Accessibility & performance

- `prefers-reduced-motion` disables Lenis, GSAP pinning and heavy animation.
- Keyboard-focusable controls with visible focus rings, skip link, `aria-live` status captions,
  meaningful labels on icon buttons and the canvas.
- No horizontal overflow; WebGL detection with automatic SVG-robot fallback and error boundary.
- Three.js is code-split and lazy-loaded; textures are procedurally generated at runtime.
- Mobile-first checks at 390px: compounding navbar, stacked hero, 2-column command deck,
  vertical timeline, portrait camera framing.

---

## Project structure

```
src/
  components/
    layout/       Navbar · Footer · mobile menu
    character/    SVGRobot · character portraits
    ui/           SectionHeading · shared primitives
  sections/       Hero · MovieOverview · Universe · Characters ·
                  Timeline · Engineering · Playground · Trivia
  three/          RobotScene (canvas, lights, dust, framing, controls)
                  RobotModel (procedural geometry, hotspots, apply loop)
                  RobotAnimations (shared pose engine)
                  RobotStage (lazy loader + WebGL fallback)
  hooks/          useLenis · useGaze · useSoundBus · useVoiceCommands ·
                  useWebGL · useReducedMotion
  store/          useInteractionStore - mood, gaze, sound, captions
  data/           movie · universe · characters · engineering · types
  styles/         index.css - Tailwind v4 @theme design system
scripts/          generate-sounds.mjs - synthesizes all WAV assets
                  replace-dashes.mjs - one-off codemod (em dash -> hyphen)
public/           favicon + generated sounds
```

---

© 2026 · Indhu & Team · Made with curiosity for the office Desathon.
