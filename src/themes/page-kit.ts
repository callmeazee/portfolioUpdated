import { getThemeSections } from "./renderer";
import { getActiveThemeId } from "./server";
import type { ThemePageKit } from "@/types/views";

/**
 * Resolves the active theme's page primitives.
 *
 * Every generic route calls this, so `/experience` in the terminal theme is
 * rendered by the terminal's own primitives rather than a neutral shell that
 * merely inherits its chrome (ISS-016).
 */
export async function getPageKit(): Promise<ThemePageKit> {
  const { PageKit } = await getThemeSections(await getActiveThemeId());
  return PageKit;
}
