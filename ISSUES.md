# Portfolio Issues & Open Questions

## Status
🟡 Open · 🔴 Blocked · 🟢 Resolved · ⚪ Won't Fix

## Open — awaiting further input

| ID | Issue | Status | Priority | Notes |
|---|---|---|---|---|
| ISS-005 | Production domain unknown | 🔴 | High | Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`). Verified end to end that it propagates to canonical URLs, sitemap, robots.txt, OG image and JSON-LD. The résumé lists myportfolio-t3hc.onrender.com, but that is the previous portfolio — confirm before using it |
| ISS-008 | Two weak screenshots | 🟡 | Low | **Both re-attempted 2026-09-08 and neither can be improved from outside.** FileMoon: every unauthenticated route (`/`, `/signup`, `/dashboard`) is a sign-in or sign-up form, so the current capture is the best available without an account. MoviePlas: still shows its error state because of ISS-040. Both need either credentials or a fix at source; drop replacements at `public/projects/<slug>.webp` and they are picked up automatically. Architecture diagrams still absent |
| ISS-040 | MoviePlas is broken in production | 🔴 | High | **Diagnosed 2026-09-08 — not TMDB.** All four TMDB calls return 200; the failure is `movieplas-api.onrender.com/api/content/curated-movies` → `net::ERR_ABORTED`. The backend is unreachable: two separate 120s requests both timed out, and Render cold starts take ~50s, so it is down rather than asleep — likely suspended (free tier suspends after long inactivity) or failing to boot on a missing `MONGO_URI`, which `render.yaml` marks `sync: false` and so must be set by hand. **Fix is in the movieplas repo, not this one** |
| ISS-042 | MoviePlas leaks its TMDB key to the browser | 🔴 | High | The key is read through a `VITE_`-prefixed variable, so Vite inlines it into the client bundle and it is visible in every outbound request from the deployed site. Anyone can harvest and abuse it, and TMDB may rate-limit or revoke it. It should be proxied through the backend, which already exists. The value is not repeated here or anywhere in this repository (CLAUDE.md §34) |
| ISS-043 | MoviePlas `/register` returns raw JSON | 🟡 | Low | The SPA rewrite does not catch it, so the request reaches the API and a visitor sees `{"message":"Endpoint not found"}` instead of a page. `/signup` works |
| ISS-041 | Render free tier cold starts | 🟡 | Low | ConnectVerse, FileMoon and MoviePlas are on Render's free tier and return 503 "SERVICE WAKING UP" while spinning up, so a first visit can take ~50s |
| ISS-037 | Project names differ from the deployed apps | 🟡 | Low | The résumé says "Snitcher" but the site brands itself **SNITCH.**; it says "MoviePlas" but the site says **Movie Plus**. The résumé names are used — confirm which is canonical |
| ISS-009 | Case study depth | 🟡 | High | Each featured project has an overview and feature list from the résumé, but `problem`, `solution`, `architecture`, `challenges` and `learnings` are empty. These sections are what a senior engineer actually reads (CLAUDE.md §37) and need the subject's own account |
| ISS-031 | "2+ years" vs one listed role | 🟡 | Medium | The résumé states 2+ years of experience but lists only Affy Cloud from Jul 2025. Earlier work is unrepresented on `/experience`; not invented |
| ISS-032 | Two résumé entries interpreted | 🟡 | Low | Typos corrected ("Rags" → RAG, "integrayion" → integration) and "Vector" expanded to "Vector search". Confirm the last one is what was meant |
| ISS-038 | Besties details need confirming | 🟡 | Medium | Besties is a distinct project (confirmed), but is absent from the résumé, so its stack and features come from README §§5/9/11 where the record is labelled an "example". Confirm the stack — particularly WebRTC — and supply a live/repo link if one exists |
| ISS-039 | Further projects not yet supplied | 🟡 | Medium | The subject indicated more projects exist beyond the six recorded. Names, descriptions, stacks and links needed |

## Open — scheduled work, not defects

None. Every engineering item is closed or explicitly accepted (see ADR-019 and the
resolved table). Everything still open is blocked on real content.

## Resolved

| ID | Issue | Resolved |
|---|---|---|
| ISS-023 | Themes lacked real mechanics | 2026-09-02 — Phase 6 complete. Four simulated environments with working mechanics, each covered by its own e2e suite |
| ISS-025 | App-shell themes reset scroll on switch | 2026-09-02 — ⚪ Won't fix. macOS and Notion scroll an inner container, so window scroll is 0 by definition. Within README §3's "where practical"; the route is preserved and tested |
| ISS-026 | JavaScript is not split per theme | 2026-09-02 — ⚪ Accepted debt (ADR-019). `next/dynamic` was implemented and measured: it split nothing and added ~2KB. Remaining upside is ~16KB gz of 153KB, against a routing-layer rewrite |
| ISS-028 | Structured data not implemented | 2026-09-02 — `Person`, `WebSite` and per-project `CreativeWork` JSON-LD, identical across themes. Fields omitted unless real; enriches automatically as content lands |
| ISS-029 | No error boundary | 2026-09-02 — `error.tsx` and `global-error.tsx` added; 404 now renders through the active theme's PageKit. Deliberately no `loading.tsx`: pages render instantly from a static content layer, so a loading shell would be the "random loading screen" CLAUDE.md §39 prohibits |
| ISS-001 | Complete repository discovery | 2026-09-02 — Phase 0 report delivered and approved |
| ISS-007 | No test tooling | 2026-09-02 — Vitest (23 unit) + Playwright (31 e2e). `npm test`, `npm run test:e2e` |
| ISS-009 | Visual/responsive QA not performed | 2026-09-02 — run in Chromium. Focus visibility across all four themes, one `h1` per page, reduced motion, and no horizontal overflow at 360px on 6 routes × 4 themes. Screenshots reviewed; two real defects found and fixed (below) |
| ISS-010 | Themed shadows need explicit variable syntax | 2026-09-02 — convention now enforced by a unit test that fails on any bare `shadow-*` utility, alongside tests for hard-coded colours and the theme/content boundary |
| ISS-011 | Broken Open Graph image on every page | 2026-09-02 — replaced by the `/og` route handler (ADR-010) |
| ISS-012 | All canonical URLs pointed at `example.com` | 2026-09-02 — env-driven `siteConfig.url`. Real domain still pending (ISS-005) |
| ISS-013 | Fabricated boilerplate content in repo | 2026-09-02 — removed (ADR-009) |
| ISS-017 | Brutalist and Notion fall back to Editorial | 2026-09-02 — every theme now loads its own module; the renderer falls back nowhere |
| ISS-016 | Non-home routes not themed | 2026-09-02 — `PageKit` (ADR-018) themes all eight routes; the neutral `PageShell` is deleted. Verified: `/engineering` renders terminal window chrome under the terminal theme and none under editorial |
| ISS-027 | `motion` shipped to themes that never used it | 2026-09-02 — dependency removed; dock magnification and the brutalist cursor hand-rolled. 188KB → 153KB gzipped for every theme. ADR-017 reversed with the reasoning recorded |
| ISS-002 | No real portfolio content exists | 2026-09-02 — résumé supplied. Profile, contact, experience, skills, education, engineering areas and five projects populated. **0 publish blockers**; the site is now publishable. Depth remains as ISS-009 |
| ISS-034 | Repository links unverified | 2026-09-08 — resolved by verification, not by name matching. Snitcher confirmed by its repo `homepage` field being exactly the live URL; FileMoon and MoviePlas confirmed by content (package name `filemoon` with Cloudinary/Express/bcrypt; `render.yaml` plus frontend/backend). All three linked. CloudSpire, ConnectVerse and Besties have no public repo under github.com/callmeazee and stay `pending` — they may be private |
| ISS-030 | Résumé PDF not in the repository | 2026-09-08 — `/resume` now renders the résumé from the content layer instead of linking a missing file: contact, experience, skills, projects and education, with print styles that strip theme chrome and force black on white. A PDF link still appears if `contact.resume.url` is set |
| ISS-033 | Project names differ from the planning docs | 2026-09-02 — resolved by asking rather than assuming: Besties is a **separate project**, not a rename of ConnectVerse. Re-added; the résumé names stand for the other three |
| ISS-004 | Verify exact tech stack per project | 2026-09-02 — stacks taken from the résumé. The WebRTC/audio-video claim belongs to Besties, not ConnectVerse, and is recorded on the right project |
| ISS-006 | Public contact details unknown | 2026-09-02 — email, GitHub and LinkedIn supplied and published; phone recorded but deliberately not rendered |
| ISS-018 | Theme designs unproven against real content | 2026-09-02 — all four themes reviewed with real content. Two real defects found and fixed (below) |
| ISS-035 | Editorial reveals hid on-screen content | 2026-09-02 — scroll-driven reveals animated from `opacity: 0`, leaving in-viewport sections invisible at common heights (0.01 at 1440×900). Now transform-only; the test varies viewport height, which is what exposed it |
| ISS-036 | Scroll containers lacked keyboard access | 2026-09-02 — real content made `/engineering` overflow, and that page has no links, so macOS/Notion window bodies were scrollable with nothing focusable (axe, WCAG 2.1.1). Both now `tabIndex={0}` |
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
