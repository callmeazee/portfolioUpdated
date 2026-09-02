import type { ThemeConfig, ThemeId } from "@/types/theme";

/**
 * THEME REGISTRY
 *
 * The single place theme IDs are enumerated (theme.md §11, ARCHITECTURE.md).
 * Adding a theme means adding it here and adding its `[data-theme]` block in
 * tokens.css — never scattering `if (theme === "…")` through the application.
 *
 * IDs are stable and must not be renamed without a migration: they are written
 * into visitors' cookies and into shared `?theme=` URLs (theme.md §2).
 */
export const THEME_IDS = ["editorial", "terminal", "brutalist", "notion"] as const;

/** theme.md §3 — and the fallback whenever resolution fails (theme.md §15). */
export const DEFAULT_THEME: ThemeId = "editorial";

export const themeRegistry: Record<ThemeId, ThemeConfig> = {
  editorial: {
    id: "editorial",
    name: "Editorial",
    tagline: "Professional",
    description:
      "A premium editorial layout with large typography, generous whitespace and restrained motion.",
    motion: { intensity: "low" },
    layout: { density: "spacious" },
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    tagline: "Engineering",
    description:
      "A macOS-inspired developer environment with a command palette and keyboard navigation.",
    motion: { intensity: "medium" },
    layout: { density: "compact" },
  },
  brutalist: {
    id: "brutalist",
    name: "Brutalist",
    tagline: "Experimental",
    description:
      "A bold neo-brutalist layout with thick borders, hard shadows and high contrast.",
    motion: { intensity: "high" },
    layout: { density: "comfortable" },
  },
  notion: {
    id: "notion",
    name: "Notion",
    tagline: "Documentation",
    description:
      "A calm, document-style workspace with sidebar navigation and long-form readability.",
    motion: { intensity: "low" },
    layout: { density: "comfortable" },
  },
};

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export function getThemeConfig(id: ThemeId): ThemeConfig {
  return themeRegistry[id];
}

export function getAllThemes(): ThemeConfig[] {
  return THEME_IDS.map((id) => themeRegistry[id]);
}
