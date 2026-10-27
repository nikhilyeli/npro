# Netflix Theme Guide (cinematic, near-black + red)

Status: **IMPLEMENTED 2026-09-23.** Route: `/npro/netflix` (aliases: `nflx`, `stream`, `streaming`). Build order: 6th (after Anthropic, Google, Apple, Meta). Part of [company-variants-plan.md](./company-variants-plan.md).
Inspired by, not affiliated with, Netflix: no logo, no wordmark, no "N" ribbon.

**Built:** tokens (light/dark, per the table below), the "Netflix CLI" terminal (`nikhil@stream ~ $`), the Reel pet (a round film-reel character), `play`/`resume` ("Continue watching Nikhil's Portfolio — S1E1: About Me"), `top10` (a real top-10 skills list pulled from `portfolio.json`), and a `deploy` pipeline. A content variant (`src/lib/variants.ts`) adds a tailored hero line and a truthful "Why Netflix" panel plus project reordering.
**Shipped as the lighter option from this guide's open question:** palette + terminal + pet + eggs, re-using the existing grid/roadmap components — no horizontal "rows" Projects layout, no "Continue watching" roadmap re-skin, and no new font (Inter reused, skipping the Archivo/Barlow Condensed idea). **Not built:** `skip-intro`, `areyoustillwatching`, content OG/favicon-per-page beyond the SVG favicon.

## Direction

Cinematic and confident: a near-black canvas, one saturated red accent, bold condensed-feeling headlines, content presented as horizontal "rows" rather than grids.

## Tokens (HSL triples; all pairs checked for WCAG AA on 2026-09-23)

| Token | Light | Dark (primary look) |
|---|---|---|
| `--background` | `0 0% 97%` | `0 0% 8%` (`#141414`-ish) |
| `--foreground` | `0 0% 8%` | `0 0% 93%` |
| `--card` / `--popover` | `0 0% 100%` | `0 0% 12%` |
| `--primary` | `357 92% 41%` (darkened from the bright brand red so white text passes AA) | `357 92% 55%` |
| `--primary-foreground` | `0 0% 100%` | `0 0% 6%` |
| `--muted-foreground` | `0 0% 38%` | `0 0% 63%` |
| `--accent` / `--accent-foreground` | `357 92% 95%` / `357 80% 32%` | `357 40% 20%` / `357 90% 82%` |
| `--accent-2` | `0 0% 20%` (near-black chip, light mode) | `0 0% 70%` (light grey chip, dark mode) |
| `--success` | `142 60% 28%` | `142 50% 50%` |
| `--progress` | `357 92% 41%` | `357 92% 55%` |
| `--border` / `--input` | `0 0% 88%` | `0 0% 22%` |
| `--radius` | `0.375rem` (small, confident corners) | |
| Confetti | red, near-black/grey, white — deliberately restrained (2-3 colors, not rainbow) | |

Netflix's own product is almost always dark; this plan keeps a light mode for consistency with every other theme (and the site-wide light/dark toggle), but dark is the "true" look and the one worth screenshotting first.

## Typography

Netflix Sans is proprietary. Plan: a bold, slightly condensed open alternative — **Archivo** or **Barlow Condensed** for headings (verify current OFL availability), Inter for body (no new download if skipped). Mono: Fira Code (no change). Headlines large, bold, tight tracking; body comfortable and neutral so it doesn't compete.

## Shape, motion

Small radius (6px), edge-to-edge imagery where possible, hover = scale up slightly + shadow (like a title card), fast confident transitions (150-200ms). Reduced motion respected (global rule already in place).

## Component mapping

- **Navbar:** near-black translucent bar, red active-state underline.
- **Hero:** full-bleed dark backdrop, large bold title, one red primary button ("View Projects" as if it were "Play").
- **Projects:** reframe as horizontal scrolling "rows" grouped by category (a genuine layout change, biggest lift in this theme) with card hover scale-up; graceful fallback to the existing grid if horizontal rows aren't built yet.
- **Experience roadmap:** re-skin as "Continue watching": completed = red-checked/finished bar, in-progress = a red "progress bar" fill (matches the site's existing progress-ring pattern conceptually), future = a dim/greyed-out row.
- **Badges:** small pill "tags" (age-rating-card style, but with real content like "Remote"/"Full-time" — no fake ratings).
- **Contact:** dark card, red submit button.

## Terminal skin: "Netflix CLI" (playful, not a real product)

Bg near-black `0 0% 6%`, fg light grey `0 0% 92%`, prompt red `357 85% 62%`, commands light grey `0 0% 75%`. Prompt `nikhil@stream ~ $`. Title `nikhil · now playing`.

## Pet: "Reel", a pixel film-reel character (original art)

A small round film-reel body with two "eyes" as reel holes, thin arms/legs, walks and naps like the others; bubbles about pacing a project like a season ("binge responsibly"), shipping in episodes (iterative releases), and cliffhangers (todo items).

## Easter eggs (proposal)

| Egg | What happens |
|---|---|
| `play` / `resume` | "Continue watching Nikhil's Portfolio — S1E1: About Me" then scrolls to About |
| `skip-intro` | Jumps straight to Projects, skipping Hero, with a quick fade |
| `top10` | Prints a "Top 10 in Skills today" list pulled from real skills data, numbered 1-10 |
| `deploy` | A release-train pipeline: build, encode, "now streaming in 190 countries (pretend)", zero downtime |
| `areyoustillwatching` | A friendly "Are you still there?" prompt after some idle time in the terminal, dismissible |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Logo click → `play`; footer button → confetti in red/near-black/white.

## Content angle (truth first)

Frame real experience as a media-savvy engineer: performance at scale, content delivery, resilient systems, clean UX for consuming information quickly. Only real experience from `portfolio.json`; never claim streaming-specific work not actually done.

## Assets

`favicon-netflix.svg`, `og-netflix.png` (near-black card, bold red title), `noindex` on the private page (see [private-variants-and-route-lock-plan.md](./private-variants-and-route-lock-plan.md)).

## Checklist (same shape as the Google/Apple/Meta guides)

1. Tokens (light + dark). 2. Font decision (Archivo/Barlow Condensed or skip and keep Inter). 3. `SKINS`, "Reel" pet sprite, `EGG_THEMES`, `LOGO_EGG`, `FOOTER_EGG`. 4. Contrast script both modes (values above already checked once; recheck after any tweak). 5. Optional: horizontal "rows" layout for Projects (biggest net-new UI piece — can ship v1 without it, reusing the existing grid). 6. Content variant JSON. 7. OG + favicon. 8. Browser QA desktop first, then 375px. 9. Leak check per the private-variants plan before this ever goes live for a real application.

## Open question for you (resolved 2026-09-23)

Answered: ship v1 with the standard grid/roadmap components re-skinned in Netflix colors (no rows layout). Revisit the "rows"/"Continue watching" idea later if wanted.
