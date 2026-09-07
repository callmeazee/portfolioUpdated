import type { Project } from "@/types/content";

/** Second primary project (README §11, content.md §28). */
export const ecommerce: Project = {
  id: "ecommerce",
  slug: "ecommerce",
  title: "E-commerce Platform",
  shortTitle: "E-commerce",
  category: "E-commerce",
  status: null,
  year: null,
  role: null,
  shortDescription: "A full-stack commerce platform.",
  technologies: [],
  links: {
    /*
     * Interview 2026-09-02 confirmed this project has public links, but the URLs
     * have not been supplied yet — so these stay "pending", not "unavailable".
     * The two states make different claims and must not be conflated (ADR-011).
     */
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
  order: 2,
};
