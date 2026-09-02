/**
 * CANONICAL CONTENT MODEL
 *
 * Source of truth: content.md. Consumed by every theme (theme.md §1); themes
 * decide how a record looks, never what it says.
 *
 * ── THE PENDING CONVENTION ────────────────────────────────────────────────
 *
 * `null` means "not yet supplied" — a gap awaiting the content interview.
 * It never means "confirmed absent".
 *
 * A confirmed absence is expressed explicitly instead:
 *   - an empty array (`certifications: []` = there are none)
 *   - a discriminated state (`{ status: "unavailable" }`, `{ measured: false }`)
 *
 * The distinction matters because it is what keeps the No Fabrication Policy
 * (CLAUDE.md §9) enforceable: `src/content/completeness.ts` walks these records
 * and reports every `null` as an open gap, so unfilled content stays visible
 * rather than quietly rendering as an em dash. Never replace a `null` with a
 * plausible-sounding guess to make a page look finished.
 */

export interface CallToAction {
  label: string;
  href: string;
}

/**
 * content.md §25: a project without a public link is marked unavailable, never
 * given an invented URL. "pending" and "unavailable" are deliberately different
 * states — one is homework, the other is a fact.
 */
export type ExternalLink =
  | { status: "available"; url: string }
  | { status: "unavailable"; note?: string }
  | { status: "pending" };

/** content.md §12 / §30 — one grouping vocabulary for stacks and skills alike. */
export type TechGroupName =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Real-Time"
  | "Cloud & Infrastructure"
  | "Mobile"
  | "Testing"
  | "Tools"
  | "Other";

export interface TechGroup {
  group: TechGroupName;
  items: string[];
}

/* ── Profile (content.md §3, §4) ─────────────────────────────────────────── */

export interface Profile {
  fullName: string;
  displayName: string;
  title: string;
  /** Short hero line. content.md §4 keeps this to a sentence, not a paragraph. */
  headline: string | null;
  positioning: string | null;
  location: string | null;
  availability: string | null;
  shortBio: string | null;
  /** Paragraphs, not one blob — themes set their own rhythm. */
  longBio: string[] | null;
  philosophy: string | null;
  currentFocus: string | null;
  primaryCta: CallToAction | null;
  secondaryCta: CallToAction | null;
}

/* ── Projects (content.md §§5–28) ────────────────────────────────────────── */

export type ProjectStatus =
  | "Completed"
  | "In Progress"
  | "Archived"
  | "Prototype"
  | "Production";

export interface MediaAsset {
  src: string;
  /** Required, not optional: alt text is an accessibility obligation (README §14). */
  alt: string;
  caption?: string;
}

export interface ProjectMedia {
  hero: MediaAsset | null;
  screenshots: MediaAsset[];
  architectureDiagram: MediaAsset | null;
}

export interface ProjectLinks {
  live: ExternalLink;
  repository: ExternalLink;
}

/** A reusable block for the deep-dive sections in content.md §§13–21. */
export interface TechnicalSection {
  summary: string;
  points: string[];
}

/**
 * content.md §22 and §23 describe challenges and their solutions. They are
 * modelled as ONE record rather than two parallel arrays, because parallel
 * arrays drift: nothing would stop challenges[2] from losing its solution.
 * Only `problem` is required — the narrative fields fill in as they are known.
 */
export interface Challenge {
  title: string;
  problem: string;
  investigation?: string;
  approach?: string;
  implementation?: string;
  result?: string;
}

/**
 * content.md §20: never invent performance numbers. "Not measured yet" is a
 * first-class, renderable state rather than an empty section.
 */
export type PerformanceNotes =
  | { measured: false }
  | { measured: true; metrics: Array<{ label: string; value: string }> };

/** Section order mirrors the case-study hierarchy in design.md §26. */
export interface CaseStudy {
  overview: string[];
  problem: string[];
  solution: string[];
  features: string[];
  architecture: TechnicalSection | null;
  frontend: TechnicalSection | null;
  backend: TechnicalSection | null;
  database: TechnicalSection | null;
  realtime: TechnicalSection | null;
  infrastructure: TechnicalSection | null;
  security: TechnicalSection | null;
  performance: PerformanceNotes;
  challenges: Challenge[];
  learnings: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortTitle: string | null;
  category: string;
  status: ProjectStatus | null;
  year: number | null;
  role: string | null;
  /** 1–2 sentences. Used by cards, homepage and search (content.md §7). */
  shortDescription: string | null;
  technologies: TechGroup[];
  links: ProjectLinks;
  media: ProjectMedia;
  /** null until the case study is written. Themes fall back to the summary. */
  caseStudy: CaseStudy | null;
  featured: boolean;
  /** Explicit, so ordering never depends on file or object key order (§28). */
  order: number;
}

/* ── Experience (content.md §29) ─────────────────────────────────────────── */

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string | null;
  employmentType: string | null;
  /** ISO `YYYY-MM`. */
  startDate: string;
  /**
   * `"present"` rather than `null` for a current role — under the pending
   * convention a null here would read as "end date unknown".
   */
  endDate: string | "present";
  description: string | null;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  relatedProjectSlugs: string[];
}

/* ── Engineering, education, credentials (content.md §§31–34) ────────────── */

export interface EngineeringArea {
  id: string;
  name: string;
  shortDescription: string;
  technologies: string[];
  relatedProjectSlugs: string[];
  notes: string | null;
}

export interface EducationEntry {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startYear: number;
  endYear: number | "present";
  description: string | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string | null;
  credentialUrl: string | null;
}

export interface Achievement {
  id: string;
  category:
    | "Open Source"
    | "Hackathons"
    | "Awards"
    | "Publications"
    | "Community"
    | "Technical Achievements";
  title: string;
  description: string;
  date: string | null;
  url: string | null;
}

/* ── Notes (content.md §35) ──────────────────────────────────────────────── */

export interface Note {
  slug: string;
  title: string;
  summary: string;
  /** ISO `YYYY-MM-DD`. */
  publishedAt: string;
  tags: string[];
  body: string[];
}

/* ── Contact and resume (content.md §§36–38) ─────────────────────────────── */

export interface Contact {
  /** Only what is intentionally public (content.md §36). */
  email: string | null;
  github: ExternalLink;
  linkedin: ExternalLink;
  resume: {
    url: string | null;
    label: string;
  };
}
