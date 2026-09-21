// Tiny synthesized sound effects for the easter eggs (Web Audio, no asset files).
// Sounds only ever play in response to a visitor's own action, and can be muted.

const STORAGE_KEY = 'npro-sound';

let audioCtx: AudioContext | null = null;

let muted = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    return false;
  }
})();

export const isMuted = () => muted;

export const setMuted = (value: boolean) => {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'off' : 'on');
  } catch {
    // Storage blocked: the setting just won't persist.
  }
};

const getContext = (): AudioContext | null => {
  if (!audioCtx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
};

const tone = (freq: number, start: number, duration: number, type: OscillatorType = 'triangle', volume = 0.14) => {
  const ctx = getContext();
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
};

// C major pentatonic: every combination of notes sounds happy
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];

export type SoundName = 'squash' | 'win' | 'done' | 'flick' | 'tick' | 'pop' | 'step';

// `level` lets a sound climb the scale (combo streaks, turn counts).
export const playSound = (name: SoundName, level = 0) => {
  if (muted) return;
  try {
    const note = SCALE[level % SCALE.length];
    switch (name) {
      case 'squash':
        tone(note, 0, 0.14);
        break;
      case 'tick':
        tone(note, 0, 0.1, 'sine', 0.1);
        break;
      case 'step':
        tone(660, 0, 0.09, 'triangle', 0.1);
        break;
      case 'pop':
        tone(880, 0, 0.08, 'square', 0.05);
        tone(1318.5, 0.05, 0.14, 'triangle', 0.1);
        break;
      case 'flick':
        tone(240, 0, 0.1, 'sine', 0.08);
        tone(360, 0.05, 0.12, 'sine', 0.06);
        break;
      case 'win':
        [0, 1, 2, 3, 5].forEach((n, i) => tone(SCALE[n], i * 0.09, 0.3, 'triangle', 0.16));
        break;
      case 'done':
        tone(392, 0, 0.18, 'sine', 0.12);
        tone(330, 0.16, 0.3, 'sine', 0.1);
        break;
    }
  } catch {
    // Audio unavailable (blocked or unsupported): the visuals still work.
  }
};
