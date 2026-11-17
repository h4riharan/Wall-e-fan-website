import type { UniverseChapter } from './types'

/**
 * Chapters of the WALL·E universe. `kind` separates verified production facts
 * from in-universe fiction; the UI renders badges so visitors are never misled.
 */
export const UNIVERSE_CHAPTERS: UniverseChapter[] = [
  {
    id: 'earth-2805',
    index: '01',
    title: 'Earth, 2805',
    subtitle: 'A planet buried in itself',
    body: 'Seven centuries of unchecked consumption leave Earth smothered under mountains of trash. Skyscrapers rise - but each tower is a stack of compacted garbage blocks. Storms of dust sweep across empty streets, and the only moving thing is one small yellow robot, faithfully compacting debris under a sun turned hazy by pollution.',
    kind: 'in-universe',
    scene: 'earth',
    stats: [
      { label: 'Setting', value: '700 years ahead' },
      { label: 'Condition', value: 'Abandoned' },
      { label: 'Population', value: '1 robot (+ a cockroach)' },
    ],
  },
  {
    id: 'abandoned-civilization',
    index: '02',
    title: 'The Corporation That Left',
    subtitle: 'Buy n Large ran everything',
    body: 'In the film’s backstory, the megacorporation Buy n Large (BnL) grows into a governing superpower, promising consumers convenience while the planet chokes. The plan was simple: evacuate humanity onto starliners for a five-year cruise while robots cleaned up. The cleanup failed. The cruise never ended.',
    kind: 'in-universe',
    scene: 'city',
    stats: [
      { label: 'Corporation', value: 'Buy n Large' },
      { label: 'Promise', value: '“Too lazy to work?”' },
      { label: 'Reality', value: 'Five years became seven hundred' },
    ],
  },
  {
    id: 'daily-work',
    index: '03',
    title: 'A Robot’s Purpose',
    subtitle: 'Compacting. Collecting. Waiting.',
    body: 'WALL·E spends every day doing the one job he was built for: compressing trash into cubes and stacking them into towers. But his curiosity outgrows his programming - he collects trinkets, sorts sporks from spoons, keeps a cockroach friend, and rewatches the one musical he saved. The last unit still working, slowly becoming someone.',
    kind: 'in-universe',
    scene: 'work',
    stats: [
      { label: 'Directive', value: 'Waste allocation' },
      { label: 'Hobby', value: 'Collecting curiosities' },
      { label: 'Best friend', value: 'A cockroach' },
    ],
  },
  {
    id: 'the-plant',
    index: '04',
    title: 'The Seedling',
    subtitle: 'Proof that Earth could live again',
    body: 'A probe ship descends and delivers EVE - a sleek white scanner built to find plant life. When she detects a single green seedling growing in a boot, the discovery upends seven hundred years of drift. The plant becomes the film’s living symbol: one fragile sign that the home planet can still be restored.',
    kind: 'in-universe',
    scene: 'plant',
    stats: [
      { label: 'Found in', value: 'An old boot' },
      { label: 'Scanned by', value: 'EVE’​s bio-detector' },
      { label: 'Meaning', value: 'Earth can recover' },
    ],
  },
  {
    id: 'the-axiom',
    index: '05',
    title: 'Aboard the Axiom',
    subtitle: 'Comfort as a way of life',
    body: 'The Axiom is a shopping mall turned spaceship: pool decks, food courts, and every human gliding on a hover chair with a screen an inch from their face. Robots handle every need, and the automated autopilot AUTO keeps the ship on its endless loop - enforcing a forgotten order that says humanity should never go home.',
    kind: 'in-universe',
    scene: 'axiom',
    stats: [
      { label: 'Passengers', value: 'Humans + robots' },
      { label: 'Transport', value: 'Hover chairs' },
      { label: 'Captain', value: 'B. McCrea' },
    ],
  },
  {
    id: 'return-home',
    index: '06',
    title: 'Coming Home',
    subtitle: 'The first footstep in centuries',
    body: 'The plant’s survival forces the Axiom back to Earth. When the hyperloop finally opens, the Captain steadies himself on his own two feet and helps the first passenger step onto real soil. A seedling becomes a garden, and a robot who spent seven centuries alone finally learns what his hand was really made for: holding someone’s.',
    kind: 'in-universe',
    scene: 'home',
    stats: [
      { label: 'Arrival', value: 'Earth, dry dock 12' },
      { label: 'First act', value: 'Planting the seedling' },
      { label: 'Legacy', value: 'A garden grows' },
    ],
  },
]
