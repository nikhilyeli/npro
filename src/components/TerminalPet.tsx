import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EGG_EVENT, triggerEgg } from '@/lib/easterEggs';
import { playSound } from '@/lib/sound';
import type { BrandId } from '@/lib/brandIds';

// A small pixel pet that wanders along the bottom of the terminal, like a VS Code pet.
// Original pixel art drawn from code (no image files). Click it, or type `pet`, to make it happy.

export type PetKind = 'critter' | 'duck';
type Mode = 'idle' | 'walk' | 'sleep' | 'happy';

// Which theme gets which pet
export const PET_FOR_BRAND: Partial<Record<BrandId, PetKind>> = { microsoft: 'duck', anthropic: 'critter' };

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

interface PetDef {
  name: string;
  palette: Record<string, string>;
  frame: (mode: Mode, step: number) => string[];
  lines: string[];
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
        {def.name} · click to pet
      </span>
    </div>
  );
};

export default TerminalPet;
