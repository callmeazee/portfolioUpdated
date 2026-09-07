"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { useWindowManager } from "@/themes/runtime/window-manager";
import { useReducedMotion } from "@/themes/runtime/use-reduced-motion";

/**
 * The dock, with genuine cursor magnification.
 *
 * Driven by motion values rather than React state: a pointermove handler that
 * called `setState` would re-render every item on every frame. `useMotionValue`
 * writes straight to the DOM, so magnification costs no renders at all.
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

function DockButton({
  item,
  mouseX,
  isRunning,
  isMinimized,
  reducedMotion,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  isRunning: boolean;
  isMinimized: boolean;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);

  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return INFLUENCE;
    return x - (box.left + box.width / 2);
  });

  const target = useTransform(distance, [-INFLUENCE, 0, INFLUENCE], [BASE_SIZE, MAX_SIZE, BASE_SIZE], {
    clamp: true,
  });
  const size = useSpring(target, { stiffness: 320, damping: 22, mass: 0.4 });

  const content = (
    <>
      <span aria-hidden="true" className="grid size-full place-items-center">
        {item.icon}
      </span>
      {/* Tooltip is decorative; the accessible name comes from the label below. */}
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
    <motion.li
      ref={ref}
      style={reducedMotion ? { width: BASE_SIZE, height: BASE_SIZE } : { width: size, height: size }}
      className="group relative flex items-end justify-center"
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
    </motion.li>
  );
}

export function MacDock({ items }: { items: DockItem[] }) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const manager = useWindowManager();
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  return (
    /*
     * In normal flow rather than floating over the desktop. macOS lets windows
     * slide under the dock, but here that hid the bottom of the page content —
     * an authenticity detail is not worth making content unreachable.
     */
    <nav aria-label="Dock" className="z-40 flex shrink-0 justify-center p-sm">
      <ul
        onPointerMove={(event) => mouseX.set(event.clientX)}
        onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        /*
         * Nine items cannot fit 360px. The dock scrolls inside itself rather
         * than overflowing the page, so mobile keeps every destination instead
         * of hiding some (theme.md §12 wants a deliberate mobile design, not a
         * truncated desktop one).
         */
        className="flex max-w-[calc(100vw-1.5rem)] items-end gap-sm overflow-x-auto overscroll-x-contain rounded-lg border border-border bg-surface/85 px-sm py-sm backdrop-blur"
      >
        {items.map((item) => {
          const window = manager.windows.find((w) => w.id === item.id);
          return (
            <DockButton
              key={item.id}
              item={item}
              mouseX={mouseX}
              isRunning={window !== undefined || item.href === pathname}
              isMinimized={window?.minimized ?? false}
              reducedMotion={reducedMotion}
            />
          );
        })}
      </ul>
    </nav>
  );
}
