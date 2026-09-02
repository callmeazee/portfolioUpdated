# Design Specification — Azeez Ahmed Khan Multi-Theme Portfolio

## Purpose

This document defines the **visual design system** for the portfolio.

It complements:

- `README.md` — overall project requirements
- `theme.md` — behavior and identity of the four themes
- `content.md` — portfolio content and project data

The goal is to ensure the portfolio has a coherent design system while allowing four substantially different visual experiences.

---

# 1. Design Direction

The portfolio should feel like a **premium software product**, not a template-based developer portfolio.

The design must communicate:

```text
Professional
Technical
Modern
Intentional
Memorable
Fast
Accessible
```

The four themes should feel genuinely different while sharing:

- content hierarchy
- information architecture
- usability principles
- accessibility
- responsive behavior
- semantic meaning

---

# 2. Design Principles

## 2.1 Content First

Visual design must support the content.

Do not allow decorative elements to obscure:

- name
- role
- projects
- experience
- technology
- contact
- project links

---

## 2.2 Strong Hierarchy

Every page should have an obvious hierarchy:

```text
Page
  ↓
Section
  ↓
Content
  ↓
Supporting information
  ↓
Actions
```

Visitors should understand where they are within seconds.

---

## 2.3 Progressive Disclosure

Do not display every technical detail immediately.

Homepage:

```text
What is it?
Why does it matter?
What did I build?
```

Project page:

```text
How did I build it?
Why did I build it that way?
What problems did I solve?
```

Technical sections:

```text
Architecture
Database
Security
Performance
Infrastructure
```

This keeps the homepage concise while allowing deep technical exploration.

---

# 3. Global Design System

## 3.1 Typography

Typography is one of the most important visual elements.

Use a maximum of:

```text
1 display font
1 body font
1 monospace font
```

Avoid unnecessary font combinations.

### Display typography

Used for:

- hero
- major section headings
- project titles
- theme-specific statements

### Body typography

Used for:

- descriptions
- paragraphs
- metadata
- navigation

### Monospace typography

Used primarily for:

- Terminal theme
- code
- technical metadata
- keyboard shortcuts
- command interfaces

---

# 4. Type Scale

Use a responsive type scale.

Suggested conceptual scale:

```text
Display XL
Display L
Display M

Heading XL
Heading L
Heading M
Heading S

Body L
Body M
Body S

Caption
Micro
```

Do not hard-code the same pixel size across every viewport.

Typography should scale using responsive CSS.

Example conceptual values:

```text
Hero:
clamp(3.5rem, 10vw, 10rem)

Section heading:
clamp(2rem, 5vw, 5rem)

Body:
clamp(1rem, 1.2vw, 1.25rem)
```

Exact values should be refined during implementation.

---

# 5. Color System

Use semantic color tokens.

```text
Background
Surface
Surface Secondary
Foreground
Muted
Accent
Border
Success
Warning
Danger
```

Example:

```css
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
```

Never build shared components around hard-coded theme colors.

---

# 6. Spacing System

Use a consistent spacing scale.

Example:

```text
4
8
12
16
24
32
48
64
96
128
160
```

The actual implementation can use CSS variables or Tailwind spacing tokens.

The spacing system should remain consistent even when themes change.

---

# 7. Container System

Use a shared maximum content width.

Recommended conceptual structure:

```text
Full viewport
    ↓
Outer padding
    ↓
Maximum content container
    ↓
Grid
```

The exact max width should be determined during implementation.

Recommended range:

```text
1200px – 1500px
```

depending on theme.

The Terminal and Notion themes may use different internal panel widths without breaking the overall responsive system.

---

# 8. Grid System

Use a flexible responsive grid.

Desktop:

```text
12 columns
```

Tablet:

```text
8 columns
```

Mobile:

```text
4 columns
```

The actual implementation may use CSS Grid or Tailwind Grid.

---

# 9. Border System

Borders should have semantic meaning.

Use:

```text
subtle border
strong border
interactive border
focus border
```

Avoid borders on every element.

Borders should help define:

- sections
- panels
- cards
- navigation
- dividers

---

# 10. Radius System

Each theme may interpret radius differently.

## Editorial

Small to medium radius.

## Terminal

Small radius.

## Neo-Brutalist

Minimal radius or square corners.

## Notion

Small radius.

Example tokens:

```text
radius-sm
radius-md
radius-lg
radius-full
```

---

# 11. Shadow System

Use shadows intentionally.

```text
shadow-sm
shadow-md
shadow-lg
shadow-hard
```

The Neo-Brutalist theme may use:

```text
hard offset shadows
```

The Editorial theme should use:

```text
subtle shadows
```

The Terminal theme should use:

```text
minimal shadows
```

The Notion theme should use:

```text
very subtle elevation
```

---

# 12. Iconography

Use one primary icon system.

Recommended:

```text
Lucide
```

Icons should:

- have consistent stroke weight
- have accessible labels where needed
- never replace essential text
- use semantic meaning

Avoid mixing many icon libraries.

---

# 13. Button System

Buttons must have consistent semantics.

Types:

```text
Primary
Secondary
Ghost
Destructive
Icon
Link
```

Example:

```text
Primary:
View Case Study

Secondary:
GitHub

Ghost:
View All

Icon:
Open
```

Theme styling changes.

Button meaning does not.

---

# 14. Link System

Links should have clear interaction states:

```text
Default
Hover
Focus
Active
Visited where appropriate
Disabled
```

External links should be distinguishable where useful.

---

# 15. Focus States

Every interactive element must have a visible focus state.

Do not remove browser focus outlines without replacing them.

Focus states must remain visible in all four themes.

---

# 16. Motion System

Motion should be treated as part of the design system.

Define:

```text
duration-fast
duration-normal
duration-slow

ease-standard
ease-emphasized
ease-spring
```

Conceptual values:

```text
Fast:
100–150ms

Normal:
200–300ms

Slow:
400–700ms
```

Avoid excessive long animations.

---

# 17. Reduced Motion

When:

```text
prefers-reduced-motion: reduce
```

the design must:

- remove decorative motion
- disable parallax
- reduce transition duration
- avoid auto-playing animations
- preserve navigation and functionality

---

# 18. Editorial Design System

## Personality

```text
Premium
Editorial
Minimal
Confident
Refined
```

## Layout

Use:

- large margins
- asymmetric compositions
- strong horizontal rhythm
- large project imagery
- editorial typography

Example:

```text
┌────────────────────────────────────────────┐
│ AZEEZ                                      │
│                                            │
│ FULL-STACK                                 │
│ ENGINEER                                   │
│                                            │
│                    Short introduction      │
│                                            │
└────────────────────────────────────────────┘
```

---

## Editorial Hero

The hero should occupy a significant portion of the viewport.

Recommended structure:

```text
Eyebrow
↓
Large name / role
↓
Positioning statement
↓
CTA
```

Avoid stuffing the hero with:

- skills
- statistics
- social icons
- long biography
- project cards

---

## Editorial Project Layout

Use large visual storytelling.

Example:

```text
01

BESTIES
Real-time social platform

[Large Project Image]

React · TypeScript · Node · MongoDB

View Case Study →
```

Projects should feel like editorial feature articles rather than SaaS cards.

---

# 19. Terminal Design System

## Personality

```text
Technical
Developer-focused
Interactive
Dark
Precise
```

## macOS Window

Use:

```text
Traffic light buttons
Window title
Terminal body
Prompt
Output
```

The traffic-light buttons are decorative unless they perform a real function.

---

## Terminal Colors

Use restrained terminal colors.

Avoid making the entire interface green.

Possible semantic colors:

```text
Foreground
Muted
Accent
Success
Warning
Error
Command
Path
```

---

## Terminal Typography

Use a high-quality monospace font.

Potential choices:

```text
JetBrains Mono
IBM Plex Mono
SF Mono
```

Use one.

---

## Terminal Prompt

Example:

```text
azeez@portfolio ~ %
```

The prompt should be part of the visual identity.

---

## Terminal Project View

A project may be represented as:

```text
$ cd projects/besties

$ cat README.md

# Besties

Real-time social platform...

$ tree

├── frontend
├── backend
├── realtime
├── database
└── infrastructure
```

The content remains real portfolio content.

Do not fabricate terminal output.

---

# 20. Neo-Brutalist Design System

## Personality

```text
Bold
Raw
Experimental
High Contrast
Playful
Confident
```

## Visual Rules

Use:

- thick borders
- hard shadows
- oversized text
- strong blocks
- high contrast
- controlled accent colors

Avoid:

- excessive gradients
- soft shadows
- excessive blur
- excessive rounded cards

---

## Neo-Brutalist Grid

Use intentional asymmetry.

Example:

```text
┌──────────────┐
│              │
│   BESTIES    │─────────────┐
│              │             │
└──────────────┘             │
                             │
             ┌───────────────┘
             │
             │ E-COMMERCE
             │
             └───────────────
```

The layout should remain responsive.

---

## Neo-Brutalist Buttons

Buttons can use:

```text
thick border
hard shadow
offset hover
```

Example interaction:

```text
Default:
[ VIEW PROJECT ]

Hover:
    [ VIEW PROJECT ]
```

The movement should be subtle enough to remain usable.

---

# 21. Notion Design System

## Personality

```text
Calm
Organized
Documentary
Technical
Knowledge-oriented
```

## Layout

Desktop:

```text
Sidebar
    +
Main Document
```

Example:

```text
┌──────────────┬─────────────────────────────────┐
│              │                                 │
│ HOME         │ # Besties                       │
│ ABOUT        │                                 │
│ PROJECTS     │ Real-time social platform      │
│              │                                 │
│ Engineering  │ Status: Completed              │
│              │ Stack: MERN + WebRTC           │
│ NOTES        │                                 │
│              │ ## Overview                     │
│ CONTACT      │ ...                             │
│              │                                 │
└──────────────┴─────────────────────────────────┘
```

---

# 22. Notion Typography

Use:

- highly readable body font
- clear heading hierarchy
- compact metadata
- monospace for technical content

The document should feel comfortable for long-form reading.

---

# 23. Notion Blocks

Possible block types:

```text
Paragraph
Heading
Divider
Callout
Code
Image
Quote
List
Table
Toggle
Database
Link
```

Do not implement every block type unless the content requires it.

---

# 24. Navigation Design

Navigation must remain consistent in meaning but change visually.

## Editorial

Minimal top navigation:

```text
Work
Experience
About
Contact
```

## Terminal

Command-based:

```text
$ projects
$ experience
$ about
```

## Brutalist

Bold navigation:

```text
[WORK]
[ABOUT]
[CONTACT]
```

## Notion

Sidebar navigation:

```text
Home
Projects
Experience
Engineering
Notes
Contact
```

---

# 25. Project Card Design

Project cards are theme-specific.

## Editorial

Large visual feature.

## Terminal

File/project entry.

## Brutalist

Bold poster-like block.

## Notion

Database/document row.

The underlying project data remains identical.

---

# 26. Project Case Study Design

Every major project should follow a consistent information hierarchy.

```text
Project title
↓
Short description
↓
Metadata
↓
Hero media
↓
Overview
↓
Problem
↓
Solution
↓
Features
↓
Architecture
↓
Technical details
↓
Challenges
↓
Results / current status
↓
Learnings
↓
Links
```

Each theme may reorder visual presentation slightly, but the information architecture must remain understandable.

---

# 27. Project Metadata

Use compact metadata.

Example:

```text
ROLE
Full-Stack Developer

STATUS
Completed

YEAR
2026

TYPE
Social Platform
```

And:

```text
STACK
React
TypeScript
Node.js
MongoDB
Socket.io
WebRTC
AWS
```

---

# 28. Technical Diagram Design

Architecture diagrams should use the same visual language as the active theme.

Example semantic structure:

```text
Client
  ↓
Frontend
  ↓
API
  ↓
Backend
  ↓
Database
```

For real-time systems:

```text
Client A
   │
   ▼
Signaling Server
   │
   ▼
Client B
   │
   ▼
WebRTC
```

Diagrams must be:

- readable
- responsive
- accessible where practical
- labeled
- visually consistent

---

# 29. Image Design

Project images should prioritize:

```text
real product UI
real screenshots
real architecture
real workflows
```

Avoid generic stock imagery.

Use:

- WebP
- AVIF where appropriate
- responsive image sizes
- lazy loading for below-the-fold images

Hero images may load eagerly when important to the first viewport.

---

# 30. Empty States

Every dynamic/content section should have a meaningful fallback.

Examples:

```text
No notes published yet.
```

or:

```text
GitHub activity unavailable.
```

Do not show broken UI.

---

# 31. Loading States

Loading states should be theme-specific.

## Editorial

Subtle skeleton or fade.

## Terminal

Command/status output.

Example:

```text
$ loading projects...
```

## Brutalist

Bold placeholder block.

## Notion

Document skeleton.

Avoid long loading animations.

---

# 32. Error States

Errors must remain understandable.

Example:

```text
Unable to load project.

Try again
```

Terminal:

```text
$ projects

ERROR: Unable to load project data.

$ retry
```

Brutalist:

```text
PROJECT FAILED TO LOAD.

[ RETRY ]
```

Notion:

```text
⚠ This page could not be loaded.
```

The underlying error behavior remains shared.

---

# 33. Theme Switcher Design

The switcher is part of the portfolio identity.

## Editorial

Use a refined segmented control.

```text
Editorial · Terminal · Brutalist · Notion
```

## Terminal

Use:

```text
$ theme
```

with options.

## Brutalist

Use a large bold switcher.

## Notion

Use a property/dropdown style control.

---

# 34. Theme Switcher Microcopy

Use simple labels:

```text
Editorial
Terminal
Brutalist
Notion
```

Optional descriptions:

```text
Professional
Engineering
Experimental
Documentation
```

Do not use confusing names such as:

```text
Theme A
Theme B
Theme C
Theme D
```

---

# 35. Mobile Design

Mobile is not a scaled-down desktop.

Each theme needs a deliberate mobile layout.

## Editorial

Focus on typography and single-column storytelling.

## Terminal

Focus on readable terminal content and command palette.

## Brutalist

Preserve boldness without causing horizontal overflow.

## Notion

Use a collapsible navigation drawer.

---

# 36. Accessibility Design

Minimum requirements:

```text
WCAG-conscious contrast
Keyboard navigation
Visible focus
Semantic HTML
Reduced motion
Accessible labels
Alt text
Proper heading hierarchy
```

Do not use color as the only way to communicate meaning.

---

# 37. Performance Design

The visual design must account for performance from the beginning.

Prioritize:

```text
Fast first render
Optimized images
Minimal blocking resources
Font optimization
Code splitting
Lazy loading
Efficient animation
```

Avoid:

```text
Huge background videos
Uncompressed images
Unnecessary WebGL
Heavy animation libraries everywhere
Large JavaScript bundles
```

---

# 38. Visual Density

Each theme has a different density.

| Theme | Density |
|---|---|
| Editorial | Spacious |
| Terminal | Dense |
| Neo-Brutalist | Medium |
| Notion | Comfortable |

The content remains the same.

Only presentation density changes.

---

# 39. Design Consistency Rules

Even though the themes are different:

- terminology must remain consistent
- project titles must remain consistent
- links must remain consistent
- content hierarchy must remain recognizable
- accessibility must remain consistent
- responsive behavior must remain reliable
- theme switching must remain predictable

---

# 40. Design QA Checklist

## Visual

- [ ] Typography hierarchy is clear
- [ ] Spacing is consistent
- [ ] Colors are intentional
- [ ] Contrast is sufficient
- [ ] Buttons are consistent
- [ ] Links are recognizable
- [ ] Images are optimized
- [ ] No accidental overflow

## Interaction

- [ ] Hover states work
- [ ] Focus states work
- [ ] Active states work
- [ ] Theme switching works
- [ ] Navigation works
- [ ] Mobile interactions work

## Accessibility

- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Reduced motion
- [ ] Contrast
- [ ] Semantic headings
- [ ] Alt text

## Responsive

- [ ] Desktop
- [ ] Laptop
- [ ] Tablet
- [ ] Mobile
- [ ] Small mobile

---

# 41. Design Quality Bar

The portfolio should not look like:

```text
Template
+
Developer photo
+
Gradient
+
Project cards
+
Contact form
```

The quality bar should be:

```text
Product design
+
Editorial composition
+
Strong typography
+
Engineering clarity
+
Purposeful interaction
+
Excellent responsive behavior
```

---

# 42. Final Design Philosophy

The portfolio has one content system and four visual identities.

```text
                CONTENT
                   │
                   ▼
            DESIGN SYSTEM
                   │
      ┌────────────┼────────────┐
      │            │            │
      ▼            ▼            ▼
 EDITORIAL      TERMINAL    BRUTALIST
      │                         │
      └────────────┬────────────┘
                   ▼
                 NOTION
```

The design should communicate:

### Editorial

> I am professional.

### Terminal

> I understand engineering.

### Neo-Brutalist

> I can build memorable interfaces.

### Notion

> I can communicate and document technical work.

Together, the four experiences should make the portfolio itself a demonstration of:

```text
Frontend Engineering
+
Design Systems
+
Component Architecture
+
Responsive Design
+
Accessibility
+
Interaction Design
+
Product Thinking
```

The portfolio should be judged not only by how attractive it looks, but by how intelligently the design system is constructed underneath it.
