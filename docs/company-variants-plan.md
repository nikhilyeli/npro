# nPro: Theme Modes and Company Variants — Plan

Status (2026-09-20):
- **Phase 0 (tokens) DONE**: `--success`, `--progress*`, `--confetti-*`, `--font-sans/mono`; dead `App.css` removed.
- **Phase 1 (theme system) DONE and now route-based**: `data-theme` axis, `src/lib/brand.ts`, route `/npro/:company?` (`src/pages/SiteRoute.tsx`), pre-paint script. The theme comes from the **route**; there is no saved brand preference any more.
- **Phase 2 (Microsoft theme, "Visual Purple") DONE**: see the guide. Signal stays the default.
- **Phase 4, partly DONE**: static `/npro/<company>/index.html` + `404.html` are generated at build; session **company lock** is on; **theme tools flag** (`VITE_THEME_SWITCHER`) is off in production. Still to do: per-company OG image/meta and favicon per page.
- **Phase 5 started: Anthropic** (`/npro/anthropic`): theme tokens, serif headings, Claude-style terminal, pet, `think`/`haiku` eggs. See [anthropic-theme-guide.md](./anthropic-theme-guide.md). Next in order: Google, Apple, Meta, Netflix, Amazon.
- **Per-theme easter eggs and terminal pets (2026-09-20):** each theme has its own egg set (`eggsForBrand` in `src/lib/easterEggs.ts`), so "found N of M" counts only that theme's eggs. Microsoft: `winver`, `bsod`, `clippy`, `dotnet run`, Azure `deploy`, `runas` + a duck pet. Anthropic: `think`, `haiku` + a critter pet. The logo and footer buttons trigger a theme-specific egg.
- **404 page redesigned:** theme-aware, "home" respects the company lock, never links to another company, and no longer points at `/` (the wrong root on GitHub Pages).
- **Plans written, not implemented (2026-09-20):** guides for [Google](./google-theme-guide.md), [Apple](./apple-theme-guide.md) and [Meta](./meta-theme-guide.md) (palettes contrast-checked), and [private-variants-and-route-lock-plan.md](./private-variants-and-route-lock-plan.md) for hiding company details from page source/bundles/repo plus route blocking and auto-switch. **That plan supersedes the production side of "Routes, company lock and theme tools" below.**
- **Favicon set fixed:** `favicon.ico` (16/32/48), `apple-touch-icon.png` and the SVG are all linked in `index.html`.
- **Phase 3 (content variants): not started.**

## Decisions (2026-09-20)

- **Default theme is Signal.** Microsoft is opt-in.
- **Microsoft = "Visual Purple":** Visual Studio purple is the primary, Fluent blue is the second accent and the roadmap "in progress" color.
- **No "Tailored for <Company>" line** on variant pages. Variants stay silent.
- **Everything is route-based** (`/npro` = Signal, `/npro/microsoft` = Microsoft). The switcher button and the terminal `theme` command are **dev tools**: they exist only when the theme-tools flag is on (see below), and they just navigate between routes.
- **Company order after Microsoft:** Anthropic → Google → Apple → Meta → Netflix → Amazon.

## Routes, company lock and theme tools (implemented 2026-09-20)

**Routes.** `/npro` → Signal. `/npro/<company>` → that company's theme (`COMPANY_BRAND_IDS` in `src/lib/brandIds.ts`). Unknown `/npro/<x>` → the 404 page.
The build writes a real `dist/<company>/index.html` for each company plus `dist/404.html`, because GitHub Pages has no SPA fallback.

**Company lock (session).** Landing on a company route stores `sessionStorage["npro-company-lock"] = "<id>"` (the company id, not just a boolean, so it knows which company to hold). While locked, any other route (including `/npro`) redirects back to the locked company route. The pre-paint script uses the lock too, so there is no wrong-theme flash.

**Theme tools flag.** The palette switcher and the terminal `theme` command exist **only when the flag is on**; otherwise `theme` is "command not found" and `help` doesn't list it. While the flag is on, the company lock is ignored and cleared. Two ways to turn it on:

| Where | How | Default |
|---|---|---|
| Dev machine (env var) | Windows user variable `VITE_THEME_SWITCHER=true`, then restart the terminal / dev server. Env vars beat `.env`. `setx VITE_THEME_SWITCHER true` | off |
| Browser DevTools console (runtime) | `npro.unlockThemes()` (turn on), `npro.lockThemes()` (turn off), `npro.status()` | off |
| GitHub Actions | `.github/workflows/mainghpages.yml` builds with `VITE_THEME_SWITCHER: 'false'` | **off** |

`.env` (committed) holds `VITE_THEME_SWITCHER=false`, which is the default everywhere. The runtime unlock is stored in `localStorage["npro-unlock-themes"]`, so it survives reloads on that browser only.

**Honest limits.** This is client-side, so it is a *discretion* feature, not security. Anyone can type another company's URL in a fresh tab, or run `npro.unlockThemes()` in the console, and every variant's data is in one bundle. If real isolation is needed, build **separate per-company bundles** so a variant's content only ships on its own page.

## The idea

Today the site has one look ("Signal": teal + violet) with light and dark modes.
The goal is to grow this into two independent choices:

1. **Mode:** light / dark (already exists).
2. **Brand theme:** `signal` (current, stays the default) · `microsoft` (first) · later `anthropic`, `netflix`, `apple`, `amazon`, `google`, …

A brand theme changes **colors, typography, shape, motion and a few content details**. Content variants (copy, emphasis, order)
let the same portfolio be tailored to a company, for example when applying for a role there.
The guide for the first theme is in [microsoft-theme-guide.md](./microsoft-theme-guide.md).
The repeatable process is captured in the project skill `.claude/skills/company-portfolio-variant/SKILL.md`.

## Ground rules

- **Truthful content only.** A variant may re-order, re-emphasise and re-word real experience. It must never add skills, employers or claims that are not in `portfolio.json`.
- **Inspired by, not impersonating.** Use a company's public palette and design language as inspiration. Do not use their logos or wordmarks, and do not imply endorsement. (The existing four-color and Google "logo ring" hover easter eggs are the only brand-mark nods.)
- **Accessibility does not bend.** Every theme × mode must meet WCAG AA (4.5:1 text, 3:1 UI) and respect reduced motion.
- **One codebase.** No forked components. Themes are tokens + a small config; variants are JSON.

## Architecture

### 1. Theme axis: `data-theme` next to the existing `.dark`

```
<html data-theme="microsoft" class="dark">
```

```css
:root                                { /* signal light (default, today's tokens) */ }
.dark                                { /* signal dark */ }
:root[data-theme="microsoft"]        { /* microsoft light */ }
:root[data-theme="microsoft"].dark   { /* microsoft dark  */ }
```

- **Mode** (light/dark) is a visitor preference saved in `localStorage["theme"]`. The **brand** is *not* saved: it comes from the route (see "Routes, company lock and theme tools").
- The pre-paint script in `index.html` applies mode + the route's brand before first paint (no flash).
- `BrandSwitcher` (palette button) is a dev tool, shown only when the theme-tools flag is on.

### 2. Token coverage: make themes able to change everything

Tokens that exist today: `background, foreground, card, primary, secondary, muted, accent, accent-2, destructive, border, input, ring, radius, terminal-*, live-dot`, plus shadows and the type scale.

Tokens to **add** (Phase 0, no visual change for Signal):

| Token | Why | Signal value | Microsoft value |
|---|---|---|---|
| `--progress` | Roadmap "in progress" icon (currently hard-coded amber in `Experience.tsx`) | current amber | Fluent blue (this is the "blue progress symbol" you asked for) |
| `--success` | Roadmap "completed" check (currently `terminal-green`) | current green | Fluent green |
| `--font-sans`, `--font-mono` | Brand typography | Inter / Fira Code | Segoe UI Variable / Cascadia Code |
| `--radius-card`, `--radius-control` | Fluent uses smaller radii | 0.625rem | 8px / 4px |
| `--confetti-1..4` | Easter-egg confetti (currently hex in `EasterEggs.tsx`) | teal, violet, gold, white | Fluent set |
| `--terminal-*` per theme | Terminal is theme-invariant today; brand can skin it (PowerShell blue for Microsoft) | Signal ink | PowerShell |

Hard-coded colors found in `src` (2026-09-20 scan, 16 hits / 7 files) that must move to tokens first:
`Experience.tsx` (amber in-progress icon, 5), `EasterEggs.tsx` (confetti palettes, 2), `Index.tsx` (devtools console styling, cosmetic),
`index.css` (brand-logo hover rings, intentional), `App.css` (likely unused Vite template CSS: check and delete), shadcn `chart.tsx` / `toast.tsx` (library defaults, check).
Static assets that are per-brand and cannot be tokens: `favicon.svg`, `og-image.png`.

### 3. Content variants (data overlay)

`src/data/variants/<id>.json` overrides parts of `portfolio.json`; merge is deep, arrays replace.

```jsonc
{
  "id": "microsoft",
  "label": "Microsoft",
  "theme": "microsoft",
  "content": {
    "hero": { "titles": ["…"], "description": "…" },
    "skills": { "highlight": ["C#", ".NET", "Azure", "TypeScript"] },
    "projects": { "order": [3, 1, 2] },
    "console": { "prompt": "PS C:\\Users\\nikhil\\portfolio>", "eggs": ["winver", "clippy"] }
  },
  "seo": { "title": "…", "description": "…", "ogImage": "og-microsoft.png" }
}
```

A `useVariant()` context supplies merged data to components, which today import `portfolio.json` directly.
Components that read `portfolioData` (Hero, Console, Skills, Projects, Experience, Achievements, Contact, Footer) switch to the hook.

### 4. GitHub Pages: link previews are static

Crawlers (LinkedIn, WhatsApp, X, Facebook) do **not** run JavaScript, so `?for=microsoft` cannot change the preview image.
Recommended: generate one static entry page per variant at build time:

```
/npro/                 → default (Signal)
/npro/microsoft/       → own <title>, meta, og-microsoft.png, boots with microsoft theme
```

Done: the `npro-brand-routes` plugin in `vite.config.ts` copies `index.html` into `dist/<id>/index.html` for every company (and `dist/404.html`). GitHub Pages serves `/npro/microsoft/` from that folder, so no SPA-redirect hacks are needed.
To do: give each of those pages its own `<title>`, description, `og:url` and `og-<id>.png` (rendered with Playwright from an HTML template, the process used for `og-image.png`), driven by `variants/<id>.json`.

## Phases

| # | Phase | Output | Visual change |
|---|---|---|---|
| 0 | Token audit and refactor | `--progress`, `--success`, fonts, radii, confetti tokens; delete dead CSS | none |
| 1 | Theme system | `data-theme`, brand toggle UI, pre-paint script, `?for=` | new toggle only |
| 2 | Microsoft theme | see the guide; screenshots of all sections × 2 modes × desktop/mobile | Microsoft mode |
| 3 | Content variants | `variants/` schema, `useVariant()`, Microsoft copy | Microsoft mode copy |
| 4 | Static entry pages and OG | build script, `og-microsoft.png`, per-variant favicon | link previews |
| 5 | More companies | one pack per company (below) | new modes |

Order of work per phase: **plan → tokens → verify in browser (desktop first, then mobile) → screenshots → commit.**

## Company pack ideas (build order: Microsoft ✔ → Anthropic → Google → Apple → Meta → Netflix → Amazon; starting directions, verify against each brand's current public guidelines)

Meta (added 2026-09-20) has no notes in the table yet: research at pack time. Starting hints: blue `#0866FF`-family, clean sans, "move fast", impact and scale, open source (React is from Meta: a truthful, relevant angle for a React developer).

| Company | Vibe | Palette direction | Type direction | Content angle |
|---|---|---|---|---|
| **Microsoft** | Fluent: calm, clear, inclusive | blue `#0078D4`, neutral greys, four-color accents | Segoe UI Variable, Cascadia Code | .NET / Azure / C#, accessibility, growth mindset. Terminal as PowerShell |
| **Anthropic / Claude** | Warm, editorial, humane | cream backgrounds, warm clay-orange accent, near-black text | serif display + clean sans (proprietary fonts → open substitutes) | Careful, safety-minded engineering, clear writing, AI tooling |
| **Netflix** | Cinematic | near-black `#141414`, red `#E50914` | bold display sans | Projects as horizontal "rows", experience as "Continue watching" |
| **Apple** | Spacious, product-page storytelling | white / `#F5F5F7`, near-black, blue `#0071E3` | SF Pro / system stack, very large type | Craft, detail, UX polish; big scroll-driven sections |
| **Amazon** | Dense, pragmatic | navy `#232F3E`, orange `#FF9900` | Amazon Ember → system substitute | Bullets rewritten as metrics/STAR, mapped to leadership principles |
| **Google** | Material 3: playful, tonal | blue/red/yellow/green tonal palettes | Google Sans → Roboto/Inter | Scale, reliability, open source, UX |

Later ideas: Meta, Stripe, Spotify, NVIDIA, GitHub, JetBrains.
Proprietary brand fonts are not licensed for reuse: always plan an open-license substitute.

## Open questions

1. Is client-side discretion enough for the route lock, or do you want per-company bundles (strict isolation)?
2. Signal light-mode contrast misses found on 2026-09-20 (unchanged so far, colors were frozen): white on primary button 4.38:1, `text-primary` links 4.19:1, the green "Full Time" badge text 2.47:1, the amber progress ring 2.04:1 (graphic needs 3:1). Fix them when color changes are allowed again?
