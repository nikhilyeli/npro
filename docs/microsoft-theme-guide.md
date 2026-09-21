# Microsoft Theme Guide (Fluent-inspired)

Status: **IMPLEMENTED (first pass), 2026-09-20.** Part of [company-variants-plan.md](./company-variants-plan.md) (Phase 2).
The source of truth for values is the `:root[data-theme="microsoft"]` blocks in `src/index.css`; this guide explains the intent.

**Direction chosen: "Visual Purple".** Visual Studio purple is the primary; Fluent blue is the second accent and the roadmap "in progress" color.
Done: tokens (light + dark), Segoe/Cascadia font stacks, 8px radius, Fluent Pivot tabs, PowerShell-blue terminal with `PS C:\nikhil>` prompt, blue in-progress ring, Fluent green completed check, themed confetti.
Done later the same day: the Microsoft easter eggs (§6: `winver` About box, `bsod`, `clippy` paperclip helper, `dotnet run`, Azure-flavoured `deploy`/`azd up`, `runas hire nikhil`), the Windows Terminal title bar, and the **Debug Duck** pet (a rubber duck in the PowerShell window, like a VS Code pet). The logo click opens `winver`; the footer button gives the four-color confetti.
Not done yet: Fluent double focus ring, navbar active underline, left-aligned hero, self-hosted Cascadia Code, per-theme favicon/OG (Phase 4).
Verified 2026-09-20: WCAG AA on all text/UI pairs in Microsoft light and dark (accent-2 in light was darkened from 42% to 38% lightness to pass).

The goal is not to copy microsoft.com. It is a portfolio for a Microsoft-stack developer that *feels* like
Microsoft's **Fluent 2** design language: calm, clear, human, accessible.
It ships as `data-theme="microsoft"` and works in both light and dark mode.

## 1. Design principles to carry over

- **Clarity over decoration:** flat surfaces, thin 1px strokes, restrained shadows, little gradient.
- **Familiar and human:** Segoe-style type, friendly copy, obvious controls.
- **Inclusive by default:** strong focus rings, high contrast, reduced-motion support (already present in the site).
- **Depth through material:** translucent navbar (Mica/Acrylic feel) using the existing `backdrop-blur`.

## 2. Color tokens

HSL triples for `src/index.css` (same raw-triple format as today). Hex given for reference. **Run a contrast script before merging.**

### Light: `:root[data-theme="microsoft"]`

| Token | Hex | HSL triple | Notes |
|---|---|---|---|
| `--background` | `#FAFAFA` | `0 0% 98%` | page |
| `--foreground` | `#242424` | `0 0% 14%` | Fluent neutral foreground |
| `--card` / `--popover` | `#FFFFFF` | `0 0% 100%` | |
| `--primary` | `#5C2D91` | `268 53% 37%` | **Visual Studio purple.** White text on it passes AA |
| `--primary-foreground` | `#FFFFFF` | `0 0% 100%` | |
| `--secondary` | `#F2F2F2` | `0 0% 95%` | |
| `--muted-foreground` | `#616161` | `0 0% 38%` | |
| `--accent` | `#F3EEFA` | `268 55% 95%` | soft purple tint (badges, hovers) |
| `--accent-foreground` | `#492378` | `268 53% 30%` | |
| `--accent-2` | `#0068C0` | `206 100% 38%` | Fluent blue (gradient end, "Remote" badge). Darkened from `#0078D4` to reach 4.5:1 |
| `--border` / `--input` | `#E0E0E0` | `0 0% 88%` | |
| `--ring` | `#5C2D91` | `268 53% 37%` | |
| `--success` | `#107C10` | `120 77% 28%` | Fluent green: roadmap completed |
| `--progress` | `#0078D4` | `206 100% 42%` | roadmap in progress (blue ring) |
| `--radius` | | `0.5rem` | cards 8px |

### Dark: `:root[data-theme="microsoft"].dark`

| Token | Hex | HSL triple |
|---|---|---|
| `--background` | `#1F1F1F` | `0 0% 12%` |
| `--card` | `#292929` | `0 0% 16%` |
| `--foreground` | `#F5F5F5` | `0 0% 96%` |
| `--primary` | `#A480E8` | `261 69% 71%` |
| `--primary-foreground` | `#0F0F0F` | `0 0% 6%` |
| `--muted-foreground` | `#ADADAD` | `0 0% 68%` |
| `--accent` | `#2B2038` | `268 35% 22%` |
| `--accent-foreground` | `#E3D6F8` | `268 80% 88%` |
| `--accent-2` | `#479EF5` | `210 90% 62%` |
| `--border` / `--input` | `#424242` | `0 0% 26%` |
| `--success` | `#45A045` | `120 40% 45%` |
| `--progress` | inherited | the in-progress icon is a light circle in both modes |

### Accent set (confetti, badges, illustrations)

Fluent-adjacent: blue `#0078D4`, green `#107C10`, orange `#FFB900`, red `#D13438`.
The Microsoft four-color logo squares (`#F25022 #7FBA00 #00A4EF #FFB900`) stay **only** inside the hidden footer egg. Do not use the Windows/Microsoft logo anywhere.

### Terminal (`--terminal-*`): skin it as PowerShell

Classic PowerShell blue: bg `#012456`, fg `#EEEDF0`, prompt `#F9F1A5` (yellow), command `#61D6D6`, highlight `#F9F1A5`.
Windows-Terminal dark alternative: bg `#0C0C0C`, fg `#CCCCCC`.

## 3. Typography

| Role | Stack |
|---|---|
| Sans | `"Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, "Inter", Roboto, sans-serif` |
| Mono | `"Cascadia Code", "Cascadia Mono", "Fira Code", Consolas, monospace` |

- Segoe UI is a system font on Windows only (not licensed for web download), so macOS/Android visitors get `system-ui`/Inter. That is acceptable.
- Cascadia Code is open source (OFL): self-host it (for example the `@fontsource/cascadia-code` package: verify availability) for the terminal on every OS.
- Fluent type ramp (px): Caption 12 · Body 14/16 · Subtitle 20 · Title 28 · Large title 40 · Display 68. Headings weight **600**, no negative tracking.
- Map onto existing `text-display` and `text-section-title` tokens so components don't change.

## 4. Shape, elevation and motion

- Radius: controls 4px, cards 8px, dialogs 8px, avatars/badges pill.
- Borders: 1px neutral stroke on cards (no heavy shadow at rest).
- Shadows (Fluent): rest `0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.14)` · hover `0 0 2px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.14)`. Dark: stronger alpha.
- Navbar: translucent `background/80` + blur (Mica/Acrylic feel).
- Motion: 100 to 300ms, decelerate curve `cubic-bezier(0.1, 0.9, 0.2, 1)`; keep the reduced-motion rule.
- Focus: 2px inner ring + 1px white outer (Fluent double focus), using `--ring`.

## 5. Component mapping

| Area | Microsoft treatment |
|---|---|
| **Navbar** | Command-bar feel; active section shown with a 2px brand underline; "Sign in"-style spacing not needed |
| **Hero** | Left-aligned on desktop, large Segoe display, purple→blue gradient title (currently shipped) or a flat purple accent, logo mark in own style |
| **Buttons** | Primary = filled blue, 4px radius, 32/40px heights; secondary = outlined neutral |
| **Tabs** (Projects, Experience) | Fluent *Pivot*: text tabs with a 2px underline indicator, no pill background |
| **Cards** | 1px stroke, 8px radius, hover lifts to shadow-8; project image overlay softer |
| **Badges** | Fluent Tag: subtle tinted background, 4px radius |
| **Roadmap** | Completed = green check circle (`--success`) · **In progress = blue indeterminate ProgressRing (`--progress`)** · Future = dashed neutral line fading out |
| **Skills** | Progress bars as thin Fluent bars (4px) in brand blue |
| **Console** | Framed as a **Windows Terminal / PowerShell** window (tabs bar, `PS C:\Users\nikhil\portfolio>` prompt) |
| **Contact form** | Fluent inputs: 1px border, 2px brand bottom border on focus, labels above |
| **Toasts** | Fluent message bar / toast styling |
| **Footer** | Simple link columns, neutral background |

## 6. Microsoft-flavoured easter eggs (ideas)

`winver` (fake About Windows box) · `clippy` ("It looks like you're building a portfolio. Would you like help?") ·
`dotnet run` (build + "Hello, World!") · `az deploy` (like `deploy`, with Azure steps) ·
`bsod` (a friendly "just kidding, all systems normal" blue screen) · `runas hire nikhil` alias for `sudo hire nikhil`.
All must stay light, dismissible and free of Microsoft logos.

## 7. Content angle (truth first)

Only reframe what is real in `portfolio.json`. Emphasis candidates: .NET / C# backends, TypeScript/React frontends, cloud/Azure work **if applicable**,
accessibility and inclusive UI, collaboration and continuous learning ("growth mindset"), shipping reliable software.
Hero titles might read: "Senior Software Engineer" · ".NET & Azure" (only if true) · "Fullstack (C# + React)" · "Accessible UI".

## 8. Assets

`public/favicon-microsoft.svg` (own "N" mark in brand blue, same red live dot rule as the Signal favicon) ·
`og-microsoft.png` (1200×630, light Fluent card: name, title, `PS>` prompt) · both referenced only by the variant entry page.

## 9. Implementation checklist (Phase 0 → 2)

1. Tokenise: `--progress`, `--success`, `--font-sans/mono`, `--radius-card/control`, `--confetti-1..4`, per-theme `--terminal-*`. Signal values equal today's, so **no visual change**.
2. Point Tailwind (`tailwind.config.ts`) at the new tokens: `success`, `progress`, `fontFamily`, `borderRadius`.
3. Replace hard-coded colors in `Experience.tsx` and `EasterEggs.tsx` with tokens.
4. Add `data-theme` handling: `ThemeToggle` menu, `index.html` pre-paint script, `?for=` param.
5. Add the two Microsoft token blocks to `src/index.css`.
6. Component tweaks that tokens can't express (tabs indicator, Fluent focus ring, PowerShell terminal chrome) behind `[data-theme="microsoft"]` selectors or a `useTheme()` flag.
7. Contrast check script (both modes) and fix failures.
8. Browser QA: every section × light/dark × desktop then mobile; roadmap; console; game/spinner; toasts; keyboard focus; reduced motion.
9. Screenshots into `docs/screenshots/microsoft/` and update the status line at the top of this file.

## 10. Definition of done

- Toggle switches Signal ↔ Microsoft instantly, persists, and never flashes on load.
- All text meets AA in both modes; focus is always visible.
- No hard-coded colors remain outside intentional brand-mark eggs.
- Signal theme looks exactly as before.
