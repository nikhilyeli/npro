// Shared plumbing for the portfolio's hidden easter eggs.
// Anything (logo, footer, console commands, Konami code) fires an egg with `triggerEgg`;
// <EasterEggs /> renders the reward and <Console /> prints the matching terminal output.

import type { BrandId } from './brandIds';

export type EggType =
  // 'google' here is a Signal-theme easter egg (the logo/matrix ASCII art), unrelated to the
  // Google BRAND theme below — the name predates the Google theme and was kept for compatibility.
  | 'google'
  | 'microsoft'
  | 'confetti'
  | 'fidget'
  | 'bugs'
  | 'deploy'
  | 'coffee'
  | 'motivate'
  | 'hire'
  | 'pet'
  | 'winver'
  | 'bsod'
  | 'clippy'
  | 'dotnet'
  | 'think'
  | 'haiku'
  // Google theme
  | 'dino'
  | 'recursion'
  | 'lighthouse'
  | 'doodle'
  | 'kubectl'
  // Apple theme
  | 'neofetch'
  | 'swiftrun'
  // Meta theme
  | 'reactions'
  | 'reacttree'
  | 'movefast'
  // Netflix theme
  | 'play'
  | 'top10'
  // Amazon theme
  | 'day1'
  | 'metrics'
  // OpenAI theme
  | 'tokens'
  | 'align'
  // Syntax theme (not a company — a design-language theme)
  | 'format'
  | 'lint'
  // Atelier theme (not a company — a design-language theme)
  | 'develop'
  | 'note';

export const EGG_TYPES: EggType[] = [
  'google', 'microsoft', 'confetti', 'fidget', 'bugs', 'deploy', 'coffee', 'motivate', 'hire',
  'pet', 'winver', 'bsod', 'clippy', 'dotnet', 'think', 'haiku',
  'dino', 'recursion', 'lighthouse', 'doodle', 'kubectl',
  'neofetch', 'swiftrun',
  'reactions', 'reacttree', 'movefast',
  'play', 'top10',
  'day1', 'metrics',
  'tokens', 'align',
  'format', 'lint',
  'develop', 'note',
];

// Eggs that only exist in some themes. Anything not listed exists everywhere.
const EGG_THEMES: Partial<Record<EggType, BrandId[]>> = {
  google: ['signal'],
  microsoft: ['signal', 'microsoft'],
  pet: ['microsoft', 'anthropic', 'google', 'apple', 'meta', 'netflix', 'amazon', 'openai', 'syntax', 'atelier'],
  winver: ['microsoft'],
  bsod: ['microsoft'],
  clippy: ['microsoft'],
  dotnet: ['microsoft'],
  think: ['anthropic'],
  haiku: ['anthropic'],
  dino: ['google'],
  recursion: ['google'],
  lighthouse: ['google'],
  doodle: ['google'],
  kubectl: ['google'],
  neofetch: ['apple'],
  swiftrun: ['apple'],
  reactions: ['meta'],
  reacttree: ['meta'],
  movefast: ['meta'],
  play: ['netflix'],
  top10: ['netflix'],
  day1: ['amazon'],
  metrics: ['amazon'],
  tokens: ['openai'],
  align: ['openai'],
  format: ['syntax'],
  lint: ['syntax'],
  develop: ['atelier'],
  note: ['atelier'],
};

export const eggsForBrand = (brand: BrandId): EggType[] => EGG_TYPES.filter(type => EGG_THEMES[type]?.includes(brand) ?? true);

// What the logo and the footer button do in each theme
export const LOGO_EGG: Record<BrandId, EggType> = {
  signal: 'google', microsoft: 'winver', anthropic: 'think', google: 'doodle', apple: 'neofetch', meta: 'reactions',
  netflix: 'play', amazon: 'day1', openai: 'tokens', syntax: 'format', atelier: 'note',
};
export const FOOTER_EGG: Record<BrandId, EggType> = {
  signal: 'microsoft', microsoft: 'microsoft', anthropic: 'confetti', google: 'confetti', apple: 'confetti', meta: 'confetti',
  netflix: 'confetti', amazon: 'confetti', openai: 'confetti', syntax: 'confetti', atelier: 'confetti',
};

export const EGG_EVENT = 'trigger-easter-egg';

export interface EggDetail {
  type: EggType;
  message?: string;
}

const MOTIVATION = [
  'Every bug you fix makes you a stronger engineer.',
  'Ship it. Small wins compound.',
  'Green build, clear mind.',
  "You've solved harder problems than this one.",
  'Progress over perfection. Commit early, commit often.',
  "Today's stack trace is tomorrow's war story.",
  'Take a breath. Read the error message. You got this.',
  'Refactor your code, not your confidence.',
];

// 5 / 7 / 5 syllables, one line per "\n"
const HAIKUS = [
  'Null pointer at dawn\none more log line, one more brew\ngreen build blooms at last',
  'Semicolon lost\nthe compiler sighs, then hints\nfound it. Breathe. Ship it.',
  'Tests are turning red\nread the message, not the fear\none fix, then all green',
  'Small commits, steady\nevery merge a little lift\nthe whole hill is climbed',
];

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const randomMotivation = () => pick(MOTIVATION);

const messageFor = (type: EggType): string | undefined => {
  if (type === 'motivate' || type === 'think') return randomMotivation();
  if (type === 'haiku') return pick(HAIKUS);
  return undefined;
};

export const triggerEgg = (type: EggType) => {
  const detail: EggDetail = { type, message: messageFor(type) };
  window.dispatchEvent(new CustomEvent(EGG_EVENT, { detail }));
};

const STORAGE_KEY = 'npro-eggs-found';

const readFound = (): EggType[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((t): t is EggType => EGG_TYPES.includes(t)) : [];
  } catch {
    return [];
  }
};

// Records a discovery. `isNew` is true only the first time this visitor finds this egg.
// `count` / `total` are scoped to the current theme, so "all found" is reachable in every theme.
export const markFound = (type: EggType, brand: BrandId): { isNew: boolean; count: number; total: number } => {
  const available = eggsForBrand(brand);
  const found = readFound();
  const isNew = !found.includes(type);
  const next = isNew ? [...found, type] : found;
  if (isNew) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked: the egg still works, it just won't be remembered.
    }
  }
  return { isNew, count: next.filter(t => available.includes(t)).length, total: available.length };
};
