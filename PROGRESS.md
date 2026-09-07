# Portfolio Development Progress

## Current Status
- **Phase:** Real content landed. 0 publish blockers — the site is publishable once a domain is set
- **Overall:** Four environments carrying real content. 0 publish blockers. Case-study depth and a domain remain.
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
| 6 Theme Environments | 🟢 |
| 8 Theme Integration | 🟢 |
| 9 Case Studies | 🟡 |
| 10 Accessibility | 🟢 |
| 11 Performance | 🟢 |
| 12 SEO | 🟢 |
| 13 Testing | 🟢 |
| 14 Production QA | 🟢 |
| 15 Deployment | ⬜ |

Legend: ⬜ Not Started · 🟡 In Progress · 🟢 Complete · 🔴 Blocked · ⚪ Skipped

## Current Work
- **Active task:** Case-study depth (ISS-009) and the deployment domain (ISS-005).
- Project imagery is in place; `next/image` serves AVIF/WebP at responsive sizes.
- **Test suite:** `npm test` (39 unit) · `npm run test:e2e` (110 Playwright).
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

### 2026-09-02 — Step 6.0 Theme runtime and contract

Direction change: the four themes were presentation layers, not environments — the whole
app had two client components, so nothing ran (ADR-015). Phase 6 rebuilds them with real
mechanics. This step laid the foundation.

**Done and verified:**
- `src/themes/runtime/` — pure window state machine (`window-state.ts`), window manager
  context, `useDragGesture` on Pointer Events, `useReducedMotion`, `usePersistentUi`.
- Expanded contract (`src/types/views.ts`): `Layout` → `Shell` with the collections a shell
  navigates, plus `PageKit` (ADR-018).
- Editorial and Terminal migrated; both publish a PageKit.
- All six previously-unthemed routes converted; neutral `PageShell` deleted (closes ISS-016).
- `motion` and `lucide-react` added, per-theme only (ADR-017).

**Verification run:** `typecheck`, `lint`, `build` clean. 35 unit tests (12 new, covering
z-ordering, focus-after-close, zoom restore, size clamping and the routed window's
un-closability) and 31 e2e tests pass. Screenshot confirms `/engineering` renders terminal
window chrome under the terminal theme and none under editorial.

**Two lint findings fixed rather than suppressed:** `usePersistentUi` rebuilt on
`useSyncExternalStore` — storage genuinely is external state, which also removes an extra
render; and the drag hook's ref update moved out of render into an effect, unsafe under
concurrent rendering.

**Not yet done:** no environment mechanics exist yet — that is steps 6.1–6.4. The runtime is
built but only the window state machine is exercised.

### 2026-09-02 — Step 6.1 macOS environment

**Done and verified:**
- Menu bar with working Go / Window / Theme menus (native `<details>`) and a real clock.
  No battery or wifi indicator — those would be invented status (CLAUDE.md §39).
- Dock with genuine cursor magnification, driven by motion values rather than React state
  so a pointermove costs zero renders. Running indicators reflect real window state.
- `MacWindow` with functional traffic lights: close, minimize, zoom. Draggable title bar
  and corner resize on Pointer Events.
- Finder and Terminal utility windows, client-rendered from the static content layer
  (ADR-016). The Terminal executes real commands and shares its vocabulary with ⌘K.
- Mobile (theme.md §12): full-screen windows, no drag, dock scrolls within itself so no
  destination is hidden.

**Verification run:** `typecheck`, `lint`, `build` clean; 37 unit and 42 e2e tests pass.
Eleven new e2e tests cover the desktop specifically — minimize/restore, zoom reporting its
state, the routed window's absent close control, dock navigation, Finder browsing real
content, the Terminal executing and rejecting commands, window stacking and raise-on-click,
keyboard operation of window controls, and magnification being skipped under reduced motion.

**Two real bugs found by those tests:**
- The title bar's drag handler called `preventDefault` on pointerdown, which suppressed the
  click on every traffic light. The controls looked live and did nothing — precisely the
  fake interaction §39 prohibits. `useDragGesture` now ignores gestures starting on an
  interactive element.
- Utility windows opened at full desktop size, burying the routed window. They now cascade
  at a modest size, measured in the click handler so hydration stays in step.

**One regression caught and fixed:** moving the theme switcher into the menu bar briefly
made theme switching require JavaScript. The Theme menu now uses relative `?theme=`
anchors, so a no-JS visitor who opens a shared `?theme=terminal` link can still leave.

**Not yet done:** Notion, Brutalist and Editorial remain as they were — Brutalist and Notion
still fall back to the editorial module (ISS-017).

### 2026-09-02 — Step 6.2 Notion workspace

**Done and verified:**
- Resizable, collapsible sidebar with a page tree whose chevron and page link are separate
  controls — expanding must not navigate, navigating must not collapse.
- Breadcrumb bar plus the two page controls Notion actually has: the font switcher
  (Default / Serif / Mono) and the full-width toggle. Both persist per viewer.
- Block vocabulary: callout, toggle (native `<details>`), quote, divider, properties table,
  tags, and a code block whose copy button genuinely copies.
- Projects database with Table / Board / Gallery views and working filter and sort over the
  canonical content layer.
- Case study rendered as a Notion page, deep technical detail behind toggles — the
  progressive disclosure design.md §2.3 asks for.
- Mobile: the sidebar becomes a drawer (theme.md §12).

**Deliberately omitted:** block drag handles and the slash menu. Both imply editing this
page cannot do, and a handle that reorders nothing is the fake interaction CLAUDE.md §39
prohibits.

**Verification run:** `typecheck`, `lint`, `build` clean; 37 unit and 54 e2e tests pass.
Twelve new Notion tests assert the mechanics are real rather than decorative: the tree
expanding without navigating, the sidebar collapsing and persisting, the font switcher
changing the computed font, all three database views, and the filter and sort actually
changing which records render.

**One trap caught in my own work:** the theme switcher was first written as a `<select>`
with a `window.location` handler, which would have made switching away from the workspace
require JavaScript — the same trap hit in Phase 5 and again in 6.1. It is now a `<details>`
menu of relative `?theme=` anchors.

**One limitation documented rather than hidden:** switching into an app-shell theme resets
scroll position. macOS and Notion are fixed-viewport shells that scroll an inner container,
so window scroll is 0 by definition. README §3 asks for preservation "where practical"; the
tests now assert scroll survives between document-scrolling themes, and that the *route*
survives when switching into a shell theme.

### 2026-09-02 — Step 6.3 Neo-Brutalist environment

**Done and verified:**
- Physical press primitives — hover displacement, hard-shadow collapse, 3px translate on
  `:active`. All CSS state, so they cost zero JavaScript and work before hydration.
- Marquee ticker carrying real project names, categories and any verified stack entries.
  Server-rendered; the loop is a CSS keyframe.
- Project filtering by category plus sorting, via chunky toggles over the content layer.
- Bracketed navigation and a large bold theme selector (design.md §§24, 33), built from
  `?theme=` anchors so switching works without JavaScript.
- Cursor-following block — honest decoration: `aria-hidden`, pointer-events none, skipped
  under reduced motion and on coarse pointers.
- Case study as a poster sequence, same hierarchy as every other theme.

**Intentional, not random (theme.md §8.5):** the grid asymmetry — the lead project spanning
both columns — is derived from the explicit `order` field, never randomised. A test reloads
the page and asserts the layout is identical.

**Verification run:** `typecheck`, `lint`, `build` clean; 37 unit and 61 e2e tests pass.
Seven new brutalist tests cover filtering, sorting, the marquee carrying real content, the
fixed asymmetry, the cursor follower being absent under reduced motion, the marquee stopping
rather than snapping there, and no-JS theme switching.

**One reduced-motion subtlety:** the global block clamps animation to 0.01ms, which would
snap the marquee to its end position and leave content off-screen. It is explicitly stopped
instead and the strip becomes a normal scrollable row — motion removed, information kept.

**Milestone:** all four themes now load their own module. The renderer no longer falls back
anywhere, which closes ISS-017.

### 2026-09-02 — Steps 6.4 Editorial and 6.5 Hardening

**Editorial (6.4):**
- Scroll-driven reveals via `animation-timeline: view()` — compositor-driven, zero
  JavaScript, which is what keeps Editorial the lightest theme (README §15).
- Reading progress bar via `animation-timeline: scroll()`, also CSS-only and `aria-hidden`
  since it duplicates the scrollbar.
- Case-study contents rail with IntersectionObserver scroll-spy. This one earns its
  JavaScript: knowing where you are in a long case study is navigation, not decoration. The
  links are plain anchors that work unhydrated; only the highlight needs the observer.
- Every reveal is gated twice — on `@supports` and on `prefers-reduced-motion` — so content
  is never dependent on an animation running. The hero is excluded outright; ISS-021 was
  precisely that mistake.

**View transitions were dropped, not forgotten:** React's `ViewTransition` is absent from
the installed React and has no types, so shipping it would have meant untyped, unverifiable
code. Recorded here rather than left as a silent gap.

**Hardening (6.5) — the budget test disproved ADR-013.**

The test was written to verify that inactive themes' JavaScript never ships. It found the
opposite: all four themes download a byte-identical set of 8 chunks, roughly 622KB. The
first version of the test *passed* because it double-counted responses; de-duplicating by
URL exposed the truth.

Cause: `renderer.ts` calls `import()` from a Server Component. Next builds the
client-reference manifest statically per route, so because any theme could be selected,
every theme's client components land in one bundle. `import()` in a server component splits
the server graph, not the client one.

ADR-013 now carries a correction, and ISS-026 records the defect with two candidate fixes.
The test suite documents the current behaviour rather than the aspiration: when splitting
starts working, `themes currently share one bundle` will fail, and that failure is the
signal to replace it with a per-theme assertion.

**Verification run:** `typecheck`, `lint`, `build` clean; 37 unit and 67 e2e tests pass.

### 2026-09-02 — Bundle investigation and the `motion` reversal

Investigating ISS-026 before fixing it changed both its priority and the fix.

**Real numbers:** 622KB decoded is **188KB gzipped** over the wire. Theme-specific code is
only ~22KB gz of that, so the duplicate-theme waste ISS-026 describes is ~11KB gz — I had
filed it High; it is Medium at most, now corrected.

**The larger waste was elsewhere.** `motion` was ~39KB gz — a fifth of all JavaScript — for
exactly two decorative effects, shipped to all four themes because of the same splitting
defect. ADR-017 approved it on the premise that per-theme imports would contain it; that
premise was false, so the justification no longer held.

**Removed.** Dock magnification and the brutalist cursor are hand-rolled, still writing to
the DOM directly so neither costs a React render per frame. **188KB → 153KB gzipped for
every theme**, one fewer chunk, one fewer dependency. ADR-017 carries the reversal and its
reasoning; ISS-027 is resolved.

**Test gap closed:** the suite previously only asserted these effects were *disabled* under
reduced motion, never that they worked. Both now have positive tests — which mattered,
because both were rewritten from scratch.

**Verification run:** typecheck, lint, build clean; 37 unit and 69 e2e tests pass.

### 2026-09-02 — Phases 8, 10 and 13

**Phase 8 — Theme Integration.** A 4 themes × 9 routes matrix asserting the structural
contract everywhere: HTTP 200, the theme actually applied rather than falling back, exactly
one `h1`, one `#main` landmark, reachable navigation, deep links resolving directly,
unknown routes 404ing rather than rendering an empty shell, the résumé reachable from every
theme, and — per README §16 — canonical URL, `og:image` and title identical regardless of
theme. 22 tests, all passing.

**Phase 10 — Accessibility.** axe-core against WCAG 2.1 A and AA, four themes × three
routes. **Zero violations** after one real fix.

The audit found `scrollable-region-focusable` (serious) in the brutalist marquee: it had
`overflow-x: auto` but nothing focusable inside, so a keyboard user could never scroll it
(WCAG 2.1.1) — a defect I introduced myself when making the strip scrollable for the
reduced-motion case. The fix is to treat it as what it is: decorative repetition. It is now
`aria-hidden` and clipped, so it adds no tab stop and no screen-reader duplication, and
nothing is lost because every name in it is a real link elsewhere on the page.

Worth noting what automation cannot do: axe catches roughly a third of real accessibility
problems. It found the contrast and structure issues; the keyboard operation of window
controls, focus restoration and reduced-motion behaviour are still covered by hand-written
assertions, and neither set replaces the other.

**Phase 13 — Testing.** 37 unit and 103 Playwright tests across theme mechanics,
integration, accessibility, performance budgets and no-JS paths.

### 2026-09-02 — Issue sweep

Every engineering issue is now closed or explicitly accepted. What remains is blocked on
content.

**ISS-026 — attempted, measured, accepted (ADR-019).** `next/dynamic` was implemented across
all four shells to split the per-theme bundles. It split nothing: the bundle stayed
byte-identical and grew ~2KB from the lazy-boundary wrappers. Turbopack merges the route's
client modules regardless, because the client manifest is built per route. Reverted.

The only remaining approach is route groups per theme — a routing-layer rewrite — for a
measured upside of **~16KB gzipped out of 153KB**. Accepted as debt rather than pretended
away; the budget test asserts the current behaviour and will fail the day it changes.

**ISS-029 — error boundaries were missing entirely.** `error.tsx` (with a `reset()` that
genuinely retries) and `global-error.tsx` (inline-styled, since it replaces the root layout
and cannot depend on the theme system) are added, and 404 now renders through the active
theme's PageKit — verified themed in all four.

**No `loading.tsx`, deliberately.** design.md §31 describes per-theme loading states, but
these pages render instantly from a static content layer. A loading shell would flash on
every navigation and would be precisely the "random loading screen" CLAUDE.md §39 lists as
bad. Recorded so the omission reads as a decision rather than an oversight.

**ISS-025 — won't fix**, with the reasoning already tested and documented.

### 2026-09-02 — Phases 12 (SEO) and 14 (Production QA)

**Structured data.** `Person` and `WebSite` on every page, `CreativeWork` on project pages,
built from the canonical content layer and emitted by the root layout — so all four themes
publish an identical machine-readable identity (README §16), verified by test.

No-fabrication matters more here than anywhere else, because search engines read this as
assertions of fact. Every field is omitted unless a real value exists: no `email`, no
`sameAs`, and CloudCost AI emits **no** `CreativeWork` at all because its description is
still pending — an entry would assert nothing. Tests cover both.

**Production QA.** A console-error and page-error sweep across four themes × five routes on
a production build. It found nothing, which is the useful result: the theme system renders
server-side defaults it corrects on the client — the macOS clock, the ⌘K label, every
`usePersistentUi` value — and each was a hydration mismatch waiting to happen. theme.md §16
asks for "no console errors"; this is that check, automated.

**Deployment prep.** `.env.example` and a Deployment section in `ARCHITECTURE.md`. Verified
end to end that setting `NEXT_PUBLIC_SITE_URL` propagates correctly to canonical URLs, the
sitemap, robots.txt, the OG image URL and the JSON-LD — so ISS-005 is provably a
one-variable fix rather than a hope.

**Deliberately not deployable.** `getContentStatus().isPublishable` is false while any
featured project carries placeholder fields (ADR-006). It currently reports 6 blockers, and
that gate is documented as the pre-deploy check.

### 2026-09-02 — Real content landed

A résumé was supplied. Profile, contact, experience, skills, education, five projects and
five engineering areas are now populated from it. **Publish blockers: 6 → 0.**

**The résumé contradicted the planning documents, and the résumé won.** The docs named the
primary projects Besties, E-commerce Platform and CloudCost AI; the résumé names them
ConnectVerse, Snitcher and CloudSpire AI, with live URLs. Treated as renames of the same
three and flagged for confirmation (ISS-033).

**One claim was dropped rather than carried over.** The docs described "Besties" as having
WebRTC audio/video calling. The résumé's ConnectVerse mentions no WebRTC, audio or video at
all — profiles, posts, likes, comments, notifications over Socket.IO. Publishing the WebRTC
claim would have been fabrication, so it is absent (ISS-004).

Two additional real projects — FileMoon Cloud and MoviePlas — were added as unfeatured, so
they appear on `/projects` without crowding the homepage (README §30 rule 14).

**Two real defects that only appeared once content existed:**

- **Reveals hid visible content.** The scroll-driven reveals animated from `opacity: 0`. At
  1440×900 the "Selected work" section sat *in the viewport* at opacity 0.01, and taller
  monitors hid a different one — the page looked blank below the hero. This is the ISS-021
  lesson again, applied to the hero but not to the sections. Now transform-only. The old
  test scrolled to the bottom and passed throughout; the new one varies viewport height,
  which is the variable that actually mattered.
- **Scroll containers had no keyboard access.** Real content made `/engineering` overflow,
  and that page has no links, so the macOS and Notion window bodies were scrollable with
  nothing focusable inside (axe, WCAG 2.1.1). Both are now `tabIndex={0}`.

**Three unit tests were asserting emptiness** and failed on contact with real data. They now
assert the mechanism — that pending links are leaf gaps, that featured projects satisfy the
publish gate — rather than a snapshot of what happened to be missing.

### 2026-09-02 — Project imagery (ISS-008, Phase 11)

Captured all five project heroes from the live deployments at 1440×900 @2x, resized to
1600px and encoded as WebP (11–101KB each). `next/image` re-encodes to AVIF/WebP per
request at responsive sizes, so design.md §29 is satisfied without hand-tuning variants.

No theme rendered imagery before this; each now does so in its own idiom — a full-bleed
lead image in editorial, a bordered hard-shadowed block in brutalist, a page cover and
gallery thumbnails in Notion, and an `open <file>` preview in terminal. The `ProjectImage`
primitive is shared because the mechanics (accurate `sizes`, a reserved 16:10 frame to
avoid layout shift) are easy to get wrong; only the framing is per-theme.

**One capture was rejected rather than shipped.** MoviePlas first rendered its own error
state — "Failed to load home content" — which would have made the project look broken. The
capture was retried through the app's retry control and only kept once the error was gone.
A screenshot is a claim about the work like any other.

**Two remain weak and are flagged (ISS-008):** FileMoon Cloud shows only its sign-in form,
and MoviePlas has empty cards because TMDB did not return. Both are real and honest, and
both are one file replacement away from better.

Also noted: the deployed apps brand themselves **SNITCH.** and **Movie Plus**, while the
résumé says Snitcher and MoviePlas (ISS-037).

### 2026-09-02 — Besties restored; view-all in every theme

**Besties is a distinct project, not a rename of ConnectVerse.** ISS-033 flagged the
ambiguity rather than resolving it by assumption, and the assumption would have been wrong:
merging them would have deleted a real project and attached its WebRTC/audio-video work to
one that does not have it. Re-added as an unfeatured project (the résumé leads with the
other three), with links `pending` rather than `unavailable` — the two make different
claims.

Its stack comes from README §§5/9/11, where the record is labelled an "example", so that is
the one part warranting confirmation (ISS-038).

**"View all projects" now exists in every theme**, each in its own idiom: an "All projects →"
link in editorial, `ls projects --all` in terminal, "→ View all projects" in Notion, and a
pressed button in brutalist. A cross-theme test asserts the link exists, navigates, and that
/projects lists more than the featured three — so this cannot silently regress.

Verified the homepage still shows only the featured three in every theme. Notion's sidebar
lists all six, which is correct: that is the workspace page tree, persistent navigation on
every page, not homepage content.

## Rules
After every meaningful session, update completed work, current phase, blockers, decisions
and meaningful changes. Never mark work complete without verification.
