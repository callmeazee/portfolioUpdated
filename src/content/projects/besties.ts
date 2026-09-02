import type { Project } from "@/types/content";

/**
 * Structural fields (slug, title, category, featured, order) come from the
 * project's own specification: content.md §§27–28 fix the ordering, README §11
 * names it the first primary project. The short description is the wording used
 * for this project in content.md §7 and README §9.
 *
 * Everything descriptive or technical is `null` pending the content interview.
 * In particular the stack is NOT pre-filled from README's illustrative examples:
 * ISS-004 flags per-project stacks as unverified, and content.md §40 rule 6
 * forbids claiming a technology that was not actually used.
 */
export const besties: Project = {
  id: "besties",
  slug: "besties",
  title: "Besties",
  shortTitle: null,
  category: "Social Platform",
  status: null,
  year: null,
  role: null,
  shortDescription:
    "A real-time social platform with messaging, online presence and audio/video communication.",
  technologies: [],
  links: {
    live: { status: "pending" },
    repository: { status: "pending" },
  },
  media: {
    hero: null,
    screenshots: [],
    architectureDiagram: null,
  },
  caseStudy: null,
  featured: true,
  order: 1,
};
