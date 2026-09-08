import type { Metadata } from "next";

import {
  contact,
  education,
  experience,
  getAllProjects,
  profile,
  skills,
} from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = createSeoMetadata({
  title: "Résumé",
  description: `Résumé of ${profile.fullName}, ${profile.title}.`,
  canonicalPath: "/resume",
});

/**
 * content.md §37 — the résumé must be reachable from every theme.
 *
 * Rendered from the canonical content layer rather than linking a PDF that is
 * not in the repository. That keeps it in step with the rest of the site by
 * construction: there is no second copy to fall out of date, and it is
 * printable, linkable and readable by a screen reader, which a PDF is not.
 *
 * A downloadable PDF is still offered when `contact.resume.url` is set.
 */
export default async function ResumePage() {
  const { Page, Section, DefinitionList, Empty, Action } = await getPageKit();

  /* Only projects that say something concrete belong on a résumé. */
  const projects = getAllProjects().filter((project) => project.shortDescription !== null);

  const links = [
    contact.email ? { term: "Email", description: contact.email } : null,
    contact.github.status === "available"
      ? { term: "GitHub", description: contact.github.url.replace(/^https?:\/\//, "") }
      : null,
    contact.linkedin.status === "available"
      ? { term: "LinkedIn", description: contact.linkedin.url.replace(/^https?:\/\//, "") }
      : null,
    profile.location ? { term: "Location", description: profile.location } : null,
  ].filter((entry) => entry !== null);

  return (
    <Page title="Résumé" intro={profile.shortBio ?? undefined}>
      {contact.resume.url ? (
        <p className="mt-lg">
          <Action href={contact.resume.url} external>
            Download {contact.resume.label} (PDF)
          </Action>
        </p>
      ) : null}

      <Section id="contact" title="Contact" compact={links.length === 0}>
        {links.length === 0 ? (
          <Empty>Contact details pending.</Empty>
        ) : (
          <DefinitionList items={links} />
        )}
      </Section>

      <Section id="experience" title="Experience" compact={experience.length === 0}>
        {experience.length === 0 ? (
          <Empty>Experience details pending.</Empty>
        ) : (
          <DefinitionList
            items={experience.map((entry) => ({
              term: `${entry.startDate} – ${entry.endDate}`,
              description: (
                <span>
                  <strong>{entry.role}</strong>, {entry.company}
                  {entry.responsibilities.length > 0 ? (
                    <ul className="mt-xs grid gap-xs">
                      {entry.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </span>
              ),
            }))}
          />
        )}
      </Section>

      <Section id="skills" title="Skills" compact={skills.length === 0}>
        {skills.length === 0 ? (
          <Empty>Skills pending.</Empty>
        ) : (
          /* Grouped, never rated (README §30 rule 15). */
          <DefinitionList
            items={skills.map((group) => ({
              term: group.group,
              description: group.items.join(", "),
            }))}
          />
        )}
      </Section>

      <Section id="projects" title="Projects" compact={projects.length === 0}>
        {projects.length === 0 ? (
          <Empty>Projects pending.</Empty>
        ) : (
          <DefinitionList
            items={projects.map((project) => ({
              term: project.title,
              description: (
                <span>
                  {project.shortDescription}
                  {project.technologies.length > 0 ? (
                    <span className="mt-xs block text-body-s text-muted">
                      {project.technologies.flatMap((group) => group.items).join(" · ")}
                    </span>
                  ) : null}
                  {project.links.live.status === "available" ? (
                    <span className="mt-xs block text-body-s">
                      <a href={project.links.live.url} target="_blank" rel="noreferrer noopener">
                        {project.links.live.url.replace(/^https?:\/\//, "")}
                      </a>
                    </span>
                  ) : null}
                </span>
              ),
            }))}
          />
        )}
      </Section>

      <Section id="education" title="Education" compact={education.length === 0}>
        {education.length === 0 ? (
          <Empty>Education pending.</Empty>
        ) : (
          <DefinitionList
            items={education.map((entry) => ({
              term: String(entry.endYear),
              description: `${entry.degree} (${entry.field}), ${entry.institution}`,
            }))}
          />
        )}
      </Section>
    </Page>
  );
}
