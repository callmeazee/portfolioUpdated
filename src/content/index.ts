/**
 * Canonical content — the single source of truth for what the portfolio says.
 *
 * Themes import from here and decide only how a record looks (theme.md §1).
 * Nothing under `src/components/themes/**` may define portfolio facts.
 */

import type { Project } from "@/types/content";

import { projects } from "./projects";

export { profile } from "./profile";
export { projects } from "./projects";
export { experience } from "./experience";
export { skills } from "./skills";
export { engineeringAreas } from "./engineering";
export { education, certifications, achievements } from "./education";
export { notes } from "./notes";
export { contact } from "./contact";
export { getContentStatus, hasNotes } from "./completeness";
export type { ContentStatus } from "./completeness";

/** Homepage selection — the strongest work only (README §30 rule 14). */
export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

/** Everything, for `/projects`. */
export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Drives `generateStaticParams` and the sitemap, so neither can drift. */
export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
