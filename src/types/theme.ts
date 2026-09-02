import type { THEME_IDS } from "@/themes/registry";

export type ThemeId = (typeof THEME_IDS)[number];

/**
 * Behavioural metadata for a theme.
 *
 * Deliberately holds NO colors, fonts or radii, even though README §4 sketches
 * them here. Those live once in `src/themes/tokens.css` (ADR-008) — duplicating
 * them into TypeScript would create two sources of truth that drift, and the
 * CSS copy is the one the browser actually renders. What remains here is what
 * CSS cannot express: identity, copy, and the motion/density intent that
 * components branch on.
 */
export interface ThemeConfig {
  id: ThemeId;
  /** Switcher label (design.md §34). */
  name: string;
  /** One-word character, shown beside the label. */
  tagline: string;
  /** Longer description, used for accessible descriptions and metadata. */
  description: string;
  motion: {
    /** theme.md §§6.5, 7.6, 8.4 — respected on top of prefers-reduced-motion. */
    intensity: "low" | "medium" | "high";
  };
  layout: {
    /** design.md §38. */
    density: "compact" | "comfortable" | "spacious";
  };
}
