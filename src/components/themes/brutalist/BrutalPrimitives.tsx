import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The brutalist physical primitives.
 *
 * Deliberately CSS-only — the press, the hard-shadow collapse and the offset
 * hover are all `:active`/`:hover` state, so they cost zero JavaScript and work
 * before hydration. design.md §20 asks for thick borders, hard shadows and
 * offset hover; none of that needs a runtime.
 *
 * The displacement is a real 4px translate paired with the shadow collapsing,
 * so the element genuinely appears to be pressed into the page rather than
 * merely darkening.
 */

const PRESS =
  "border-2 border-foreground shadow-(--shadow-md) transition-[transform,box-shadow] duration-(--duration-fast) " +
  "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-(--shadow-lg) " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none " +
  "motion-reduce:transform-none motion-reduce:transition-none";

export function BrutalButton({
  href,
  children,
  external = false,
  tone = "default",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  tone?: "default" | "accent";
}) {
  const className = [
    PRESS,
    "inline-block px-md py-sm text-body-m font-bold uppercase tracking-[0.04em]",
    tone === "accent" ? "bg-accent text-accent-foreground" : "bg-surface text-foreground",
  ].join(" ");

  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** A poster-like block (design.md §25 — the brutalist project card). */
export function BrutalBlock({
  children,
  className = "",
  tone = "surface",
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "secondary" | "accent";
}) {
  const background =
    tone === "accent"
      ? "bg-accent text-accent-foreground"
      : tone === "secondary"
        ? "bg-surface-secondary"
        : "bg-surface";

  return (
    <div className={`border-2 border-foreground ${background} ${className}`}>{children}</div>
  );
}

/** Oversized section label — design.md §20's "bold labels". */
export function BrutalLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border-2 border-foreground bg-foreground px-sm py-0 text-caption font-bold tracking-[0.14em] text-background uppercase">
      {children}
    </span>
  );
}

export function BrutalEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="border-2 border-dashed border-foreground p-md text-body-m font-medium">
      {children}
    </div>
  );
}
