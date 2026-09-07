import type { Metadata } from "next";

import { getAllProjects } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = createSeoMetadata({
  title: "Projects",
  description: "Selected engineering work by Azeez Ahmed Khan.",
  canonicalPath: "/projects",
});

export default async function ProjectsPage() {
  const { Page, Card, Empty } = await getPageKit();
  const projects = getAllProjects();

  return (
    <Page title="Projects">
      {projects.length === 0 ? (
        <Empty>No projects published yet.</Empty>
      ) : (
        <ul className="mt-lg">
          {projects.map((project) => (
            <Card
              key={project.slug}
              href={`/projects/${project.slug}`}
              eyebrow={project.slug}
              title={project.title}
              description={project.shortDescription}
              meta={project.category}
            />
          ))}
        </ul>
      )}
    </Page>
  );
}
