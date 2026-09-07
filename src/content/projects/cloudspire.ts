import type { Project } from "@/types/content";

/**
 * Sourced from the résumé supplied 2026-09-02, which supersedes the working
 * name "CloudCost AI" used throughout the planning documents.
 *
 * The case study carries only what the résumé states. `problem`, `solution`,
 * `challenges` and `learnings` are empty because nothing in the source
 * describes them — those sections simply do not render (CLAUDE.md §37).
 */
export const cloudspire: Project = {
  id: "cloudspire-ai",
  slug: "cloudspire-ai",
  title: "CloudSpire AI",
  shortTitle: "CloudSpire",
  category: "AI",
  status: "Completed",
  /* Not stated on the résumé. */
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "AI-powered cloud cost optimisation platform that analyses infrastructure usage and recommends ways to reduce spend.",

  technologies: [
    { group: "Frontend", items: ["React", "TypeScript"] },
    { group: "Backend", items: ["Node.js"] },
    { group: "Database", items: ["MongoDB"] },
    { group: "Cloud & Infrastructure", items: ["AWS"] },
  ],

  links: {
    live: { status: "available", url: "https://cloudspire-ai.vercel.app" },
    /* Not listed on the résumé; see ISS-003. */
    repository: { status: "pending" },
  },

  media: {
    /* Captured from the live deployment on 2026-09-02. */
    hero: {
      src: "/projects/cloudspire-ai.webp",
      alt: "The CloudSpire AI landing page, showing the cloud cost optimisation product.",
    },
    screenshots: [],
    architectureDiagram: null,
  },

  caseStudy: {
    overview: [
      "CloudSpire AI is an AI-powered cloud cost optimisation platform. It analyses infrastructure usage, identifies unnecessary cloud spending, and provides intelligent recommendations to reduce operational costs.",
    ],
    problem: [],
    solution: [],
    features: [
      "Infrastructure usage analysis",
      "Identification of unnecessary cloud spending",
      "Intelligent cost-reduction recommendations",
    ],
    architecture: null,
    frontend: null,
    backend: null,
    database: null,
    realtime: null,
    infrastructure: null,
    security: null,
    /* content.md §20 — never invent performance numbers. */
    performance: { measured: false },
    challenges: [],
    learnings: [],
  },

  featured: true,
  order: 1,
};
