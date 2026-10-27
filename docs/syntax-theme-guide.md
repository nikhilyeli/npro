# Syntax Theme Guide (developer design language — not a company)

Status: **IMPLEMENTED 2026-09-23.** Route: `/npro/syntax` (aliases: `dev`, `code`, `ide`, `terminal`). Part of [company-variants-plan.md](./company-variants-plan.md).

Unlike every other theme in this project, Syntax isn't tied to a company — it's a general "developer tool" design language, ported from an existing "Syntax & Atelier" design system the user maintains (two brand languages: Syntax for developers, Atelier for designers/photographers). Nikhil's real, truthful content stays exactly the same; only the visual language changes. There is no "Why Syntax" hiring-angle content panel — that content type only makes sense for a company page.

**Built:** tokens (light + dark, ported directly from the source design system's token values, converted to HSL and re-verified for WCAG AA — see below), the "Cursor" pet (an original blocky character with a blinking cursor-bar mouth, not the design system's own wordmark mark), `format` and `lint` easter eggs, and a `build && deploy` pipeline. No content variant (by design — see above).

## Source and porting notes

Ported from the user's own Design System artifact ("Syntax & Atelier", `tokens.json`). Its `dev-*` tokens map onto this project's CSS variables as follows (light theme; dark mirrors the source's own dark values):

| This project | Source token | Hex (light / dark) |
|---|---|---|
| `--background` | `dev-canvas` | `#f5f6fb` / `#14151f` |
| `--foreground` | `dev-ink` | `#191b2b` / `#e8eaf5` |
| `--card`/`--popover` | `dev-surface` | `#ffffff` / `#1a1c29` |
| `--primary` | `dev-primary` | `#0b57c9` / `#5aa6ff` |
| `--primary-foreground` | `dev-on-primary` | `#ffffff` / `#0a1024` |
| `--secondary` | `dev-surface-raised` | `#eceef8` / `#232637` |
| `--muted-foreground` | `dev-ink-muted` | `#4a5072` / `#a9aeca` |
| `--accent` | `dev-info-bg` | `#e3edfc` / `#12233f` |
| `--accent-foreground` | `dev-link` | `#0b57c9` / `#7ab8ff` |
| `--accent-2` (identity color) | `dev-purple` | `#5b34d6` / `#a08bff` |
| `--destructive` | `dev-danger` | `#c4291f` / `#ff7b72` |
| `--border` | `dev-border` | `#ccd0e4` / `#363a54` |
| `--input` | `dev-border-strong` | `#7a80a3` / `#7077a0` |
| `--ring` | `dev-focus` | `#0b57c9` / `#8cc4ff` |
| `--radius` | `dev-radius-md` | `4px` (`0.25rem`) |

Every accent/background pairing above only reuses combinations the source design system itself documents as accessible (its README states which text tokens are valid on which surface — e.g. `dev-link` is only used on `dev-canvas`/`dev-surface`/`dev-surface-raised`/`dev-info-bg`, so `--accent` was mapped to `dev-info-bg` rather than `dev-surface-overlay`, which only allows `dev-ink`/`dev-ink-muted` text).

**The terminal is syntax-highlighted, using this theme's own code-highlighting tokens** — a genuinely on-theme choice, not a generic re-skin:

| Terminal role | Source token | Dark hex |
|---|---|---|
| `--terminal-bg` | `dev-code-bg` (dark) | `#0f1019` |
| `--terminal-fg` | `dev-code-ink` (dark) | `#d8dbee` |
| `--terminal-prompt` | `dev-syn-number` (dark, green) | `#a5e6b8` |
| `--terminal-command` | `dev-syn-keyword` (dark, purple) | `#c0a9ff` |
| `--terminal-highlight` | `dev-syn-function` (dark, gold) | `#e6d08a` |
| `--terminal-muted` | `dev-syn-comment` (dark) | `#8b92b5` |

The terminal stays dark regardless of the site's light/dark toggle (same pattern every other theme uses — a terminal is meant to look like a real terminal).

**Contrast re-verified 2026-09-23** with the same HSL→luminance→ratio script used for every other theme: all primary/accent/muted pairs pass 4.5:1 or better in both modes (see [company-variants-plan.md](./company-variants-plan.md)'s verification log for the exact numbers). This re-checks the source design system's own claimed AA compliance rather than assuming it.

## Typography

Segoe UI Variable (Text/Display) and Cascadia Code are the source's real fonts, but Segoe UI Variable is a Microsoft-exclusive variable font with no public web-font distribution, and Cascadia Code isn't on Google Fonts either — so, like the existing Microsoft/Apple/Meta themes, this ships **system-font stacks only, no new download**: `--font-sans`/`--font-display` fall back through `"Segoe UI"` → `system-ui` → `-apple-system`; `--font-mono` falls back through `"Cascadia Code"` → `"JetBrains Mono"` → the site's already-loaded **Fira Code** → generic monospace, so code still looks intentional on non-Windows machines.

## Shape and voice

4px grid corners (`0.25rem` default radius, flat, no shadow on in-flow panels), dense/precise spacing. Content voice per the source's own rules: imperative, sentence case, exact numbers over adjectives, and **text emoji only** (`:)`, `\o/`, `✓`, `✕`, `⚠︎`) — never pictographic emoji (🚀 🎉) — which is why `format`'s success line ends in `:)` rather than an emoji.

## Pet: "Cursor" (original art)

A small square "window" face with a blinking text-cursor bar for a mouth — a nod to the source design system's own wordmark accent (a lowercase name plus a solid block cursor), drawn as an original creature rather than copying that mark. Purple body (`dev-purple`), blue cursor bar (`dev-primary`).

## Easter eggs

| Egg | What happens |
|---|---|
| `format` (logo click) | "Formatted 1 file in 12ms. :)" |
| `lint` | "✓ 0 problems, 0 warnings." |
| `build && deploy` / `deploy` | Restore → build → test → deploy pipeline |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Footer button → confetti in blue/purple/green/gold.

## Not built

Content variant (intentionally — see above), a real "syntax-highlighted" code sample component (the terminal's own text is plain, just colored via the theme tokens), per-page OG/favicon beyond the SVG favicon.
