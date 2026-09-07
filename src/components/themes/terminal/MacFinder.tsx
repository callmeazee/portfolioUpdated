"use client";

import Link from "next/link";
import { useState } from "react";

import type { Note, Project } from "@/types/content";

/**
 * A Finder-style browser over the real content layer.
 *
 * Client-rendered from static content (ADR-016), which costs nothing in SEO
 * because every item here also exists as a server-rendered route — the links
 * below are those routes.
 */
export function MacFinder({ projects, notes }: { projects: Project[]; notes: Note[] }) {
  const [folder, setFolder] = useState<"projects" | "notes">("projects");

  const items =
    folder === "projects"
      ? projects.map((project) => ({
          key: project.slug,
          href: `/projects/${project.slug}`,
          name: `${project.slug}`,
          kind: project.category,
          detail: project.shortDescription,
        }))
      : notes.map((note) => ({
          key: note.slug,
          href: `/notes/${note.slug}`,
          name: `${note.slug}.md`,
          kind: "Note",
          detail: note.summary,
        }));

  return (
    <div className="grid h-full grid-cols-[9rem_1fr]">
      <nav aria-label="Finder sidebar" className="border-r border-border p-sm">
        <ul className="grid gap-xs">
          {(["projects", "notes"] as const).map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => setFolder(name)}
                aria-current={folder === name ? "true" : undefined}
                className={`w-full rounded-sm px-sm py-xs text-left font-mono text-caption ${
                  folder === name
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="overflow-auto p-sm">
        {items.length === 0 ? (
          <p className="font-mono text-caption text-muted italic">This folder is empty.</p>
        ) : (
          <table className="w-full border-collapse font-mono text-caption">
            <thead>
              <tr className="text-muted">
                <th scope="col" className="py-xs text-left font-normal">
                  Name
                </th>
                <th scope="col" className="py-xs text-left font-normal">
                  Kind
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.key} className="border-t border-border hover:bg-surface-secondary">
                  <td className="py-xs">
                    <Link href={item.href} className="text-accent hover:underline">
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-xs text-muted">{item.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
