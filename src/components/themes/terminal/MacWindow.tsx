"use client";

import { useRef, type ReactNode } from "react";

import { useWindowManager } from "@/themes/runtime/window-manager";
import { useDragGesture } from "@/themes/runtime/use-drag";
import { useReducedMotion } from "@/themes/runtime/use-reduced-motion";
import { MIN_HEIGHT, MIN_WIDTH, type WindowState } from "@/themes/runtime/window-state";

/**
 * A macOS window with controls that do real work (design.md §19 — traffic
 * lights are decorative only if they perform no function; here they perform).
 *
 * ACCESSIBILITY
 * - The controls are real `<button>`s with explicit labels, not styled divs.
 * - Dragging and resizing are pointer enhancements. Window position is
 *   decorative: nothing is unreachable without a mouse, and the resize grip is
 *   `aria-hidden` because there is nothing to do with it from the keyboard.
 * - Minimized state is exposed through the dock button's `aria-expanded`.
 * - A minimized window is unmounted from the accessibility tree entirely rather
 *   than merely hidden, so a screen reader never walks invisible content.
 */
export function MacWindow({
  window: state,
  children,
  onClose,
  toolbar,
}: {
  window: WindowState;
  children: ReactNode;
  /** Omitted for the routed window, which has nowhere to close to. */
  onClose?: () => void;
  toolbar?: ReactNode;
}) {
  const manager = useWindowManager();
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const isFocused = manager.focusedId === state.id;

  /** Seeds pixel geometry from the rendered rect the first time it is needed. */
  function currentRect() {
    if (state.geometry) return state.geometry;
    const box = ref.current?.getBoundingClientRect();
    return box
      ? { x: box.left, y: box.top, width: box.width, height: box.height }
      : { x: 40, y: 60, width: MIN_WIDTH, height: MIN_HEIGHT };
  }

  const drag = useDragGesture({
    onDragStart: () => manager.focus(state.id),
    onDrag: ({ dx, dy }) => {
      const rect = currentRect();
      manager.dispatch({
        type: "setGeometry",
        id: state.id,
        geometry: { ...rect, x: rect.x + dx, y: rect.y + dy },
      });
    },
  });

  const resize = useDragGesture({
    onDragStart: () => manager.focus(state.id),
    onDrag: ({ dx, dy }) => {
      const rect = currentRect();
      manager.dispatch({
        type: "setGeometry",
        id: state.id,
        geometry: { ...rect, width: rect.width + dx, height: rect.height + dy },
      });
    },
  });

  if (state.minimized) return null;

  const positioned = state.geometry !== null;

  return (
    <section
      ref={ref}
      aria-label={`${state.title} window`}
      onPointerDownCapture={() => manager.focus(state.id)}
      style={{
        zIndex: state.z,
        ...(positioned
          ? {
              position: "absolute" as const,
              left: state.geometry!.x,
              top: state.geometry!.y,
              width: state.geometry!.width,
              height: state.geometry!.height,
            }
          : undefined),
      }}
      className={[
        "flex flex-col overflow-hidden border bg-surface sm:rounded-lg",
        /* Until dragged, the window is CSS-placed — no measuring, no hydration desync. */
        positioned ? "" : "absolute inset-0 sm:inset-md",
        isFocused ? "border-border-strong shadow-(--shadow-lg)" : "border-border opacity-95",
        reducedMotion ? "" : "transition-[opacity,border-color] duration-(--duration-fast)",
      ].join(" ")}
    >
      {/*
        MOBILE (theme.md §12): the desktop metaphor does not survive 360px, so
        windows go full-screen and the title bar stops being a drag handle —
        `touch-none` there would swallow scrolling on a touch device.
      */}
      <header
        {...drag}
        className="flex shrink-0 items-center gap-sm border-b border-border bg-surface-secondary px-md py-sm sm:cursor-grab sm:touch-none sm:active:cursor-grabbing"
      >
        <span className="flex shrink-0 gap-xs">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${state.title}`}
              className="size-[0.8rem] rounded-full bg-danger transition-transform hover:scale-110"
            />
          ) : (
            /* The routed window cannot close — showing an inert control would be
               a fake interaction (CLAUDE.md §39), so it is dimmed and disabled. */
            <span
              aria-hidden="true"
              title="The main window cannot be closed"
              className="size-[0.8rem] rounded-full bg-border-strong"
            />
          )}

          <button
            type="button"
            onClick={() => manager.minimize(state.id)}
            aria-label={`Minimize ${state.title}`}
            className="size-[0.8rem] rounded-full bg-warning transition-transform hover:scale-110"
          />

          <button
            type="button"
            onClick={() => {
              const desktop = ref.current?.parentElement?.getBoundingClientRect();
              manager.toggleZoom(state.id, {
                x: 0,
                y: 0,
                width: desktop?.width ?? 0,
                height: desktop?.height ?? 0,
              });
            }}
            aria-label={state.zoomed ? `Restore ${state.title}` : `Zoom ${state.title}`}
            aria-pressed={state.zoomed}
            className="size-[0.8rem] rounded-full bg-success transition-transform hover:scale-110"
          />
        </span>

        <p className="min-w-0 flex-1 truncate text-center font-mono text-caption text-muted">
          {state.title}
        </p>

        <span className="flex shrink-0 items-center gap-sm">{toolbar}</span>
      </header>

      {/*
        `tabIndex={0}` so the window body can be scrolled from the keyboard.
        axe flagged this (scrollable-region-focusable, WCAG 2.1.1) once real
        content made /engineering overflow: that page has no links, so a
        keyboard user had nothing to focus and no way to reach the bottom.
      */}
      <div tabIndex={0} className="min-h-0 flex-1 overflow-auto">
        {children}
      </div>

      {/* Pointer-only affordance; every function remains keyboard reachable. */}
      <span
        {...resize}
        aria-hidden="true"
        className="absolute right-0 bottom-0 hidden size-4 cursor-nwse-resize touch-none sm:block"
      />
    </section>
  );
}
