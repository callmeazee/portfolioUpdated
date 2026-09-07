import Link from "next/link";

import { ProjectImage } from "@/components/shared/ProjectImage";
import type { Project } from "@/types/content";

/**
 * design.md §6.4 / §18: projects read as editorial feature articles, not SaaS
 * cards — a large number, a large title, and a full-width hairline between
 * entries. No boxes, no shadows, no equal-height grid.
 */
export function EditorialSelectedWork({ projects }: { projects: Project[] }) {
  return (
    <section
      className={`editorial-in-view border-b border-border ${projects.length === 0 ? "py-xl" : "py-2xl"}`}
      aria-labelledby="selected-work"
    >
      <div className="flex items-baseline justify-between gap-md">
        <h2
          id="selected-work"
          className="font-mono text-caption tracking-[0.18em] text-muted uppercase"
        >
          Selected work
        </h2>
        <Link href="/projects" className="text-body-s text-muted hover:text-foreground">
          All projects →
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-lg text-body-m text-muted italic">No projects published yet.</p>
      ) : (
        <ol className="mt-lg">
          {projects.map((project) => (
            <li key={project.slug} className="group border-t border-border py-lg">
              <Link href={`/projects/${project.slug}`} className="block">
                <div className="grid gap-md lg:grid-cols-12">
                  <p className="font-mono text-body-s text-muted lg:col-span-1">
                    {String(project.order).padStart(2, "0")}
                  </p>

                  <div className="lg:col-span-7">
                    <h3 className="text-heading-xl font-display tracking-[-0.02em] transition-colors group-hover:text-accent">
                      {project.title}
                    </h3>
                    {project.shortDescription === null ? (
                      <p className="mt-sm max-w-[50ch] text-body-m text-muted italic">
                        Description pending.
                      </p>
                    ) : (
                      <p className="mt-sm max-w-[50ch] text-body-m text-muted">
                        {project.shortDescription}
                      </p>
                    )}
                  </div>

                  {project.media.hero ? (
                    <ProjectImage
                      asset={project.media.hero}
                      className="lg:col-span-7 lg:col-start-2"
                      sizes="(min-width: 1024px) 55vw, 100vw"
                    />
                  ) : null}

                  <div className="lg:col-span-3 lg:col-start-10">
                    <p className="font-mono text-micro tracking-[0.14em] text-muted uppercase">
                      {project.category}
                    </p>
                    {project.technologies.length === 0 ? (
                      <p className="mt-xs text-body-s text-muted italic">Stack pending.</p>
                    ) : (
                      <p className="mt-xs text-body-s text-muted">
                        {project.technologies.flatMap((g) => g.items).join(" · ")}
                      </p>
                    )}
                    <span className="mt-sm inline-block text-body-s group-hover:text-accent">
                      View case study →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
