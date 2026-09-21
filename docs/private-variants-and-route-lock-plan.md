# Private Company Variants and Route Lock: Plan

Status: **PLAN ONLY. Nothing here is implemented.** (2026-09-20) Replaces the "Routes, company lock and theme tools" design in [company-variants-plan.md](./company-variants-plan.md) for production. The current single-bundle version stays as the dev/testing setup until this is built.

## Goal

A recruiter or hiring manager should only ever see **their own** company's version. Nothing on the default page, in `index.html`, in the JavaScript or CSS, or in the public repo should reveal that other company versions exist or what they contain.

## What leaks today (measured 2026-09-20 on a production build)

| Where | What is visible | Why it matters |
|---|---|---|
| `dist/index.html` (default page source) | `var companies = ["microsoft","anthropic"]`, the lock key `npro-company-lock`, the key `npro-unlock-themes` | Anyone using View Source learns the company list |
| Main JS bundle (loaded by every visitor) | 42 mentions of "microsoft", 12 of "anthropic", theme labels, pet names ("Debug Duck", "Sparky"), egg lists, `npro.unlockThemes()` | Every variant's data ships to every visitor |
| Main CSS bundle | `data-theme="microsoft"` (5 blocks) and `data-theme="anthropic"` (2 blocks) with every token | All theme blocks are readable |
| Static pages | `/npro/microsoft/`, `/npro/anthropic/` are guessable words | Anyone can type another company's URL |
| Public GitHub repo (`nikhilyeli/npro`) | `src/`, `docs/`, the skill, all company guides | The repo itself lists every company and theme |
| Source maps | none (good) | keep it that way |

## What can and cannot be hidden (honest limits)

- Anything the browser receives is visible to whoever receives it. So the rule is: **ship each company's data only on that company's page**, and ship nothing about other companies anywhere else.
- A company's own visitors will see their own theme and copy. That is intended.
- The client-side session lock is *discretion*, not security. Real secrecy comes from not shipping other variants at all (Level 1) and not publishing them in the repo (Level 2).

## Protection levels (pick how far to go)

| Level | What it does | Effort |
|---|---|---|
| **0 today** | one bundle, all themes, company list in `index.html` | done |
| **1 separate bundles** | default page and each company page load **their own** JS/CSS; no company data or names in shared code | medium |
| **2 private source** | company packs and docs live in a **private repo**; the public repo has the engine and Signal only | medium |
| **3 secret links** | unguessable page URLs (`/npro/c/7k2x9q/`) and, optionally, the variant data encrypted with a key kept in the URL fragment (`#k=…`, never sent to the server) | higher |

Recommended: **1 + 2 now, 3 for links you actually send.** Level 3's encryption is optional; opaque slugs alone stop guessing.

## Target architecture (Level 1)

1. **Theme registry.** Shared code knows only Signal plus a `registerTheme()` function. Everything company-specific moves out of shared files into `variants/<id>/` and registers itself: label, tokens CSS, terminal skin, pet sprite, egg set, logo/footer eggs, content JSON, fonts.
   Today these live in shared code and must move: `BRANDS`/`BRAND_FONT_URLS` (`src/lib/brand.ts`), `COMPANY_BRAND_IDS` (`src/lib/brandIds.ts`), `SKINS`/`COMMAND_EGGS` (`Console.tsx`), `PETS`/`PET_FOR_BRAND` (`TerminalPet.tsx`), `EGG_THEMES`/`LOGO_EGG`/`FOOTER_EGG` (`easterEggs.ts`), the company overlays and `FOUND_MESSAGES` (`EasterEggs.tsx`), and the `:root[data-theme=…]` blocks in `src/index.css`.
2. **Multi-entry Vite build.** `index.html` (default) plus one HTML entry per company. Each company entry imports the shared app **and its own module**; the default entry imports none. Shared vendor code is a common chunk; company code and CSS are separate files. The default page's JS has no reference to any company chunk.
3. **Static HTML per entry with the theme baked in.** The company page ships `<html data-theme="…">` directly, so no pre-paint script has to list companies. The default `index.html` contains no company list, no env-flag text, no lock logic naming companies.
4. **Neutral filenames.** Hashed asset names only; no company names in file names, chunk names, comments or `<title>` of the default page. Company pages carry their own title/OG (needed for link previews).
5. **No discovery hints.** `<meta name="robots" content="noindex,nofollow">` on company pages; no sitemap entry; **no `robots.txt` Disallow lines** (they would list the paths); no source maps.
6. **Dev tools compiled out of production.** The theme switcher, the terminal `theme` command and `window.npro.*` live in a module imported only when `import.meta.env.VITE_THEME_SWITCHER === 'true'`. With the flag `false` (GitHub Actions), the branch is dead code and the module is not emitted. **This removes today's runtime `npro.unlockThemes()` from production** (see decisions).

## Route blocking and auto-switch (spec)

Interpretation: "route blocking" = a visitor on one company's page cannot open another company's page; "auto-switch" = if they try, they are sent back to their own company automatically.

- **On a company page:** boot script sets `sessionStorage["npro-lock"] = "<its own id or slug>"`.
- **Blocking:** if a lock exists and is a different id than this page's, `location.replace()` to the locked page before rendering anything.
- **Auto-switch from the default page:** the default bundle contains one generic rule: if `sessionStorage["npro-lock"]` is set, `location.replace("/npro/<value>/")`. It never needs a company list: the value comes from the visitor's own session. (A hand-edited value just leads to the generic 404.)
- **Unknown routes / 404:** locked session → same auto-switch; otherwise the neutral Signal 404 (which links only to `/npro`).
- **`replace`, not `push`,** so the Back button doesn't trap the visitor.
- **Scope:** per browser tab session. A brand-new tab or cleared storage has no lock; that visitor simply sees whatever URL they typed.
- **Never leak in messages:** no text like "this page belongs to another company"; a blocked visit just lands on the visitor's own page.

## Dev and testing without leaking

- Local machine: Windows env var `VITE_THEME_SWITCHER=true` (as today) builds the **dev bundle that includes every variant** and the switcher + `theme` command. Never deploy that build.
- Optional private preview: deploy the dev bundle to a private location (a password-protected static host, or a local `vite preview`) for QA.
- GitHub Actions production build sets `VITE_THEME_SWITCHER=false` and builds per-entry bundles (Level 1).

## Private source (Level 2)

- Create a private repo (for example `npro-variants`) holding `variants/*`, the company guides in `docs/` and the skill notes about companies.
- The public repo keeps: the engine, Signal, the generic docs, and the registry hooks.
- CI: the build workflow checks out the private repo using a secret (deploy key or fine-grained token, stored as an Actions secret), builds, and publishes only the built `dist/` to GitHub Pages. If the source repo becomes private, remember GitHub Pages on private repos needs a paid plan; alternative: build in the private repo and push `dist/` to a public pages repo.
- History warning: variants already committed to the public repo remain in git history. Removing them from history (or making the current repo private and creating a fresh public one) is a separate, deliberate step.

## Secret links (Level 3, optional)

- Opaque slugs: `/npro/c/<random 6-8 chars>/` per application, mapping to a company only inside that company's own bundle.
- Optional encryption: ship the variant JSON encrypted (AES-GCM via WebCrypto); the decryption key is in the URL fragment (`#k=…`), which browsers never send to the server and which is not in access logs. Without the key, the page shows the neutral Signal site. This also hides the copy from anyone who finds the URL without the full link.
- Optional expiry: a signed timestamp in the fragment after which the page falls back to Signal.

## Leak check in CI (must-have)

`scripts/check-leaks.mjs` runs after the build and **fails the deploy** if:
1. the default entry (HTML, JS, CSS) contains any company id/name/label, theme token block, pet name, lock/unlock keys naming companies, or `unlockThemes`;
2. any company's files contain another company's identifiers;
3. any source map or `robots.txt` Disallow line exists.
The list of names to scan for comes from the private repo at build time (never committed to the public repo).

## Implementation phases

| Phase | Work | Result |
|---|---|---|
| A | Extract the theme registry; move all company data out of shared files into `variants/<id>/` | shared code company-free |
| B | Multi-entry Vite build; per-company CSS; neutral chunk names | separate bundles |
| C | Static HTML per entry with `data-theme` baked in; remove the pre-paint company list and env-flag text from `index.html` | clean View Source |
| D | Lock boot + blocking + auto-switch scripts (spec above) | route blocking |
| E | Compile dev tools out of production; keep the local env-var workflow | no unlock in prod |
| F | Private repo + CI checkout; move company docs | private source |
| G | `check-leaks.mjs` in CI; view-source/grep/incognito QA | verified |
| H (optional) | Opaque slugs and encrypted payload | secret links |

Each phase ends with: typecheck, production build, leak check, browser QA (desktop first, then 375px), then commit.

## Verification plan

- `curl` the default page and grep the HTML, JS and CSS for every company name and theme token: expect zero.
- Open `/npro/<company>/` in a fresh incognito tab, then try the other company's URL and `/npro/`: expect auto-switch back.
- Network panel on the default page: no request for any company file.
- Search the built `dist/` for source maps and for `robots.txt` contents.
- Confirm the public repo tree contains no company names (after Level 2).

## Decisions for you

1. **Remove the production DevTools unlock (`npro.unlockThemes()`)?** Recommended yes: keeping it means shipping every variant to every visitor. Local env-var testing stays.
2. **Private repo for company packs (Level 2):** yes/no, and are you fine with a token secret in GitHub Actions?
3. **Readable URLs (`/npro/microsoft/`) or opaque slugs (Level 3)?** Readable is friendlier; opaque stops guessing.
4. **Encrypted variant data (Level 3)?** Worth it only for the most sensitive tailored copy.
5. **History cleanup** of variants already in the public repo: leave, or rewrite/start a fresh public repo?
