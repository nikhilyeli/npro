# Apple Theme Guide (spacious, product-page storytelling), PLAN ONLY

Status: **PLAN. Not implemented.** (2026-09-20) Build order: 4th (after Anthropic, Google). Part of [company-variants-plan.md](./company-variants-plan.md).
Inspired by, not affiliated with, Apple: no Apple logo, no slogans, no product imagery.

## Direction

Quiet confidence: lots of whitespace, very large type, tight tracking, frosted glass, soft shadows, one blue accent. Pages read like product pages: one idea per screen.

## Tokens (HSL triples; all pairs checked for WCAG AA on 2026-09-20)

| Token | Light | Dark |
|---|---|---|
| `--background` | `240 11% 97%` (#F5F5F7) | `0 0% 0%` (true black) |
| `--foreground` | `240 3% 12%` (#1D1D1F) | `240 11% 97%` |
| `--card` / `--popover` | `0 0% 100%` | `240 4% 11%` (#1C1C1E) |
| `--primary` | `211 100% 43%` (a touch darker than the brand blue for AA) | `208 100% 58%` |
| `--primary-foreground` | `0 0% 100%` | `0 0% 0%` |
| `--muted-foreground` | `240 2% 44%` | `240 3% 64%` |
| `--accent` / `--accent-foreground` | `211 90% 95%` / `210 100% 35%` | `211 60% 18%` / `208 100% 82%` |
| `--accent-2` | `241 60% 52%` (indigo) | `283 87% 65%` (purple) |
| `--success` | `136 59% 30%` | `135 64% 51%` |
| `--progress` | `211 100% 43%` | inherited |
| `--border` / `--input` | `240 6% 83%` | `240 2% 22%` |
| `--radius` | `1.25rem` (cards 20px; buttons pill) | |
| Confetti | soft pastels: blue, indigo, mint, peach | |

## Typography

- SF Pro is licensed for Apple platforms only: do **not** self-host it. Use the system stack `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Inter, sans-serif`: it renders SF natively on Apple devices and Inter elsewhere. Mono: `ui-monospace, "SF Mono", Menlo, "Fira Code", monospace`.
- Display sizes very large (`clamp(3rem, 8vw, 6rem)`), weight 600, tracking `-0.02` to `-0.03em`, line-height 1.05. Body 17px, generous line-height.

## Shape, material, motion

Card radius 20-28px, pill buttons, frosted-glass navbar (`backdrop-blur-xl` + saturation boost), hairline borders, very soft large shadows. Apple-style easing `cubic-bezier(0.28, 0.11, 0.32, 1)`, 300-600ms. Optional scroll storytelling: sticky sections, fade/scale-in on enter (must respect reduced motion).

## Component mapping

Navbar: translucent glass bar with centered links; Hero: giant headline, one blue "Learn more"-style link plus a button; Cards: white rounded tiles on the grey page; Tabs: segmented control; Badges: small filled pills; Roadmap: blue ring, green check, hairline dashed future; Contact: large rounded inputs.

## Terminal skin: macOS Terminal

Bg `240 4% 8%`, fg `240 11% 97%`, prompt green `135 64% 51%`, commands cyan `199 100% 70%`, SF Mono. Prompt `nikhil@mac ~ %`. Traffic-light dots (already the default chrome).

## Pet: "Pixel", a pixel cat (original art)

Generic pixel cat, no Apple characters. Walks, sleeps curled, hops when petted; bubbles about craft ("Sweat the details.").

## Easter eggs (proposal)

| Egg | What happens |
|---|---|
| `neofetch` | Fake system-info panel (OS: nPro, Kernel: React, Shell: zsh, Uptime: too many coffees) |
| `swift run` | Build log, "Build complete!", "Hello, world!" |
| `say hello` | Speaks "Hello" with the browser's speech synthesis (only after a user action; muted respects the sound setting) |
| `spotlight` or ⌘K / Ctrl+K | A tiny command palette that jumps to sections (also a real UX feature) |
| `deploy` | Xcode-style pipeline: build, test, archive, "Upload succeeded" |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Logo click → `neofetch`; footer button → pastel confetti.

## Content angle (truth first)

Craft, detail, UX polish, accessibility, performance. Real experience only; never imply work on Apple platforms you have not done.

## Assets

`favicon-apple.svg`, `og-apple.png` (white/grey, large type), `noindex` on the private page.

## Checklist

Same 8 steps as the Google guide, plus check reduced-motion behavior for any scroll storytelling and test Safari (backdrop-filter, system font stack).
