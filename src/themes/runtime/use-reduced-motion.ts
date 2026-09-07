"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const list = window.matchMedia(QUERY);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

/**
 * CSS already neutralises animation globally under `prefers-reduced-motion`
 * (see globals.css). This is for the cases CSS cannot reach: JavaScript-driven
 * motion such as dock magnification, spring physics and genie transforms, which
 * must not merely run faster but not run at all (README §22, design.md §17).
 *
 * The server snapshot is `false` so the markup matches on first paint; it
 * corrects itself immediately after hydration.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
