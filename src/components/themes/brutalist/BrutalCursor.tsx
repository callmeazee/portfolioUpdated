"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

import { useReducedMotion } from "@/themes/runtime/use-reduced-motion";

/**
 * A cursor-following block — theme.md §8.3 allows "cursor interactions where
 * useful", and this is the theme's signature flourish.
 *
 * Honest decoration rather than fake functionality: it is `aria-hidden`,
 * `pointer-events: none`, and nothing depends on it. It is skipped entirely
 * under `prefers-reduced-motion` and on coarse pointers, where a cursor
 * follower is meaningless and would only cost battery.
 *
 * Driven by motion values, so pointer movement never triggers a React render.
 */
export function BrutalCursor() {
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 28, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 400, damping: 28, mass: 0.3 });

  useEffect(() => {
    if (reducedMotion) return;
    /* Coarse pointers have no cursor to follow. */
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, x, y]);

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed top-0 left-0 z-50 hidden size-6 -translate-x-1/2 -translate-y-1/2 border-2 border-foreground bg-accent mix-blend-multiply [@media(pointer:fine)]:block"
    />
  );
}
