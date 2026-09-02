import type { ReactNode } from "react";

/**
 * Neutral page frame shared by every route while the themes are built.
 *
 * Its job is structural, not visual: one `<main id="main">` landmark for the
 * skip link to target, and exactly one `<h1>` per page so the heading
 * hierarchy stays correct (README §14). The active theme's Layout supplies the
 * container and chrome around it.
 *
 * Still used by the routes Phase 4 did not theme (`/experience`,
 * `/engineering`, `/about`, `/notes`, `/contact`, `/resume`); those move into
 * the theme modules as the remaining themes land.
 */
export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <main id="main" className="py-xl">
      <h1 className="text-display-m font-display">{title}</h1>
      {intro ? <p className="mt-md max-w-[65ch] text-body-l text-muted">{intro}</p> : null}
      {children}
    </main>
  );
}

/** design.md §30 — every content section degrades to something meaningful. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="mt-lg max-w-[65ch] rounded-md border border-border bg-surface-secondary p-lg text-body-m text-muted italic">
      {children}
    </p>
  );
}
