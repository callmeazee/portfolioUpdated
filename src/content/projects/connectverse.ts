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
    repository: { status: "pending" },
  },

  media: { hero: null, screenshots: [], architectureDiagram: null },

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

  featured: true,
  order: 3,
};
