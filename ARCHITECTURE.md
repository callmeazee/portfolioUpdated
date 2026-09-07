# Portfolio Technical Architecture

## Core Principle
This is **one application with four presentation systems**, not four separate websites.

Content, routes, application behavior, SEO and accessibility are shared. Themes control presentation.

## Layers

```text
Application
├── Routes / Pages
├── Canonical Content
├── Shared Components
├── Theme System
│   ├── Editorial
│   ├── Terminal
│   ├── Brutalist
│   └── Notion
├── Design Tokens
├── Utilities
└── Infrastructure
```

## Separation of Concerns

**Content:** what the portfolio says.

**Application:** routing, navigation, theme state, persistence, SEO, accessibility and other shared behavior.

**Theme:** layout, typography, visual hierarchy, animation and presentation.

A theme must never redefine project facts, experience, skills, technologies, metrics or
contact information. Themes import from `src/content`; nothing under
`src/components/themes/**` may define portfolio facts.

Content uses the pending convention (ADR-011): `null` means "not yet supplied", never
"confirmed absent". `src/content/completeness.ts` reports the gaps and the publish
blockers, so placeholder content cannot quietly reach production.

## Structure

Target layout. Directories marked ✅ exist as of Phase 1; the rest arrive in the phase noted.

```text
src/
├── app/                     ✅ ONE route tree, theme-agnostic
│   ├── layout.tsx           ✅ resolves theme → sets data-theme
│   ├── page.tsx             ✅ (Phase 1 placeholder)
│   ├── about/ contact/      ✅ (Phase 1 placeholders)
│   ├── og/route.tsx         ✅ social card (ADR-010)
│   ├── api/health/          ✅
│   ├── robots.ts sitemap.ts ✅
│   ├── projects/ projects/[slug]/            ✅
│   ├── experience/ engineering/ notes/       ✅
│   └── notes/[slug]/ resume/                 ✅
├── themes/
│   ├── tokens.css           ✅ semantic contract + [data-theme] overrides
│   ├── registry.ts          ✅ the ONLY place theme ids are enumerated
│   ├── resolve.ts           ✅ pure: URL param → cookie → editorial
│   ├── server.ts            ✅ getActiveThemeId() — cookie read
│   ├── actions.ts           ✅ setThemePreference() Server Action
│   └── renderer.ts          ✅ theme id → presentation module (dynamic import)
├── content/                 ✅ canonical, theme-free, typed
│   ├── profile.ts experience.ts skills.ts engineering.ts
│   ├── education.ts notes.ts contact.ts
│   ├── projects/{index,besties,ecommerce,cloudcost}.ts
│   ├── completeness.ts      ✅ pending-field + publish-blocker report
│   └── index.ts             ✅ barrel + accessors
├── types/content.ts         ✅
├── types/theme.ts           ✅  views.ts ✅ (the theme prop contract)
├── proxy.ts                 ✅ applies the ?theme= step before rendering
├── components/
│   ├── shared/              ✅ PageShell, ThemeSwitcher, CommandPalette
│   └── themes/
│       ├── editorial/       ✅ Layout, Home, ProjectDetail + sections
│       ├── terminal/        ✅ window chrome, prompts, command vocabulary
│       └── {brutalist,notion}/  → Phases 6–7
├── config/site.ts           ✅
├── interfaces/              ✅
└── lib/                     ✅ seo.ts, utils.ts
```

## Design Tokens

`src/themes/tokens.css` is the single styling contract. Token names deliberately sit in
Tailwind v4's own namespaces, so one declaration both defines the token and generates the
matching utility, and Tailwind compiles that utility to `var(--token)` rather than to a
literal. Themes override token *values* under `[data-theme="…"]` — unlayered rules, which
always beat Tailwind's `@layer theme`.

Shared and `ui` components may reference only semantic tokens, never a literal color.

Two carve-outs, both documented in place: shadows live outside `@theme` and are consumed
as `shadow-(--shadow-md)` (Tailwind would otherwise bake in a literal and defeat theme
overrides), and the OG card in `app/og/route.tsx` uses literal colors because Satori
cannot read custom properties.

## Theme Registry
Use a central theme registry instead of scattering theme conditionals throughout the application.

```text
theme ID
  ↓
theme registry
  ↓
theme configuration/components
  ↓
shared content
```

## Theme Selection
Follow `theme.md`. Priority:
`URL parameter → cookie → system preference → editorial default`.

Resolution happens on the server (ADR-007) so that only the active theme's tree renders
and inactive themes' JavaScript never ships. The switcher writes the cookie and calls
`router.refresh()` inside `startTransition`, preserving route, scroll and client state
without a page load.

Invalid themes must fall back safely to editorial.

Assumption on "system preference": `prefers-color-scheme` does not auto-select a theme —
dropping a visitor into Terminal because their OS is dark would be surprising. It selects
a light/dark variant within a theme where one exists.

## Rendering
Prefer Server Components. Use Client Components only where interactivity requires them,
such as theme switching or interactive terminal behavior.

Because theme resolution reads a cookie, themed routes render dynamically rather than
being fully prerendered. This is the accepted cost of ADR-007.

## State
Keep state minimal. Do not add a state-management library unless justified by actual complexity.

## Styling
Tailwind CSS v4 over CSS custom-property tokens (ADR-008). Theme-level value overrides,
never duplicated stylesheets.

## Dependencies
Before adding a dependency, check whether existing tooling or native platform features already solve the problem. Avoid unnecessary bundle/runtime cost.

## Non-Negotiables
- No fabricated portfolio information.
- No duplicated content per theme.
- No unnecessary rewrites.
- No premature abstraction.
- No silent architectural changes.

## Deployment

**Required configuration.** `NEXT_PUBLIC_SITE_URL` must be set to the production origin
before deploying. It is the single source for canonical URLs, the sitemap, `robots.txt` and
the Open Graph image URL; unset, they all resolve against `http://localhost:3000`. See
`.env.example`.

**Rendering.** Every themed route renders dynamically, because the root layout reads the
theme cookie (ADR-007). `robots.txt` and `sitemap.xml` remain static. There is nothing to
revalidate: the content layer is compiled TypeScript, so a content change is a deploy.

**Pre-deploy gate.** `getContentStatus().isPublishable` must be true — it is false while any
featured project still carries placeholder fields (ADR-006). At the time of writing it
reports 6 blockers, so the site is deliberately not deployable yet.

**Verification before shipping**

```
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
```

The e2e suite runs against a real production build, so it exercises what actually ships:
every theme on every route, the accessibility audit, per-theme JavaScript budgets, and a
console-error sweep that would catch hydration mismatches.

**Known debt at deploy time** — see `ISSUES.md`: all four themes share one JavaScript bundle
(ADR-019, ~16KB gz of avoidable payload), and switching into an app-shell theme resets
scroll position (ISS-025).
