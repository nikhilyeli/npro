# Google Theme Guide (Material 3 inspired), PLAN ONLY

Status: **PLAN. Not implemented.** (2026-09-20) Build order: 3rd, after Anthropic. Part of [company-variants-plan.md](./company-variants-plan.md).
Inspired by, not affiliated with, Google: no logos or wordmarks. **Decision (2026-09-20): the pet and the game egg are a homage to the Chrome offline dinosaur**, drawn as our own pixel art (not Google's assets or code). Other Google mascots (Android bot, Gopher) stay out. It is a playful nod on a personal portfolio, not an endorsement; if that ever feels risky, swap the sprite for a generic dinosaur with no other change.

## Direction

Friendly, tonal, playful: Material 3 surfaces, big rounded shapes, pill buttons, blue as the anchor with red/yellow/green as confetti and accents.

## Tokens (HSL triples; all pairs checked for WCAG AA on 2026-09-20)

| Token | Light | Dark |
|---|---|---|
| `--background` | `210 17% 98%` (#F8F9FA) | `225 6% 13%` (#202124) |
| `--foreground` | `225 6% 13%` | `220 9% 92%` |
| `--card` / `--popover` | `0 0% 100%` | `225 4% 17%` |
| `--primary` | `214 82% 46%` (darker than the bright brand blue so white text passes) | `217 89% 76%` |
| `--primary-foreground` | `0 0% 100%` | `225 6% 13%` |
| `--muted-foreground` | `213 4% 39%` | `213 5% 63%` |
| `--accent` / `--accent-foreground` | `217 92% 95%` / `217 76% 37%` | `217 40% 22%` / `214 89% 90%` |
| `--accent-2` | `139 68% 30%` (green) | `137 41% 65%` |
| `--success` | `139 68% 30%` | `137 41% 65%` |
| `--progress` (roadmap ring) | `214 82% 46%` | inherited |
| `--destructive` | `4 71% 49%` (red) | `4 62% 50%` |
| `--border` / `--input` | `220 9% 88%` | `210 5% 25%` |
| `--radius` | `1rem` (cards 16px; buttons fully pill) | |
| Confetti | `#4285F4 #EA4335 #FBBC04 #34A853` (brand-adjacent set, like the existing logo-ring egg) | |

## Typography

- Google Sans is proprietary. Plan: **Roboto** (open) for body and **Inter** as fallback. Google has published some open fonts (for example Google Sans Code, possibly Google Sans Flex): *verify the licence before use*. Mono: Roboto Mono or Google Sans Code if open.
- Scale: Material 3 (display 57/45/36, headline 32/28/24, title 22/16/14, body 16/14/12). Headings weight 400-500, sentence case.
- Load lazily like Anthropic's serif (`BRAND_FONT_URLS`).

## Shape, elevation, motion

Large radii, tonal surface tint instead of heavy shadows (elevation = a slightly lighter/tinted surface in dark mode), state layers on hover/press (8%/12% overlay), emphasized easing `cubic-bezier(0.2, 0, 0, 1)`, 200-500ms. Reduced motion respected (already global).

## Component mapping

Navbar: top app bar with a subtle tonal surface; Buttons: pill, filled/tonal/outlined; Tabs: Material primary tabs (underline indicator) or secondary tabs; Cards: filled tonal cards with 16px radius; Chips for tags; Roadmap: blue ring in progress, green check completed, dashed grey future; Contact form: outlined text fields with floating labels.

## Terminal skin: "Cloud Shell"

Bg `225 6% 13%`, fg `220 9% 92%`, prompt green `137 41% 65%`, commands blue `217 89% 76%`, muted `213 5% 63%`. Prompt `nikhil@cloudshell:~$`. Windows-agnostic chrome: a tab strip with a `+` and `⋮`.

## Pet: "Dino", a pixel T-rex (homage to the Chrome offline dinosaur)

- **Art:** an original pixel T-rex drawn from code in `TerminalPet.tsx` (same `span`/frame helpers as Sparky and the duck), about 16×17 sprite pixels, monochrome grey (`--foreground`-ish in light, light grey in dark) like the offline page. Frames: idle (blink), walk A/B (legs alternate), sleep (eyes closed, "z z"), happy (small hop).
- **Behavior:** walks along the terminal lane, sleeps, hops when petted, with bubbles like "No internet? No problem." and "Press Space to run."
- **Starts the game:** clicking the pet still pets it; **double-click, or pressing Space/↑ while the pet is focused, or the `dino` command** launches the runner game (below). The label under the lane reads "Dino · click to pet · Space to run".

## Easter egg: the Dino Runner game (endless runner)

An original endless runner in the spirit of Chrome's offline game, built as an overlay like the bug-squash game.

- **Screen:** a full-width canvas overlay. First it shows a tiny parody "offline" card ("No internet. Try: checking your hiring pipeline.", text only, no Google logos), then Space/tap starts.
- **Controls:** Space / ↑ / tap to jump, ↓ to duck (long-press on touch). Esc closes. Desktop first; on mobile the whole canvas is the jump button.
- **World:** grey ground line with scrolling bumps and clouds; obstacles are pixel cacti (single, double, triple) and later low birds; speed ramps up gradually.
- **Physics:** fixed-timestep loop (60 Hz) with `requestAnimationFrame`, gravity-based jump with a short hold for a higher jump, simple AABB hitboxes slightly smaller than the sprites so it feels fair.
- **Score and win:** distance score with a 5-digit counter. **Easy win target: 300**, then it keeps going with "you won" celebration once (mini confetti + win chime); milestone blip every 100. High score saved in `localStorage` (wrapped in try/catch).
- **Sound:** existing WebAudio helper (`src/lib/sound.ts`): jump blip, milestone chime, game-over "done" tone, muted setting respected, mute button in the overlay.
- **Game over:** dino falls, "Try again" (Space) and "Close". A friendly line on defeat ("Every dev crashes sometimes. Run again.").
- **Accessibility:** overlay is a labelled modal dialog; game is optional; instructions are text; reduced-motion users get a **no-obstacle "stroll" mode** (score by time) or a static "you found it" card instead of fast motion.
- **Performance:** one canvas, sprites drawn from the same string-frame data, no images, no dependencies.
- **Counts as an egg:** new `dino` egg type; first finish shows "Easter egg found! N of M".

## Easter eggs (proposal)

| Egg | What happens |
|---|---|
| `dino` / `run` / `offline` (also double-click the pet) | Opens the Dino Runner game above |
| `recursion` | Prints "Did you mean: recursion" (the classic), repeats once |
| `lucky` / `feeling-lucky` | Picks a random egg and celebrates it |
| `gcloud deploy` / `deploy` | Cloud pipeline: build, test, "rolled out to 100%", zero downtime |
| `lighthouse` | Fake audit scoring 100/100/100/100 with confetti |
| `doodle` | The logo plays a short playful animation (bounce/wiggle) |
| `kubectl` | Pods "Running" table, all green |
| `pet`, `confetti`, `fidget`, `bugs`, `coffee`, `motivate`, `hire` | shared set |
Logo click → `doodle`; footer button → confetti in the four Google colors. Google theme egg count would be the shared 8 + `dino`, `recursion`, `lucky`, `lighthouse`, `doodle`, `kubectl` (minus theme-specific ones from other companies), counted per theme as usual.

## Content angle (truth first)

Reliability and scale-minded engineering, testing, accessibility, open-source habits, clean UX. Only real experience from `portfolio.json`; never claim Google products you have not used.

## Assets

`favicon-google.svg` (own "N" mark, same red live-dot rule), `og-google.png` 1200×630 light Material card, `<meta name="robots" content="noindex">` on the private page.

## Checklist

1. Add the CSS blocks. 2. Fonts (`BRAND_FONT_URLS`). 3. `SKINS`, the Dino pet sprite, `EGG_THEMES`, `LOGO_EGG`, `FOOTER_EGG`, and the `dino` egg + `DinoRunner` overlay in `EasterEggs.tsx` (or its own component file). 4. Contrast script both modes. 5. Content variant JSON. 6. OG + favicon. 7. Browser QA (desktop first, then 375px). 8. Leak check (see [private-variants-and-route-lock-plan.md](./private-variants-and-route-lock-plan.md)).
