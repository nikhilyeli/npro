import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { EGG_EVENT, EGG_TYPES, EggDetail, EggType, markFound, triggerEgg } from '@/lib/easterEggs';
import { isMuted, playSound, setMuted } from '@/lib/sound';
import { getBrand } from '@/lib/brand';

type Palette = 'brand' | 'microsoft';

// 'microsoft' is the four-tile logo palette used by the footer egg (an intentional brand nod).
// 'brand' follows the active theme through the --confetti-* tokens in src/index.css.
const MICROSOFT_LOGO_COLORS = ['#F25022', '#7FBA00', '#00A4EF', '#FFB900'];
const FALLBACK_BRAND_COLORS = ['#26C5B0', '#9D70EB', '#F5B942', '#FFFFFF'];

const paletteColors = (palette: Palette): string[] => {
  if (palette === 'microsoft') return MICROSOFT_LOGO_COLORS;
  const styles = getComputedStyle(document.documentElement);
  const colors = [1, 2, 3, 4].map(i => styles.getPropertyValue(`--confetti-${i}`).trim()).filter(Boolean);
  return colors.length ? colors : FALLBACK_BRAND_COLORS;
};

const FOUND_MESSAGES: Record<EggType, string> = {
  google: 'You clicked the logo. Check the terminal for a surprise.',
  microsoft: 'The secret footer button. Microsoft colors, of course.',
  confetti: 'You asked for it: confetti.',
  fidget: 'A fidget spinner. Give it a flick!',
  bugs: 'Bug hunt unlocked. Squash as many as you can!',
  deploy: 'Shipped to production. Zero downtime.',
  coffee: 'Caffeine loaded. Focus +100%.',
  motivate: 'You got this.',
  hire: 'Excellent decision. Taking you to the contact form…',
  pet: 'You made a friend. Pets are the best part of the terminal.',
  winver: 'About nPro: version, license and a little humor.',
  bsod: 'A very fake blue screen. Nothing was harmed.',
  clippy: 'It looks like you found the paperclip assistant.',
  dotnet: 'Hello, World! Build succeeded, 0 errors.',
  think: 'Thinking, carefully.',
  haiku: 'A tiny poem for tired developers.',
  dino: 'An homage to Chrome\'s offline dinosaur. Jump the cacti!',
  recursion: 'Did you mean: recursion?',
  lighthouse: 'A perfect audit score, as it should be.',
  doodle: 'Today\'s doodle, found.',
  kubectl: 'All pods healthy.',
  neofetch: 'System info, nPro edition.',
  swiftrun: 'Build complete! Hello, world!',
  reactions: 'A little rain of reactions.',
  reacttree: 'Hydrated in 42ms.',
  movefast: 'Moving fast, testing the important parts.',
  play: 'Continue watching: About Me.',
  top10: 'Top 10 in Skills today.',
  day1: "It's always Day 1.",
  metrics: 'An illustrative dashboard, found.',
  tokens: 'Context loaded. Ready to hire.',
  align: 'Incentives, aligned.',
  format: 'Formatted, zero warnings.',
  lint: '0 problems, 0 warnings.',
  develop: 'Developed in the darkroom.',
  note: 'A handwritten note, found.',
};

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
  square: boolean;
  emoji?: string; // when set, drawn as text instead of a colored rect (reaction rain)
}

/* ------------------------------ Fidget spinner ------------------------------ */

const WIN_TURNS = 10;

const FidgetSpinner: React.FC<{ onCelebrate: () => void }> = ({ onCelebrate }) => {
  const spinnerRef = useRef<SVGSVGElement>(null);
  const motion = useRef({ angle: 0, velocity: 0, turns: 0, wholeTurns: 0, celebrated: false });
  const [rpm, setRpm] = useState(0);
  const [turns, setTurns] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;
      const m = motion.current;
      m.angle += m.velocity * dt;
      m.turns += Math.abs(m.velocity * dt) / 360;
      m.velocity *= Math.pow(0.985, dt);
      if (Math.abs(m.velocity) < 0.05) m.velocity = 0;
      if (spinnerRef.current) spinnerRef.current.style.transform = `rotate(${m.angle}deg)`;
      setRpm(Math.round(m.velocity * 10));

      const whole = Math.floor(m.turns);
      if (whole > m.wholeTurns) {
        m.wholeTurns = whole;
        setTurns(whole);
        // A rising tick for every full turn: the spinner "climbs the scale"
        if (whole < WIN_TURNS) playSound('tick', whole - 1);
      }
      if (m.turns >= WIN_TURNS && !m.celebrated) {
        m.celebrated = true;
        playSound('win');
        onCelebrate();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onCelebrate]);

  const flick = () => {
    motion.current.velocity = Math.min(70, motion.current.velocity + 18 + Math.random() * 10);
    playSound('flick');
  };

  const progress = Math.min(100, (turns / WIN_TURNS) * 100);
  const won = turns >= WIN_TURNS;

  return (
    <div className="flex flex-col items-center gap-4 px-4 text-center">
      <button
        type="button"
        autoFocus
        onClick={flick}
        aria-label="Flick the fidget spinner"
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg ref={spinnerRef} viewBox="0 0 200 200" className="h-56 w-56 select-none md:h-72 md:w-72" aria-hidden="true">
          {[0, 120, 240].map(deg => (
            <g key={deg} transform={`rotate(${deg} 100 100)`}>
              <rect x="90" y="46" width="20" height="56" className="fill-primary" />
              <circle cx="100" cy="42" r="30" className="fill-primary" />
              <circle cx="100" cy="42" r="14" className="fill-background" />
            </g>
          ))}
          <circle cx="100" cy="100" r="24" className="fill-accent2" />
          <circle cx="100" cy="100" r="9" className="fill-background" />
        </svg>
      </button>

      <div className="w-56 md:w-72">
        <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={WIN_TURNS} aria-valuenow={Math.min(turns, WIN_TURNS)}>
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent2 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          {rpm} rpm · {Math.min(turns, WIN_TURNS)}/{WIN_TURNS} turns
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        {won ? '🏆 Nailed it! Keep spinning if you like.' : 'Click, tap or press Space to flick. Just 10 turns to win!'}
      </p>
    </div>
  );
};

/* -------------------------------- Bug squash -------------------------------- */

const GAME_SECONDS = 45;
const WIN_SCORE = 12;
const BUG_LIFETIME_MS = 1800;

interface Bug {
  id: number;
  x: number;
  y: number;
}

const encouragement = (score: number) =>
  score >= WIN_SCORE ? '🏆 You won! Keep squashing!' : score >= 8 ? 'Almost there!' : score >= 4 ? 'Nice! Keep going!' : 'Squash the bugs!';

const BugGame: React.FC<{ onCelebrate: () => void; onMilestone: () => void; onClose: () => void }> = ({ onCelebrate, onMilestone, onClose }) => {
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [score, setScore] = useState(0);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const nextId = useRef(0);
  const streak = useRef(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    const spawn = setInterval(() => {
      const id = nextId.current++;
      const bug = { id, x: 8 + Math.random() * 80, y: 22 + Math.random() * 64 };
      setBugs(prev => [...prev, bug]);
      setTimeout(
        () =>
          setBugs(prev => {
            // Still here after its lifetime: the bug got away, so the combo resets
            if (prev.some(b => b.id === id)) streak.current = 0;
            return prev.filter(b => b.id !== id);
          }),
        BUG_LIFETIME_MS
      );
    }, 600);
    const clock = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => {
      clearInterval(spawn);
      clearInterval(clock);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) {
      setPhase('done');
      setBugs([]);
      if (score >= WIN_SCORE) {
        playSound('win');
        onCelebrate();
      } else {
        playSound('done');
      }
    }
  }, [timeLeft, phase, score, onCelebrate]);

  const squash = (id: number) => {
    setBugs(prev => prev.filter(b => b.id !== id));
    playSound('squash', streak.current);
    streak.current += 1;
    const next = score + 1;
    setScore(next);
    // Win the moment the target is hit, without waiting for the clock
    if (next === WIN_SCORE) {
      playSound('win');
      onMilestone();
    }
  };

  const replay = () => {
    streak.current = 0;
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setBugs([]);
    setPhase('playing');
  };

  return (
    <>
      <div className="fixed left-1/2 top-20 z-[91] -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-5 py-2 text-center font-mono text-sm shadow-lifted">
        🐛 {score}/{WIN_SCORE} · ⏱ {Math.max(0, timeLeft)}s
        <span className="ml-3 hidden text-muted-foreground sm:inline">{phase === 'playing' ? encouragement(score) : ''}</span>
      </div>

      {bugs.map(bug => (
        <button
          key={bug.id}
          type="button"
          aria-label="Squash bug"
          onPointerDown={() => squash(bug.id)}
          className="fixed z-[91] animate-fade-in text-5xl leading-none transition-transform active:scale-75"
          style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
        >
          🐛
        </button>
      ))}

      {phase === 'done' && (
        <div className="fixed left-1/2 top-1/2 z-[92] w-[min(90vw,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 text-center shadow-lifted">
          <p className="text-2xl font-bold">{score >= WIN_SCORE ? '🏆 Bug-free build!' : 'So close!'}</p>
          <p className="mt-2 text-muted-foreground">
            {score >= WIN_SCORE
              ? `You squashed ${score} bugs. That's how you ship quality.`
              : `You squashed ${score} bug${score === 1 ? '' : 's'}. Squash ${WIN_SCORE} to win. Every dev debugs, try again!`}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button onClick={replay}>Play again</Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

/* ------------------------------ Dino Runner ---------------------------------
   An original endless-runner in the spirit of Chrome's offline game (own art and
   code, not Google's). Jump with Space/↑/tap, duck with ↓ or the Duck button. */

const DINO_W = 600;
const DINO_H = 180;
const GROUND_Y = 148;
const GRAVITY = 2600;
const JUMP_VELOCITY = -620;
// The dino's body (34px tall) must fit under the canvas top even at the peak of the jump,
// or it visually vanishes off the top edge ("hits the ceiling") and throws off collision timing.
const MAX_JUMP_HEIGHT = GROUND_Y - 40 - 10; // 10px margin above the tallest (standing) sprite
const DINO_WIN_SCORE = 300;
const DINO_HIGH_SCORE_KEY = 'npro-dino-highscore';

interface DinoObstacle {
  x: number;
  w: number;
  h: number;
  y: number;
  kind: 'cactus' | 'bird';
}

const readDinoHighScore = () => {
  try {
    return Number(localStorage.getItem(DINO_HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
};

const saveDinoHighScore = (score: number) => {
  try {
    localStorage.setItem(DINO_HIGH_SCORE_KEY, String(score));
  } catch {
    // Storage blocked: the run still counts, it just won't be remembered.
  }
};

const DinoRunner: React.FC<{ onCelebrate: () => void; onClose: () => void }> = ({ onCelebrate, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(prefersReducedMotion()).current;

  const g = useRef({
    mode: (reduced ? 'stroll' : 'ready') as 'ready' | 'playing' | 'over' | 'stroll',
    dinoY: 0,
    velocity: 0,
    ducking: false,
    obstacles: [] as DinoObstacle[],
    speed: 260,
    score: 0,
    spawnIn: 0.9,
    legPhase: 0,
    legAt: 0,
    won: false,
    highScore: readDinoHighScore(),
  });

  const [, force] = useState(0);
  const rerender = () => force(n => n + 1);

  const jump = () => {
    const s = g.current;
    if (s.mode === 'over' || s.mode === 'stroll') return;
    if (s.mode === 'ready') s.mode = 'playing';
    if (s.dinoY === 0) {
      s.velocity = JUMP_VELOCITY;
      playSound('flick');
    }
  };

  const replay = () => {
    const s = g.current;
    s.mode = 'playing';
    s.dinoY = 0;
    s.velocity = 0;
    s.ducking = false;
    s.obstacles = [];
    s.speed = 260;
    s.score = 0;
    s.spawnIn = 0.9;
    s.won = false;
    rerender();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resize = () => {
      const width = wrapRef.current?.clientWidth ?? DINO_W;
      canvas.width = DINO_W;
      canvas.height = DINO_H;
      canvas.style.width = `${Math.min(width, DINO_W)}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();
    let sinceScoreUpdate = 0;
    let lastMilestone = 0;

    const spawnObstacle = () => {
      const s = g.current;
      const bird = s.score > 150 && Math.random() < 0.35;
      if (bird) {
        s.obstacles.push({ x: DINO_W, w: 22, h: 16, y: GROUND_Y - 46 - Math.random() * 16, kind: 'bird' });
      } else {
        const clusters = Math.random() < 0.7 ? 1 : Math.random() < 0.8 ? 2 : 3;
        for (let i = 0; i < clusters; i++) {
          s.obstacles.push({ x: DINO_W + i * 16, w: 12, h: 26, y: GROUND_Y - 26, kind: 'cactus' });
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = g.current;

      if (s.mode === 'playing') {
        // Physics
        s.velocity += GRAVITY * dt;
        s.dinoY = s.dinoY + s.velocity * dt;
        if (s.dinoY >= 0) {
          s.dinoY = 0;
          s.velocity = 0;
        } else if (s.dinoY < -MAX_JUMP_HEIGHT) {
          // Safety clamp: never let the sprite go above the canvas, whatever the velocity.
          s.dinoY = -MAX_JUMP_HEIGHT;
          if (s.velocity < 0) s.velocity = 0;
        }

        // Speed + score
        s.speed = Math.min(560, 260 + s.score * 0.35);
        s.score += dt * (s.speed / 6);
        sinceScoreUpdate += dt;
        if (sinceScoreUpdate > 0.1) {
          sinceScoreUpdate = 0;
          rerender();
        }
        const milestone = Math.floor(s.score / 100);
        if (milestone > lastMilestone) {
          lastMilestone = milestone;
          playSound('tick', milestone % 6);
        }
        if (s.score >= DINO_WIN_SCORE && !s.won) {
          s.won = true;
          playSound('win');
          onCelebrate();
        }

        // Obstacles
        s.spawnIn -= dt;
        if (s.spawnIn <= 0) {
          spawnObstacle();
          s.spawnIn = Math.max(0.55, 1.15 - s.speed / 900) + Math.random() * 0.4;
        }
        const dinoTop = GROUND_Y - (s.ducking ? 18 : 40) + s.dinoY;
        const dinoBottom = GROUND_Y;
        const dinoLeft = 40;
        const dinoRight = 40 + (s.ducking ? 34 : 22);
        let hit = false;
        s.obstacles = s.obstacles.filter(o => {
          o.x -= s.speed * dt;
          if (o.x + o.w < 0) return false;
          const overlapX = o.x + 3 < dinoRight && o.x + o.w - 3 > dinoLeft;
          const overlapY = o.y + 3 < dinoBottom && o.y + o.h - 3 > dinoTop;
          if (overlapX && overlapY) hit = true;
          return true;
        });
        if (hit) {
          s.mode = 'over';
          s.highScore = Math.max(s.highScore, Math.floor(s.score));
          saveDinoHighScore(s.highScore);
          playSound('done');
          rerender();
        }
        if (now - s.legAt > 100) {
          s.legAt = now;
          s.legPhase = s.legPhase ? 0 : 1;
        }
      } else if (s.mode === 'stroll') {
        s.score += dt * 20;
        sinceScoreUpdate += dt;
        if (sinceScoreUpdate > 0.2) {
          sinceScoreUpdate = 0;
          rerender();
        }
        if (now - s.legAt > 260) {
          s.legAt = now;
          s.legPhase = s.legPhase ? 0 : 1;
        }
      }

      // --- draw ---
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--terminal-fg').trim();
      const color = fg ? `hsl(${fg})` : '#d8d8d8';
      ctx.clearRect(0, 0, DINO_W, DINO_H);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 2);
      ctx.lineTo(DINO_W, GROUND_Y + 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = color;
      for (const o of g.current.obstacles) {
        if (o.kind === 'cactus') ctx.fillRect(o.x, o.y, o.w, o.h);
        else {
          const flap = g.current.legPhase ? 2 : -2;
          ctx.fillRect(o.x, o.y + 6, o.w, 6);
          ctx.fillRect(o.x + 4, o.y + 6 + flap, 6, 3);
          ctx.fillRect(o.x + o.w - 10, o.y + 6 - flap, 6, 3);
        }
      }

      // dino: duck = short & wide, else tall & narrow; legs alternate while running
      const duckNow = g.current.mode === 'playing' && g.current.ducking;
      const bodyW = duckNow ? 34 : 22;
      const bodyH = duckNow ? 18 : 34;
      const bodyY = GROUND_Y - bodyH + g.current.dinoY;
      ctx.fillRect(40, bodyY, bodyW, bodyH);
      ctx.fillRect(40 + bodyW - 10, bodyY - 8, 10, 10); // head
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--terminal-bg').trim()
        ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--terminal-bg').trim()})`
        : '#111';
      ctx.fillRect(40 + bodyW - 4, bodyY - 6, 3, 3); // eye
      ctx.fillStyle = color;
      if (g.current.dinoY === 0 && g.current.mode !== 'over' && !duckNow) {
        const legOffset = g.current.legPhase ? 2 : -2;
        ctx.fillRect(40 + 2 + legOffset, bodyY + bodyH, 5, 8);
        ctx.fillRect(40 + bodyW - 8 - legOffset, bodyY + bodyH, 5, 8);
      } else if (!duckNow) {
        ctx.fillRect(40 + 2, bodyY + bodyH, 5, 8);
        ctx.fillRect(40 + bodyW - 8, bodyY + bodyH, 5, 8);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [onCelebrate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        g.current.mode === 'over' ? replay() : jump();
      } else if (e.key === 'ArrowDown') {
        g.current.ducking = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') g.current.ducking = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const s = g.current;
  const score = Math.floor(s.score);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <div ref={wrapRef} className="relative w-full max-w-[600px]">
        <canvas ref={canvasRef} className="w-full rounded-lg border border-border bg-card" style={{ imageRendering: 'pixelated', aspectRatio: `${DINO_W}/${DINO_H}` }} onPointerDown={jump} />

        <div className="pointer-events-none absolute right-3 top-2 rounded bg-background/70 px-2 py-1 font-mono text-xs">
          HI {String(s.highScore).padStart(5, '0')} {String(score).padStart(5, '0')}
        </div>

        {s.mode === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 text-center font-mono text-sm">
            Press Space, ↑ or tap to run
          </div>
        )}
        {s.mode === 'stroll' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center font-mono text-xs opacity-70">Reduced motion is on: enjoy a calm stroll.</div>
        )}
        {s.mode === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/85 text-center">
            <p className="text-xl font-bold">{score >= DINO_WIN_SCORE ? '🏆 You win! Game over.' : 'Game over'}</p>
            <p className="text-sm text-muted-foreground">Score {score} · Best {s.highScore}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={replay}>
                Play again
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onPointerDown={() => (g.current.ducking = true)}
          onPointerUp={() => (g.current.ducking = false)}
          onPointerLeave={() => (g.current.ducking = false)}
          disabled={s.mode === 'stroll'}
        >
          Duck (hold)
        </Button>
        <p className="hidden text-xs text-muted-foreground sm:block">Space/↑ to jump · ↓ to duck · {DINO_WIN_SCORE} to win</p>
      </div>
    </div>
  );
};

/* ------------------------- Microsoft-theme overlays ------------------------- */

// A parody "About" box (no logos): version, license, a wink
const WinverDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const now = new Date();
  const version = `${String(now.getFullYear()).slice(2)}H${now.getMonth() < 6 ? 1 : 2}`;
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-card shadow-lifted">
        <div className="border-b border-border px-4 py-2 text-sm text-muted-foreground">About nPro</div>
        <div className="space-y-3 p-6 text-sm">
          <p className="text-2xl font-semibold text-primary">nPro Portfolio</p>
          <p>
            Version {version} (Build {now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()})
          </p>
          <p className="text-muted-foreground">© Nikhil Yeli. All rights reserved.</p>
          <hr className="border-border" />
          <p>
            This product is licensed to: <strong>recruiters, hiring managers and curious developers</strong>.
          </p>
          <p className="text-muted-foreground">Powered by C#, .NET, React, TypeScript and a lot of coffee.</p>
        </div>
        <div className="flex justify-end border-t border-border p-3">
          <Button onClick={onClose} autoFocus>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

// A friendly fake blue screen. Any key or click dismisses it; it also closes itself.
const BsodScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setPercent(p => Math.min(100, p + 4)), 90);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (percent < 100) return;
    const t = setTimeout(onClose, 1200);
    return () => clearTimeout(t);
  }, [percent, onClose]);

  useEffect(() => {
    const onAny = () => onClose();
    window.addEventListener('keydown', onAny);
    return () => window.removeEventListener('keydown', onAny);
  }, [onClose]);

  return (
    <div className="flex h-full cursor-pointer flex-col justify-center gap-4 bg-progress p-8 font-sans text-white md:p-20" onClick={onClose}>
      <p className="text-7xl md:text-8xl">:(</p>
      <p className="max-w-2xl text-xl md:text-2xl">Your portfolio ran into a problem and needs to impress you. We're just collecting some awesome info, and then we'll restart... just kidding.</p>
      <p className="text-xl md:text-2xl">{percent}% complete</p>
      <div className="mt-2 max-w-2xl space-y-1 text-sm md:text-base">
        <p>For more information about this issue, hire the developer.</p>
        <p>Stop code: TOO_MUCH_AWESOMENESS</p>
        <p>What failed: nikhil.sys</p>
        <p className="mt-4 opacity-80">All systems are normal. Press any key or click to continue.</p>
      </div>
    </div>
  );
};

// A non-modal helper in the corner. Its main button leads to the hire egg.
const PaperclipHelper: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 14000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label="Paperclip assistant"
      className="fixed bottom-6 right-4 z-[91] w-[min(90vw,20rem)] animate-fade-in rounded-lg border border-border bg-card p-4 shadow-lifted md:right-6"
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl" aria-hidden="true">
          📎
        </span>
        <p className="text-sm">It looks like you're reading a developer's portfolio. Would you like help?</p>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button
          size="sm"
          onClick={() => {
            onClose();
            triggerEgg('hire');
          }}
        >
          Hire the developer
        </Button>
        <Button size="sm" variant="outline" onClick={onClose}>
          Just browsing
        </Button>
      </div>
    </div>
  );
};

/* --------------------------------- Container -------------------------------- */

const EasterEggs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>();
  const [overlay, setOverlay] = useState<'fidget' | 'bugs' | 'winver' | 'bsod' | 'dino' | null>(null);
  const [clippyOpen, setClippyOpen] = useState(false);
  const [muted, setMutedState] = useState(isMuted());
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const closeClippy = useCallback(() => setClippyOpen(false), []);

  const step = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.current = particles.current.filter(p => p.life > 0 && p.y < canvas.height + 20);
    for (const p of particles.current) {
      p.vy += 0.25;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life / 30);
      if (p.emoji) {
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.square ? p.size : p.size * 0.5);
      }
      ctx.restore();
    }
    raf.current = particles.current.length ? requestAnimationFrame(step) : undefined;
  }, []);

  const burst = useCallback(
    (palette: Palette = 'brand', count = 140) => {
      if (prefersReducedMotion()) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
      if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;
      const colors = paletteColors(palette);
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
        const speed = 6 + Math.random() * 10;
        particles.current.push({
          x: canvas.width / 2,
          y: canvas.height * 0.6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 6,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 90 + Math.random() * 60,
          square: palette === 'microsoft',
        });
      }
      if (!raf.current) raf.current = requestAnimationFrame(step);
    },
    [step]
  );

  // A rain of reaction emojis floating up from the bottom, for the Meta theme's "reactions" egg
  const burstEmoji = useCallback((emojis: string[], count = 24) => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
    if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: canvas.width * (0.15 + Math.random() * 0.7),
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(4 + Math.random() * 4),
        size: 22 + Math.random() * 12,
        rot: 0,
        vr: 0,
        color: '',
        life: 120 + Math.random() * 60,
        square: false,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    if (!raf.current) raf.current = requestAnimationFrame(step);
  }, [step]);

  const celebrate = useCallback(() => burst('brand', 180), [burst]);
  const miniCelebrate = useCallback(() => burst('brand', 70), [burst]);

  // React to any egg being triggered (logo, footer, console commands, Konami code)
  useEffect(() => {
    const onEgg = (e: Event) => {
      const { type, message } = (e as CustomEvent<EggDetail>).detail ?? {};
      if (!type || !EGG_TYPES.includes(type)) return;

      switch (type) {
        case 'fidget':
          setOverlay('fidget');
          playSound('pop');
          break;
        case 'bugs':
          setOverlay('bugs');
          playSound('pop');
          break;
        case 'microsoft':
          burst('microsoft');
          playSound('win');
          break;
        case 'coffee':
          burst('brand', 45);
          playSound('pop');
          break;
        case 'motivate':
          burst('brand', 60);
          playSound('step', 2);
          break;
        case 'deploy':
          // Timed to match the fake pipeline the terminal prints
          [1, 2, 3, 4].forEach(i => setTimeout(() => playSound('step', i), i * 450));
          setTimeout(() => {
            burst('brand', 150);
            playSound('win');
          }, 2250);
          break;
        case 'hire':
          setOverlay(null);
          setClippyOpen(false);
          burst('brand', 200);
          burst('microsoft', 120);
          playSound('win');
          setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 1600);
          break;
        case 'pet':
          break; // <TerminalPet /> animates and chirps by itself; only the first-find toast below
        case 'winver':
          setOverlay('winver');
          playSound('pop');
          break;
        case 'bsod':
          setOverlay('bsod');
          playSound('done');
          break;
        case 'clippy':
          setClippyOpen(true);
          playSound('step', 3);
          break;
        case 'dotnet':
          // Timed to match the build output the terminal prints
          [1, 2, 3, 4, 5].forEach(i => setTimeout(() => playSound('step', i), i * 380));
          setTimeout(() => {
            burst('brand', 70);
            playSound('win');
          }, 2300);
          break;
        case 'think':
          [0, 1, 2].forEach(i => setTimeout(() => playSound('step', i), 100 + i * 700));
          setTimeout(() => {
            burst('brand', 70);
            playSound('win');
          }, 2250);
          break;
        case 'haiku':
          burst('brand', 40);
          playSound('pop');
          break;
        case 'dino':
          setOverlay('dino');
          playSound('pop');
          break;
        case 'recursion':
          [0, 1].forEach(i => setTimeout(() => playSound('tick', i), 500 + i * 900));
          break;
        case 'lighthouse':
          setTimeout(() => {
            burst('brand', 120);
            playSound('win');
          }, 2100);
          break;
        case 'doodle':
          burst('brand', 90);
          playSound('pop');
          break;
        case 'kubectl':
          setTimeout(() => playSound('win'), 1900);
          break;
        case 'neofetch':
          playSound('pop');
          break;
        case 'swiftrun':
          [0, 1].forEach(i => setTimeout(() => playSound('step', i), i * 420));
          setTimeout(() => {
            burst('brand', 70);
            playSound('win');
          }, 950);
          break;
        case 'reactions':
          burstEmoji(['👍', '❤️', '😆', '😮'], 26);
          playSound('pop');
          break;
        case 'reacttree':
          burst('brand', 40);
          playSound('step', 1);
          break;
        case 'movefast':
          [0, 1, 2].forEach(i => setTimeout(() => playSound('step', i), 150 + i * 260));
          setTimeout(() => burst('brand', 60), 900);
          break;
        case 'play':
          playSound('pop');
          break;
        case 'top10':
          burst('brand', 50);
          playSound('step', 2);
          break;
        case 'day1':
          playSound('pop');
          break;
        case 'metrics':
          setTimeout(() => playSound('win'), 300);
          break;
        case 'tokens':
          [0, 1].forEach(i => setTimeout(() => playSound('tick', i), i * 380));
          setTimeout(() => playSound('win'), 1150);
          break;
        case 'align':
          burst('brand', 40);
          playSound('pop');
          break;
        case 'format':
          playSound('tick', 0);
          break;
        case 'lint':
          playSound('pop');
          break;
        case 'develop':
          [0, 1, 2].forEach(i => setTimeout(() => playSound('step', i), 150 + i * 480));
          setTimeout(() => burst('brand', 50), 1600);
          break;
        case 'note':
          playSound('pop');
          break;
        default: // google (logo) and confetti
          burst('brand');
          playSound('pop');
      }

      // "Found N of M" counts only the eggs this theme has, so finding them all is possible in every theme
      const { isNew, count, total } = markFound(type, getBrand());
      if (isNew && count === total) {
        toast({ title: `🏆 All ${total} easter eggs found!`, description: 'You have officially seen everything here. Thanks for poking around.' });
        setTimeout(() => {
          burst('brand', 200);
          burst('microsoft', 200);
          playSound('win');
        }, 500);
      } else if (isNew) {
        toast({ title: `🥚 Easter egg found! ${count} of ${total}`, description: type === 'haiku' ? FOUND_MESSAGES.haiku : message ?? FOUND_MESSAGES[type] });
      } else if (type === 'motivate') {
        toast({ title: '💪 Keep going', description: message });
      }
    };
    window.addEventListener(EGG_EVENT, onEgg);
    return () => window.removeEventListener(EGG_EVENT, onEgg);
  }, [burst]);

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        triggerEgg('bugs');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The paperclip helper isn't modal, but Escape dismisses it too
  useEffect(() => {
    if (!clippyOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setClippyOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clippyOpen]);

  // While an overlay is open: Escape closes it and the page behind doesn't scroll
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOverlay(null);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [overlay]);

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    []
  );

  const toggleSound = () => {
    setMuted(!muted);
    setMutedState(!muted);
    if (muted) playSound('pop');
  };

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true" />

      {clippyOpen && <PaperclipHelper onClose={closeClippy} />}

      {overlay && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            { fidget: 'Fidget spinner', bugs: 'Bug squash game', winver: 'About nPro', bsod: 'Blue screen', dino: 'Dino Runner' }[overlay]
          }
          className={`fixed inset-0 ${overlay === 'bsod' ? 'z-[99]' : 'z-[90] bg-background/80 backdrop-blur-sm'}`}
        >
          {(overlay === 'fidget' || overlay === 'bugs' || overlay === 'dino') && (
            <div className="fixed bottom-6 right-4 z-[93] flex gap-2 md:bottom-auto md:top-20">
              <Button variant="outline" size="sm" onClick={toggleSound} aria-pressed={muted}>
                {muted ? '🔇 Sound off' : '🔊 Sound on'}
              </Button>
              <Button variant="outline" size="sm" onClick={closeOverlay}>
                Close (Esc)
              </Button>
            </div>
          )}

          {overlay === 'fidget' && (
            <div className="flex h-full items-center justify-center">
              <FidgetSpinner onCelebrate={celebrate} />
            </div>
          )}
          {overlay === 'bugs' && <BugGame onCelebrate={celebrate} onMilestone={miniCelebrate} onClose={closeOverlay} />}
          {overlay === 'winver' && <WinverDialog onClose={closeOverlay} />}
          {overlay === 'bsod' && <BsodScreen onClose={closeOverlay} />}
          {overlay === 'dino' && <DinoRunner onCelebrate={celebrate} onClose={closeOverlay} />}
        </div>
      )}
    </>
  );
};

export default EasterEggs;
