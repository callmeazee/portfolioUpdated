"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/themes/runtime/use-reduced-motion";

/**
 * A cursor-following block — theme.md §8.3 allows "cursor interactions where
 * useful", and this is the theme's signature flourish.
 *
 * Hand-rolled rather than library-driven (ADR-017, revised): this is one lerp
 * in a rAF loop, and it did not justify ~39KB gzipped of animation runtime
 * shipped to every theme (ISS-027).
 *
 * Honest decoration rather than fake functionality: `aria-hidden`,
 * `pointer-events: none`, and nothing depends on it. Skipped entirely under
 * `prefers-reduced-motion` and on coarse pointers, where a cursor follower is
 * meaningless and would only cost battery.
 *
 * Position is written straight to the DOM, so pointer movement never triggers a
 * React render.
 */
export function BrutalCursor() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    /* Coarse pointers have no cursor to follow. */
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const element = ref.current;
    if (!element) return;

    let targetX = -100;
    let targetY = -100;
    let x = -100;
    let y = -100;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const tick = () => {
      /* Exponential smoothing — the trailing feel a spring would give. */
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 hidden size-6 border-2 border-foreground bg-accent mix-blend-multiply [@media(pointer:fine)]:block"
    />
  );
}
