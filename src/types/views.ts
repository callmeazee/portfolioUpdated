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

/**
 * THE THEME BOUNDARY
 *
 * These are the props a theme receives. They exist so that theme components
 * take content as INPUT and never import `@/content` themselves — the rule that
 * keeps four presentations from becoming four portfolios (CLAUDE.md §§8, 40).
 *
 * A theme decides how a project looks. It never decides what a project is.
 */

export interface ThemeLayoutProps {
  children: ReactNode;
  profile: Profile;
  contact: Contact;
  navigation: ReadonlyArray<{ label: string; href: string }>;
}

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
  Layout: ComponentType<ThemeLayoutProps>;
  Home: ComponentType<HomeViewProps>;
  ProjectDetail: ComponentType<ProjectViewProps>;
}
