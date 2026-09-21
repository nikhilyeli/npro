---
name: company-portfolio-variant
description: Create or update a company-tailored version of the nPro portfolio (brand theme + tailored content + link-preview image), for example Microsoft, Anthropic/Claude, Netflix, Apple, Amazon or Google. Use when the user asks for a Microsoft theme, a "version for <company>", a brand theme toggle, or a company-specific profile page.
---

# Company portfolio variant (nPro)

Turns the nPro portfolio (`C:\dev\npro`, React + Vite + Tailwind + shadcn, GitHub Pages at `/npro`) into brand-themed and company-tailored versions.

**Read first:** `docs/company-variants-plan.md` (architecture, phases, status) and, for Microsoft, `docs/microsoft-theme-guide.md`.
The plan is the source of truth for what is already implemented: check its status lines before doing anything.

## Current state (2026-09-20)

Done: tokens; **route-based themes** (`/npro` = Signal, `/npro/<company>`; `src/pages/SiteRoute.tsx`, `src/lib/brand.ts`, `src/lib/brandIds.ts`); session **company lock** (`sessionStorage["npro-company-lock"]`); static `dist/<company>/index.html` + `404.html` via the Vite plugin in `vite.config.ts`; **Microsoft "Visual Purple"** theme (VS purple primary, Fluent blue accent-2/progress). Signal is the default.
Theme tools (navbar palette switcher + terminal `theme` command) exist only when `VITE_THEME_SWITCHER=true` (Windows env var on the dev machine; `.env` default and GitHub Actions = false) or after `npro.unlockThemes()` in the **browser DevTools console** (`npro.lockThemes()`, `npro.status()`). They are dev tools: never turn them on in production.
**Anthropic theme started** (`/npro/anthropic`, guide: `docs/anthropic-theme-guide.md`): cream/clay palette, serif headings via `--font-display` (font lazy-loaded in `brand.ts`), Claude-style terminal.
Each theme also has its own **terminal skin + pet + egg set**: `SKINS` in `src/components/Console.tsx`, `PET_FOR_BRAND` and sprites in `src/components/TerminalPet.tsx` (original pixel art, never official mascots), `EGG_THEMES` / `LOGO_EGG` / `FOOTER_EGG` in `src/lib/easterEggs.ts`, overlays in `src/components/EasterEggs.tsx`. The 404 page (`src/pages/NotFound.tsx`) is theme-aware and must never link to another company.
Not done: content variants (`src/data/variants/`), per-company OG image/meta/favicon per page, remaining company themes.
Next companies, in order: **Google → Apple → Meta → Netflix → Amazon** (Anthropic started). Google's pet and game are decided: a pixel T-rex pet plus a "Dino Runner" endless-runner egg (homage to the Chrome offline dino, own pixel art, plan in the Google guide). Plans exist for Google, Apple and Meta: `docs/google-theme-guide.md`, `docs/apple-theme-guide.md`, `docs/meta-theme-guide.md` (contrast-checked palettes; nothing built yet).
**Secrecy plan (not built):** `docs/private-variants-and-route-lock-plan.md`. Today all company data ships to every visitor and the public repo lists every company. Before building more company themes in shared files, consider doing that plan's Phase A (theme registry, company code in `variants/<id>/`) so new themes don't add more leaks. When the plan is built: never put company names in shared code, `index.html`, comments or chunk names, and run the leak check.
User decisions: Signal by default; no "Tailored for <Company>" line; everything route-based; company lock is discretion, not security.
To add a company: add its id to `COMPANY_BRAND_IDS` in `src/lib/brandIds.ts` (this also creates its route, static page and pre-paint handling automatically), add its entry to `BRANDS` in `src/lib/brand.ts` (and `BRAND_FONT_URLS` if it needs a web font), add `:root[data-theme="<id>"]` + `.dark` blocks in `src/index.css`, then give it a terminal skin (`SKINS`), optionally a pet, and an egg set (`EGG_THEMES`, `LOGO_EGG`, `FOOTER_EGG`; `Record<BrandId, ...>` types will flag what's missing). Run the contrast script for both modes. Test with the theme tools on.

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
