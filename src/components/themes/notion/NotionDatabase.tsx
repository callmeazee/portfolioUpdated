"use client";

import Link from "next/link";
import { Columns3, LayoutGrid, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

import type { Project } from "@/types/content";

import { NotionTag } from "./NotionBlocks";

/**
 * The projects database — Notion's Table, Board and Gallery views over the real
 * content layer, with filtering and sorting that genuinely filter and sort.
 *
 * This is the theme's strongest claim to being a workspace rather than a
 * lookalike: the views operate on the same canonical records every other theme
 * renders, so nothing here is a mock-up.
 */

type View = "table" | "board" | "gallery";
type SortKey = "order" | "title" | "category";

const VIEWS: Array<{ id: View; label: string; icon: typeof Table2 }> = [
  { id: "table", label: "Table", icon: Table2 },
  { id: "board", label: "Board", icon: Columns3 },
  { id: "gallery", label: "Gallery", icon: LayoutGrid },
];

/** Null status is shown as "Pending" — an honest gap, not an invented value. */
function statusOf(project: Project) {
  return project.status ?? "Pending";
}

export function NotionDatabase({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<View>("table");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("order");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const rows = useMemo(() => {
    const filtered =
      category === "all" ? projects : projects.filter((p) => p.category === category);

    return [...filtered].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "category") return a.category.localeCompare(b.category);
      return a.order - b.order;
    });
  }, [projects, category, sort]);

  const groups = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const project of rows) {
      const key = statusOf(project);
      map.set(key, [...(map.get(key) ?? []), project]);
    }
    return [...map.entries()];
  }, [rows]);

  return (
    <section aria-labelledby="database" className="my-lg">
      <h2 id="database" className="sr-only">
        Projects database
      </h2>

      <div className="flex flex-wrap items-center gap-md border-b border-border pb-xs">
        <div role="tablist" aria-label="Database view" className="flex gap-xs">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={`flex items-center gap-xs rounded-sm px-sm py-xs text-body-s ${
                view === id
                  ? "bg-surface-secondary text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-sm text-body-s">
          <label className="flex items-center gap-xs text-muted">
            Filter
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-sm border border-border bg-surface px-xs py-0 text-foreground"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All types" : option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-xs text-muted">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="rounded-sm border border-border bg-surface px-xs py-0 text-foreground"
            >
              <option value="order">Manual</option>
              <option value="title">Name</option>
              <option value="category">Type</option>
            </select>
          </label>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {rows.length} projects shown
      </p>

      {rows.length === 0 ? (
        <p className="py-lg text-body-m text-muted italic">No projects match this filter.</p>
      ) : view === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-body-s">
            <thead>
              <tr className="text-muted">
                {["Name", "Type", "Status", "Year"].map((heading) => (
                  <th key={heading} scope="col" className="py-xs pr-md text-left font-normal">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((project) => (
                <tr key={project.slug} className="border-t border-border hover:bg-surface-secondary">
                  <td className="py-sm pr-md">
                    <Link href={`/projects/${project.slug}`} className="font-medium hover:underline">
                      {project.title}
                    </Link>
                  </td>
                  <td className="py-sm pr-md">
                    <NotionTag>{project.category}</NotionTag>
                  </td>
                  <td className="py-sm pr-md">
                    <NotionTag>{statusOf(project)}</NotionTag>
                  </td>
                  <td className="py-sm pr-md text-muted">{project.year ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : view === "board" ? (
        <div className="flex gap-md overflow-x-auto py-md">
          {groups.map(([status, items]) => (
            <div key={status} className="w-[16rem] shrink-0">
              <h3 className="flex items-center gap-xs pb-sm text-body-s text-muted">
                <NotionTag>{status}</NotionTag>
                <span>{items.length}</span>
              </h3>
              <ul className="grid gap-sm">
                {items.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="block rounded-md border border-border bg-surface p-sm shadow-(--shadow-sm) hover:border-border-strong"
                    >
                      <span className="text-body-m font-medium">{project.title}</span>
                      <span className="mt-xs block text-body-s text-muted">
                        {project.shortDescription ?? "Description pending"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid gap-md py-md sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="block h-full rounded-md border border-border bg-surface p-md hover:border-border-strong"
              >
                <span className="grid h-20 place-items-center rounded-sm bg-surface-secondary text-muted">
                  {/* No invented cover art — the record has no image yet. */}
                  <span className="text-body-s italic">No cover</span>
                </span>
                <span className="mt-sm block text-body-m font-medium">{project.title}</span>
                <span className="mt-xs block text-body-s text-muted">
                  {project.shortDescription ?? "Description pending"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
