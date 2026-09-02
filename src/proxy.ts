import { NextResponse, type NextRequest } from "next/server";

import { parseTheme, THEME_COOKIE, THEME_COOKIE_MAX_AGE, THEME_QUERY_PARAM } from "@/themes/resolve";

/**
 * Applies the `?theme=` step of the resolution priority (theme.md §3).
 *
 * This exists because layouts do not receive `searchParams` — only pages do —
 * so the root layout cannot see the parameter that is supposed to outrank the
 * cookie. The proxy runs before rendering, so it can translate the parameter
 * into a cookie the layout will read.
 *
 * Two writes, for two different jobs:
 *   1. `request.cookies.set` + forwarding the headers, so THIS render already
 *      sees the theme. Without it a shared `?theme=terminal` link would render
 *      editorial once and only switch on the next navigation.
 *   2. `response.cookies.set`, so the choice persists afterwards (theme.md §4).
 *
 * An unrecognised value is ignored rather than rejected, leaving the cookie or
 * the editorial default in place — a bad link must never break the portfolio
 * (theme.md §15).
 */
export function proxy(request: NextRequest) {
  const theme = parseTheme(request.nextUrl.searchParams.get(THEME_QUERY_PARAM));

  if (!theme) {
    return NextResponse.next();
  }

  request.cookies.set(THEME_COOKIE, theme);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  response.cookies.set({
    name: THEME_COOKIE,
    value: theme,
    path: "/",
    maxAge: THEME_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  /*
   * Skip Next internals, the API and the OG card. Without a matcher the proxy
   * would also run for every static asset and image request.
   */
  matcher: ["/((?!_next/static|_next/image|api|og|favicon.ico|.*\\.svg$).*)"],
};
