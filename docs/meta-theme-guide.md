# Meta Theme Guide (friendly, social, React-forward), PLAN ONLY

Status: **PLAN. Not implemented.** (2026-09-20) Build order: 5th (Anthropic, Google, Apple, then Meta). Part of [company-variants-plan.md](./company-variants-plan.md).
Inspired by, not affiliated with, Meta: no infinity logo, no Facebook/Instagram/WhatsApp marks.

## Direction

Approachable and energetic: clean blue on soft grey, rounded friendly shapes, reactions and small delights. A good natural fit for a React developer, since React is a Meta open-source project (a true, relevant angle).

## Tokens (HSL triples; all pairs checked for WCAG AA on 2026-09-20)

| Token | Light | Dark |
|---|---|---|
| `--background` | `216 20% 95%` (#F0F2F5) | `210 4% 10%` (#18191A) |
| `--foreground` | `0 0% 2%` | `216 15% 91%` |
| `--card` / `--popover` | `0 0% 100%` | `220 3% 14%` (#242526) |
| `--primary` | `217 100% 47%` (a bit darker than the bright brand blue for AA) | `212 100% 59%` |
| `--primary-foreground` | `0 0% 100%` | `0 0% 4%` |
| `--muted-foreground` | `216 3% 40%` | `216 5% 70%` |
| `--accent` / `--accent-foreground` | `210 100% 95%` / `218 91% 40%` | `212 40% 20%` / `212 100% 85%` |
| `--accent-2` | `268 70% 48%` (purple) | `268 100% 74%` |
| `--success` | `133 60% 30%` | `137 46% 50%` |
| `--progress` | `217 100% 47%` | inherited |
| `--destructive` | `348 80% 50%` | `348 70% 55%` |
| `--border` / `--input` | `216 7% 82%` | `210 4% 25%` |
| `--radius` | `0.75rem` (cards 12px; buttons 8px or pill) | |
| Confetti | blue, purple, pink `#FF5C87`, orange `#FF7E29` | |

## Typography

Meta's brand fonts are proprietary. Use **Inter** (already loaded) with a Helvetica/system fallback: no new download. Mono: Fira Code. Weights 500-700 for headings, sentence case, friendly tone.

## Shape and motion

12px cards, 8px controls, pill chips, soft single-layer shadows, quick springy transitions (150-250ms, slight overshoot on reactions). Reduced motion respected.

## Component mapping

Navbar: white bar with a soft bottom shadow and a round icon button style for the toggles; Hero: friendly, centered; Cards: white on grey with 12px radius; Tabs: pill or underline tabs; Badges: soft-tint chips; Roadmap: blue ring, green check, dashed future; Contact: rounded inputs with a subtle grey fill.

## Terminal skin

Bg `210 4% 10%`, fg `216 15% 91%`, prompt blue `212 100% 70%`, commands green `137 46% 62%`. Prompt `nikhil@dev ~ $`. Title `nikhil · dev`. Public-tooling flavor only (React, Jest, npm); no internal-tool names.

## Pet: "Loma", a pixel llama (original art)

A generic pixel llama (a nod to open models, no Meta marks). Walks, naps, hops on pet; bubbles about shipping small and iterating.

## Easter eggs (proposal)

| Egg | What happens |
|---|---|
| `like` / `react` (`reactions`) | A rain of reaction emojis (👍 ❤️ 😆 😮) floats up the screen with a happy chime |
| `react` | Terminal renders a fake component tree, "✔ Hydrated in 42ms" |
| `move-fast` | "Moving fast... (and testing the important parts)" plus a quick progress sprint |
| `hackathon` | 24-hour timelapse of commit messages, ends in a demo-day confetti burst |
| `deploy` | CI pipeline: lint, jest, build, canary 1% → 100% |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Logo click → `like`; footer button → confetti in the theme colors.

## Content angle (truth first)

React and TypeScript frontends, shipping quickly with quality, collaboration, open-source habits. Real experience only.

## Assets

`favicon-meta.svg`, `og-meta.png`, `noindex` on the private page.

## Checklist

Same 8 steps as the Google guide. Reaction-rain egg must stay short (about 3 s), be muted when the sound setting is off, and skip animation under reduced motion.
