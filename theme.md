# Theme Specification — Azeez Ahmed Khan Portfolio

## Purpose

This document defines the visual, interaction, and architectural requirements for the four portfolio themes.

The portfolio is **one application with one shared content system** and four presentation systems.

The four themes are:

1. Editorial / Minimal
2. macOS Terminal
3. Neo-Brutalist
4. Notion

The theme system must allow the user to switch themes without changing the underlying content, routes, project data, SEO, accessibility logic, or application behavior.

---

# 1. Core Theme Architecture

```text
                    SHARED CONTENT
                          │
                          ▼
                  THEME ENGINE
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
  PRESENTATION       PRESENTATION      PRESENTATION
       │                  │                  │
       ▼                  ▼                  ▼
  EDITORIAL          TERMINAL          BRUTALIST
                          │
                          ▼
                       NOTION
```

## Non-negotiable rule

**Themes control presentation, not content.**

Do not create separate project data for each theme.

For example, there should be only one:

```text
Besties
```

record.

The Editorial theme renders it one way.

The Terminal theme renders it differently.

The Neo-Brutalist theme renders it differently.

The Notion theme renders it differently.

---

# 2. Theme IDs

Use stable IDs:

```ts
type PortfolioTheme =
  | "editorial"
  | "terminal"
  | "brutalist"
  | "notion";
```

Do not rename these IDs after implementation unless there is a migration strategy.

---

# 3. Theme Selection Priority

Theme selection should follow this priority:

```text
1. URL parameter
2. Persisted user preference
3. System preference where applicable
4. Editorial default
```

Examples:

```text
/?theme=editorial
/?theme=terminal
/?theme=brutalist
/?theme=notion
```

Default:

```text
editorial
```

---

# 4. Theme Switching

Switching must:

- happen without a full page reload
- preserve the current route
- preserve content
- preserve application state where practical
- persist the selection
- work on desktop
- work on mobile
- work with keyboard navigation
- support screen readers
- support reduced motion

The theme switcher itself should be visually adapted to the current theme.

---

# 5. Shared Design Tokens

All themes should consume semantic design tokens.

Example:

```text
--color-background
--color-surface
--color-surface-secondary
--color-foreground
--color-muted
--color-accent
--color-border
--color-success
--color-warning
--color-danger

--font-display
--font-body
--font-mono

--space-xs
--space-sm
--space-md
--space-lg
--space-xl
--space-2xl

--radius-sm
--radius-md
--radius-lg

--shadow-sm
--shadow-md
--shadow-lg
```

Shared components should use semantic variables instead of hard-coded theme colors.

---

# 6. Editorial / Minimal Theme

## Theme ID

```text
editorial
```

## Purpose

This is the **default and recruiter-facing theme**.

Primary message:

> Professional, confident, modern, polished, technically capable.

## Visual references

The design language can borrow principles from:

- premium editorial websites
- modern design studios
- Linear
- Vercel
- high-end SaaS
- modern developer portfolios

Do not directly clone another product or website.

---

## 6.1 Visual Language

Use:

- large typography
- generous whitespace
- strong hierarchy
- restrained color palette
- editorial grids
- asymmetric compositions where useful
- thin borders
- subtle shadows
- high-quality project imagery
- restrained animation

Avoid:

- excessive gradients
- excessive glassmorphism
- random 3D objects
- skill percentage bars
- unnecessary decorative effects
- excessive cards

---

## 6.2 Layout

Preferred structure:

```text
Hero
↓
Selected Work
↓
Engineering Capabilities
↓
Experience
↓
About
↓
Notes
↓
Contact
```

---

## 6.3 Hero

The hero should immediately communicate:

- name
- role
- positioning statement
- primary CTA
- secondary CTA

Example structure:

```text
AZEEZ AHMED KHAN

FULL-STACK
ENGINEER

I build modern web applications,
SaaS products and real-time systems.

[ View Work ]
[ GitHub ]
```

---

## 6.4 Project Presentation

Projects should be visually dominant.

Example:

```text
01

BESTIES

Real-time social platform

React
TypeScript
Node.js
MongoDB
Socket.io
WebRTC
AWS

View Case Study →
```

---

## 6.5 Editorial Motion

Motion intensity:

```text
LOW
```

Use:

- typography reveal
- subtle fade
- subtle slide
- image reveal
- hover transitions

Animation should never block comprehension.

---

# 7. macOS Terminal Theme

## Theme ID

```text
terminal
```

## Purpose

This is the **engineering/developer mode**.

Primary message:

> This portfolio was built by someone who understands software systems.

---

## 7.1 Visual Direction

Inspired by:

- macOS Terminal
- iTerm
- Raycast
- VS Code
- developer tooling

It should look like a modern developer environment.

It must NOT become a fake hacker website.

Avoid:

- Matrix rain
- green-on-black cliché
- fake hacking
- meaningless ASCII animation
- commands that only pretend to work

---

## 7.2 Terminal Window

Use macOS-style window chrome:

```text
┌──────────────────────────────────────────────┐
│ ● ● ●    azeez@portfolio                     │
├──────────────────────────────────────────────┤
│                                              │
│ $ whoami                                     │
│                                              │
│ Azeez Ahmed Khan                             │
│ Full-Stack Developer                         │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 7.3 Supported Commands

Recommended commands:

```text
help
whoami
about
projects
experience
skills
engineering
architecture
contact
github
resume
theme
clear
```

Unknown commands should return a helpful response.

Example:

```text
$ help

Available commands:

about
projects
experience
skills
engineering
architecture
contact
github
resume
theme
clear
```

---

## 7.4 Command Palette

Support:

```text
⌘ K
```

and:

```text
Ctrl + K
```

The command palette must provide normal navigation without requiring terminal commands.

---

## 7.5 Terminal Accessibility

Important content must always be available through:

- normal links
- buttons
- keyboard navigation
- screen readers
- mobile navigation

Terminal interaction is an enhancement, not a usability requirement.

---

## 7.6 Terminal Motion

Motion intensity:

```text
MEDIUM
```

Use:

- typing
- cursor blink
- command transitions
- panel transitions
- subtle terminal boot sequence

Do not use a long loading sequence.

---

# 8. Neo-Brutalist Theme

## Theme ID

```text
brutalist
```

## Purpose

This is the **bold and memorable creative mode**.

Primary message:

> Confident, experimental, creative and capable of building distinctive interfaces.

---

## 8.1 Visual Language

Use:

- thick borders
- strong contrast
- hard shadows
- oversized typography
- asymmetric grids
- bright controlled accents
- large buttons
- offset elements
- bold labels
- intentional visual tension

---

## 8.2 Example Hero

```text
AZEEZ
AHMED
KHAN

FULL-STACK
ENGINEER

[ SEE MY WORK → ]
```

---

## 8.3 Interaction

Possible interactions:

- physical button movement
- hard-shadow transitions
- offset hover states
- project cards expanding
- bold typography transitions
- cursor interactions where useful

All interactions must remain accessible.

---

## 8.4 Brutalist Motion

Motion intensity:

```text
MEDIUM / HIGH
```

But animation should still respect:

```text
prefers-reduced-motion
```

---

## 8.5 Brutalist Rule

The design should feel:

```text
intentional
```

not:

```text
random
```

Do not randomly rotate elements, randomly change colors, or destroy the layout for the sake of looking brutalist.

---

# 9. Notion Theme

## Theme ID

```text
notion
```

## Purpose

This is the **documentation and knowledge mode**.

Primary message:

> Organized, thoughtful, technical and documentation-driven.

---

## 9.1 Visual Language

Use:

- document layouts
- sidebar navigation
- breadcrumbs
- page icons
- metadata
- tables
- tags
- callouts
- code blocks
- toggles
- nested pages
- database-like views

---

## 9.2 Sidebar

Example:

```text
AZEEZ

Workspace

Home
About
Experience

Projects
  Besties
  E-commerce
  CloudCost AI

Engineering
  Architecture
  Frontend
  Backend
  Infrastructure

Notes
Contact
```

---

## 9.3 Project Page

Example:

```text
# Besties

Real-time social platform

Status: Completed
Role: Full-Stack Developer
Type: Social Platform

Stack:
React
TypeScript
Node.js
MongoDB
Socket.io
WebRTC
AWS

---

## Overview

...

## Problem

...

## Architecture

...

## Challenges

...

## Solutions

...

## Learnings

...
```

---

## 9.4 Notion Interactions

Where useful:

- collapsible sections
- page navigation
- breadcrumbs
- tags
- database views
- expandable technical sections
- code blocks
- callouts

Do not reproduce Notion pixel-for-pixel.

---

# 10. Shared Component Strategy

Shared primitives:

```text
components/shared/
```

Examples:

```text
Button
Link
Image
ProjectCard
ProjectCaseStudy
ThemeSwitcher
ThemeProvider
Section
Container
Badge
Modal
CommandPalette
```

Theme-specific components:

```text
components/editorial/
components/terminal/
components/brutalist/
components/notion/
```

---

# 11. Theme Component Rule

A shared component should never contain large amounts of code like:

```ts
if (theme === "editorial") ...
if (theme === "terminal") ...
if (theme === "brutalist") ...
if (theme === "notion") ...
```

Prefer theme-specific presentation components.

Bad architecture:

```text
One giant component
→ 1000 conditional statements
```

Preferred:

```text
ThemeProvider
      ↓
ThemeRenderer
      ↓
EditorialRenderer
TerminalRenderer
BrutalistRenderer
NotionRenderer
```

---

# 12. Responsive Theme Rules

Every theme must be responsive.

## Editorial

Desktop:

```text
editorial grid
```

Mobile:

```text
single-column editorial layout
```

## Terminal

Desktop:

```text
multi-panel terminal environment
```

Mobile:

```text
single terminal window + drawer
```

## Brutalist

Desktop:

```text
asymmetric grid
```

Mobile:

```text
controlled stacked layout
```

## Notion

Desktop:

```text
sidebar + document
```

Mobile:

```text
drawer + document
```

---

# 13. Accessibility Rules

All themes must support:

- semantic HTML
- keyboard navigation
- visible focus states
- screen readers
- sufficient contrast
- alt text
- reduced motion
- accessible forms
- accessible navigation

The theme selector itself must be accessible.

---

# 14. Performance Rules

Only load what the active theme needs.

Do not load unnecessary assets for inactive themes.

Use:

- lazy loading
- dynamic imports
- optimized images
- responsive images
- font optimization
- animation cleanup
- code splitting

Theme switching must not cause obvious jank.

---

# 15. Theme Fallback

If theme initialization fails:

```text
fallback → editorial
```

The portfolio content must remain accessible.

---

# 16. Theme Validation Checklist

Before considering a theme complete:

- [ ] Desktop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works
- [ ] Keyboard navigation works
- [ ] Screen reader navigation works
- [ ] Reduced motion works
- [ ] Theme switch works
- [ ] URL theme works
- [ ] Persistence works
- [ ] All project pages work
- [ ] Resume works
- [ ] Contact works
- [ ] SEO remains correct
- [ ] No console errors
- [ ] No unnecessary theme assets load
- [ ] Lighthouse performance is acceptable

---

# 17. Final Theme Principle

The four themes are not four separate portfolios.

They are four interfaces over the same portfolio system.

```text
EDITORIAL
"Professional"

TERMINAL
"Engineer"

NEO-BRUTALIST
"Creative Builder"

NOTION
"Technical Thinker"
```

The content remains the source of truth.

The theme controls how that content is experienced.
