"use server";

import { cookies } from "next/headers";

import { isThemeId } from "./registry";
import { THEME_COOKIE, THEME_COOKIE_MAX_AGE } from "./resolve";
import type { ThemeId } from "@/types/theme";

/**
 * Persists the theme selection.
 *
 * A Server Action rather than a `document.cookie` write on the client: the
 * cookie is set with proper attributes by the same runtime that reads it, the
 * switcher stays free of DOM mutation, and Next revalidates the current route
 * once the action resolves — which is exactly the re-render ADR-007 wants.
 *
 * The ID is re-validated here because a Server Action is a public endpoint; an
 * unrecognised value is ignored rather than written through.
 */
export async function setThemePreference(id: ThemeId): Promise<void> {
  if (!isThemeId(id)) return;

  const store = await cookies();

  store.set(THEME_COOKIE, id, {
    path: "/",
    maxAge: THEME_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
