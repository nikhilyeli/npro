---
name: company-portfolio-variant
description: Create or update a company-tailored version of the nPro portfolio (brand theme + tailored content + link-preview image), for example Microsoft, Anthropic/Claude, Netflix, Apple, Amazon or Google. Use when the user asks for a Microsoft theme, a "version for <company>", a brand theme toggle, or a company-specific profile page.
---

# Company portfolio variant (nPro)

Turns the nPro portfolio (`C:\dev\npro`, React + Vite + Tailwind + shadcn, GitHub Pages at `/npro`) into brand-themed and company-tailored versions.

**Read first:** `docs/company-variants-plan.md` (architecture, phases, status) and, for Microsoft, `docs/microsoft-theme-guide.md`.
The plan is the source of truth for what is already implemented: check its status lines before doing anything.

## Current state (2026-09-23, revised same day)

Done: tokens; **route-based themes** (`/npro` = Signal, `/npro/<company>`; `src/pages/SiteRoute.tsx`, `src/lib/brand.ts`, `src/lib/brandIds.ts`); **route aliases** (`ROUTE_ALIASES` in `brandIds.ts` — natural names like `/npro/gemini`, `/npro/chatgpt`, `/npro/aws` redirect to their canonical theme route); session **company lock** (`sessionStorage["npro-company-lock"]`); static `dist/<company>/index.html` + `404.html` via the Vite plugin in `vite.config.ts`; the favicon set (`.ico`/apple-touch/svg), now **swapped per theme** (`favicon-<id>.svg`, updated at runtime in `applyBrand()`, pre-painted in `index.html`, and baked into each company's static entry in `vite.config.ts` — all three paths must stay in sync since dev/prod serve `public/` under the `/npro` base); **all Lovable-scaffold traces removed** (`docs/remove-lovable-traces-guide.md` — re-run its grep check after any bulk template regeneration).
**All eight company themes are built**, Signal stays the default:
- **Microsoft "Visual Purple"** (VS purple primary, Fluent blue accent-2/progress) — `docs/microsoft-theme-guide.md`.
- **Anthropic** (cream/clay, serif headings via `--font-display`) — `docs/anthropic-theme-guide.md`.
- **Google** (Material tonal blue; **Dino Runner** game — a full canvas endless runner, jump/duck, win at 300, reduced-motion "stroll" mode) — `docs/google-theme-guide.md`.
- **Apple** (spacious, one blue accent, system font stack; pet is **Orb**, a Siri-inspired AI-orb) — `docs/apple-theme-guide.md`.
- **Meta** (friendly blue/grey; "reaction rain" emoji-particle mode; pet is **Aria**, the same orb shape in Meta colors) — `docs/meta-theme-guide.md`.
- **Netflix** (near-black + red; pet is **Reel**, a film-reel character) — `docs/netflix-theme-guide.md`. Shipped palette/terminal/pet/eggs only, no "rows" layout.
- **Amazon** (navy + amber, dense; pet is **Box**, a cardboard shipping box) — `docs/amazon-theme-guide.md`. Shipped palette/terminal/pet/eggs only, no Leadership-Principle bullet tags.
- **OpenAI** (near-monochrome + one teal accent; pet is **Ada**, a small assistant bot) — `docs/openai-theme-guide.md`, written and built in this pass (no prior guide existed).

**Two more themes exist that are NOT companies: Syntax and Atelier** — a developer design language and a studio/photography design language, ported from the user's own "Syntax & Atelier" Design System artifact rather than researched from a real company's brand. Same route/lock/pet/egg machinery, but **no content variant** (no "Why {Company}" panel — that only makes sense for an employer page). `docs/syntax-theme-guide.md` and `docs/atelier-theme-guide.md` document the exact source-token → CSS-variable mapping; when porting a design system like this again, follow that pattern (convert hex to HSL, only reuse text/background pairings the source itself documents as accessible, re-verify contrast independently rather than trusting the source's claims).
Theme tools (navbar palette switcher + terminal `theme` command) exist only when `VITE_THEME_SWITCHER=true` (Windows env var on the dev machine; `.env` default and GitHub Actions = false) or after `npro.unlockThemes()` in the **browser DevTools console** (`npro.lockThemes()`, `npro.status()`). They are dev tools: never turn them on in production.
Each theme has its own **terminal skin + pet + egg set**: `SKINS` in `src/components/Console.tsx`, `PET_FOR_BRAND` and sprites (all original pixel/vector art, never official mascots — see `dinoFrame`/`orbFrame`/`reelFrame`/`boxFrame`/`botFrame` for the patterns) in `src/components/TerminalPet.tsx`, `EGG_THEMES` / `LOGO_EGG` / `FOOTER_EGG` in `src/lib/easterEggs.ts`, overlays and the particle system (including the emoji-drawing mode used for Meta's reaction rain) in `src/components/EasterEggs.tsx`. The Google pet can also open a full game via a `gameEgg` field on its `PetDef` (double-click, or Space/↑ while focused) — the pattern to reuse for any future pet+game combo. The 404 page (`src/pages/NotFound.tsx`) is theme-aware and must never link to another company.
**Content variants are now built** (`src/lib/variants.ts`): a small, generic `CompanyVariant` per company — a tailored one-line hero description, 2-3 truthful "Why {Company}" bullets (every claim traces to an existing fact in `portfolio.json`, nothing invented), a project display order, and a skill-category display order. Wired into `Hero.tsx` (a "Why {Company}" card, hidden entirely on Signal so it stays pixel-identical), `Projects.tsx`, and `Skills.tsx`. To extend a company's variant, edit its entry in `VARIANTS`; keep every bullet traceable to a real highlight/metric/project.
Not done: per-company OG image/meta/favicon-page (all company pages still share the one default OG image); the Dino Runner's jump physics and the Dino sprite were both fixed this pass (see the plan doc's "Bug fixes" section) but haven't had a long human playtest, only physics-math verification plus a mid-jump screenshot.
**Secrecy plan (still not built, deliberately):** `docs/private-variants-and-route-lock-plan.md`. Today all eight companies' data ships to every visitor and the public repo lists every company. That plan's own "Decisions for you" section has five open questions (remove the prod DevTools unlock, private repo + CI secret, opaque URLs, encrypted payloads, git-history cleanup) that change its design materially, and its Phase B (multi-entry Vite build, splitting each company into its own bundle) is a real architectural change with regression risk across every theme — don't start it without the user answering those decisions first. If more themes get added before it's built, keep following the existing shared `Record<BrandId,...>` pattern (it's what that refactor would eventually break apart, but it's the fastest/lowest-risk way to add a theme today).
User decisions: Signal by default; no "Tailored for <Company>" line; everything route-based; company lock is discretion, not security; Netflix/Amazon stayed palette-only (no rows layout, no Leadership Principle tags); content variants go as deep as reordering + a truthful "why fit" blurb, not full section rewrites.
To add a company: add its id to `COMPANY_BRAND_IDS` in `src/lib/brandIds.ts` (this also creates its route, static page and pre-paint handling automatically; add any natural-language aliases to `ROUTE_ALIASES` in the same file), add its entry to `BRANDS` in `src/lib/brand.ts` (and `BRAND_FONT_URLS` if it needs a web font), add a `favicon-<id>.svg` in `public/`, add `:root[data-theme="<id>"]` + `.dark` blocks in `src/index.css`, then give it a terminal skin (`SKINS`), a pet, an egg set (`EGG_THEMES`, `LOGO_EGG`, `FOOTER_EGG`; `Record<BrandId, ...>` types will flag what's missing — run `tsc --noEmit` after adding the id to `COMPANY_BRAND_IDS` and fix every error it surfaces), and a `VARIANTS` entry in `src/lib/variants.ts`. Run the contrast script for both modes. Test with the theme tools on.

## Non-negotiable rules

1. **Plan first, then implement.** The user prefers a written plan and approval before big changes. Do not change colors or themes outside the agreed phase.
2. **Truthful content.** Variants may re-order, re-emphasise and re-word what is in `src/data/portfolio.json`. Never invent skills, employers, metrics or dates. If a company-relevant claim is missing, ask the user.
3. **Inspired by, not impersonating.** Use public palette/design language only. No official logos or wordmarks (existing four-color and Google-ring hover eggs are the only exception). No claim of affiliation.
4. **Accessibility:** WCAG AA in every brand × light/dark combination, visible focus, `prefers-reduced-motion` respected.
5. **Signal (current theme) must stay pixel-identical** unless the user asks otherwise.
6. **Desktop first, then mobile**: verify both. Keep the user's constraint: no unrequested palette changes.

## Model

- Two axes: **mode** (`.dark` class, a saved visitor preference) × **brand** (`data-theme="<id>"` on `<html>`, chosen by the **route**, never saved).
- Theme = CSS variable blocks in `src/index.css` (`:root[data-theme="x"]` and `:root[data-theme="x"].dark`) + Tailwind already reads the variables.
- Content variant = `src/data/variants/<id>.json` deep-merged over `portfolio.json` (arrays replace), supplied through a `useVariant()` hook.
- Per-company link previews need **static** pages on GitHub Pages: `/npro/<id>/index.html` (generated already) with its own meta + `og-<id>.png` (to do).

## Workflow for a new company

1. **Check status** in `docs/company-variants-plan.md`. If Phase 0/1 (token audit, theme switcher) are not done, do them first.
2. **Research** the company's current public brand/design guidance and the target role's job description. Note palette, type, shape, motion, tone, values. Record sources in the pack doc. Propose open-license font substitutes for proprietary fonts.
3. **Write a pack doc** `docs/<company>-theme-guide.md` from the structure of `docs/microsoft-theme-guide.md` (tokens light+dark as HSL triples, typography, shape/motion, component mapping, easter egg ideas, content angle, assets, checklist). **Get the user's approval before building.**
4. **Tokens:** add the two CSS blocks; add any missing tokens (see plan §2) rather than hard-coding colors in components.
5. **Contrast check** all text/UI pairs in both modes (script or WebAIM-style math) and fix failures.
6. **Content variant JSON:** hero titles/description, skill highlights, project order, console prompt/eggs, SEO. Facts must trace back to `portfolio.json`.
7. **Assets:** `favicon-<id>.svg` (same red `--live-dot` dot rule) and `og-<id>.png` 1200×630 (render an HTML template with Playwright via a local static server: `file:` URLs are blocked; screenshot the `.card` element; verify PNG is exactly 1200×630 and text is inside the 2:1 safe area).
8. **Entry page:** generate `/npro/<id>/index.html` (own title, description, og:image absolute URL `https://nikhilyeli.github.io/npro/...`, twitter tags, boot variant).
9. **QA** in the browser: every section × light/dark × desktop then mobile (375px); roadmap states; console + easter eggs; toasts; keyboard navigation; reduced motion; no console errors; no horizontal scroll.
10. **Docs:** update the status lines in the plan and pack doc; do not commit unless asked.

## Company quick notes (verify before use)

- **Microsoft:** Fluent, blue `#0078D4`, Segoe UI Variable / Cascadia Code, PowerShell-styled terminal, .NET/Azure/C#, accessibility.
- **Anthropic/Claude:** warm cream + clay-orange, editorial serif + sans, calm humane tone.
- **Netflix:** near-black + red, cinematic rows, "Continue watching" for experience.
- **Apple:** spacious, SF/system type, large scroll storytelling, blue accent.
- **Amazon:** navy + orange, dense, metrics/STAR bullets mapped to leadership principles.
- **Google:** Material 3 tonal palettes, playful, Roboto/Inter substitute for Google Sans.

## Existing building blocks to reuse

- Tokens: `src/index.css`, `tailwind.config.ts` (`accent2`, `terminal-*`, `live`, shadows, `text-display`).
- Easter eggs: `src/lib/easterEggs.ts`, `src/lib/sound.ts`, `src/components/EasterEggs.tsx`, console commands in `src/components/Console.tsx`.
- OG generation approach and meta tags: `index.html`, `public/og-image.png`.
- Light/dark toggle: `src/components/ThemeToggle.tsx` (localStorage key `theme`); pre-paint script in `index.html` (mode + route brand + lock).
- Verify a production-like build with `VITE_THEME_SWITCHER=false npm run build` + `npx vite preview`; test locking, unlocking (`npro.unlockThemes()`), and the env-var path with a second dev server on another port.
