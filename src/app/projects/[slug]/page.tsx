import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProjectBySlug } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getThemeSections } from "@/themes/renderer";
import { getActiveThemeId } from "@/themes/server";

/*
 * No `generateStaticParams` — see the note in app/notes/[slug]/page.tsx. Under
 * ADR-007 every route is dynamic, so enumerating params buys nothing. The
 * content layer still guards against drift: `getProjectSlugs()` drives the
 * sitemap, and an unknown slug 404s below.
 */

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return createSeoMetadata({ title: "Project not found" });
  }

  /*
   * Per-project metadata (README §16). The description falls back to the site
   * default rather than being invented when the project has none yet.
   */
  return createSeoMetadata({
    title: `${project.title} — ${project.category}`,
    description: project.shortDescription ?? undefined,
    canonicalPath: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { ProjectDetail } = await getThemeSections(await getActiveThemeId());

  return <ProjectDetail project={project} />;
}
