"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Pointer-driven drag, hand-rolled.
 *
 * A drag library would be dead weight here: Pointer Events already unify mouse,
 * touch and pen, and `setPointerCapture` keeps events flowing to the handle
 * even when the pointer outruns it — the one thing naive drag code gets wrong.
 *
 * ACCESSIBILITY: dragging is an enhancement, never a requirement (README §14).
 * Window position and sidebar width are conveniences; every window control and
 * every destination stays reachable from the keyboard without dragging at all.
 */

export interface DragDelta {
  dx: number;
  dy: number;
}

/**
 * Drag handles frequently contain controls — a window title bar holds the
 * traffic lights. Starting a drag there calls `preventDefault`, which suppresses
 * the click that follows, leaving the button visibly present but dead. Gestures
 * beginning on an interactive element are therefore ignored.
 */
const INTERACTIVE = "a, button, input, select, textarea, summary, label, [role='button']";

export function useDragGesture(handlers: {
  onDragStart?: () => void;
  onDrag: (delta: DragDelta) => void;
  onDragEnd?: () => void;
  disabled?: boolean;
}) {
  /*
   * The returned handlers are stable (`useCallback` with no deps) so that
   * attaching them never re-subscribes mid-gesture. They read the caller's
   * callbacks through this ref to avoid capturing a stale closure.
   *
   * Updated in an effect rather than during render: mutating a ref while
   * rendering is unsafe under concurrent rendering, and the initial value
   * already covers the first paint.
   */
  const latest = useRef(handlers);
  useEffect(() => {
    latest.current = handlers;
  });

  const origin = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    /* Primary button only — right-click must not start a drag. */
    if (latest.current.disabled || event.button !== 0) return;
    if ((event.target as HTMLElement).closest(INTERACTIVE)) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    origin.current = { x: event.clientX, y: event.clientY };
    latest.current.onDragStart?.();
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (origin.current === null) return;

    latest.current.onDrag({
      dx: event.clientX - origin.current.x,
      dy: event.clientY - origin.current.y,
    });
    origin.current = { x: event.clientX, y: event.clientY };
  }, []);

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (origin.current === null) return;

    origin.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    latest.current.onDragEnd?.();
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    /* Cancel fires when the browser steals the gesture (e.g. a system swipe). */
    onPointerCancel: onPointerUp,
  };
}
