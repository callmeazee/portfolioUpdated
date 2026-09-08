import type { CaseStudy, TechnicalSection } from "@/types/content";
import type { ProjectViewProps } from "@/types/views";

import { ArchitectureDiagram } from "@/components/shared/ArchitectureDiagram";
import { ProjectImage } from "@/components/shared/ProjectImage";

import { NotionCallout, NotionProperties, NotionTag, NotionToggle } from "./NotionBlocks";
import { NotionDocument, NotionHeading } from "./NotionPage";

/**
 * The case study as a Notion page: properties at the top, then the sections in
 * the order design.md §26 fixes, with the deep technical detail behind toggles
 * — which is exactly the progressive disclosure design.md §2.3 asks for.
 *
 * Every section is conditional, so a thin record yields a short honest page
 * rather than a scaffold of empty headings (CLAUDE.md §37).
 */

function Technical({ name, section }: { name: string; section: TechnicalSection | null }) {
  if (section === null) return null;

  return (
    <NotionToggle summary={name}>
      <p className="text-body-m leading-[1.75]">{section.summary}</p>
      {section.points.length > 0 ? (
        <ul className="mt-sm grid gap-xs pl-md text-body-m text-muted">
          {section.points.map((point) => (
            <li key={point} className="list-disc">
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </NotionToggle>
  );
}

function Prose({ id, title, paragraphs }: { id: string; title: string; paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;

  return (
    <section aria-labelledby={id}>
      <NotionHeading id={id}>{title}</NotionHeading>
      <div className="grid gap-md">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-body-m leading-[1.75]">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function CaseStudyBody({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <>
      <Prose id="overview" title="Overview" paragraphs={caseStudy.overview} />
      <Prose id="problem" title="Problem" paragraphs={caseStudy.problem} />
      <Prose id="solution" title="Solution" paragraphs={caseStudy.solution} />

      {caseStudy.features.length > 0 ? (
        <section aria-labelledby="features">
          <NotionHeading id="features">Features</NotionHeading>
          <ul className="grid gap-xs pl-md text-body-m">
            {caseStudy.features.map((feature) => (
              <li key={feature} className="list-disc">
                {feature}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="technical">
        <NotionHeading id="technical">Technical detail</NotionHeading>
        <Technical name="Architecture" section={caseStudy.architecture} />
        {caseStudy.diagram ? <ArchitectureDiagram diagram={caseStudy.diagram} /> : null}
        <Technical name="Frontend" section={caseStudy.frontend} />
        <Technical name="Backend" section={caseStudy.backend} />
        <Technical name="Database" section={caseStudy.database} />
        <Technical name="Real-time" section={caseStudy.realtime} />
        <Technical name="Infrastructure" section={caseStudy.infrastructure} />
        <Technical name="Security" section={caseStudy.security} />
      </section>

      {caseStudy.challenges.length > 0 ? (
        <section aria-labelledby="challenges">
          <NotionHeading id="challenges">Challenges</NotionHeading>
          {caseStudy.challenges.map((challenge) => (
            <NotionToggle key={challenge.title} summary={challenge.title}>
              <p className="text-body-m leading-[1.75]">{challenge.problem}</p>
              {challenge.approach ? (
                <p className="mt-sm text-body-m text-muted">{challenge.approach}</p>
              ) : null}
              {challenge.result ? <p className="mt-sm text-body-m">{challenge.result}</p> : null}
            </NotionToggle>
          ))}
        </section>
      ) : null}

      <section aria-labelledby="performance">
        <NotionHeading id="performance">Performance</NotionHeading>
        {caseStudy.performance.measured ? (
          <NotionProperties
            items={caseStudy.performance.metrics.map((metric) => ({
              label: metric.label,
              value: metric.value,
            }))}
          />
        ) : (
          /* content.md §20 — stated, never guessed. */
          <NotionCallout>Not measured yet.</NotionCallout>
        )}
      </section>

      {caseStudy.learnings.length > 0 ? (
        <section aria-labelledby="learnings">
          <NotionHeading id="learnings">Learnings</NotionHeading>
          <ul className="grid gap-xs pl-md text-body-m">
            {caseStudy.learnings.map((learning) => (
              <li key={learning} className="list-disc">
                {learning}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

export function NotionProjectDetail({ project }: ProjectViewProps) {
  const pending = <span className="text-muted italic">Pending</span>;

  const links = [
    { label: "Live", link: project.links.live },
    { label: "Source", link: project.links.repository },
  ];

  return (
    <NotionDocument icon="🗂" title={project.title} description={project.shortDescription}>
      {/* Notion pages have covers; this is the closest honest equivalent. */}
      {project.media.hero ? (
        <ProjectImage asset={project.media.hero} className="mb-lg rounded-md" priority />
      ) : null}

      <NotionProperties
        items={[
          { label: "Type", value: <NotionTag>{project.category}</NotionTag> },
          { label: "Status", value: project.status ? <NotionTag>{project.status}</NotionTag> : pending },
          { label: "Role", value: project.role ?? pending },
          { label: "Year", value: project.year ?? pending },
          {
            label: "Stack",
            value:
              project.technologies.length === 0 ? (
                <span className="text-muted italic">Pending verification</span>
              ) : (
                <span className="flex flex-wrap gap-xs">
                  {project.technologies.flatMap((group) =>
                    group.items.map((item) => <NotionTag key={`${group.group}-${item}`}>{item}</NotionTag>),
                  )}
                </span>
              ),
          },
          {
            label: "Links",
            value: (
              <span className="flex flex-wrap gap-md">
                {links.map(({ label, link }) =>
                  link.status === "available" ? (
                    <a
                      key={label}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline"
                    >
                      {label}
                    </a>
                  ) : (
                    /* content.md §25 — absence is stated, never invented. */
                    <span key={label} className="text-muted italic">
                      {label}: {link.status === "unavailable" ? "not public" : "pending"}
                    </span>
                  ),
                )}
              </span>
            ),
          },
        ]}
      />

      {project.caseStudy === null ? (
        <NotionCallout>
          Case study not written yet. The overview, problem, architecture, challenges and
          learnings for this project are collected before this page is published.
        </NotionCallout>
      ) : (
        <CaseStudyBody caseStudy={project.caseStudy} />
      )}
    </NotionDocument>
  );
}
