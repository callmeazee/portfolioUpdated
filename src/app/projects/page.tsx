import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState, PageShell } from "@/components/shared/PageShell";
import { getAllProjects } from "@/content";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Projects",
  description: "Selected engineering work by Azeez Ahmed Khan.",
  canonicalPath: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageShell title="Projects">
      {projects.length === 0 ? (
        <EmptyState>No projects published yet.</EmptyState>
      ) : (
        <ul className="mt-lg grid gap-md sm:grid-cols-2">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="rounded-md border border-border bg-surface p-lg shadow-(--shadow-sm)"
            >
              <p className="font-mono text-micro text-muted">
                {String(project.order).padStart(2, "0")} · {project.category}
              </p>
              <h2 className="mt-xs text-heading-s font-display">
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
              </h2>
              {project.shortDescription === null ? (
                <p className="mt-xs text-body-s text-muted italic">Description pending.</p>
              ) : (
                <p className="mt-xs text-body-s text-muted">{project.shortDescription}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
