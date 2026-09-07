# Architecture Decision Records

Record important technical/product decisions here. Never silently overwrite historical decisions.

## ADR-001 — Four Theme Architecture
**Status:** Accepted

The portfolio supports:
1. Editorial / Minimal
2. macOS Terminal
3. Neo-Brutalist
4. Notion-style

**Reason:** Demonstrate professional communication and frontend engineering range while maintaining one application.

## ADR-002 — Canonical Shared Content
**Status:** Accepted

Portfolio facts and case-study content live independently from theme components.

**Reason:** Prevent inconsistent information and make additional themes inexpensive.

## ADR-003 — Plan Before Implementation
**Status:** Accepted

Claude Code must complete discovery and planning before major implementation.

**Reason:** Multiple design documents and themes create a high risk of architectural drift if coding starts immediately.

## ADR-004 — PLAN.md Is the Execution Track
**Status:** Accepted · 2026-09-02

**Context:** `README.md` §29 defines 8 phases (Editorial before the theme engine);
`PLAN.md` and `CLAUDE.md` §11 define 16 (0–15, theme infrastructure before themes).
The documentation hierarchy ranks README above PLAN, but `CLAUDE.md` §11 instructs
explicitly to use PLAN.md's phases.

**Decision:** Execute against PLAN.md's 16 phases. Treat README §29 as a coarse summary.

**Consequences:** Theme infrastructure lands before any theme is built, which is what
prevents four parallel implementations from diverging.

## ADR-005 — `/notes`, Not `/blog`
**Status:** Accepted · 2026-09-02

**Context:** The boilerplate shipped `/blog`; `README` §12 and the `theme.md` sidebars
specify `/notes`.

**Decision:** Use `/notes`. The boilerplate `/blog` routes and their fabricated posts
were deleted in Phase 1; `/notes` is created in Phase 3 with the rest of the route tree.

**Consequences:** No redirect is needed — nothing was ever deployed at `/blog`.

## ADR-006 — Content via Guided Interview, Built Against Placeholders
**Status:** Accepted · 2026-09-02

**Context:** No real portfolio content exists. Fabrication is forbidden (`CLAUDE.md` §9).
Waiting for complete content before building would stall every phase.

**Decision:** Build Phases 1–8 against the typed content model with honest, visible empty
states, and backfill real records through a structured interview sequenced by
`content.md` §42 (Profile → Besties → E-commerce → CloudCost AI → Experience → Skills).

**Consequences:** Missing fields are `null` and render as explicit gaps, never as
plausible filler. The site is not deployed (Phase 15) while any primary-project record is
still placeholder. Progress on unfilled records is tracked in ISSUES.md.

## ADR-007 — Cookie-Driven Server-Rendered Themes
**Status:** Accepted · 2026-09-02

**Context:** Four structurally different presentations must share one route tree, switch
without a page reload, persist across sessions, and avoid shipping inactive themes' JS
(`theme.md` §§4, 14). Alternatives considered: a client-side renderer with dynamic
imports (instant, but a non-default theme flashes editorial on first paint and content
renders client-side); route groups plus a `proxy.ts` rewrite (fully static, but per-theme
route shells to keep in sync).

**Decision:** Resolve the theme on the server from `?theme=` → cookie → system preference
→ editorial, and render only the active theme's tree. The switcher writes the cookie and
calls `router.refresh()` inside `startTransition`.

**Consequences:** Route, scroll and client state survive a switch with no page load; each
theme gets real server-rendered HTML; inactive themes' JS never ships. Accepted trade-off:
routes render dynamically rather than fully statically, and a switch costs one RSC
round-trip rather than being literally instantaneous.

**Consequence discovered in Phase 3 (2026-09-02):** the cost is broader than "routes render
dynamically". Because the root layout reads a cookie, `generateStaticParams` is inert — it
cannot prerender anything. On `/notes/[slug]`, whose param list is currently empty, its mere
presence made Next classify the segment as statically prerenderable, and a request for an
unknown slug then failed with `DYNAMIC_SERVER_USAGE` (HTTP 500) instead of rendering a 404.
Both dynamic routes now omit it. Reinstate only if theme resolution becomes
static-compatible, e.g. under `cacheComponents`.

**Implementation note:** the `?theme=` step cannot live in the layout — layouts do not
receive `searchParams`. `src/proxy.ts` translates the parameter into a request cookie
before rendering, so `getActiveThemeId()` stays a single cookie read everywhere.

## ADR-008 — Tailwind CSS v4 over CSS Custom-Property Tokens
**Status:** Accepted · 2026-09-02

**Context:** `README` §27 recommends Tailwind; the boilerplate used hand-rolled global CSS.
Four themes must override presentation without duplicating stylesheets.

**Decision:** Semantic tokens are the contract, declared in `src/themes/tokens.css`.
Token names sit in Tailwind v4's own namespaces (`--color-*`, `--font-*`, `--text-*`,
`--radius-*`, `--ease-*`), so one declaration both defines the token and generates the
utility. Themes override token *values* under `[data-theme="…"]`; those rules are
unlayered and therefore beat Tailwind's `@layer theme`.

**Consequences:** A theme switch is a repaint, not a rebuild — verified in the compiled
CSS, where utilities resolve to `var(--token)`.

*Exception:* shadows are deliberately kept out of `@theme`. Tailwind bakes `shadow-md`
into a literal at build time, which would silently ignore every `[data-theme]` override
(the brutalist hard offsets would never apply). They are plain custom properties consumed
as `shadow-(--shadow-md)`. Tracked as ISS-010 so the convention does not get forgotten.

## ADR-009 — Strip Boilerplate Content, Keep Infrastructure
**Status:** Accepted · 2026-09-02

**Context:** An untracked "SEO boilerplate" layer sat on top of the Create Next App commit,
carrying an invented identity and three fabricated blog articles.

**Decision:** Keep the genuinely useful infrastructure — `lib/seo.ts`, `lib/utils.ts`,
`interfaces/`, the `config/site.ts` shape, the `sitemap`/`robots` routes, the `@/*` alias,
ESLint and `next/font` setup. Delete `src/data/blog.ts`, `src/app/blog/**`,
`src/app/page.module.css` and the whole `src/api/**` route→controller→service chain
(three files of indirection returning a static object, contra `CLAUDE.md` §14).

**Consequences:** No fabricated content survives into the portfolio. `/api/health` is now
a single self-contained route handler.

## ADR-010 — Social Card as a Route Handler, Not the File Convention
**Status:** Accepted · 2026-09-02

**Context:** The boilerplate's `createSeoMetadata` defaulted `openGraph.images` to
`/opengraph-image.png`, a file that does not exist — every page had a broken social
preview. Removing that default exposed a second problem: with `app/opengraph-image.tsx`
present, only `/` emitted an `og:image`. File-based metadata takes precedence over the
`metadata` object site-wide, but the generated image attaches only to the segment holding
the file, so `/about` and `/contact` had their explicit images stripped and emitted none.
Verified against Next.js 16.3.4 — an absolute URL set directly on the page was dropped too.

**Decision:** Serve the card from `app/og/route.tsx`, an ordinary route handler, and have
`createSeoMetadata` point every route at it explicitly.

**Consequences:** Every route carries a working `og:image`, with no file-convention
precedence rule to lose to. This matters because SEO identity must be identical across all
four themes (`README` §16). The card's palette values are necessarily literal — Satori
cannot read CSS custom properties — the one sanctioned exception to tokens-only.

## ADR-011 — The Pending Convention in the Content Model
**Status:** Accepted · 2026-09-02

**Context:** ADR-006 builds the site against placeholders while real content arrives by
interview. That is only safe if "not yet supplied" is structurally distinguishable from
"confirmed absent" — otherwise a missing fact and a deliberate omission look identical,
and the No Fabrication Policy (`CLAUDE.md` §9) becomes unenforceable by inspection.

**Decision:** In `src/types/content.ts`, `null` means *pending* and never *absent*. A
confirmed absence is stated explicitly: an empty array, `{ status: "unavailable" }` for a
link that genuinely has no public URL (content.md §25), `{ measured: false }` for
performance that was never measured (content.md §20).

`src/content/completeness.ts` walks the records, reports every pending value by path, and
computes publish blockers. Collections that are empty only because nobody has been asked
yet are listed separately, since an empty array alone cannot carry that distinction.

**Consequences:** Unfilled content is countable and visible rather than silently rendering
as blank. Phase 15 has a mechanical ship gate. The cost is a small amount of ceremony at
each field, and one genuine sharp edge: `ExperienceEntry.endDate` uses the literal
`"present"` rather than `null`, because a null end date would otherwise read as "unknown".

**Also decided here:** challenges and their solutions are ONE record
(`Challenge { problem, investigation?, approach?, implementation?, result? }`) rather than
the two parallel arrays content.md §§22–23 implies. Parallel arrays drift — nothing would
stop a challenge from losing its solution.

## ADR-012 — Theme Config Holds Behaviour, tokens.css Holds Appearance
**Status:** Accepted · 2026-09-02

**Context:** `README` §4 sketches a `ThemeConfig` carrying colors, typography and radii.
ADR-008 already puts those values in `src/themes/tokens.css`, where the browser reads them.

**Decision:** `src/types/theme.ts` deliberately carries no visual values — only identity
(id, name, tagline, description) and the motion/density intent that components branch on.
Appearance lives once, in CSS.

**Consequences:** An intentional deviation from README §4's sketch, taken because the
alternative is two sources of truth for the same color that will drift, with the CSS copy
being the one that actually renders. `src/themes/registry.ts` remains the single place
theme IDs are enumerated (theme.md §11).

## ADR-013 — Theme Modules Behind a Dynamic-Import Renderer
**Status:** Accepted · 2026-09-02

**Context:** theme.md §14 requires that inactive themes' assets never load, and CLAUDE.md
§40 forbids four parallel applications. Something has to map a resolved theme ID to its
presentation without static imports pulling all four into the bundle.

**Decision:** `src/themes/renderer.ts` maps each ID to a `() => import(...)` loader
returning a module that satisfies the `ThemeSections` contract (`Layout`, `Home`,
`ProjectDetail`) in `src/types/views.ts`. Routes stay thin: load canonical content, resolve
the theme, hand the content to the theme. No `if (theme === …)` outside the registry.

Theme components receive content as PROPS and may not import `@/content`. That single rule
is what stops a theme from redefining what a project is.

**Consequences:** Adding a theme means adding a module and a loader entry — the route tree,
SEO and content layer are untouched.

**CORRECTION (2026-09-02, step 6.5):** this ADR originally claimed "a visitor downloads
exactly one theme". That is **false**, and was never verified until the budget test was
written. Measurement shows all four themes ship a byte-identical set of eight chunks.

Cause: the loaders `import()` from a Server Component. Next builds the client-reference
manifest statically per route, so because any of the four could be selected, every theme's
client components land in the same route bundle. `import()` in a server component splits the
SERVER graph, not the client one — the distinction this ADR missed.

The dynamic imports still keep the server graph tidy, and the contract stands. The bundle
claim does not. Tracked as ISS-026 with candidate fixes; theme.md §14 remains unmet.

Until Phases 5–7 land, Terminal, Brutalist and Notion point their loaders at the editorial
module. This is theme.md §15's documented fallback rather than a stub, and it is not
visually inert: each already carries its own `[data-theme]` token values, so selecting
Terminal today renders the editorial layout in the dark monospace palette. Recorded as
ISS-017 so it is not mistaken for finished work.

## ADR-014 — The Command Palette Is the Terminal's Command System
**Status:** Accepted · 2026-09-02

**Context:** theme.md §7.3 asks for a command vocabulary (`whoami`, `projects`, `theme`, …)
and §7.4 asks for a ⌘K command palette. Building both would mean two overlapping keyboard
surfaces over the same destinations — and a free-text REPL invites exactly the fake
commands CLAUDE.md §39 and design.md §19 forbid, since most of the vocabulary has nothing
real to print.

**Decision:** One mechanism. `CommandPalette` is the command system; the §7.3 vocabulary is
carried as keywords, so typing `whoami` finds About and `theme terminal` switches theme.
Every command performs real work — navigate, switch theme, or open a real link. An
unmatched query returns `command not found: <query>` rather than inventing output. The
empty state is `help`: it lists everything.

**Consequences:** No REPL. Commands that would only print a canned string do not exist.
Destinations with no real URL (GitHub, LinkedIn) produce no command at all until a URL is
supplied, rather than a command that fails.

**Accessibility (theme.md §7.5):** the palette opens from a visible button as well as ⌘K,
every destination is also a plain link in the navigation, and Escape always closes and
restores focus, so the modal is not a keyboard trap.

**Discoverability fix:** design.md §33 makes `theme <id>` the terminal's switcher
presentation, which on its own strands anyone who opens a shared `?theme=terminal` link and
dislikes it. The terminal footer therefore carries relative `?theme=` anchors — real links
that preserve the current path, work without JavaScript, and are keyboard reachable.

## ADR-015 — Themes Are Simulated Environments, Not Skins
**Status:** Accepted · 2026-09-02

**Context:** Phases 4–5 delivered four themes as presentation layers — the same markup with
different CSS variables. The whole application held two client components, so nothing ran
and nothing felt alive. The intent was always four *environments*: a macOS desktop, a Notion
workspace, a physical brutalist interface, a magazine.

**Decision:** Rebuild each theme with the working mechanics of the thing it evokes — windows
that open, close, minimize and zoom; a sidebar tree and database views; buttons that
depress; scroll choreography.

**Documented conflict, resolved by explicit instruction.** `CLAUDE.md:804-806` ("Do not
simply clone Notion… inspired by the information architecture, not become a literal copy"),
`theme.md:708` ("Do not reproduce Notion pixel-for-pixel") and `theme.md:196` ("Do not
directly clone another product") forbid what was requested. Explicit user instruction ranks
above these in CLAUDE.md's own hierarchy, and the user confirmed the override after the
conflict was put to them. **Resolution: replicate Notion's behaviour faithfully using
original assets** — Lucide icons and open fonts. Notion's proprietary icon set and font
licensing rule out literal assets regardless.

For macOS there is no conflict: `design.md` §19 states the traffic lights "are decorative
**unless they perform a real function**", and `CLAUDE.md` §39 lists an interactive terminal
among its good examples. Functional window controls are what the specification asked for.

**Consequences:** Client JavaScript grows substantially, contained by the per-theme dynamic
imports of ADR-013. `CLAUDE.md` §39 still binds absolutely: every control does real work.
Fake battery indicators, boot sequences and drag handles that reorder nothing stay out.

## ADR-016 — macOS Window Model: Route-Bound Main Window
**Status:** Accepted · 2026-09-02

**Context:** A desktop of draggable windows sits awkwardly with a server-rendered route
tree. Rendering every window client-side would be the most authentic simulation but would
stop page content being server-rendered, weakening the SEO that `README` §16 protects.

**Decision:** The current route server-renders inside the focused window, keeping SEO, deep
links and `<main id="main">` intact. Additional windows — a Finder-style project browser, a
Terminal, Get Info — are client-rendered from the static content layer, which costs nothing
in SEO because that content already exists on real routes.

**Consequences:** A genuine multi-window desktop without giving up server rendering. The
routed window cannot be closed (closing it would blank the page); the state machine enforces
this via its `isRoute` flag, covered by a unit test.

## ADR-017 — `motion` and `lucide-react`
**Status:** Accepted · 2026-09-02

**Context:** `CLAUDE.md` §35 requires justifying each dependency. Dock magnification, genie
minimize and spring physics are painful to hand-roll well.

**Decision:** Add `motion` and `lucide-react`, imported only inside the theme modules that
use them so the renderer's code-splitting keeps Editorial light. `lucide-react` is already
sanctioned by `design.md` §12.

**Rejected:** a drag library. Pointer Events with `setPointerCapture` cover drag and resize
in roughly a hundred lines (`src/themes/runtime/use-drag.ts`), and a dependency would be
dead weight.

## ADR-018 — PageKit: Themed Primitives for Generic Routes
**Status:** Accepted · 2026-09-02

**Context:** The theme contract covered `Home` and `ProjectDetail` only, so the other six
routes rendered a neutral `PageShell` that merely inherited the theme's chrome (ISS-016).
Writing bespoke components for eight routes across four themes means thirty-two components.

**Decision:** Each theme publishes a `PageKit` — `Page`, `Section`, `Prose`, `Card`,
`DefinitionList`, `Empty`, `Action`. Generic routes compose from whichever theme is active,
resolved by `src/themes/page-kit.ts`. `Home` and `ProjectDetail` stay bespoke, since that is
where an environment's character lives and a shared abstraction would flatten it.

**Consequences:** All eight routes are themed, closing ISS-016. The neutral `PageShell` is
deleted. Adding a route costs one file, not four.

## Future ADRs
For each new decision record:
- Date
- Status
- Context
- Decision
- Alternatives
- Reason
- Consequences
