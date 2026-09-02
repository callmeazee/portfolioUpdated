# Portfolio Development Progress

## Current Status
- **Phase:** 5 — Terminal (complete). Phase 13 testing brought forward → next: 6 Neo-Brutalist
- **Overall:** Editorial and Terminal complete, now covered by 54 automated tests and browser QA. Records still unfilled — content is the critical path.
- **Last Updated:** 2026-09-02

## Phase Tracker

| Phase | Status |
|---|---|
| 0 Discovery | 🟢 |
| 1 Foundation | 🟢 |
| 2 Content System | 🟢 |
| 3 Routing & Shell | 🟢 |
| 4 Editorial | 🟢 |
| 5 Terminal | 🟢 |
| 6 Neo-Brutalist | ⬜ |
| 7 Notion | ⬜ |
| 8 Theme Integration | ⬜ |
| 9 Case Studies | ⬜ |
| 10 Accessibility | 🟡 |
| 11 Performance | ⬜ |
| 12 SEO | ⬜ |
| 13 Testing | 🟡 |
| 14 Production QA | ⬜ |
| 15 Deployment | ⬜ |

Legend: ⬜ Not Started · 🟡 In Progress · 🟢 Complete · 🔴 Blocked · ⚪ Skipped

## Current Work
- **Active task:** Phase 6 — Neo-Brutalist theme.
- **Test suite:** `npm test` (23 unit) · `npm run test:e2e` (31 Playwright).
- **Blockers:** ISS-002 (no real portfolio content). The editorial theme is structurally
  complete but renders mostly empty states, so it cannot be judged as a design until real
  copy lands. Content status: **40 fields pending, 6 sections awaiting, 6 publish blockers.**

## Development Log

### 2026-09-02 — Phase 1 Foundation

**Done and verified:**
- Removed the SEO-boilerplate content layer (ADR-009): fabricated blog posts and routes,
  marketing copy, dead `page.module.css`, and the `src/api/` route→controller→service chain.
- Tailwind CSS v4 + PostCSS configured (ADR-008).
- Semantic token contract in `src/themes/tokens.css` — colors, typography, type scale,
  spacing, radius, shadow, motion — with value overrides for all four themes.
- Accessibility baseline: skip link, `:focus-visible` on every interactive element,
  `prefers-reduced-motion` guard, semantic landmarks. Removed the `overflow-x: hidden`
  crutch that was masking real overflow bugs.
- Real site identity; canonical domain now env-driven instead of `https://example.com`.
- Fixed broken Open Graph images on every route (ADR-010).
- Added `typecheck` script.

**Verification run:** `npm run typecheck`, `npm run lint`, `npm run build` all clean.
Production server checked: `/`, `/about`, `/contact` → 200; `/og` → 200 image/png;
`/robots.txt`, `/sitemap.xml`, `/api/health` → 200; unknown route → 404. No server
warnings or errors. Confirmed in the compiled CSS that all four `[data-theme]` blocks
emit, that token utilities resolve to `var(--token)` rather than baked literals, and
that `og:image` is present on every route.

**Not verified — carried into ISSUES.md:**
- Visual/responsive QA in a real browser (focus ring appearance, 360px overflow,
  reduced-motion behaviour) — no browser tooling available in this session (ISS-009).

### 2026-09-02 — Phase 2 Content System

**Done and verified:**
- `src/types/content.ts` — canonical model for profile, projects, case studies, experience,
  skills, engineering areas, education, certifications, achievements, notes and contact.
- Pending convention (ADR-011): `null` = not yet supplied; confirmed absence is stated
  explicitly (`[]`, `{ status: "unavailable" }`, `{ measured: false }`).
- `src/content/**` — records for all three primary projects plus every other section.
  Only structural decisions taken from the project's own specs are pre-filled (slug, title,
  category, featured, order, and the short descriptions README/content.md state verbatim).
  Stacks are deliberately NOT pre-filled from README's illustrative examples — ISS-004
  flags them as unverified.
- `src/content/completeness.ts` — reports pending fields by path and computes publish
  blockers, giving Phase 15 a mechanical ship gate.
- `src/content/index.ts` — accessors: `getFeaturedProjects`, `getAllProjects`,
  `getProjectBySlug`, `getProjectSlugs`.
- Placeholder homepage wired to the content layer, so the model is exercised end to end.

**Verification run:** `typecheck`, `lint`, `build` clean. Production server renders the
three featured projects in explicit order, shows "Description pending." for the one record
without a description, and reports 40 / 6 / 6. Counts reconciled by hand against the
records (10 profile + 4 contact + 26 project fields = 40).

**Not verified:** no automated tests exist yet (ISS-007); the counts above were checked by
inspection, not by an assertion.

### 2026-09-02 — Phase 3 Routing & Application Shell

**Done and verified:**
- Theme registry (`src/themes/registry.ts`) — the single place theme IDs are enumerated.
- Pure resolver (`resolve.ts`), server reader (`server.ts`), Server Action (`actions.ts`).
- `src/proxy.ts` applies the `?theme=` step, which a layout cannot see, by writing the
  parameter into the request cookie before rendering.
- `ThemeSwitcher` — native radios in a fieldset; persists via Server Action, strips a stale
  `?theme=` so the proxy cannot immediately overwrite the new choice.
- Full route tree per README §12: `/projects`, `/projects/[slug]`, `/experience`,
  `/engineering`, `/notes`, `/notes/[slug]`, `/resume`, plus existing `/about`, `/contact`.
- Neutral shell (`SiteHeader`, `SiteFooter`, `PageShell`, `EmptyState`) with one `<main
  id="main">` landmark per page for the skip link, and one `<h1>` per page.
- Sitemap now derives project and note entries from the content layer.

**Verification run:** `typecheck`, `lint`, `build` clean. Against a production server, all
11 routes return 200 and unknown slugs return 404, with zero server errors. Theme
resolution checked end to end: default → editorial; each of the four `?theme=` values
applies on the same request; an invalid `?theme=hacker` falls back to editorial with a 200;
the parameter sets a one-year `SameSite=Lax` cookie; the cookie alone persists on deep
routes; the parameter outranks the cookie; a tampered cookie value falls back to editorial.
Switcher markup confirmed as 4 radios, 1 checked, an `sr-only` legend, and correct landmarks.

**Two problems found and fixed rather than worked around:**
- ESLint rejected the client-side `document.cookie` write. Replaced with a Server Action
  instead of suppressing the rule — better mechanism anyway, since Next revalidates the
  route once the action resolves.
- `/notes/[slug]` returned 500 for unknown slugs. Root cause was ADR-007: the layout's
  cookie read makes `generateStaticParams` inert, and with an empty notes list its presence
  made Next classify the segment as prerenderable, which then failed at request time.
  Removed from both dynamic routes and recorded under ADR-007.

**Not verified:** browser QA of the switcher (focus ring, arrow-key behaviour, mobile
layout) — ISS-009. No automated tests — ISS-007.

### 2026-09-02 — Phase 4 Editorial

**Done and verified:**
- Theme boundary: `src/types/views.ts` defines the props a theme receives. Theme components
  take content as input and never import `@/content` (ADR-013).
- `src/themes/renderer.ts` — dynamic-import map from theme ID to presentation module.
- Editorial module: `EditorialLayout`, `EditorialHome` (Hero, SelectedWork, Capabilities,
  Experience, About, Notes, Contact), `EditorialProjectDetail`.
- Case study follows design.md §26's hierarchy, with every section conditional so a thin
  record yields a short honest page rather than a scaffold of empty headings.
- `ThemeSwitcher` gained the `segmented` variant design.md §33 specifies for editorial.
- Low-intensity motion (theme.md §6.5): one CSS hero entrance plus hover transitions.
  Deliberately no scroll-triggered reveals — an IntersectionObserver on every page is a
  poor trade for decorative motion.
- Removed the superseded neutral `SiteHeader`/`SiteFooter`.

**Verification run:** `typecheck`, `lint`, `build` clean. Against a production server all
10 routes return 200, unknown slugs 404, zero server errors. Homepage section order matches
theme.md §6.2 exactly (hero → selected-work → capabilities → experience → about → notes →
contact). Theme resolution still correct after the refactor, including invalid-value
fallback. Case study renders honest markers throughout — "Pending", "Technology stack
pending verification", "Case study not written yet", links as "pending" rather than
invented. Landmarks confirmed: skip link, header, `nav[aria-label]`, `main#main`, footer.
The hero animation is neutralised by the global reduced-motion block.

**Notable:** the whole editorial theme is server-rendered. `ThemeSwitcher` is the only
`"use client"` component in the entire application.

**Not verified:** visual QA — whether this actually looks premium at real viewport sizes
is unproven without a browser (ISS-009), and with almost every field empty the design
cannot be fairly judged yet. No automated tests (ISS-007).

### 2026-09-02 — Phase 5 Terminal

**Done and verified:**
- `TerminalWindow` — macOS chrome; traffic lights are `aria-hidden` because they are
  decorative, which design.md §19 permits so long as they claim no function.
- `PromptHeading` — the visible text is `$ ls projects`, an `sr-only` span carries the real
  section name ("Selected work"). Sighted users get the metaphor, screen-reader users get a
  usable heading, and the level stays correct (theme.md §7.5).
- `CommandPalette` — one mechanism serving both §7.3's vocabulary and §7.4's ⌘K palette
  (ADR-014). Real navigation only; unmatched input returns `command not found`.
- `TerminalHome` and `TerminalProjectDetail` — same seven sections and same case-study
  hierarchy as editorial, framed as a shell session.
- Mobile navigation via native `<details>` (theme.md §12's drawer, zero JavaScript).
- Relative `?theme=` anchors in the footer so the theme is switchable without JS.
- Motion intensity MEDIUM: a blinking cursor and hover transitions. No boot sequence —
  theme.md §7.6 warns against long loading sequences and a fake startup would be invented
  output.

**Verification run:** `typecheck`, `lint`, `build` clean. All 8 routes 200 under the
terminal cookie, zero server errors. Confirmed the dual-layer headings resolve to the seven
theme.md §6.2 sections in order; that terminal and editorial produce genuinely different
markup; that every palette destination is also a plain nav link; that Brutalist/Notion
still fall back to editorial (ISS-017); and that footer `?theme=` links switch theme while
preserving the path.

**Two lint findings fixed rather than suppressed:** `setState` inside `useEffect` in the
palette — the platform check moved to `useSyncExternalStore` with a server snapshot (which
also removes a hydration flash), and the highlight reset moved to React's documented
previous-value pattern during render.

**Not verified:** the palette's interactive behaviour — ⌘K, arrow keys, focus restore,
Escape — cannot be exercised without a browser. Its markup and focus logic were reviewed,
but the interaction itself is unproven (ISS-009).

### 2026-09-02 — Test tooling and browser QA (Phases 10/13 brought forward)

Requested before continuing to Phase 6: fix the open issues. Everything not blocked on
real content is now closed.

**Added:**
- Vitest — 23 unit tests: theme resolution including hostile input, project ordering and
  uniqueness, no-fabrication invariants, completeness reporting, and three convention tests
  (no bare `shadow-*`, no hard-coded colours outside the sanctioned OG card, no theme
  component importing `@/content`).
- Playwright — 31 e2e tests over a production build: accessibility baseline, responsive
  overflow, theme switching, and the command palette.
- A screenshot harness for visual QA.

**Three real defects found by the new tests and by looking at the screenshots:**
- ISS-020 — the terminal homepage had no `h1` at all; every section was an `h2` prompt.
- ISS-021 — the editorial hero animated the page's LCP text from `opacity: 0`, so the name
  faded in. Now transform-only.
- ISS-022 — editorial sections kept spacious padding when empty, producing a column of
  blank bands that read as a broken page.

**Also fixed:** one flaky test with a real cause — the ⌘K listener attaches on hydration, so
a keypress fired before React hydrates is dropped. Tests now retry until interactive rather
than assuming a settling time; the limitation is recorded as technical debt.

**Verification run:** `typecheck`, `lint`, `build` clean; 23 unit and 31 e2e tests passing,
the e2e suite run twice to confirm stability.

**Still not verifiable:** whether the designs are *good*. Structure, accessibility and
responsive behaviour are now proven in a browser, but every theme renders mostly empty
states (ISS-018).

## Rules
After every meaningful session, update completed work, current phase, blockers, decisions
and meaningful changes. Never mark work complete without verification.
