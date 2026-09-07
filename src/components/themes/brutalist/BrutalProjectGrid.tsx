"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project } from "@/types/content";

import { BrutalButton, BrutalEmpty, BrutalLabel } from "./BrutalPrimitives";

/**
 * Project filtering and sorting — the theme's real functionality, not
 * decoration. Chunky toggles operating on the canonical content layer.
 *
 * The grid is intentionally asymmetric (design.md §20): the first project spans
 * two columns. That asymmetry is FIXED, derived from the explicit `order`
 * field, never randomised — theme.md §8.5 requires intentional, not random.
 */

type SortKey = "order" | "title";

function statusOf(project: Project) {
  return project.status ?? "Pending";
}

export function BrutalProjectGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState<SortKey>("order");

  const categories = useMemo(
    () => ["ALL", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const visible = useMemo(() => {
    const filtered =
      category === "ALL" ? projects : projects.filter((p) => p.category === category);

    return [...filtered].sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : a.order - b.order,
    );
  }, [projects, category, sort]);

  return (
    <section aria-labelledby="work" className="border-b-2 border-foreground py-xl">
      <div className="flex flex-wrap items-center justify-between gap-md">
        <h2 id="work">
          <BrutalLabel>Selected work</BrutalLabel>
        </h2>

        <div className="flex flex-wrap items-center gap-sm">
          <fieldset className="flex flex-wrap items-center gap-xs border-0 p-0">
            <legend className="sr-only">Filter by type</legend>
            {categories.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                aria-pressed={category === option}
                className={`border-2 border-foreground px-sm py-xs text-caption font-bold uppercase transition-transform duration-(--duration-fast) active:translate-x-[2px] active:translate-y-[2px] motion-reduce:transform-none ${
                  category === option
                    ? "bg-foreground text-background"
                    : "bg-surface hover:bg-surface-secondary"
                }`}
              >
                {option}
              </button>
            ))}
          </fieldset>

          <label className="flex items-center gap-xs text-caption font-bold uppercase">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="border-2 border-foreground bg-surface px-xs py-xs font-bold uppercase"
            >
              <option value="order">Order</option>
              <option value="title">Name</option>
            </select>
          </label>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} projects shown
      </p>

      {visible.length === 0 ? (
        <div className="mt-lg">
          <BrutalEmpty>No projects match this filter.</BrutalEmpty>
        </div>
      ) : (
        <ul className="mt-lg grid gap-md md:grid-cols-2">
          {visible.map((project, index) => (
            <li
              key={project.slug}
              /* Fixed asymmetry: the lead project takes the full width. */
              className={index === 0 ? "md:col-span-2" : ""}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group block h-full border-2 border-foreground bg-surface p-md shadow-(--shadow-md) transition-[transform,box-shadow] duration-(--duration-fast) hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-(--shadow-lg) active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span className="flex items-start justify-between gap-md">
                  <span className="font-mono text-body-s font-bold">
                    {String(project.order).padStart(2, "0")}
                  </span>
                  <span className="border-2 border-foreground px-xs py-0 text-micro font-bold uppercase">
                    {statusOf(project)}
                  </span>
                </span>

                <span
                  className={`mt-sm block font-display font-bold uppercase ${
                    index === 0 ? "text-display-m" : "text-heading-l"
                  } leading-[0.95] tracking-[-0.02em]`}
                >
                  {project.title}
                </span>

                <span className="mt-sm block text-body-m">
                  {project.shortDescription ?? (
                    <em className="text-muted">Description pending.</em>
                  )}
                </span>

                <span className="mt-md inline-block border-b-2 border-foreground text-body-s font-bold uppercase">
                  Open project →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Only the featured projects are shown above (README §30 rule 14). */}
      <p className="mt-lg">
        <BrutalButton href="/projects">View all projects →</BrutalButton>
      </p>
    </section>
  );
}
