import type { Project } from "@/types/content";

/**
 * Sourced from the résumé supplied 2026-09-02, which supersedes the working
 * name "Besties" used in the planning documents.
 *
 * IMPORTANT: the planning documents described this project as having WebRTC
 * audio/video calling. The résumé does not mention WebRTC, audio or video at
 * all — it describes profiles, posts, likes, comments, notifications and
 * real-time interaction over Socket.IO. The unsupported claims are therefore
 * absent here rather than carried over (CLAUDE.md §9, ISS-004).
 */
export const connectverse: Project = {
  id: "connectverse",
  slug: "connectverse",
  title: "ConnectVerse",
  shortTitle: null,
  category: "Social Platform",
  status: "Completed",
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "Social platform with user profiles, posts, likes, comments, notifications and real-time interactions.",

  technologies: [
    { group: "Frontend", items: ["React"] },
    { group: "Backend", items: ["Node.js"] },
    { group: "Real-Time", items: ["Socket.IO"] },
  ],

  links: {
    live: { status: "available", url: "https://connectverse-5fl1.onrender.com" },
    /*
     * No public repository found under github.com/callmeazee as of 2026-09-08.
     * Kept `pending` rather than `unavailable`: it may simply be private, and
     * the two states make different claims (ADR-011).
     */
    repository: { status: "pending" },
  },

  media: {
    /* Captured from the live deployment on 2026-09-02. */
    hero: {
      src: "/projects/connectverse.webp",
      alt: "The ConnectVerse landing page, showing the social feed's features.",
    },
    screenshots: [],
    architectureDiagram: null,
  },

  caseStudy: {
    overview: [
      "ConnectVerse is a social platform built around real-time interaction. Users have profiles, publish posts, and engage through likes, comments and notifications delivered live over Socket.IO.",
    ],
    problem: [],
    solution: [],
    features: [
      "User profiles",
      "Posts",
      "Likes",
      "Comments",
      "Notifications",
      "Real-time interactions",
    ],
    architecture: null,
    /* No diagram: the architecture has not been established from source. */
    diagram: null,
    frontend: null,
    backend: null,
    database: null,
    realtime: null,
    infrastructure: null,
    security: null,
    performance: { measured: false },
    challenges: [],
    learnings: [],
  },

  /* Unfeatured now that Besties carries the real-time story with a full case study. */
  featured: false,
  order: 4,
};
