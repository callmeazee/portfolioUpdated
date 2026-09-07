"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary (README §25 — the portfolio must degrade
 * gracefully; a failure must never make it unusable).
 *
 * Styled entirely with semantic tokens, so it inherits whichever theme is
 * active from `data-theme` on the document without needing to resolve the theme
 * itself — which matters, because theme resolution is one of the things that
 * could have failed to get here.
 *
 * `reset()` genuinely retries the segment, so "Try again" is a real control
 * rather than a decorative one (CLAUDE.md §39).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* Surfaced for diagnosis; the digest is what production logs correlate on. */
    console.error("Route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <main id="main" className="mx-auto w-full max-w-[var(--container-max)] px-md py-2xl">
      <h1 className="text-display-m font-display">Something went wrong</h1>

      <p className="mt-md max-w-[60ch] text-body-l text-muted">
        This page failed to load. The rest of the portfolio is unaffected — the navigation
        above still works.
      </p>

      <div className="mt-lg flex flex-wrap gap-sm">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent px-md py-sm text-body-s font-medium text-accent-foreground"
        >
          Try again
        </button>
        {/* The router still works for a route-level error, so use Link. */}
        <Link
          href="/"
          className="rounded-md border border-border px-md py-sm text-body-s font-medium"
        >
          Go home
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-lg font-mono text-caption text-muted">Reference: {error.digest}</p>
      ) : null}
    </main>
  );
}
