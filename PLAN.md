# Portfolio Implementation Plan

## Purpose
This is the execution roadmap. Planning must happen before major implementation.

## Source of Truth
Read and respect, in order:
1. Explicit user instructions
2. `README.md`
3. `theme.md`
4. `design.md`
5. `content.md`
6. Existing implementation, unless it conflicts with the above

## Phase 0 — Discovery
- Inspect repository structure, Next.js/React versions, router, TypeScript, styling, dependencies, assets, fonts, routes, components, linting, formatting, testing and environment configuration.
- Read all four source documents.
- Identify documentation/code conflicts, missing requirements and risks.
- Produce a repository audit and architecture proposal.
- Update `ARCHITECTURE.md`, `ISSUES.md`, `PLAN.md`.
- **STOP and request approval. Do not implement.**

## Phase 1 — Foundation
Establish shared layout, design tokens, typography, responsive foundations, accessibility foundations, reusable primitives and theme infrastructure.

## Phase 2 — Content System
Create typed canonical content for profile, projects, case studies, experience, skills, education and contact. Keep content independent from themes.

## Phase 3 — Routing & Application Shell
Implement routes, navigation, theme selection, URL/persistence behavior and fallback handling according to `theme.md`.

## Phase 4 — Editorial
Build the premium recruiter-facing editorial/minimal theme.

## Phase 5 — Terminal
Build the macOS-inspired developer theme. Avoid fake hacker clichés.

## Phase 6 — Theme Environments
Rebuild all four themes as simulated environments rather than presentation layers (ADR-015).
Phases 4–5 delivered the content-correct structure; this delivers the mechanics.

- **6.0 Runtime & contract** — window state machine, drag/resize, reduced-motion and
  persistence hooks; `Shell` + `PageKit` contract so every route is themed (ADR-018).
- **6.1 macOS** — dock, menu bar, windows that open/close/minimize/zoom (ADR-016).
- **6.2 Notion** — sidebar tree, blocks, toggles, Table/Board/Gallery database views.
- **6.3 Neo-Brutalist** — physical buttons, displacement, real filtering.
- **6.4 Editorial** — scroll choreography, reading progress, view transitions.
- **6.5 Hardening** — per-theme JS budgets, accessibility sweep, mobile QA.

## Phase 7 — (folded into Phase 6)
The former Notion phase is now step 6.2.

## Phase 8 — Theme Integration
Verify every theme supports the same important content, routes, deep links, persistence and accessibility.

## Phase 9 — Project Case Studies
Prioritize Besties, E-commerce Platform and CloudCost AI. Document only truthful technologies, architecture, challenges, solutions, metrics and links.

## Phase 10 — Accessibility
Keyboard navigation, focus states, semantic HTML, labels, contrast, reduced motion and screen-reader compatibility.

## Phase 11 — Performance
Optimize images/fonts, client components, animations, dependencies, bundles and Next.js rendering.

## Phase 12 — SEO
Metadata, Open Graph, sitemap, robots, canonical URLs and structured data where justified.

## Phase 13 — Testing
Typecheck, lint, build, critical interactions, theme switching, responsive checks and accessibility checks.

## Phase 14 — Production QA
Desktop/mobile QA, all themes, navigation, links, console errors, loading/error states and performance.

## Phase 15 — Deployment
Verify environment configuration, production build and deployment. Record release notes.

## Definition of Done
A phase is complete only after implementation is verified, relevant checks pass, documentation is updated, `PROGRESS.md` is updated, decisions are recorded and no blocker is silently ignored.
