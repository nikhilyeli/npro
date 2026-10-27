# Amazon Theme Guide (dense, pragmatic, metrics-first)

Status: **IMPLEMENTED 2026-09-23.** Route: `/npro/amazon` (aliases: `aws`, `prime`). Build order: 7th (after Anthropic, Google, Apple, Meta, Netflix). Part of [company-variants-plan.md](./company-variants-plan.md).
Inspired by, not affiliated with, Amazon: no logo, no smile-arrow mark, no wordmark.

**Built:** tokens (light/dark, including the intentional primary/accent-2 swap between modes described below), the "Ops Console" terminal (`nikhil@ops ~ $`), the Box pet (a cardboard shipping box, not the smile-arrow), `day1` and `metrics` (a dashboard explicitly labeled illustrative, not a real claim), and a `deploy` pipeline. A content variant (`src/lib/variants.ts`) adds a tailored hero line and a truthful "Why Amazon" panel plus project/skill reordering.
**Shipped as the lighter option from this guide's open question:** palette + terminal + pet + eggs — **no Leadership Principle tags on Experience bullets** (the highest-effort, highest-content-risk option). `leadership` and `prime` (the two remaining proposed eggs) were not built. No new font (Inter reused, skipping the Source Sans 3 idea).

## Direction

Dense and pragmatic over decorative: a deep navy anchor, amber/orange as the one warm accent, information-dense layout, bullet points read like resume bullets mapped to outcomes (a natural fit, since Amazon's own hiring process is famous for exactly this).

## Tokens (HSL triples; all pairs checked for WCAG AA on 2026-09-23)

| Token | Light | Dark |
|---|---|---|
| `--background` | `210 20% 97%` | `206 55% 10%` |
| `--foreground` | `210 30% 12%` | `40 30% 92%` |
| `--card` / `--popover` | `0 0% 100%` | `206 45% 14%` |
| `--primary` (navy — carries button text, so it stays the primary rather than the brighter orange) | `206 62% 20%` (`#173B54`-ish) | `36 100% 50%` (amber takes over as primary in dark mode, where dark text on amber passes AA and reads as the "Amazon orange" moment) |
| `--primary-foreground` | `0 0% 100%` | `206 55% 10%` |
| `--muted-foreground` | `210 8% 40%` | `210 15% 68%` |
| `--accent` / `--accent-foreground` | `206 60% 93%` / `206 62% 24%` | `206 45% 20%` / `36 100% 78%` |
| `--accent-2` (amber highlight) | `36 100% 34%` (darkened for AA as a text color) | `36 100% 60%` |
| `--success` | `142 55% 28%` | `142 45% 50%` |
| `--progress` | `36 100% 34%` (light) / `36 100% 50%` (dark) | |
| `--border` / `--input` | `210 12% 85%` | `206 30% 24%` |
| `--radius` | `0.375rem` (small, dense, functional) | |
| Confetti | navy, amber, white, light blue | |

Note the primary/accent swap between modes is intentional and mirrors how Amazon's own dark-mode surfaces lean more on amber while light surfaces lean on navy for interactive elements — verify against current public brand usage before building, since guidelines can shift.

## Typography

Amazon Ember is proprietary. Plan: **Inter** (already loaded, no new download) or **Source Sans 3** as a slightly more neutral/dense alternative — pick during implementation by comparing against the sample content. Mono: Fira Code. Body sizes trend slightly smaller/denser than the other themes (14-15px base) to fit the "information-dense" brief; headings restrained, not oversized.

## Shape, motion

Small radius (6px), thin borders, compact spacing, minimal motion (quick 150ms transitions, no bouncy easing) — the opposite personality from Apple's theme, deliberately.

## Component mapping

- **Navbar:** navy bar (dark mode) / white bar with navy text (light mode), amber active-state underline.
- **Hero:** direct, metrics-forward subhead if real numbers exist in `portfolio.json` (e.g. years of experience, delivery counts) — never fabricated ones.
- **Experience bullets:** each `highlights` bullet gets a small **Leadership Principle** tag where a real, honest mapping exists (e.g. "Ownership", "Dive Deep", "Bias for Action") — this is a labeling/framing exercise over existing true bullets, not new claims. Build a small honest mapping table during implementation and let bullets with no clean mapping go untagged rather than forcing one.
- **Roadmap:** amber ring in progress, green check completed, dashed grey future — same shape language as other themes, just the palette swap.
- **Cards:** thin-bordered, dense padding, navy headers.
- **Contact:** compact form, amber submit button (light mode) / amber submit button (dark mode too, since amber-on-navy full theme.

## Terminal skin: "Ops Console"

Bg deep navy `206 62% 12%`ish, fg warm off-white `40 30% 92%`, prompt amber `36 100% 60%`, commands light blue `200 70% 72%`. Prompt `nikhil@ops ~ $`. Title `nikhil · ops console`.

## Pet: "Box", a pixel cardboard-box-with-tape-smile character (original art, generic shipping box — not the Amazon smile-arrow logo)

A plain brown box with a simple flap and a small original abstract mark (not the Amazon arrow), walks/naps like the others; bubbles about "one more delivery" (shipping), "Day 1 thinking" (a genuinely well-known Amazon-culture phrase safe to reference generically, not a trademark), and metrics-minded encouragement.

## Easter eggs (proposal)

| Egg | What happens |
|---|---|
| `day1` | Prints "It's always Day 1." plus a short note on staying customer-obsessed |
| `metrics` | A fake dashboard: uptime 99.99%, p99 latency, deploys/week — framed as illustrative, not real claims |
| `prime` | A confetti burst plus "Two-day shipping unlocked" (playful, no real logistics claim) |
| `deploy` | A pipeline styled like a warehouse/ops rollout: build, canary, "rolled out across all fulfillment centers (pretend)", zero downtime |
| `leadership` | Lists a few real Leadership-Principle-style tags actually used in the Experience section |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Logo click → `day1`; footer button → confetti in navy/amber/white.

## Content angle (truth first)

Ownership, scale, operational rigor, metrics-driven delivery. Only reframe what's real in `portfolio.json`; the Leadership Principle tags must trace to an actual bullet, never invented achievements.

## Assets

`favicon-amazon.svg`, `og-amazon.png` (navy card, amber accent line), `noindex` on the private page (see [private-variants-and-route-lock-plan.md](./private-variants-and-route-lock-plan.md)).

## Checklist (same shape as the other company guides)

1. Tokens (light + dark, note the intentional primary/accent swap between modes). 2. Font decision (Inter vs Source Sans 3). 3. `SKINS`, "Box" pet sprite, `EGG_THEMES`, `LOGO_EGG`, `FOOTER_EGG`. 4. Contrast script both modes. 5. Build the honest Leadership Principle tag mapping (or skip it if no clean mapping exists) before wiring it into `Experience.tsx`. 6. Content variant JSON. 7. OG + favicon. 8. Browser QA desktop first, then 375px. 9. Leak check per the private-variants plan.

## Open question for you (resolved 2026-09-23)

Answered: keep this theme to a palette/terminal/pet/eggs pass for v1, no Leadership Principle tags. Revisit later if wanted — the guide's honest-mapping caveat above still applies.
