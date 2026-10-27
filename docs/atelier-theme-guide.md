# Atelier Theme Guide (studio design language — not a company)

Status: **IMPLEMENTED 2026-09-23.** Route: `/npro/atelier` (aliases: `design`, `studio`, `photo`, `photography`, `gallery`). Part of [company-variants-plan.md](./company-variants-plan.md).

Atelier is the warm, light-first counterpart to [Syntax](./syntax-theme-guide.md) in the same source "Syntax & Atelier" design system — a studio/photography/design language rather than a company. Same rule as Syntax: real content stays truthful and unchanged; no "Why Atelier" hiring-angle content panel.

**Built:** tokens (light + dark, ported from the source design system and re-verified for WCAG AA), web fonts (Fraunces serif display + DM Sans body + JetBrains Mono, all lazily loaded via Google Fonts — the source's actual choices, unlike most other themes here which reuse system/already-loaded fonts), the "Sprout" pet (an original potted-plant character in moss/clay), `develop` and `note` easter eggs, and a `publish gallery` pipeline. No content variant (by design).

## Source and porting notes

Ported from the same Design System artifact's `studio-*` tokens:

| This project | Source token | Hex (light / dark) |
|---|---|---|
| `--background` | `studio-paper` | `#fbf8f2` / `#1b1611` |
| `--foreground` | `studio-ink` | `#2a1f17` / `#f4ece1` |
| `--card`/`--popover` | `studio-white` | `#ffffff` / `#241e18` |
| `--primary` | `studio-moss` | `#3d6b4b` / `#8dbf98` |
| `--primary-foreground` | `studio-on-moss` | `#ffffff` / `#14210f` |
| `--secondary` | `studio-linen` | `#f3ede2` / `#2d251d` |
| `--muted-foreground` | `studio-ink-soft` | `#65523f` / `#c4b4a0` |
| `--accent` | `studio-sage` | `#dbe6d4` / `#2b3a2d` |
| `--accent-foreground` | `studio-ink` (sage's only documented-safe text) | same as foreground |
| `--accent-2` (warm accent) | `studio-clay` | `#8a5230` / `#dba57f` |
| `--destructive` | `studio-brick` | `#a63a2c` / `#f09a8a` |
| `--border` | `studio-hairline` | `#dccfb9` / `#4b3f31` |
| `--input` | `studio-line-strong` | `#8a7862` / `#8f7d69` |
| `--ring` | `studio-focus` (= `studio-lake`) | `#2a6a8f` / `#86bcd8` |
| `--radius` | `studio-radius-md` | `16px` (`1rem`) |

`--accent-foreground` intentionally uses `studio-ink` rather than a saturated moss/lake tone: the source design system's own accessibility notes only list `studio-ink` as a safe text color on the `studio-sage` tint, so that constraint was followed exactly rather than guessing a "nicer-looking" but unverified pairing.

**The terminal is a warm "darkroom"** — fixed dark regardless of the site's light/dark toggle, same pattern as every other theme's terminal:

| Terminal role | Source token | Dark hex |
|---|---|---|
| `--terminal-bg` | `studio-paper` (dark) | `#1b1611` |
| `--terminal-fg` | `studio-ink` (dark) | `#f4ece1` |
| `--terminal-prompt` | `studio-moss` (dark) | `#8dbf98` |
| `--terminal-command` | `studio-clay` (dark) | `#dba57f` |
| `--terminal-highlight` | `studio-amber` (dark) | `#e8b768` |

**Contrast re-verified 2026-09-23** with the project's standard HSL→luminance→ratio script: all primary/accent/muted pairs pass 4.5:1 or better in both modes.

## Typography

Unlike most themes here (which reuse system fonts to avoid a new download), Atelier's identity genuinely depends on its type: **Fraunces** (serif display/headings, via `--font-display`), **DM Sans** (body, via `--font-sans`), and **JetBrains Mono** (via `--font-mono`) are all real, freely licensed Google Fonts and central to the "warm studio" feel, so they're lazily loaded the first time this theme is applied (`BRAND_FONT_URLS.atelier` in `src/lib/brand.ts`), same lazy-load pattern as Anthropic's serif and Google's Roboto. The source's handwriting face (Caveat, for a "made with care" handwritten note style) was **not loaded** — nothing in the current component set renders handwritten emphasis text, so loading an unused font would just cost load time for no visible benefit. Add it if a future component uses it.

## Shape and voice

Soft, generous: 16px default radius, 8px spacing grid, one soft shadow (never stacked), image-first single-column layout in spirit. Content voice per the source's own rules: first person, plain and warm, one clear goal per view — and **emoji used freely** (🌿 ✨ 🙂), the opposite of Syntax's text-emoji-only rule.

## Pet: "Sprout" (original art)

A small pixel potted plant — two fanning leaves, a stem, a clay-brown pot with a simple face — walking on stub legs like every other pet here. Moss-green leaves, clay pot, tied directly to Atelier's own palette rather than any literal design-system asset (no logo/monogram was copied).

## Easter eggs

| Egg | What happens |
|---|---|
| `develop` | A darkroom-style pipeline: "Exposing... Developing... Fixing... Ready. 🌿" |
| `note` (logo click) | 🖊️ "made with care" |
| `publish gallery` / `deploy` | Export → color grade → publish pipeline |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Footer button → confetti in moss/lake/clay/amber.

## Not built

Content variant (intentionally — see above), the source's handwritten-note visual treatment (no Caveat font loaded, see Typography), per-page OG/favicon beyond the SVG favicon.
