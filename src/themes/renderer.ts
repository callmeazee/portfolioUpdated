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
 * PHASE STATUS: Editorial and Terminal are implemented. Brutalist and Notion
 * deliberately point at Editorial for now, which is the documented fallback
 * behaviour (theme.md §15) rather than a stub. They are NOT visually identical
 * in the meantime — each already carries its own token values, so selecting
 * Brutalist today yields the editorial layout in the brutalist palette.
 * Phases 6–7 replace each entry with its own module.
 */
const loaders: Record<ThemeId, () => Promise<{ sections: ThemeSections }>> = {
  editorial: () => import("@/components/themes/editorial"),
  terminal: () => import("@/components/themes/terminal"),
  brutalist: () => import("@/components/themes/editorial"),
  notion: () => import("@/components/themes/editorial"),
};

export async function getThemeSections(id: ThemeId): Promise<ThemeSections> {
  const { sections } = await loaders[id]();
  return sections;
}
