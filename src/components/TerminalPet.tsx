import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { EGG_EVENT, type EggType, triggerEgg } from '@/lib/easterEggs';
import { playSound } from '@/lib/sound';
import type { BrandId } from '@/lib/brandIds';

// A small pixel pet that wanders along the bottom of the terminal, like a VS Code pet.
// Original pixel art drawn from code (no image files). Click it, or type `pet`, to make it happy.
// A pet can also open a full game: see `gameEgg` below (used by the Google-theme Dino).

export type PetKind = 'critter' | 'duck' | 'dino' | 'siri' | 'metaai' | 'reel' | 'box' | 'bot' | 'ping' | 'cursor' | 'sprout';
type Mode = 'idle' | 'walk' | 'sleep' | 'happy';

// Which theme gets which pet
export const PET_FOR_BRAND: Partial<Record<BrandId, PetKind>> = {
  signal: 'ping',
  microsoft: 'duck', anthropic: 'critter', google: 'dino', apple: 'siri', meta: 'metaai',
  netflix: 'reel', amazon: 'box', openai: 'bot',
  syntax: 'cursor', atelier: 'sprout',
};

/* --------------------------- Pet on/off (global) ---------------------------
   A visitor-level preference, independent of theme: `pets off` in the terminal
   hides the pet everywhere; `pets on` (or bare `pets` again) brings it back. */

const PET_ENABLED_KEY = 'npro-pet-enabled';
const PET_ENABLED_EVENT = 'npro-pet-enabled-change';

export const isPetEnabled = (): boolean => {
  try {
    return localStorage.getItem(PET_ENABLED_KEY) !== 'off';
  } catch {
    return true;
  }
};

export const setPetEnabled = (enabled: boolean) => {
  try {
    localStorage.setItem(PET_ENABLED_KEY, enabled ? 'on' : 'off');
  } catch {
    // Storage blocked: the setting just won't persist.
  }
  window.dispatchEvent(new Event(PET_ENABLED_EVENT));
};

const subscribePetEnabled = (onChange: () => void) => {
  window.addEventListener(PET_ENABLED_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(PET_ENABLED_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

export const usePetEnabled = (): boolean => useSyncExternalStore(subscribePetEnabled, isPetEnabled, () => true);

const SCALE = 4; // screen pixels per sprite pixel
const SPEED = 46; // px per second

const blank = (w: number, h: number) => Array.from({ length: h }, () => Array<string>(w).fill('.'));
const span = (g: string[][], row: number, from: number, to: number, ch: string) => {
  for (let x = from; x <= to; x++) g[row][x] = ch;
};

// Warm orange critter with stubby legs (12 x 9)
const critterFrame = (eyes: 'open' | 'closed' | 'happy', legs: 'A' | 'B') => {
  const g = blank(12, 9);
  [[2, 9], [1, 10], [0, 11], [0, 11], [0, 11], [0, 11], [0, 11]].forEach(([from, to], row) => span(g, row, from, to, 'o'));
  span(g, 6, 0, 11, 'd');
  if (eyes === 'open') [[3, 3], [3, 8], [4, 3], [4, 8]].forEach(([r, c]) => (g[r][c] = 'k'));
  if (eyes === 'closed') [[4, 3], [4, 4], [4, 7], [4, 8]].forEach(([r, c]) => (g[r][c] = 'k'));
  if (eyes === 'happy') [[3, 3], [3, 8], [4, 2], [4, 4], [4, 7], [4, 9]].forEach(([r, c]) => (g[r][c] = 'k'));
  g[5][2] = 'p';
  g[5][9] = 'p';
  (legs === 'A' ? [1, 2, 9, 10] : [3, 4, 7, 8]).forEach(c => {
    g[7][c] = 'd';
    g[8][c] = 'd';
  });
  return g.map(r => r.join(''));
};

// Rubber duck facing right (12 x 10)
const duckFrame = (eyes: 'open' | 'closed', feet: 'A' | 'B') => {
  const g = blank(12, 10);
  span(g, 0, 4, 7, 'y');
  span(g, 1, 3, 8, 'y');
  span(g, 2, 3, 8, 'y');
  span(g, 3, 3, 8, 'y');
  span(g, 3, 9, 10, 'b');
  span(g, 4, 4, 8, 'y');
  span(g, 5, 2, 9, 'y');
  span(g, 6, 1, 11, 'y');
  span(g, 7, 1, 11, 'y');
  span(g, 8, 2, 10, 'y');
  span(g, 6, 4, 6, 'w');
  g[2][6] = 'k';
  if (eyes === 'closed') g[2][5] = 'k';
  if (feet === 'A') {
    span(g, 9, 2, 3, 'b');
    span(g, 9, 8, 9, 'b');
  } else {
    span(g, 9, 4, 5, 'b');
    span(g, 9, 7, 8, 'b');
  }
  return g.map(r => r.join(''));
};

// Pixel T-rex, homage to the Chrome offline-page dinosaur (original art, not Google's assets).
// Boxy head on the right with an open-mouth notch, hunched back, tiny arm, thick legs, a low tail trailing left.
const dinoFrame = (eyes: 'open' | 'closed', legs: 'A' | 'B') => {
  const g = blank(18, 14);
  span(g, 0, 11, 14, 'x');
  span(g, 1, 10, 15, 'x');
  span(g, 2, 9, 15, 'x');
  span(g, 3, 8, 15, 'x');
  span(g, 4, 6, 15, 'x');
  span(g, 5, 5, 15, 'x');
  span(g, 6, 4, 15, 'x');
  span(g, 7, 3, 15, 'x');
  span(g, 8, 2, 12, 'x');
  span(g, 8, 14, 15, 'x'); // gap at col 13: open-mouth notch under the snout
  span(g, 9, 0, 12, 'x'); // belly, tapering into the tail on the left
  if (eyes === 'open') g[2][14] = 'k';
  else {
    g[2][13] = 'k';
    g[2][14] = 'k';
  }
  g[7][6] = 'k'; // tiny arm
  const [legA, legB] = legs === 'A' ? [[4, 5], [9, 10]] : [[5, 6], [8, 9]];
  [10, 11, 12, 13].forEach(row => {
    span(g, row, legA[0], legA[1], 'x');
    span(g, row, legB[0], legB[1], 'x');
  });
  return g.map(r => r.join(''));
};

// A soft gradient "AI orb" (voice-assistant inspired, not any specific product's mark): a round
// blob in banded colors with a small animated waveform — awake shows moving bars, asleep shows
// one flat resting line. Reused for Apple (Siri-like) and Meta (Meta AI-like) with different palettes.
const ORB_ROWS: [number, number][] = [
  [4, 8], [2, 10], [1, 11], [1, 11], [0, 12], [0, 12], [0, 12], [0, 12], [0, 12], [1, 11], [1, 11], [2, 10], [4, 8],
];
const orbFrame = (state: 'awake' | 'sleep', step: 'A' | 'B') => {
  const g = blank(13, 13);
  ORB_ROWS.forEach(([from, to], row) => span(g, row, from, to, row < 4 ? 'c' : row > 8 ? 'a' : 'b'));
  if (state === 'sleep') {
    span(g, 6, 3, 9, 'w');
  } else {
    const bars = step === 'A' ? [2, 4, 5, 3, 2] : [3, 5, 3, 5, 4];
    [3, 5, 6, 7, 9].forEach((col, i) => {
      const h = bars[i];
      const top = 6 - Math.floor(h / 2);
      for (let k = 0; k < h; k++) g[top + k][col] = 'w';
    });
  }
  return g.map(r => r.join(''));
};

// A round film-reel character (three reel holes, a hub, small legs) — original art, no logo
const reelFrame = (spin: 'open' | 'closed', legs: 'A' | 'B') => {
  const g = blank(13, 15);
  ORB_ROWS.forEach(([from, to], row) => span(g, row, from, to, 'r'));
  g[3][6] = 'k';
  g[7][3] = 'k';
  g[7][9] = spin === 'open' ? 'k' : 'p'; // third hole glints differently between frames (a subtle "spin")
  g[6][6] = 'k';
  const [legA, legB] = legs === 'A' ? [[3, 4], [8, 9]] : [[4, 5], [7, 8]];
  [13, 14].forEach(row => {
    span(g, row, legA[0], legA[1], 'r');
    span(g, row, legB[0], legB[1], 'r');
  });
  return g.map(r => r.join(''));
};

// A cardboard shipping box (folded flaps, a tape cross, small stub legs) — original art, no logo
const boxFrame = (eyes: 'open' | 'closed', legs: 'A' | 'B') => {
  const g = blank(13, 11);
  span(g, 0, 3, 5, 'b');
  span(g, 0, 7, 9, 'b');
  span(g, 1, 1, 11, 'b');
  for (let r = 2; r <= 8; r++) span(g, r, 0, 12, 'b');
  for (let r = 0; r <= 8; r++) g[r][6] = 't';
  span(g, 4, 0, 12, 't');
  if (eyes === 'open') {
    g[5][3] = 'k';
    g[5][9] = 'k';
  } else {
    g[5][3] = 'k';
    g[5][4] = 'k';
    g[5][8] = 'k';
    g[5][9] = 'k';
  }
  const [legA, legB] = legs === 'A' ? [[2, 3], [9, 10]] : [[3, 4], [8, 9]];
  [9, 10].forEach(row => {
    span(g, row, legA[0], legA[1], 'b');
    span(g, row, legB[0], legB[1], 'b');
  });
  return g.map(r => r.join(''));
};

// A small blocky assistant bot (antenna, a lit visor line, stub legs) — original art, no logo
const botFrame = (eyes: 'open' | 'closed', legs: 'A' | 'B') => {
  const g = blank(11, 12);
  g[0][5] = 'k';
  span(g, 1, 4, 6, 'w');
  span(g, 2, 2, 8, 'w');
  span(g, 3, 2, 8, 'w');
  if (eyes === 'open') span(g, 3, 3, 7, 't');
  else {
    g[3][3] = 't';
    g[3][7] = 't';
  }
  span(g, 4, 2, 8, 'w');
  span(g, 5, 1, 9, 'w');
  span(g, 6, 1, 9, 'w');
  span(g, 7, 2, 8, 'w');
  span(g, 8, 2, 8, 'w');
  const [legA, legB] = legs === 'A' ? [[2, 3], [7, 8]] : [[3, 4], [6, 7]];
  [9, 10].forEach(row => {
    span(g, row, legA[0], legA[1], 'w');
    span(g, row, legB[0], legB[1], 'w');
  });
  return g.map(r => r.join(''));
};

// "Ping", a small signal-wave creature for the Signal (default) theme: two antennae with glowing
// violet tips and a pulsing teal "signal dot" on its chest — original art, tied to the site's own
// teal/violet identity rather than any company.
const pingFrame = (eyes: 'open' | 'closed' | 'happy', legs: 'A' | 'B') => {
  const g = blank(13, 10);
  g[0][4] = 'v';
  g[0][8] = 'v';
  g[1][4] = 'a';
  g[1][8] = 'a';
  span(g, 2, 3, 9, 'a');
  span(g, 3, 2, 10, 'a');
  span(g, 4, 1, 11, 'a');
  span(g, 5, 1, 11, 'a');
  span(g, 6, 1, 11, 'a');
  span(g, 7, 2, 10, 'a');
  if (eyes === 'open') {
    g[3][4] = 'k';
    g[3][8] = 'k';
  } else if (eyes === 'closed') {
    span(g, 3, 3, 5, 'k');
    span(g, 3, 7, 9, 'k');
  } else {
    g[3][4] = 'k';
    g[3][8] = 'k';
    g[2][3] = 'k';
    g[2][9] = 'k';
  }
  g[5][6] = 'v'; // glowing signal dot
  const [legA, legB] = legs === 'A' ? [[2, 3], [8, 9]] : [[3, 4], [7, 8]];
  [8, 9].forEach(row => {
    span(g, row, legA[0], legA[1], 'a');
    span(g, row, legB[0], legB[1], 'a');
  });
  return g.map(r => r.join(''));
};

// "Cursor", a small blocky character for the Syntax theme: a square "window" face with a
// blinking text-cursor bar for a mouth (a nod to the design system's own cursor wordmark accent,
// drawn as our own creature, not a logo) — original art.
const cursorFrame = (state: 'awake' | 'sleep', legs: 'A' | 'B') => {
  const g = blank(11, 11);
  span(g, 0, 3, 7, 'a');
  span(g, 1, 1, 9, 'a');
  span(g, 2, 1, 9, 'a');
  if (state === 'awake') {
    g[2][3] = 'k';
    g[2][7] = 'k';
  } else {
    span(g, 2, 3, 4, 'k');
    span(g, 2, 6, 7, 'k');
  }
  span(g, 3, 1, 9, 'a');
  span(g, 4, 1, 9, 'a');
  span(g, 5, 1, 9, 'a');
  span(g, 6, 3, 7, 'a');
  if (state === 'awake') span(g, 7, 4, 6, 'v'); // the blinking cursor bar
  const [legA, legB] = legs === 'A' ? [[2, 3], [7, 8]] : [[3, 4], [6, 7]];
  [8, 9].forEach(row => {
    span(g, row, legA[0], legA[1], 'a');
    span(g, row, legB[0], legB[1], 'a');
  });
  return g.map(r => r.join(''));
};

// "Sprout", a small potted plant for the Atelier theme: fanning leaves, a stem, a clay pot with
// a simple face — original art, tied to Atelier's own moss/clay palette.
const sproutFrame = (state: 'awake' | 'sleep', legs: 'A' | 'B') => {
  const g = blank(11, 12);
  g[0][5] = 'm';
  span(g, 1, 4, 6, 'm');
  span(g, 2, 3, 7, 'm');
  g[3][5] = 'm';
  g[4][5] = 'm';
  span(g, 5, 2, 8, 'c');
  span(g, 6, 2, 8, 'c');
  span(g, 7, 3, 7, 'c');
  if (state === 'awake') {
    g[6][3] = 'k';
    g[6][7] = 'k';
  } else {
    span(g, 6, 3, 4, 'k');
    span(g, 6, 6, 7, 'k');
  }
  const [legA, legB] = legs === 'A' ? [[2, 3], [7, 8]] : [[3, 4], [6, 7]];
  [8, 9].forEach(row => {
    span(g, row, legA[0], legA[1], 'c');
    span(g, row, legB[0], legB[1], 'c');
  });
  return g.map(r => r.join(''));
};

interface PetDef {
  name: string;
  palette: Record<string, string>;
  frame: (mode: Mode, step: number) => string[];
  lines: string[];
  // When set, double-click / Space / ↑ opens this egg (a full game) instead of just petting
  gameEgg?: EggType;
}

const PETS: Record<PetKind, PetDef> = {
  critter: {
    name: 'Sparky',
    palette: { o: '#d97757', d: '#b4532f', k: '#2b1a14', p: '#f1a98f' },
    frame: (mode, step) =>
      mode === 'sleep' ? critterFrame('closed', 'A') : mode === 'happy' ? critterFrame('happy', 'A') : critterFrame('open', mode === 'walk' && step ? 'B' : 'A'),
    lines: [
      "Let's think this through together.",
      "You're doing great. Keep going!",
      'One small step at a time.',
      'Good questions make good software.',
      'Take a breath. You have got this.',
    ],
  },
  duck: {
    name: 'Debug Duck',
    palette: { y: '#ffd43b', w: '#f2b705', b: '#ff8a1f', k: '#1b1b1b' },
    frame: (mode, step) => duckFrame(mode === 'sleep' ? 'closed' : 'open', mode === 'walk' && step ? 'B' : 'A'),
    lines: [
      'Quack! Explain the bug out loud to me.',
      'Have you tried logging it?',
      'Rubber duck says: read the error message.',
      'Quack. Ship it!',
      'Is it plugged in? Is it committed?',
    ],
  },
  dino: {
    name: 'Dino',
    palette: { x: '#6b6b6b', k: '#2b2b2b' },
    frame: (mode, step) => (mode === 'sleep' ? dinoFrame('closed', 'A') : dinoFrame('open', mode === 'walk' && step ? 'B' : 'A')),
    gameEgg: 'dino',
    lines: [
      'No internet? No problem.',
      'Press Space to run.',
      'Double-click me for a game.',
      'Jump the cacti. Duck the birds.',
      'Every dev crashes sometimes. Run again.',
    ],
  },
  siri: {
    name: 'Orb',
    palette: { a: '#5b6bff', b: '#a86bff', c: '#6fe0ff', w: '#ffffff' },
    frame: (mode, step) => orbFrame(mode === 'sleep' ? 'sleep' : 'awake', mode === 'walk' && step ? 'B' : 'A'),
    lines: [
      'Sweat the details.',
      'Simplicity is the ultimate sophistication.',
      'Good design is quiet.',
      'Polish it once more.',
      'Ship the small delight.',
    ],
  },
  metaai: {
    name: 'Aria',
    palette: { a: '#0064e0', b: '#7b2ff7', c: '#ff5c87', w: '#ffffff' },
    frame: (mode, step) => orbFrame(mode === 'sleep' ? 'sleep' : 'awake', mode === 'walk' && step ? 'B' : 'A'),
    lines: [
      'Move fast, test the important parts.',
      'Ship small, iterate often.',
      'Open source it if you can.',
      'Done is better than perfect.',
      'Refactor tomorrow. Ship today.',
    ],
  },
  reel: {
    name: 'Reel',
    palette: { r: '#8a1116', k: '#141414', p: '#e50914' },
    frame: (mode, step) => reelFrame(mode === 'walk' && step ? 'closed' : 'open', mode === 'walk' && step ? 'B' : 'A'),
    lines: [
      'Binge responsibly. One more feature, I promise.',
      'Ship it in episodes, not one giant season.',
      "Every backlog item is just next episode's cliffhanger.",
      'Pacing matters more than speed.',
      "You're still building? I respect the commitment.",
    ],
  },
  box: {
    name: 'Box',
    palette: { b: '#c9a36b', t: '#8a5a2f', k: '#3a2a18' },
    frame: (mode, step) => (mode === 'sleep' ? boxFrame('closed', 'A') : boxFrame('open', mode === 'walk' && step ? 'B' : 'A')),
    lines: [
      "It's always Day 1.",
      'One more delivery before the deadline.',
      'Metrics first, opinions second.',
      'Ownership means seeing it through.',
      'Dive deep, then ship.',
    ],
  },
  bot: {
    name: 'Ada',
    palette: { w: '#d4d4d8', k: '#202123', t: '#10a37f' },
    frame: (mode, step) => (mode === 'sleep' ? botFrame('closed', 'A') : botFrame('open', mode === 'walk' && step ? 'B' : 'A')),
    lines: [
      'Thinking, one token at a time.',
      'A good prompt is a good spec.',
      'Aligning incentives: hire the good engineer.',
      'Small models, small bugs. Ship anyway.',
      'Context is everything.',
    ],
  },
  ping: {
    name: 'Ping',
    palette: { a: '#26c5b0', v: '#9d70eb', k: '#0c111c' },
    frame: (mode, step) =>
      mode === 'sleep' ? pingFrame('closed', 'A') : mode === 'happy' ? pingFrame('happy', 'A') : pingFrame('open', mode === 'walk' && step ? 'B' : 'A'),
    lines: [
      'Simple solutions to complex problems.',
      "You're on the right frequency.",
      'Ping! Just checking in.',
      'Stay tuned for more.',
      'Signal received, loud and clear.',
    ],
  },
  cursor: {
    name: 'Cursor',
    palette: { a: '#5b34d6', v: '#0b57c9', k: '#191b2b' },
    frame: (mode, step) => (mode === 'sleep' ? cursorFrame('sleep', 'A') : cursorFrame('awake', mode === 'walk' && step ? 'B' : 'A')),
    lines: [
      'Read the error message.',
      'Ship it. :)',
      'Precision beats adjectives.',
      'Format on save.',
      'Small diffs, reviewed fast.',
    ],
  },
  sprout: {
    name: 'Sprout',
    palette: { m: '#3d6b4b', c: '#8a5230', k: '#2a1f17' },
    frame: (mode, step) => (mode === 'sleep' ? sproutFrame('sleep', 'A') : sproutFrame('awake', mode === 'walk' && step ? 'B' : 'A')),
    lines: [
      'Made with care.',
      "Let's make something you'll keep.",
      'Slow light, good work.',
      'One clear goal per view. 🌿',
      'Quiet enough to let the work lead.',
    ],
  },
};

const Sprite: React.FC<{ rows: string[]; palette: Record<string, string> }> = ({ rows, palette }) => (
  <svg
    viewBox={`0 0 ${rows[0].length} ${rows.length}`}
    width={rows[0].length * SCALE}
    height={rows.length * SCALE}
    shapeRendering="crispEdges"
    aria-hidden="true"
    className="block"
  >
    {rows.flatMap((row, y) =>
      [...row].map((ch, x) => (palette[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[ch]} /> : null))
    )}
  </svg>
);

const TerminalPet: React.FC<{ kind: PetKind }> = ({ kind }) => {
  const def = PETS[kind];
  const laneRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<HTMLDivElement>(null);
  const sim = useRef({ x: 24, dir: 1 as 1 | -1, mode: 'idle' as Mode, until: 0, step: 0, stepAt: 0 });
  const [view, setView] = useState<{ mode: Mode; step: number; dir: 1 | -1 }>({ mode: 'idle', step: 0, dir: 1 });
  const [hearts, setHearts] = useState<number[]>([]);
  const [bubble, setBubble] = useState<{ text: string; x: number } | null>(null);
  const heartId = useRef(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>();

  const rows = useMemo(() => def.frame(view.mode, view.step), [def, view.mode, view.step]);
  const spriteWidth = rows[0].length * SCALE;

  // Movement + behaviour loop: walk, idle, sleep at random
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = sim.current;
    let raf = 0;
    let last = performance.now();

    const sync = () => setView(v => (v.mode === s.mode && v.step === s.step && v.dir === s.dir ? v : { mode: s.mode, step: s.step, dir: s.dir }));

    const choose = (now: number) => {
      const roll = Math.random();
      if (reduceMotion) {
        s.mode = roll < 0.5 ? 'idle' : 'sleep';
        s.until = now + 4000;
      } else if (roll < 0.55) {
        s.mode = 'walk';
        s.dir = Math.random() < 0.5 ? -1 : 1;
        s.until = now + 2000 + Math.random() * 3000;
      } else if (roll < 0.8) {
        s.mode = 'idle';
        s.until = now + 1500 + Math.random() * 2000;
      } else {
        s.mode = 'sleep';
        s.until = now + 3500 + Math.random() * 3000;
      }
      sync();
    };

    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      if (now > s.until) choose(now);
      const max = Math.max(0, (laneRef.current?.clientWidth ?? 300) - spriteWidth);
      if (s.mode === 'walk') {
        s.x += s.dir * SPEED * dt;
        if (s.x <= 0) {
          s.x = 0;
          s.dir = 1;
        } else if (s.x >= max) {
          s.x = max;
          s.dir = -1;
        }
        if (now - s.stepAt > 220) {
          s.stepAt = now;
          s.step = s.step ? 0 : 1;
        }
        sync();
      } else if (s.x > max) {
        s.x = max;
      }
      if (petRef.current) petRef.current.style.transform = `translateX(${s.x}px)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spriteWidth]);

  // Reacts to the `pet` egg (fired by clicking the pet or typing `pet`)
  useEffect(() => {
    const onEgg = (e: Event) => {
      if ((e as CustomEvent<{ type: string }>).detail?.type !== 'pet') return;
      const s = sim.current;
      s.mode = 'happy';
      s.until = performance.now() + 1500;
      setView({ mode: 'happy', step: 0, dir: s.dir });

      const id = heartId.current++;
      setHearts(prev => [...prev, id]);
      setTimeout(() => setHearts(prev => prev.filter(h => h !== id)), 950);

      const laneWidth = laneRef.current?.clientWidth ?? 300;
      setBubble({ text: def.lines[Math.floor(Math.random() * def.lines.length)], x: Math.min(Math.max(s.x - 10, 0), Math.max(0, laneWidth - 200)) });
      clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setBubble(null), 2800);

      playSound('squash', Math.floor(Math.random() * 6));
    };
    window.addEventListener(EGG_EVENT, onEgg);
    return () => {
      window.removeEventListener(EGG_EVENT, onEgg);
      clearTimeout(bubbleTimer.current);
    };
  }, [def]);

  return (
    <div ref={laneRef} className="relative h-16 border-t border-white/10 bg-black/20 select-none">
      {bubble && (
        <div
          role="status"
          className="absolute bottom-full z-10 mb-1 max-w-[200px] rounded-lg bg-terminal-fg px-3 py-1.5 text-xs font-medium leading-snug text-terminal-bg shadow-lg"
          style={{ left: bubble.x }}
        >
          {bubble.text}
        </div>
      )}

      <div ref={petRef} className="absolute bottom-2 left-0" style={{ width: spriteWidth }}>
        {view.mode === 'sleep' && (
          <span className="absolute -top-4 left-full ml-1 animate-pulse font-mono text-xs opacity-70" aria-hidden="true">
            z z
          </span>
        )}
        {hearts.map(id => (
          <span
            key={id}
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-base"
            style={{ animation: 'pet-heart 0.9s ease-out forwards' }}
          >
            ❤
          </span>
        ))}
        <button
          type="button"
          onClick={() => triggerEgg('pet')}
          onDoubleClick={() => def.gameEgg && triggerEgg(def.gameEgg)}
          onKeyDown={e => {
            if (def.gameEgg && (e.key === ' ' || e.key === 'ArrowUp')) {
              e.preventDefault();
              triggerEgg(def.gameEgg);
            }
          }}
          aria-label={`Pet ${def.name}`}
          className="block cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            transform: `scaleX(${view.dir})`,
            animation: view.mode === 'happy' ? 'pet-hop 0.5s ease 2' : undefined,
          }}
        >
          <Sprite rows={rows} palette={def.palette} />
        </button>
      </div>

      {/* ground line + label */}
      <div className="absolute inset-x-3 bottom-1.5 border-t border-dashed border-white/15" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] opacity-50" aria-hidden="true">
        {def.name} · click to pet{def.gameEgg ? ' · Space to run' : ''}
      </span>
    </div>
  );
};

export default TerminalPet;
