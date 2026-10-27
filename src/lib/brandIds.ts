// Brand theme ids and routes. Dependency-free on purpose: vite.config.ts imports this file too.
// Adding a company: add its id to COMPANY_BRAND_IDS here, then follow the steps in
// .claude/skills/company-portfolio-variant/SKILL.md (CSS blocks, BRANDS entry).

export const BASE_PATH = '/npro';

export const DEFAULT_BRAND = 'signal';

// Each of these is served at BASE_PATH/<id> (e.g. /npro/microsoft) and gets a static page at build time.
// 'syntax' and 'atelier' aren't companies — they're general design-language themes (see
// docs/syntax-theme-guide.md / docs/atelier-theme-guide.md) — but they use the same route/lock/pet
// machinery as everything else here, so they live in the same list.
export const COMPANY_BRAND_IDS = [
  'microsoft', 'anthropic', 'google', 'apple', 'meta', 'netflix', 'amazon', 'openai', 'syntax', 'atelier',
] as const;

export const BRAND_IDS = [DEFAULT_BRAND, ...COMPANY_BRAND_IDS] as const;

export type BrandId = (typeof BRAND_IDS)[number];

// Extra route names that redirect to a theme (e.g. /npro/gemini -> /npro/google), so a natural
// guess still lands on the right theme. Keys must not collide with BRAND_IDS above.
export const ROUTE_ALIASES: Record<string, BrandId> = {
  // Signal (no company): a personal/default landing spelled a different way
  me: 'signal',
  myself: 'signal',
  personal: 'signal',
  portfolio: 'signal',
  resume: 'signal',
  cv: 'signal',

  // Microsoft
  msft: 'microsoft',
  ms: 'microsoft',
  windows: 'microsoft',
  azure: 'microsoft',
  dotnet: 'microsoft',
  vscode: 'microsoft',
  xbox: 'microsoft',
  linkedin: 'microsoft',

  // Anthropic
  claude: 'anthropic',
  claudeai: 'anthropic',

  // Google
  chrome: 'google',
  gemini: 'google',
  android: 'google',
  alphabet: 'google',
  gcp: 'google',
  deepmind: 'google',
  youtube: 'google',

  // Apple
  mac: 'apple',
  macos: 'apple',
  macbook: 'apple',
  imac: 'apple',
  iphone: 'apple',
  ipad: 'apple',
  ipod: 'apple',
  ios: 'apple',
  watchos: 'apple',
  safari: 'apple',
  icloud: 'apple',

  // Meta
  facebook: 'meta',
  fb: 'meta',
  instagram: 'meta',
  insta: 'meta',
  whatsapp: 'meta',
  threads: 'meta',
  oculus: 'meta',
  quest: 'meta',

  // Netflix
  nflx: 'netflix',
  stream: 'netflix',
  streaming: 'netflix',

  // Amazon
  aws: 'amazon',
  prime: 'amazon',

  // OpenAI
  chatgpt: 'openai',
  gpt: 'openai',
  gpt4: 'openai',
  gpt5: 'openai',
  sora: 'openai',

  // Syntax (developer design language)
  dev: 'syntax',
  code: 'syntax',
  ide: 'syntax',
  terminal: 'syntax',

  // Atelier (studio design language)
  design: 'atelier',
  studio: 'atelier',
  photo: 'atelier',
  photography: 'atelier',
  gallery: 'atelier',
};
