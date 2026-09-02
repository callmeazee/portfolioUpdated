import Link from "next/link";

import type { Profile } from "@/types/content";

/**
 * design.md §6.3: eyebrow → large name/role → positioning → CTAs.
 *
 * Explicitly NOT stuffed with skills, statistics, social icons, a long bio or
 * project cards — design.md names all five as things to keep out of the hero.
 *
 * The name is split across lines by hand rather than left to wrap, because the
 * line break is a compositional decision at this size, not an accident of
 * viewport width.
 */
export function EditorialHero({ profile }: { profile: Profile }) {
  const nameLines = profile.fullName.split(" ");

  return (
    <section className="border-b border-border py-2xl" aria-labelledby="hero-name">
      <div className="grid gap-lg lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="font-mono text-caption tracking-[0.18em] text-muted uppercase">
            {profile.title}
          </p>

          <h1
            id="hero-name"
            className="editorial-reveal mt-md text-display-l leading-[0.92] font-display tracking-[-0.03em]"
          >
            {nameLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {profile.positioning === null ? (
            <p className="mt-lg max-w-[42ch] text-body-l text-muted italic">
              Positioning statement pending.
            </p>
          ) : (
            <p className="mt-lg max-w-[42ch] text-body-l text-muted">{profile.positioning}</p>
          )}

          <div className="mt-lg flex flex-wrap gap-sm">
            <Link
              href="/projects"
              className="rounded-md bg-accent px-md py-sm text-body-s font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              View work
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-border px-md py-sm text-body-s font-medium transition-colors hover:border-border-strong"
            >
              About
            </Link>
          </div>
        </div>

        {/* Right rail — the asymmetry design.md §18 asks for, not a second column of prose. */}
        <dl className="self-end lg:col-span-3 lg:col-start-10">
          <dt className="font-mono text-micro tracking-[0.14em] text-muted uppercase">
            Available
          </dt>
          <dd className="mt-xs text-body-s">
            {profile.availability ?? <span className="text-muted italic">Pending</span>}
          </dd>

          <dt className="mt-md font-mono text-micro tracking-[0.14em] text-muted uppercase">
            Based in
          </dt>
          <dd className="mt-xs text-body-s">
            {profile.location ?? <span className="text-muted italic">Pending</span>}
          </dd>
        </dl>
      </div>
    </section>
  );
}
