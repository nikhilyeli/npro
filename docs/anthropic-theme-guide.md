# Anthropic Theme Guide (warm, editorial)

Status: **STARTED, first pass implemented (2026-09-20).** Route: `/npro/anthropic`. Part of [company-variants-plan.md](./company-variants-plan.md).
Values live in the `:root[data-theme="anthropic"]` blocks of `src/index.css`. Inspired by, not affiliated with, Anthropic: no logos, wordmarks or the official mascot are used.

## Direction

Calm, humane, editorial: warm cream paper, clay-orange accent, near-black warm text, serif headings over a clean sans body, generous radius.

## Tokens

| Token | Light | Dark |
|---|---|---|
| `--background` | `50 20% 95%` (cream) | `60 3% 12%` |
| `--foreground` | `60 4% 8%` | `48 25% 92%` |
| `--card` | `48 33% 97%` | `60 3% 16%` |
| `--primary` (clay) | `16 59% 44%` (≈ `#B4532F`, white text 4.98:1) | `17 67% 67%` |
| `--accent-2` (muted blue) | `209 42% 42%` | `208 45% 65%` |
| `--success` (sage) | `93 28% 34%` | `93 30% 50%` |
| `--progress` (roadmap in progress) | `16 59% 44%` (clay ring) | inherited |
| `--radius` | `0.75rem` | |
| Confetti | `#D97757 #6A9BCC #EBDBBC #788C5D` | |

Contrast script (2026-09-20): every text/UI pair passes AA in light and dark.
The clay is deliberately darker than the bright brand orange (`#D97757`) because white text on the bright orange is only about 2.9:1.

## Typography

- Headings (`h1`-`h3`): **Source Serif 4** (open license, Google Fonts), via the new `--font-display` token. Signal and Microsoft set it to their sans, so they look unchanged.
- Body: Inter. Mono: Fira Code.
- The serif is loaded lazily the first time this theme is applied (`BRAND_FONT_URLS` in `src/lib/brand.ts`), so other themes pay nothing.
- Proprietary brand fonts are not licensed for reuse; swap in an open serif if Source Serif 4 ever feels off.

## Terminal ("Claude-style")

Warm dark window (`--terminal-bg 30 3% 12%`), cream text, orange `>` prompt, title `nikhil ✻ terminal`, mac-style dots.
Skin config: `SKINS.anthropic` in `src/components/Console.tsx`.

## Pet: Sparky

An original orange pixel critter (12×9) that walks, idles, sleeps and hops when petted. Drawn from code in `src/components/TerminalPet.tsx`
(`critterFrame`). Click it or type `pet`: hearts, a chirp, a speech bubble with a short encouraging line.
It is *not* the official mascot; to use official art, that has to be a deliberate decision with the right permissions.

## Easter eggs in this theme (10)

`confetti`, `fidget`, `bugs` (+ Konami), `deploy` (as `ship --carefully`: evals, safety checks, docs, gradual rollout), `coffee`, `motivate`, `hire`, `pet`, plus:
- **`think`** (alias `claude`; also the logo click): a "✻ Thinking…" sequence that ends in an encouraging line.
- **`haiku`**: a random 5/7/5 haiku about debugging.
The footer button gives confetti in the theme colors.

## Not done yet

Content variant (`src/data/variants/anthropic.json`: hero copy, skill emphasis, project order), `og-anthropic.png` + per-page meta, its own favicon, focus-ring polish, and a review of the wording by you.
Truthful-content rule applies: emphasise real experience (careful engineering, clear writing, tooling) and never invent claims.
