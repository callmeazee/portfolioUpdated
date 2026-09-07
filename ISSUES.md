# Portfolio Issues & Open Questions

## Status
🟡 Open · 🔴 Blocked · 🟢 Resolved · ⚪ Won't Fix

## Open — blocked on real content (cannot be fixed without you)

| ID | Issue | Status | Priority | Notes |
|---|---|---|---|---|
| ISS-002 | No real portfolio content exists | 🔴 | Critical | **40 fields pending, 6 sections awaiting, 6 publish blockers.** Blocks Phases 6–9 and deployment. Filled via the content interview (ADR-006) |
| ISS-003 | Verify project/deployment links | 🔴 | Medium | Use only verified URLs. Absence is marked explicitly, never invented (content.md §25) |
| ISS-004 | Verify exact tech stack per project | 🔴 | High | Required before any case study claims a technology. Stacks are deliberately unfilled until then |
| ISS-005 | Production domain unknown | 🔴 | High | `siteConfig.url` falls back to `http://localhost:3000`. Set `NEXT_PUBLIC_SITE_URL` before deploy or canonicals, sitemap and OG URLs will be wrong |
| ISS-006 | Public contact details unknown | 🔴 | High | Email/GitHub/LinkedIn pending. Only intentionally public details get published (content.md §36) |
| ISS-008 | Project media missing | 🔴 | Medium | No screenshots, architecture diagrams, favicon or résumé PDF |
| ISS-018 | Theme designs unproven against real content | 🔴 | Medium | Structure and responsive behaviour are now verified in a browser, but the designs render mostly empty states. They cannot be judged as designs until ISS-002 clears |

## Open — scheduled work, not defects

None. Every engineering item is closed or explicitly accepted (see ADR-019 and the
resolved table). Everything still open is blocked on real content.

## Resolved

| ID | Issue | Resolved |
|---|---|---|
| ISS-023 | Themes lacked real mechanics | 2026-09-02 — Phase 6 complete. Four simulated environments with working mechanics, each covered by its own e2e suite |
| ISS-025 | App-shell themes reset scroll on switch | 2026-09-02 — ⚪ Won't fix. macOS and Notion scroll an inner container, so window scroll is 0 by definition. Within README §3's "where practical"; the route is preserved and tested |
| ISS-026 | JavaScript is not split per theme | 2026-09-02 — ⚪ Accepted debt (ADR-019). `next/dynamic` was implemented and measured: it split nothing and added ~2KB. Remaining upside is ~16KB gz of 153KB, against a routing-layer rewrite |
| ISS-029 | No error boundary | 2026-09-02 — `error.tsx` and `global-error.tsx` added; 404 now renders through the active theme's PageKit. Deliberately no `loading.tsx`: pages render instantly from a static content layer, so a loading shell would be the "random loading screen" CLAUDE.md §39 prohibits |
| ISS-001 | Complete repository discovery | 2026-09-02 — Phase 0 report delivered and approved |
| ISS-007 | No test tooling | 2026-09-02 — Vitest (23 unit) + Playwright (31 e2e). `npm test`, `npm run test:e2e` |
| ISS-028 | Structured data not implemented | 🔴 | Low | README §25 asks for structured data "where genuinely useful". A Person schema needs a real domain, email and profile URLs to be worth emitting — blocked on ISS-002/005/006 |
| ISS-009 | Visual/responsive QA not performed | 2026-09-02 — run in Chromium. Focus visibility across all four themes, one `h1` per page, reduced motion, and no horizontal overflow at 360px on 6 routes × 4 themes. Screenshots reviewed; two real defects found and fixed (below) |
| ISS-010 | Themed shadows need explicit variable syntax | 2026-09-02 — convention now enforced by a unit test that fails on any bare `shadow-*` utility, alongside tests for hard-coded colours and the theme/content boundary |
| ISS-011 | Broken Open Graph image on every page | 2026-09-02 — replaced by the `/og` route handler (ADR-010) |
| ISS-012 | All canonical URLs pointed at `example.com` | 2026-09-02 — env-driven `siteConfig.url`. Real domain still pending (ISS-005) |
| ISS-013 | Fabricated boilerplate content in repo | 2026-09-02 — removed (ADR-009) |
| ISS-017 | Brutalist and Notion fall back to Editorial | 2026-09-02 — every theme now loads its own module; the renderer falls back nowhere |
| ISS-016 | Non-home routes not themed | 2026-09-02 — `PageKit` (ADR-018) themes all eight routes; the neutral `PageShell` is deleted. Verified: `/engineering` renders terminal window chrome under the terminal theme and none under editorial |
| ISS-027 | `motion` shipped to themes that never used it | 2026-09-02 — dependency removed; dock magnification and the brutalist cursor hand-rolled. 188KB → 153KB gzipped for every theme. ADR-017 reversed with the reasoning recorded |
| ISS-014 | No accessibility baseline | 2026-09-02 — added in Phase 1, now verified in a browser (ISS-009) |
| ISS-015 | Theme switching costs one server round-trip | 2026-09-02 — verified acceptable: switching preserves route and scroll position under test. Accepted consequence of ADR-007 |
| ISS-019 | Command palette interaction unverified | 2026-09-02 — 8 Playwright tests: ⌘K and the visible button, Escape restoring focus, arrow keys, Enter navigation, the §7.3 vocabulary, `theme <id>`, `command not found`, and the Tab containment |
| ISS-020 | Terminal homepage had no `h1` | 2026-09-02 — every section was an `h2` prompt. The top prompt is now the `h1`, carrying the person's name as its screen-reader label. Caught by a new e2e assertion |
| ISS-021 | Hero animation hid the LCP element | 2026-09-02 — the editorial hero name animated from `opacity: 0`, so the page's most important text faded in. Now animates transform only, at normal rather than slow duration |
| ISS-022 | Empty sections rendered as vast blank bands | 2026-09-02 — editorial sections used spacious padding regardless of content, so pending sections read as a broken page. They stay compact until they have something to space out |

## Blocking Questions
None outstanding. The four Phase 0 blockers were resolved (ADR-006 … ADR-009).

## Technical Debt
- All routes render placeholder content, not the finished designs.
- The content-status panel that briefly lived on `/` was replaced by the editorial theme in Phase 4; `getContentStatus()` remains available for the Phase 15 ship gate.
- `experience`, `skills` and the credential collections are empty arrays that currently mean
  "not yet collected" rather than "none". `completeness.ts` lists them under `awaiting`;
  remove each entry once its real state is confirmed.
- The ⌘K shortcut and the palette button both require hydration, so neither works in the
  first moments after load. Inherent to client interactivity; every destination is also a
  plain link, so nothing is unreachable meanwhile.

## Rules
Never silently ignore blockers. Never invent answers to unresolved content questions.
Document uncertainty explicitly.
