import type { ComponentType, ReactNode } from "react";

import type {
  Contact,
  EngineeringArea,
  ExperienceEntry,
  Note,
  Profile,
  Project,
  TechGroup,
} from "./content";
import type { ThemeConfig, ThemeId } from "./theme";

/**
 * THE THEME BOUNDARY
 *
 * These are the props a theme receives. They exist so that theme components
 * take content as INPUT and never import `@/content` themselves — the rule that
 * keeps four presentations from becoming four portfolios (CLAUDE.md §§8, 40),
 * enforced by a test in tests/unit/tokens.test.ts.
 *
 * A theme decides how a project looks. It never decides what a project is.
 */

/* ── Environment chrome ──────────────────────────────────────────────────── */

/**
 * Props for a theme's Shell — the desktop, the workspace sidebar, the magazine
 * masthead. A shell renders its own navigation, so it needs the collections it
 * navigates, not just the current page's content.
 *
 * The active route is deliberately absent: shells resolve it with `usePathname`
 * inside their interactive parts, since layouts never receive it.
 */
export interface ThemeShellProps {
  children: ReactNode;
  profile: Profile;
  contact: Contact;
  navigation: ReadonlyArray<{ label: string; href: string }>;
  projects: Project[];
  notes: Note[];
  activeTheme: ThemeId;
  themes: ThemeConfig[];
}

/* ── PageKit: themed primitives for the generic routes ───────────────────── */

/**
 * Eight routes × four themes would be thirty-two bespoke components. PageKit
 * avoids that: each theme publishes a small set of primitives, and the generic
 * routes compose from whichever theme is active (ADR-018).
 *
 * Home and ProjectDetail stay bespoke — they are where an environment's
 * character actually lives and a shared abstraction would flatten them.
 */

export interface KitPageProps {
  title: string;
  intro?: string;
  /** Rendered as a trail by themes that have one (Notion), ignored by others. */
  breadcrumb?: ReadonlyArray<{ label: string; href: string }>;
  children?: ReactNode;
}

export interface KitSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  /** Sections without content should not claim spacious padding (ISS-022). */
  compact?: boolean;
}

export interface KitCardProps {
  href?: string;
  eyebrow?: string;
  title: string;
  /** `null` renders the theme's pending treatment, never blank. */
  description?: string | null;
  meta?: string | null;
}

export interface KitDefinitionListProps {
  items: ReadonlyArray<{ term: string; description: ReactNode }>;
}

export interface ThemePageKit {
  Page: ComponentType<KitPageProps>;
  Section: ComponentType<KitSectionProps>;
  Prose: ComponentType<{ paragraphs: string[] }>;
  Card: ComponentType<KitCardProps>;
  DefinitionList: ComponentType<KitDefinitionListProps>;
  /** design.md §30 — every section degrades to something meaningful. */
  Empty: ComponentType<{ children: ReactNode }>;
  Action: ComponentType<{ href: string; children: ReactNode; external?: boolean }>;
}

/* ── Bespoke views ───────────────────────────────────────────────────────── */

export interface HomeViewProps {
  profile: Profile;
  featuredProjects: Project[];
  engineeringAreas: EngineeringArea[];
  skills: TechGroup[];
  experience: ExperienceEntry[];
  notes: Note[];
  contact: Contact;
}

export interface ProjectViewProps {
  project: Project;
}

/** The contract every theme module fulfils. */
export interface ThemeSections {
  Shell: ComponentType<ThemeShellProps>;
  PageKit: ThemePageKit;
  Home: ComponentType<HomeViewProps>;
  ProjectDetail: ComponentType<ProjectViewProps>;
}
