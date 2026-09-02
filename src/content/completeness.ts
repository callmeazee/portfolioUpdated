import { contact } from "./contact";
import { achievements, certifications, education } from "./education";
import { engineeringAreas } from "./engineering";
import { experience } from "./experience";
import { notes } from "./notes";
import { profile } from "./profile";
import { projects } from "./projects";
import { skills } from "./skills";

/**
 * CONTENT COMPLETENESS
 *
 * ADR-006 builds the site against placeholders while real content arrives by
 * interview. That only stays honest if the gaps are measurable, so this walks
 * the canonical records and reports every unfilled field by path.
 *
 * It relies on the pending convention in `src/types/content.ts`: a `null` value
 * or a `{ status: "pending" }` link is a gap. A confirmed absence — an empty
 * array, `{ status: "unavailable" }`, `{ measured: false }` — is not.
 *
 * Collections that are empty because nobody has been asked yet are listed
 * separately in `awaiting`, since an empty array alone cannot distinguish
 * "none" from "not collected".
 */

export interface ContentStatus {
  /** Dotted paths of fields awaiting a real value. */
  gaps: string[];
  /** Whole collections not yet gathered. */
  awaiting: string[];
  /** Blockers that must clear before the site can ship (Phase 15). */
  publishBlockers: string[];
  isPublishable: boolean;
}

function walk(value: unknown, path: string, out: string[]): void {
  if (value === null) {
    out.push(path);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`, out));
    return;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    // A pending link is a leaf gap, not a container to descend into.
    if (record.status === "pending") {
      out.push(path);
      return;
    }

    for (const [key, child] of Object.entries(record)) {
      walk(child, path ? `${path}.${key}` : key, out);
    }
    return;
  }
}

/**
 * Collections whose emptiness currently means "not yet collected". Remove an
 * entry here once its real state is confirmed — including confirming that it is
 * legitimately empty.
 */
const AWAITING_COLLECTION: Array<[string, { length: number }]> = [
  ["experience", experience],
  ["skills", skills],
  ["engineeringAreas", engineeringAreas],
  ["education", education],
  ["certifications", certifications],
  ["achievements", achievements],
];

export function getContentStatus(): ContentStatus {
  const gaps: string[] = [];
  walk(profile, "profile", gaps);
  walk(contact, "contact", gaps);
  projects.forEach((project) => walk(project, `projects.${project.slug}`, gaps));

  const awaiting = AWAITING_COLLECTION.filter(([, c]) => c.length === 0).map(([name]) => name);

  /*
   * Publish blockers, per ADR-006: a featured project still wearing placeholder
   * fields must not reach production, and the site cannot ship without the
   * profile essentials or a way to make contact.
   */
  const publishBlockers: string[] = [];

  if (profile.positioning === null) publishBlockers.push("profile.positioning");
  if (profile.shortBio === null) publishBlockers.push("profile.shortBio");
  if (contact.email === null && contact.linkedin.status !== "available") {
    publishBlockers.push("contact — no public way to get in touch");
  }

  for (const project of projects.filter((p) => p.featured)) {
    const missing: string[] = [];
    if (project.shortDescription === null) missing.push("shortDescription");
    if (project.status === null) missing.push("status");
    if (project.role === null) missing.push("role");
    if (project.technologies.length === 0) missing.push("technologies");
    if (project.caseStudy === null) missing.push("caseStudy");
    if (missing.length > 0) {
      publishBlockers.push(`${project.slug}: ${missing.join(", ")}`);
    }
  }

  return {
    gaps,
    awaiting,
    publishBlockers,
    isPublishable: publishBlockers.length === 0,
  };
}

/** `notes` is intentionally excluded from blockers — an empty writing section
 *  is a legitimate published state with its own empty copy (design.md §30). */
export const hasNotes = notes.length > 0;
