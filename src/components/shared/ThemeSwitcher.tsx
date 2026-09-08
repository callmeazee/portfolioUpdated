"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { track } from "@/lib/analytics";
import { setThemePreference } from "@/themes/actions";
import { THEME_QUERY_PARAM } from "@/themes/resolve";
import type { ThemeConfig, ThemeId } from "@/types/theme";

/**
 * The shared theme-switching MECHANISM. Its presentation is neutral on purpose:
 * design.md §33 gives each theme its own switcher styling, which arrives with
 * that theme in Phases 4–7. The behaviour below stays shared (theme.md §18).
 *
 * Native radio inputs in a fieldset, rather than buttons with ARIA: arrow-key
 * navigation, grouping and the announced legend all come for free, and there is
 * no keyboard trap to get wrong (README §14).
 *
 * Switching persists the cookie through a Server Action and lets the server
 * re-render (ADR-007). The route, scroll position and client state all survive
 * because this is a refresh rather than a navigation, and `startTransition`
 * keeps the current UI interactive instead of blanking it while the new payload
 * arrives.
 */
export function ThemeSwitcher({
  themes,
  active,
  variant = "plain",
}: {
  themes: ThemeConfig[];
  active: ThemeId;
  /**
   * The mechanism is shared; the presentation belongs to the active theme
   * (theme.md §18). Editorial takes the "refined segmented control" design.md
   * §33 specifies. Terminal, Brutalist and Notion add their own in Phases 5–7.
   */
  variant?: "plain" | "segmented";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectTheme(id: ThemeId) {
    if (id === active) return;

    /* README §24 — which theme do visitors actually prefer? */
    track("theme_changed", { from: active, to: id });

    /*
     * A `?theme=` in the current URL outranks the cookie (theme.md §3), so
     * leaving it in place would make the proxy immediately overwrite the choice
     * just made. Strip it and the selection sticks.
     *
     * Read from `window.location` rather than `useSearchParams`, which would
     * pull this component into a Suspense boundary for no benefit.
     */
    const url = new URL(window.location.href);
    const hasThemeParam = url.searchParams.has(THEME_QUERY_PARAM);
    url.searchParams.delete(THEME_QUERY_PARAM);

    startTransition(async () => {
      await setThemePreference(id);

      if (hasThemeParam) {
        router.replace(`${url.pathname}${url.search}${url.hash}`);
      }
    });
  }

  return (
    <fieldset
      className={[
        "m-0 flex min-w-0 flex-wrap items-center border-0 p-0",
        variant === "segmented"
          ? "gap-0 overflow-hidden rounded-md border border-border"
          : "gap-xs",
      ].join(" ")}
      aria-busy={isPending}
    >
      <legend className="sr-only">Theme</legend>

      {themes.map((theme) => {
        const isActive = theme.id === active;

        return (
          <label
            key={theme.id}
            className={[
              "cursor-pointer px-sm py-xs text-caption transition-colors",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
              "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--color-accent)",
              variant === "segmented" ? "" : "rounded-sm border",
              isActive
                ? "bg-accent text-accent-foreground"
                : variant === "segmented"
                  ? "text-muted hover:text-foreground"
                  : "border-border text-muted hover:text-foreground",
            ].join(" ")}
          >
            <input
              type="radio"
              name="theme"
              value={theme.id}
              checked={isActive}
              onChange={() => selectTheme(theme.id)}
              className="sr-only"
            />
            {theme.name}
            <span className="sr-only"> — {theme.description}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
