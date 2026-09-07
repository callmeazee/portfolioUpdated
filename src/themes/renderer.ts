import type { ThemeId } from "@/types/theme";
import type { ThemeSections } from "@/types/views";

/**
 * THEME RENDERER
 *
 * Maps a resolved theme ID to its presentation module (theme.md §11):
 *
 *     ThemeRegistry → ThemeRenderer → Editorial | Terminal | Brutalist | Notion
 *                                            ↑
 *                                     shared content
 *
 * Loaded through dynamic `import()` rather than static imports so that only the
 * active theme's module is pulled in — inactive themes never reach the bundle
 * (theme.md §14). Combined with ADR-007's server-side resolution, a visitor
 * downloads exactly one theme.
 *
 * All four themes are implemented. Each loader points at its own module, so a
 * visitor downloads exactly one environment.
 */
const loaders: Record<ThemeId, () => Promise<{ sections: ThemeSections }>> = {
  editorial: () => import("@/components/themes/editorial"),
  terminal: () => import("@/components/themes/terminal"),
  brutalist: () => import("@/components/themes/brutalist"),
  notion: () => import("@/components/themes/notion"),
};

export async function getThemeSections(id: ThemeId): Promise<ThemeSections> {
  const { sections } = await loaders[id]();
  return sections;
}
