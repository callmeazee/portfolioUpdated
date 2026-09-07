"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Per-viewer UI conveniences — sidebar width, window geometry, last-open panel.
 *
 * Strictly presentation state. Portfolio content never lives here; the content
 * layer is the only source of truth for what the site says.
 *
 * Modelled with `useSyncExternalStore` rather than an effect that calls
 * `setState`: storage genuinely is external state, so this is the API for it,
 * and it avoids the extra render (and hydration desync) an effect would cause.
 *
 * An in-memory map is the read source, with `localStorage` as best-effort
 * durability behind it. That ordering matters — `localStorage` throws outright
 * in private windows and when site data is blocked, and a remembered sidebar
 * width is never worth breaking a render over. When storage is unavailable the
 * UI still responds; the preference just does not survive a reload.
 */

const memory = new Map<string, unknown>();
const listeners = new Set<() => void>();

const CHANGE_EVENT = "portfolio:ui-state";

function readThrough<T>(key: string, fallback: T): T {
  if (!memory.has(key)) {
    let value = fallback;

    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) value = JSON.parse(stored) as T;
    } catch {
      /* Unavailable or corrupt — the default stands. */
    }

    /*
     * Seeded once so `getSnapshot` returns a stable reference. Returning a
     * fresh object each call would loop the store forever.
     */
    memory.set(key, value);
  }

  return memory.get(key) as T;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  /* `storage` fires for other tabs; the custom event covers this one. */
  const onExternal = () => {
    memory.clear();
    onChange();
  };

  window.addEventListener("storage", onExternal);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onExternal);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function usePersistentUi<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => readThrough(key, fallback),
    /* The server has no storage; first paint uses the default and corrects. */
    () => fallback,
  );

  const update = useCallback((next: T) => {
    memory.set(key, next);

    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* Non-durable, but the value still applies for this session. */
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [key]);

  return [value, update] as const;
}
