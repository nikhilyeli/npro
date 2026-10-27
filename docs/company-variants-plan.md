# nPro: Theme Modes and Company Variants — Plan

Status (2026-09-23, revised twice same day — bug-fix/expansion pass, then two non-company design-language themes):
- **Non-company themes added: Syntax and Atelier.** `/npro/syntax` and `/npro/atelier` (aliases: `dev`/`code`/`ide`/`terminal` and `design`/`studio`/`photo`/`photography`/`gallery`) are **not companies** — they're a developer design language and a studio/photography design language, ported from the user's own "Syntax & Atelier" Design System artifact, tokens converted to HSL and independently re-verified for WCAG AA rather than trusted as-is. Each got the same treatment as a company theme (tokens, terminal, an original pet — "Cursor" for Syntax, "Sprout" for Atelier — and 2 easter eggs) **except** the "Why {Company}" content-variant panel, which only makes sense for an actual employer page. Full details: [syntax-theme-guide.md](./syntax-theme-guide.md), [atelier-theme-guide.md](./atelier-theme-guide.md). `COMPANY_BRAND_IDS` in `src/lib/brandIds.ts` now holds 10 entries; its own comment flags that the name is a slight misnomer for these two.
- **Phase 0 (tokens) DONE**: `--success`, `--progress*`, `--confetti-*`, `--font-sans/mono/display`; dead `App.css` removed. All traces of the Lovable scaffold (the `gpteng.co` editor script, `lovable-tagger`) have also been removed — see [remove-lovable-traces-guide.md](./remove-lovable-traces-guide.md).
- **Phase 1 (theme system) DONE and route-based**: `data-theme` axis, `src/lib/brand.ts` + `src/lib/brandIds.ts`, route `/npro/:company?` (`src/pages/SiteRoute.tsx`), pre-paint script. The theme comes from the **route**; there is no saved brand preference.
- **Phase 2 DONE for all eight companies: Microsoft ("Visual Purple"), Anthropic (cream/clay, serif), Google (Material tonal blue), Apple (spacious, one blue accent), Meta (friendly blue/grey), Netflix (near-black + red), Amazon (navy + amber), OpenAI (near-monochrome + teal).** Signal stays the default. Every guide is now marked IMPLEMENTED, including a new [openai-theme-guide.md](./openai-theme-guide.md) written and built in this pass (no prior plan existed for it).
  - Netflix and Amazon shipped as **palette + terminal + pet + eggs** (the lighter option in each guide's open question) — no horizontal "rows" layout, no Leadership-Principle bullet tags. Revisit either later if wanted.
- **Route aliases (new):** natural-language routes now resolve to the right theme via `ROUTE_ALIASES` in `src/lib/brandIds.ts` and redirect to the canonical route, e.g. `/npro/me` → Signal, `/npro/claude` → Anthropic, `/npro/gemini`/`chrome`/`android` → Google, `/npro/mac`/`iphone`/`ipad`/`ios` → Apple, `/npro/fb`/`instagram`/`whatsapp` → Meta, `/npro/aws`/`prime` → Amazon, `/npro/chatgpt`/`gpt` → OpenAI. The alias list is edited in one place; add more there.
- **Phase 3 (content variants): now built, generic across every theme.** `src/lib/variants.ts` holds a small `CompanyVariant` per company (a tailored one-line hero description, 2-3 truthful "Why {Company}" bullets sourced only from facts already in `portfolio.json`, a project display order, and a skill-category display order). Wired into `Hero.tsx` (new "Why {Company}" card, hidden on Signal), `Projects.tsx` and `Skills.tsx` (reordering only, no new claims). Nothing is invented; every bullet traces to an existing highlight, metric, or project.
- **Phase 4, mostly DONE**: static `/npro/<company>/index.html` + `404.html` generated at build for all eight companies; session **company lock** is on; **theme tools flag** (`VITE_THEME_SWITCHER`) is off in production; the favicon (`.ico`/apple-touch/SVG) now **updates per theme** too — `favicon-<id>.svg` per company, swapped at runtime (`applyBrand` in `brand.ts`) and pre-painted (`index.html`) and baked into each company's static entry (`vite.config.ts`). Still to do: per-company OG image/meta (every company page still shares the one default OG image).
- **Bug fixes in this pass:**
  - The About-section boot "typewriter" (`Console.tsx`) had two effects racing — a new line could start typing before the last one finished, leaving several lines frozen mid-word (looked like a dumped wall of text, not a clean type-out). Replaced with one sequential typer.
  - The Dino Runner's jump could arc higher than the canvas's headroom, so the sprite visually vanished off the top at the peak of a jump ("hit the ceiling") right before a mistimed landing. Retuned gravity/jump velocity for a snappier arc and added a hard clamp so it can never exceed the canvas, whatever the input.
  - The Dino pixel sprite (`TerminalPet.tsx`) was redrawn with a clearer head/mouth-notch/tail silhouette — the old grid read as a grey blob more than a dinosaur.
  - The theme switcher's per-theme description line was removed from the dropdown (swatch + name only now).
- **New pets:** Apple's pet is now **Orb**, a Siri-inspired soft gradient "AI orb" with a small animated waveform (awake) or a resting line (asleep) — no pixel cat anymore. Meta's pet is now **Aria**, the same orb shape in Meta's blue/purple/pink. Netflix has **Reel** (a round film-reel character with three holes). Amazon has **Box** (a cardboard shipping box with a tape cross). OpenAI has **Ada** (a small blocky assistant bot with a lit visor). All are original pixel/vector art built from code, never a real product mark.
- **Per-theme easter eggs and terminal pets, now covering all eight built themes:**
  - Microsoft: `winver`, `bsod`, `clippy`, `dotnet run`, Azure `deploy`/`azd up`, `runas` + **Debug Duck** (duck pet).
  - Anthropic: `think`, `haiku` + **Sparky** (critter pet).
  - Google: `dino` (opens the **Dino Runner** game — jump/duck endless runner, win at 300, reduced-motion "stroll" mode, high score saved), `recursion`, `lighthouse`, `doodle` (wiggles the logo), `kubectl`, `lucky` (random pick, google-only) + **Dino** (T-rex pet; double-click or Space/↑ also opens the runner).
  - Apple: `neofetch`, `swift run` (`swiftrun`) + **Orb** (Siri-inspired AI-orb pet).
  - Meta: `reactions`/`like` (an emoji "reaction rain" using the confetti canvas's emoji-particle mode), `reacttree`, `move-fast` + **Aria** (Meta-colored AI-orb pet).
  - Netflix: `play`/`resume` ("Continue watching…"), `top10` (a real top-10 skills list) + **Reel** (film-reel pet).
  - Amazon: `day1`, `metrics` (an illustrative, clearly-labeled fake dashboard) + **Box** (cardboard-box pet).
  - OpenAI: `tokens`, `align` + **Ada** (assistant-bot pet).
  - The logo and footer buttons fire a theme-specific egg everywhere (`LOGO_EGG`/`FOOTER_EGG` in `src/lib/easterEggs.ts`); "found N of M" always counts only the current theme's eggs.
- **404 page redesigned:** theme-aware, "home" respects the company lock, never links to another company, and no longer points at `/` (the wrong root on GitHub Pages).
- **Plan written, not implemented:** [private-variants-and-route-lock-plan.md](./private-variants-and-route-lock-plan.md) for hiding company details from page source/bundles/repo plus per-entry bundle splitting and (optionally) a private repo. **Deliberately not built in this pass** — its own "Decisions for you" section has five open questions (remove the prod DevTools unlock, private repo + CI secret, opaque URLs, encrypted payloads, git-history cleanup) that materially change the design, and Phase B of that plan (multi-entry Vite build) is a real architectural change with regression risk across every theme. Today all eight company themes still ship in one bundle and are visible in the default page's JS/CSS — same limits as before. Answer that doc's "Decisions for you" before starting it.
- **Verified 2026-09-23:** contrast-checked (WCAG AA) in light and dark for all eight themes (Netflix/Amazon per their guides' existing tables; OpenAI newly checked, one primary value darkened from 32% to 27% lightness to clear 4.5:1 for button text); a production build generates all eight static company pages plus per-company favicons; typecheck clean; spot-checked in the browser desktop (1440px) then mobile (375px) for the new themes, the fixed typewriter sequencing, the retuned Dino Runner (jump stays on-canvas; verified via the physics math and a mid-jump screenshot), and the new orb/reel/box/bot pets.

## Decisions (2026-09-20)

- **Default theme is Signal.** Microsoft is opt-in.
- **Microsoft = "Visual Purple":** Visual Studio purple is the primary, Fluent blue is the second accent and the roadmap "in progress" color.
- **No "Tailored for <Company>" line** on variant pages. Variants stay silent.
- **Everything is route-based** (`/npro` = Signal, `/npro/microsoft` = Microsoft). The switcher button and the terminal `theme` command are **dev tools**: they exist only when the theme-tools flag is on (see below), and they just navigate between routes.
- **Company order after Microsoft:** Anthropic → Google → Apple → Meta → Netflix → Amazon → OpenAI. All built as of 2026-09-23.

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

## Company pack ideas (build order: Microsoft ✔ → Anthropic ✔ → Google ✔ → Apple ✔ → Meta ✔ → Netflix → Amazon; starting directions, verify against each brand's current public guidelines)

Meta: blue `#0866FF`-family (darkened for AA in light mode), clean sans (Inter, no new font), "move fast", impact and scale, open source (React is from Meta: a truthful, relevant angle for a React developer). Built 2026-09-23: see [meta-theme-guide.md](./meta-theme-guide.md).
Netflix and Amazon (added 2026-09-23) now have full plan-only guides: [netflix-theme-guide.md](./netflix-theme-guide.md), [amazon-theme-guide.md](./amazon-theme-guide.md) — palettes contrast-checked, pets and eggs proposed, nothing built.

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
