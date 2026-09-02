# Content Specification — Azeez Ahmed Khan Portfolio

## Purpose

This document defines the **content model and content requirements** for the portfolio.

The goal is to separate portfolio content from visual presentation.

The four themes:

- Editorial
- macOS Terminal
- Neo-Brutalist
- Notion

must all consume the same content defined here.

---

# 1. Content Architecture

Content should be organized into:

```text
Profile
Experience
Projects
Skills
Engineering
Education
Certifications
Achievements
Notes
Contact
Links
```

Recommended structure:

```text
content/
├── profile
├── experience
├── projects
├── skills
├── engineering
├── education
├── certifications
├── achievements
├── notes
└── contact
```

---

# 2. Content Source of Truth

There must be one canonical source for each piece of information.

Do not duplicate the same project description inside different themes.

For example:

```text
content/projects/besties
```

is the source of truth.

Themes only decide how it is displayed.

---

# 3. Profile Content

Define:

## Identity

- Full name
- Preferred display name
- Professional title
- Short headline
- Location if desired
- Availability if desired

## Introduction

Provide:

- short introduction
- professional positioning
- what I build
- what kind of roles/projects I am targeting

## Longer About

Provide:

- development journey
- engineering interests
- product interests
- preferred technologies
- engineering philosophy
- current learning focus

---

# 4. Hero Content

The hero should have:

```text
Name
Role
Short positioning statement
Primary CTA
Secondary CTA
```

Content should be short.

Avoid writing a large paragraph in the hero.

Recommended structure:

```text
Name:
Azeez Ahmed Khan

Role:
Full-Stack Developer

Positioning:
[TO BE DEFINED]

Primary CTA:
[TO BE DEFINED]

Secondary CTA:
[TO BE DEFINED]
```

---

# 5. Project Content Model

Every major project should have a complete content record.

Recommended fields:

```text
id
slug
title
shortTitle
category
status
year
role
client
description
shortDescription
overview
problem
solution
features
architecture
frontend
backend
database
infrastructure
realtime
security
performance
challenges
solutions
learnings
technologies
screenshots
videos
liveLink
githubLink
caseStudyLink
featured
order
```

Not every field is mandatory for every project.

---

# 6. Project Basic Information

For every project define:

## Title

Example:

```text
Besties
```

## Slug

Example:

```text
besties
```

## Category

Examples:

```text
Social Platform
E-commerce
SaaS
AI
Developer Tool
Mobile Application
```

## Status

Examples:

```text
Completed
In Progress
Archived
Prototype
Production
```

## Year

Example:

```text
2026
```

## Role

Example:

```text
Full-Stack Developer
```

---

# 7. Project Short Description

The short description is used in:

- project cards
- homepage
- search results
- theme previews

It should be 1–2 sentences.

Example:

```text
A real-time social platform with messaging,
online presence and audio/video communication.
```

---

# 8. Project Overview

The overview should explain:

- what the product is
- who it is for
- what problem it solves
- what makes it interesting

Recommended length:

```text
2–5 short paragraphs
```

---

# 9. Problem

Explain the actual problem.

Answer:

```text
What problem existed?

Who experienced it?

Why was it worth solving?

What constraints existed?
```

Avoid generic statements.

---

# 10. Solution

Explain:

```text
What was built?

How does it solve the problem?

Why was this approach chosen?
```

---

# 11. Features

List only real implemented features.

Example:

```text
Authentication
Authorization
Role-based access control
Real-time messaging
Online presence
Audio calling
Video calling
Notifications
Media uploads
Search
Pagination
Filtering
```

Do not claim features that were not actually implemented.

---

# 12. Technology Stack

Group technologies.

Recommended structure:

```text
Frontend

React
TypeScript
Tailwind CSS
Redux Toolkit

Backend

Node.js
Express
TypeScript

Database

MongoDB
Redis

Real-Time

Socket.io
WebRTC

Infrastructure

AWS
Docker
Nginx
```

---

# 13. Architecture Content

Every major project should explain its architecture.

Recommended sections:

```text
System Overview
Frontend Architecture
Backend Architecture
Database Architecture
Authentication
Authorization
Real-Time Architecture
File/Media Storage
Caching
Deployment
```

Architecture diagrams should be added where useful.

---

# 14. Backend Details

Where applicable document:

```text
API architecture
Route organization
Controllers
Services
Middleware
Validation
Authentication
Authorization
Error handling
Logging
Rate limiting
Database access
Transactions
Background jobs
```

Only document what actually exists.

---

# 15. Frontend Details

Where applicable document:

```text
Component architecture
State management
Routing
Forms
Validation
API integration
Responsive design
Accessibility
Performance
Loading states
Error states
```

---

# 16. Database Details

For database-backed projects define:

```text
Database technology
Main collections/tables
Relationships
Indexes
Validation
Important queries
Pagination strategy
Aggregation
Caching strategy
```

Do not expose sensitive production information.

---

# 17. Authentication and Authorization

Where applicable define:

```text
Authentication method
Session/token strategy
Password handling
Refresh strategy
Role model
Permission model
Protected routes
Protected APIs
```

Example:

```text
Authentication:
JWT

Authorization:
RBAC

Roles:
Admin
User
```

Only document the actual implementation.

---

# 18. Real-Time Features

For projects using Socket.io/WebRTC/etc., define:

```text
Technology
Connection model
Events
Signaling
Presence
Connection lifecycle
Failure handling
Reconnection
Media handling
```

Example:

```text
Socket.io
WebRTC
STUN/TURN
```

---

# 19. Infrastructure

Define:

```text
Hosting
Cloud provider
Containerization
Reverse proxy
CI/CD
Storage
CDN
Monitoring
Environment management
```

Example:

```text
AWS
Docker
Nginx
S3
```

Again, only include technologies actually used.

---

# 20. Performance

If performance was measured, provide real data.

Possible fields:

```text
LCP
CLS
INP
TTFB
Bundle size
API response time
Database query time
```

Never invent performance numbers.

If no measurements exist:

```text
Performance metrics:
Not measured yet
```

---

# 21. Security

Document real security practices such as:

```text
Password hashing
JWT
HTTP-only cookies
CORS
Input validation
Rate limiting
RBAC
Authorization checks
Secure headers
File validation
```

Do not expose:

- secrets
- tokens
- credentials
- private endpoints
- infrastructure secrets

---

# 22. Challenges

Every major project should have a section:

```text
Challenges
```

Describe difficult engineering problems.

Good examples:

```text
WebRTC connection lifecycle
Race conditions
Authentication flow
Large media uploads
Pagination
Database performance
State synchronization
Deployment issues
```

---

# 23. Solutions

For every major challenge explain:

```text
Problem
↓
Investigation
↓
Approach
↓
Implementation
↓
Result
```

This section is especially important for technical interviews.

---

# 24. Learnings

Explain:

```text
What did I learn?

What would I do differently?

What architectural decisions would change?

What became clearer after building the project?
```

Be honest.

---

# 25. Project Links

Every project should support:

```text
liveLink
githubLink
caseStudyLink
```

Example:

```text
Live Demo:
[TO BE PROVIDED]

GitHub:
[TO BE PROVIDED]

Case Study:
Internal route
```

If a project does not have a public live link, explicitly mark it as unavailable rather than inventing one.

---

# 26. Project Media

Possible media:

```text
heroImage
screenshots
gallery
video
architectureDiagram
demoGif
```

Recommended structure:

```text
projects/
└── besties/
    ├── hero.webp
    ├── screenshot-01.webp
    ├── screenshot-02.webp
    ├── architecture.webp
    └── demo.webp
```

Use optimized formats where appropriate.

---

# 27. Featured Projects

Not every project should appear on the homepage.

Define:

```text
featured: true
```

for the strongest projects.

Recommended initial structure:

```text
01 Besties
02 E-commerce Platform
03 CloudCost AI
```

Additional projects should appear on:

```text
/projects
```

---

# 28. Project Ordering

Each project should have an explicit order.

Example:

```text
Besties → 1
E-commerce → 2
CloudCost AI → 3
```

This prevents accidental ordering changes.

---

# 29. Experience Content

For every experience entry define:

```text
company
role
location
startDate
endDate
employmentType
description
responsibilities
achievements
technologies
projects
```

Where applicable.

Avoid writing responsibilities as generic job descriptions.

Focus on:

```text
What did I build?
What did I improve?
What technologies did I use?
What problems did I solve?
```

---

# 30. Skills Content

Skills should be grouped.

Recommended groups:

```text
Frontend
Backend
Database
Cloud & Infrastructure
Real-Time
Mobile
Testing
Tools
Other
```

Avoid:

```text
React — 95%
Node — 90%
MongoDB — 85%
```

Skill percentages are subjective and should not be used.

---

# 31. Engineering Content

This section can contain technical areas such as:

```text
Architecture
Authentication
Authorization
REST APIs
Real-Time Systems
WebRTC
Database Design
Caching
Cloud
Docker
CI/CD
Performance
Security
Testing
```

Each area can have:

```text
shortDescription
technologies
projects
notes
```

---

# 32. Education

If included:

```text
degree
field
institution
startYear
endYear
description
```

Only include relevant information.

---

# 33. Certifications

For each certification:

```text
name
issuer
date
credentialId
credentialUrl
```

Only include genuine certifications.

---

# 34. Achievements

Possible categories:

```text
Open Source
Hackathons
Awards
Publications
Community
Technical Achievements
```

Do not include inflated or unverifiable claims.

---

# 35. Notes / Writing

Optional technical notes can cover:

```text
Architecture decisions
WebRTC
MongoDB
Node.js
React
TypeScript
AWS
Performance
Debugging
Lessons learned
```

Notes should demonstrate thinking rather than simply repeat documentation.

---

# 36. Contact Content

Define:

```text
email
phone (optional)
LinkedIn
GitHub
portfolio
other professional links
```

Only publish information intentionally meant to be public.

---

# 37. Resume

Define:

```text
resumeUrl
resumeLabel
```

The resume should be accessible from every theme.

---

# 38. Social / External Links

Recommended:

```text
GitHub
LinkedIn
Email
Portfolio
```

Add other platforms only when they strengthen the professional profile.

---

# 39. Content Tone

The portfolio content should be:

- professional
- concise
- technically specific
- honest
- evidence-based
- easy to scan

Avoid:

```text
I am a passionate coding ninja.
I love solving complex problems.
I am a 10x developer.
I am obsessed with technology.
```

Prefer concrete statements.

Example:

```text
Built a real-time social platform using Socket.io
and WebRTC with authentication, presence,
messaging and audio/video communication.
```

---

# 40. Content Quality Rules

1. Never invent metrics.
2. Never invent users.
3. Never invent revenue.
4. Never invent performance numbers.
5. Never claim production scale that was not actually achieved.
6. Never claim technologies that were not used.
7. Clearly distinguish tutorial projects from independently built projects.
8. Clearly distinguish prototypes from production deployments.
9. Use real live links.
10. Use real GitHub links.
11. Keep descriptions concise.
12. Put technical depth inside case studies.
13. Update content when projects change.
14. Keep content independent from themes.

---

# 41. Content Completion Checklist

## Profile

- [ ] Name
- [ ] Professional title
- [ ] Headline
- [ ] Short bio
- [ ] Long bio
- [ ] Location if desired
- [ ] Availability if desired

## Projects

For every major project:

- [ ] Title
- [ ] Slug
- [ ] Category
- [ ] Status
- [ ] Year
- [ ] Role
- [ ] Short description
- [ ] Overview
- [ ] Problem
- [ ] Solution
- [ ] Features
- [ ] Technology stack
- [ ] Architecture
- [ ] Backend details
- [ ] Frontend details
- [ ] Database details
- [ ] Security
- [ ] Performance
- [ ] Challenges
- [ ] Solutions
- [ ] Learnings
- [ ] Screenshots
- [ ] Live link
- [ ] GitHub link
- [ ] Featured status
- [ ] Display order

## Experience

- [ ] Company
- [ ] Role
- [ ] Dates
- [ ] Description
- [ ] Responsibilities
- [ ] Achievements
- [ ] Technologies
- [ ] Relevant projects

## Skills

- [ ] Frontend
- [ ] Backend
- [ ] Database
- [ ] Cloud
- [ ] Real-Time
- [ ] Mobile
- [ ] Tools

## Contact

- [ ] Email
- [ ] GitHub
- [ ] LinkedIn
- [ ] Resume

---

# 42. Content Status

This file intentionally contains placeholders where personal/project information still needs to be supplied.

The content should be filled in before the final UI is considered complete.

Priority order:

```text
1. Profile
2. Besties
3. E-commerce
4. CloudCost AI
5. Experience
6. Skills
7. Additional projects
8. Engineering notes
9. Education
10. Certifications
11. Contact
```

---

# 43. Final Principle

The content system is the **source of truth**.

Themes should never define:

```text
What the project is.
```

Themes only define:

```text
How the project is presented.
```

Therefore:

```text
ONE CONTENT SYSTEM
        +
FOUR PRESENTATION SYSTEMS
        =
ONE MULTI-THEME PORTFOLIO
```
