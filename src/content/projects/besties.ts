import type { Project } from "@/types/content";

/**
 * Besties is a distinct project, NOT a rename of ConnectVerse — confirmed by
 * the subject on 2026-09-02, which is why ISS-033 was raised rather than the
 * two being silently merged.
 *
 * It does not appear on the résumé, so the details below come from the
 * project's own planning documents (README §§5, 9, 11 and content.md), where it
 * is described consistently in several places. Those sections label the record
 * an "example", so the stack and feature list are the one part of this file
 * that warrants confirmation — tracked as ISS-038.
 *
 * Links are `pending`, not `unavailable`: a deployment may well exist, it just
 * has not been supplied. The two states make different claims (ADR-011).
 */
export const besties: Project = {
  id: "besties",
  slug: "besties",
  title: "Besties",
  shortTitle: null,
  category: "Social Platform",
  status: "Completed",
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "Real-time social platform with messaging, online presence and audio/video communication.",

  technologies: [
    { group: "Frontend", items: ["React", "TypeScript"] },
    { group: "Backend", items: ["Node.js", "Express.js"] },
    { group: "Database", items: ["MongoDB"] },
    { group: "Real-Time", items: ["Socket.IO", "WebRTC"] },
    { group: "Cloud & Infrastructure", items: ["AWS"] },
  ],

  links: {
    live: { status: "pending" },
    repository: { status: "pending" },
  },

  media: { hero: null, screenshots: [], architectureDiagram: null },

  caseStudy: {
    overview: [
      "Besties is a real-time social platform combining a social feed with direct messaging and audio/video calling.",
    ],
    problem: [],
    solution: [],
    features: [
      "Authentication",
      "Real-time messaging",
      "Online presence",
      "Audio calls",
      "Video calls",
      "Notifications",
      "Social feed",
      "Media uploads",
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

  /*
   * Unfeatured: the résumé leads with CloudSpire, Snitcher and ConnectVerse, so
   * those keep the homepage. Besties appears on /projects. Easy to promote.
   */
  featured: false,
  order: 6,
};
