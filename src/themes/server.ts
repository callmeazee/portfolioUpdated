import { cookies } from "next/headers";

import { getThemeConfig } from "./registry";
import { resolveTheme, THEME_COOKIE } from "./resolve";
import type { ThemeConfig, ThemeId } from "@/types/theme";

/**
 * Server-only: `next/headers` is unavailable in client components, so importing
 * this from one is a build error. (The `server-only` package would state that
 * intent more loudly, but it is not a dependency and is not worth adding one
 * for — the `cookies()` import already enforces it.)
 *
 * Reads the active theme on the server (ADR-007), so only the active theme's
 * tree is ever rendered and inactive themes' JavaScript never ships.
 *
 * The `?theme=` parameter is not read here — layouts do not receive
 * `searchParams`. `src/proxy.ts` handles that step by writing the parameter
 * into the request cookie before the render begins, which keeps this a single
 * cookie read at every call site.
 *
 * Reading a cookie opts routes into dynamic rendering. That is the accepted
 * cost of server-resolved themes.
 */
export async function getActiveThemeId(): Promise<ThemeId> {
  const store = await cookies();
  return resolveTheme({ cookie: store.get(THEME_COOKIE)?.value });
}

export async function getActiveTheme(): Promise<ThemeConfig> {
  return getThemeConfig(await getActiveThemeId());
}
