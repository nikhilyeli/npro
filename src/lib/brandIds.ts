// Brand theme ids and routes. Dependency-free on purpose: vite.config.ts imports this file too.
// Adding a company: add its id to COMPANY_BRAND_IDS here, then follow the steps in
// .claude/skills/company-portfolio-variant/SKILL.md (CSS blocks, BRANDS entry).

export const BASE_PATH = '/npro';

export const DEFAULT_BRAND = 'signal';

// Each of these is served at BASE_PATH/<id> (e.g. /npro/microsoft) and gets a static page at build time.
export const COMPANY_BRAND_IDS = ['microsoft', 'anthropic'] as const;

export const BRAND_IDS = [DEFAULT_BRAND, ...COMPANY_BRAND_IDS] as const;

export type BrandId = (typeof BRAND_IDS)[number];
