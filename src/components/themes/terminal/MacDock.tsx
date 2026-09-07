"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef } from "react";

import { useWindowManager } from "@/themes/runtime/window-manager";
import { useReducedMotion } from "@/themes/runtime/use-reduced-motion";

/**
 * The dock, with genuine cursor magnification.
 *
 * Hand-rolled rather than library-driven (ADR-017, revised): magnification is
 * one distance calculation per item, and pulling in ~39KB gzipped of animation
 * runtime for it failed CLAUDE.md §35's cost test once measurement showed the
 * library shipped to all four themes rather than the two using it (ISS-027).
 *
 * Still zero React renders per frame — sizes are written straight to the DOM
 * inside a single rAF, and CSS smooths between them. Width and height are
 * animated rather than `transform: scale` so neighbours are pushed aside, which
 * is what makes the effect read as a dock rather than a zoom.
 *
 * ACCESSIBILITY: this is a real `<nav>` of real `<Link>`s — the same
 * destinations as the menu bar, reachable by Tab with no pointer needed.
 * Magnification is pure decoration and is skipped entirely under
 * `prefers-reduced-motion` (README §22).
 */

const BASE_SIZE = 44;
const MAX_SIZE = 68;
const INFLUENCE = 130;

export interface DockItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  /** Present for windows rather than routes — Finder, Terminal. */
  onActivate?: () => void;
}

export function MacDock({ items }: { items: DockItem[] }) {
  const manager = useWindowManager();
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  const listRef = useRef<HTMLUListElement>(null);
  const frame = useRef<number | null>(null);

  const resize = useCallback((pointerX: number | null) => {
    const list = listRef.current;
    if (!list) return;

    for (const item of list.querySelectorAll<HTMLElement>("[data-dock-item]")) {
      let size = BASE_SIZE;

      if (pointerX !== null) {
        const box = item.getBoundingClientRect();
        const distance = Math.abs(pointerX - (box.left + box.width / 2));
        /* Linear falloff to zero at the influence radius. */
        const proximity = Math.max(0, 1 - distance / INFLUENCE);
        size = BASE_SIZE + (MAX_SIZE - BASE_SIZE) * proximity;
      }

      item.style.width = `${size}px`;
      item.style.height = `${size}px`;
    }
  }, []);

  const schedule = useCallback(
    (pointerX: number | null) => {
      if (reducedMotion) return;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        resize(pointerX);
      });
    },
    [reducedMotion, resize],
  );

  return (
    /*
     * In normal flow rather than floating over the desktop. macOS lets windows
     * slide under the dock, but here that hid the bottom of the page content —
     * an authenticity detail is not worth making content unreachable.
     */
    <nav aria-label="Dock" className="z-40 flex shrink-0 justify-center p-sm">
      <ul
        ref={listRef}
        onPointerMove={(event) => schedule(event.clientX)}
        onPointerLeave={() => schedule(null)}
        className="flex max-w-[calc(100vw-1.5rem)] items-end gap-sm overflow-x-auto overscroll-x-contain rounded-lg border border-border bg-surface/85 px-sm py-sm backdrop-blur"
      >
        {items.map((item) => {
          const window = manager.windows.find((w) => w.id === item.id);
          const isRunning = window !== undefined || item.href === pathname;
          const isMinimized = window?.minimized ?? false;

          const content = (
            <>
              <span aria-hidden="true" className="grid size-full place-items-center">
                {item.icon}
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-sm border border-border bg-surface px-xs py-0 font-mono text-micro whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100"
              >
                {item.label}
              </span>
              <span className="sr-only">
                {item.label}
                {isMinimized ? " (minimized)" : ""}
              </span>
            </>
          );

          return (
            <li
              key={item.id}
              data-dock-item
              style={{ width: BASE_SIZE, height: BASE_SIZE }}
              className="group relative flex shrink-0 items-end justify-center transition-[width,height] duration-(--duration-fast) ease-out motion-reduce:transition-none"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="grid size-full place-items-center rounded-md border border-border bg-surface-secondary text-accent"
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.onActivate}
                  aria-label={item.label}
                  aria-expanded={isRunning ? !isMinimized : undefined}
                  className="grid size-full place-items-center rounded-md border border-border bg-surface-secondary text-accent"
                >
                  {content}
                </button>
              )}

              {/* Running indicator — reflects real window state, not decoration. */}
              <span
                aria-hidden="true"
                className={`absolute -bottom-2 size-1 rounded-full ${isRunning ? "bg-foreground" : "bg-transparent"}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
