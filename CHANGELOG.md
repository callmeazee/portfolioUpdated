# Portfolio Changelog

Record meaningful changes to the project.

## 2026-09-02

### Added
- **Phase 6 steps 6.4–6.5 — Editorial environment and hardening.** Scroll-driven reveals and
  reading progress (CSS-only), a case-study contents rail with scroll-spy, and a per-theme
  JavaScript budget test.

- **Phase 6 step 6.3 — the Neo-Brutalist environment.** CSS-only physical press and hover
  displacement, a marquee of real project data, project filtering and sorting, bracketed
  navigation, a bold no-JS theme selector, and a cursor follower gated on motion preference.
  All four themes now load their own module.

- **Phase 6 step 6.2 — the Notion workspace.** Resizable/collapsible sidebar with a page
  tree, breadcrumbs, font switcher and full-width toggle, block vocabulary (callout, toggle,
  quote, divider, properties, code with copy), and a projects database with Table/Board/
  Gallery views plus working filter and sort. Mobile drawer navigation.

- **Phase 6 step 6.1 — the macOS environment.** Menu bar with working menus and a live
  clock; dock with cursor magnification and running indicators; windows with functional
  close/minimize/zoom, drag and resize; Finder and Terminal utility windows; a deliberate
  mobile layout.

- **Phase 6 step 6.0 — theme runtime and contract.** `src/themes/runtime/` (window state
  machine, window manager, drag gesture, reduced-motion and persistence hooks); `Shell` +
  `PageKit` theme contract; `motion` and `lucide-react` as per-theme dependencies.
- ADR-015 (environments not skins, with the Notion override), ADR-016 (window model),
  ADR-017 (dependencies), ADR-018 (PageKit).

- **Test tooling.** Vitest (23 unit tests) and Playwright (31 e2e tests over a production
  build), plus a screenshot harness. `npm test`, `npm run test:e2e`.
- Convention tests that enforce what was previously only documented: no bare Tailwind
  `shadow-*` utilities, no hard-coded colours outside the OG card, and no theme component
  importing canonical content.

- **Phase 5 — Terminal theme.** macOS window chrome, prompt headings with screen-reader
  labels, `CommandPalette` (⌘K / Ctrl+K) serving as the command system, terminal homepage
  and case-study session, native `<details>` mobile drawer, no-JS `?theme=` footer links,
  and a blinking-cursor motion at MEDIUM intensity.
- ADR-014 — the command palette is the terminal's command system.

- **Phase 4 — Editorial theme.** `src/themes/renderer.ts` (dynamic-import theme modules),
  `src/types/views.ts` (the theme prop contract), and the editorial module: layout, hero,
  selected work, capabilities, experience, about, notes, contact, and the case-study page.
- `ThemeSwitcher` `segmented` variant for editorial (design.md §33).
- Low-intensity editorial motion — one CSS hero entrance, reduced-motion safe.
- ADR-013 — theme modules behind a dynamic-import renderer.

- **Phase 3 — routing and theme engine.** Theme registry, pure resolver, server-side theme
  read, `setThemePreference` Server Action, `src/proxy.ts` for the `?theme=` parameter, and
  an accessible `ThemeSwitcher`.
- Full route tree per README §12: `/projects`, `/projects/[slug]`, `/experience`,
  `/engineering`, `/notes`, `/notes/[slug]`, `/resume`.
- Neutral application shell: `SiteHeader`, `SiteFooter`, `PageShell`, `EmptyState`.
- ADR-012 — theme config holds behaviour, tokens.css holds appearance.

- **Phase 2 — content system.** `src/types/content.ts` (canonical model) and `src/content/**`
  (records for profile, the three primary projects, experience, skills, engineering areas,
  education, certifications, achievements, notes and contact).
- `src/content/completeness.ts` — reports pending fields by path and computes publish
  blockers, so placeholder content cannot quietly reach production.
- `src/content/index.ts` — `getFeaturedProjects`, `getAllProjects`, `getProjectBySlug`,
  `getProjectSlugs`.
- ADR-011 — the pending convention.

### Added (Phase 1)
- Tailwind CSS v4 with PostCSS (`tailwindcss`, `@tailwindcss/postcss`).
- `src/themes/tokens.css` — semantic design token contract (color, typography, type scale,
  spacing, radius, shadow, motion) with value overrides for all four themes.
- Accessibility baseline: skip link, `:focus-visible` on every interactive element,
  `prefers-reduced-motion` guard, semantic landmarks.
- `src/app/og/route.tsx` — Open Graph card as a route handler.
- `typecheck` npm script.
- ADR-004 … ADR-010 in `DECISIONS.md`.

### Changed
- `src/app/sitemap.ts` — project and note entries now derive from the content layer.
- `navigation` — now the core route set from README §12.
- `src/config/site.ts` — real identity; canonical URL now env-driven
  (`NEXT_PUBLIC_SITE_URL`) instead of `https://example.com`.
- `src/app/globals.css` — rebuilt on Tailwind + tokens; boilerplate component classes
  dropped in favour of theme-owned presentation.
- `/`, `/about`, `/contact`, `not-found` — reduced to honest placeholders pending content.
- `src/app/sitemap.ts` — reflects routes that actually exist.
- `src/app/api/health/route.ts` — self-contained.

### Fixed
- Window title-bar dragging suppressed clicks on the traffic-light controls, leaving them
  visibly live but inert. Drag gestures now ignore interactive elements.
- Utility windows opened at full desktop size, completely covering the routed window.
- The terminal homepage rendered no `h1` — every section was an `h2` prompt. The top prompt
  is now the `h1`, carrying the person's name as its screen-reader label.
- The editorial hero animated its heading from `opacity: 0`, fading in the page's LCP text.
  It now animates transform only, at normal rather than slow duration.
- Editorial sections kept spacious padding when empty, rendering a column of near-blank
  bands. Sections stay compact until they have content to space out.
- `/notes/[slug]` returned HTTP 500 for unknown slugs. `generateStaticParams` is inert
  under ADR-007 (the layout's cookie read makes every route dynamic), and with an empty
  notes list its presence made Next classify the segment as prerenderable, which then
  failed at request time. Removed from both dynamic routes.
- Open Graph images were broken on every page: `createSeoMetadata` defaulted to
  `/opengraph-image.png`, which does not exist. Every route now carries a working card.
  Fixing this exposed a second defect — with the `opengraph-image.tsx` file convention in
  place, only `/` emitted an `og:image` at all; child routes had explicit images stripped.
  See ADR-010.
- All canonical URLs, sitemap entries and OG URLs pointed at `https://example.com`.
- `scroll-behavior: smooth` was unguarded by `prefers-reduced-motion`.
- `overflow-x: hidden` on `html, body` was masking real horizontal-overflow bugs.

### Removed
- **`motion` dependency.** Dock magnification and the brutalist cursor are hand-rolled;
  188KB → 153KB gzipped for every theme. ADR-017 reversed (ISS-027).
- `PageShell` — superseded by each theme's `PageKit`, so all eight routes are themed.
- `SiteHeader` / `SiteFooter` — superseded by per-theme layouts.
- Fabricated content: `src/data/blog.ts` (three invented articles), `src/app/blog/**`,
  and the invented marketing copy on `/about` and `/contact`.
- Placeholder identity: "Azee Studio", `hello@example.com`, `twitter.com/yourhandle`.
- `src/api/**` — a route→controller→service chain returning a static object, plus an
  orphaned duplicate `health.ts`.
- `src/app/page.module.css` — unreferenced.
- `src/app/opengraph-image.tsx` — superseded by `app/og/route.tsx`.

### Notes
- **ADR-013's code-splitting claim is corrected.** Measurement shows all four themes ship an
  identical bundle; per-theme splitting does not work (ISS-026). The dynamic imports keep
  the server graph tidy but do not split client code.
- Phase 0 Discovery and Phase 1 Foundation complete and verified
  (`typecheck`, `lint`, `build` clean; all routes checked against a production server).
- No portfolio content exists yet; Phase 2 builds the typed model while the content
  interview supplies real records (ADR-006).

## Earlier

### Added
- Planning and project-management documentation.
- Phased implementation workflow.
- Architecture, decision, issue and progress tracking.
