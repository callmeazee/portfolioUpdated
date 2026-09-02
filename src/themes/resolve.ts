import { DEFAULT_THEME, isThemeId } from "./registry";
import type { ThemeId } from "@/types/theme";

/**
 * Theme resolution — deliberately pure, with no `next/headers` import, so the
 * same logic runs in `proxy.ts`, in server components and in tests.
 */

export const THEME_COOKIE = "portfolio-theme";
export const THEME_QUERY_PARAM = "theme";

/** One year — the selection is a preference, not a session (theme.md §4). */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Returns null for anything unrecognised, so callers fall back explicitly. */
export function parseTheme(value: string | null | undefined): ThemeId | null {
  return isThemeId(value) ? value : null;
}

/**
 * theme.md §3 priority: URL parameter → persisted cookie → default.
 *
 * System preference is intentionally NOT a step here. `prefers-color-scheme`
 * says light or dark; it does not say "Terminal". Dropping a visitor into a
 * different theme because their OS is dark would be surprising, so the
 * preference selects a light/dark variant within a theme instead
 * (see ARCHITECTURE.md). Documented as an assumption, cheap to revisit.
 *
 * An unrecognised value at any step falls through to editorial (theme.md §15)
 * rather than erroring — a bad `?theme=` in a shared link must never break the
 * portfolio.
 */
export function resolveTheme(input: {
  param?: string | null;
  cookie?: string | null;
}): ThemeId {
  return parseTheme(input.param) ?? parseTheme(input.cookie) ?? DEFAULT_THEME;
}
