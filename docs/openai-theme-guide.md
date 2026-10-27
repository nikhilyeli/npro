# OpenAI Theme Guide (minimalist, near-monochrome + one signature teal accent)

Status: **IMPLEMENTED 2026-09-23.** Route: `/npro/openai` (aliases: `chatgpt`, `gpt`, `gpt4`, `gpt5`, `sora`). Build order: 8th (after Anthropic, Google, Apple, Meta, Netflix, Amazon). Part of [company-variants-plan.md](./company-variants-plan.md).
Inspired by, not affiliated with, OpenAI: no logo (their mark is a distinctive flower/knot shape — not used or approximated), no wordmark, no product names in UI copy beyond generic references to "tokens" and "alignment" as everyday AI-engineering vocabulary.

**Built:** tokens (light/dark, contrast-checked — see below), the "console" terminal (`nikhil@openai ~ %`), the Ada pet (a small blocky assistant bot with a lit visor, not a specific product mascot), `tokens` and `align`, and a `deploy` pipeline. A content variant (`src/lib/variants.ts`) adds a tailored hero line and a truthful "Why OpenAI" panel plus project/skill reordering, both pointing at the AI-adjacent work already in `portfolio.json` (the AI Work Diary orchestration tool, the Live Yoga Simulation computer-vision project).
**No new font** (Inter reused — OpenAI's real typeface, Söhne, is proprietary).

## Direction

Quiet and minimal: mostly black, white and warm grey, one signature accent color (a dark teal-green, the color long associated with their product's send button and now a natural stand-in for a "brand color" here) used sparingly for primary actions and links. Generous whitespace, no heavy shadows, no bright multi-color palette — the opposite instinct from Google or Meta.

## Tokens (HSL triples; checked for WCAG AA on 2026-09-23)

| Token | Light | Dark |
|---|---|---|
| `--background` | `0 0% 100%` | `210 9% 10%` |
| `--foreground` | `210 9% 15%` | `0 0% 95%` |
| `--card` / `--popover` | `0 0% 100%` | `210 8% 14%` |
| `--primary` | `163 82% 27%` (darkened from a lighter teal so white button text clears 4.5:1 — see note) | `163 70% 55%` |
| `--primary-foreground` | `0 0% 100%` | `210 9% 10%` |
| `--muted-foreground` | `210 6% 40%` | `210 6% 65%` |
| `--accent` / `--accent-foreground` | `163 60% 94%` / `163 82% 26%` | `163 40% 20%` / `163 70% 82%` |
| `--accent-2` | `210 9% 15%` (near-black, the second "neutral" identity color) | `0 0% 80%` |
| `--success` | `163 70% 32%` | `163 60% 55%` |
| `--progress` | `163 82% 27%` | `163 70% 55%` |
| `--border` / `--input` | `210 14% 88%` | `210 8% 24%` |
| `--radius` | `0.75rem` | |
| Confetti | teal, near-black, white, warm grey — deliberately restrained, matching the minimal brand | |

Note on the primary color: an initial `163 82% 32%` only reached 3.78:1 against white (large-text only); darkened to `163 82% 27%` for 5.11:1, comfortably clearing AA for normal-size button/link text. Verified with a small HSL→relative-luminance→contrast-ratio script, the same approach used for every other theme.

## Typography

Söhne is proprietary. Inter (already loaded) covers the same clean-grotesque feel closely enough that no new font download is worth it. Mono: Fira Code (no change). Headings restrained (weight 600, no oversized display type) — the opposite instinct from Apple's giant type.

## Shape and motion

12px radius, thin hairline borders, minimal shadow, quick unobtrusive transitions (150-200ms). Reduced motion respected (global rule already in place).

## Component mapping

Navbar: plain white/near-black bar, no heavy chrome; Hero: quiet, generous whitespace, one teal primary button; Cards: white/near-black with a thin border, no strong shadow; Roadmap: teal ring in progress, green check completed; Contact: plain inputs, teal submit button.

## Terminal skin: minimalist console

Bg `210 9% 10%`, fg `0 0% 95%`, prompt teal `163 70% 55%`, commands off-white `0 0% 90%`. Prompt `nikhil@openai ~ %`. Title `nikhil · console`. Same mac-style dot chrome as the other non-Windows themes.

## Pet: "Ada", a small assistant bot (original art)

A blocky pixel robot — rounded head, a small antenna, a single lit horizontal "visor" line in the accent teal, stub arms/legs. Not a mascot for any specific model or product. Walks, naps (visor dims to a single line), hops when petted; bubbles about tokens, prompts, and context.

## Easter eggs

| Egg | What happens |
|---|---|
| `tokens` | A short "counting tokens..." pipeline, ending "Context loaded. Ready to hire." |
| `align` | "🎯 Aligning incentives: hire the good engineer." |
| `deploy` | A pipeline styled like a careful model rollout: evals, safety checks, gradual rollout |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Logo click → `tokens`; footer button → confetti in teal/near-black/white/grey.

## Content angle (truth first)

Full-stack engineering with real AI-adjacent project work: an AI orchestration tool (AI Work Diary) and a computer-vision ML project (Live Yoga Simulation, 90% pose-detection accuracy). Frame the fit as "can build both the model-adjacent piece and the product around it," never as claimed work on any specific OpenAI product.

## Assets

`favicon-openai.svg` (built), `og-openai.png` (not built — tracked as a general per-company gap in the master plan), `noindex` on the private page (see [private-variants-and-route-lock-plan.md](./private-variants-and-route-lock-plan.md), still unbuilt).

## Checklist

Same shape as the other guides: 1. Tokens (done, contrast-checked). 2. Font decision (Inter, done). 3. `SKINS`, Ada pet sprite, `EGG_THEMES`, `LOGO_EGG`, `FOOTER_EGG` (done). 4. Contrast script both modes (done). 5. Content variant (done, via `src/lib/variants.ts`). 6. OG + favicon (favicon done, OG image not built). 7. Browser QA desktop then 375px (done). 8. Leak check per the private-variants plan before this ever goes live for a real application (not yet run — that plan is still unbuilt).
