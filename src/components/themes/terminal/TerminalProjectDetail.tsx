import Link from "next/link";

import type { CaseStudy, TechnicalSection } from "@/types/content";
import type { ProjectViewProps } from "@/types/views";

import { ArchitectureDiagram } from "@/components/shared/ArchitectureDiagram";
import { ProjectImage } from "@/components/shared/ProjectImage";

import { PromptHeading, TerminalOutput, TerminalPending } from "./TerminalWindow";

/**
 * The same case-study information hierarchy as every other theme
 * (design.md §26), framed as a shell session.
 *
 * Sections render only when real content exists (CLAUDE.md §37), so a thin
 * record produces a short session rather than a wall of empty headings — and
 * critically, no invented `cat` output (design.md §19).
 */

function Section({
  id,
  command,
  label,
  children,
}: {
  id: string;
  command: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PromptHeading id={id} command={command} label={label} cwd="~/projects" />
      <TerminalOutput>{children}</TerminalOutput>
    </>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="grid max-w-[62ch] gap-sm">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-body-m">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Technical({
  id,
  name,
  section,
}: {
  id: string;
  name: string;
  section: TechnicalSection | null;
}) {
  if (section === null) return null;

  return (
    <Section id={id} command={`cat ${name}.md`} label={name}>
      <p className="max-w-[62ch] text-body-m">{section.summary}</p>
      {section.points.length > 0 ? (
        <ul className="mt-sm grid gap-xs font-mono text-body-s text-muted">
          {section.points.map((point) => (
            <li key={point}>— {point}</li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}

function CaseStudyBody({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <>
      {caseStudy.overview.length > 0 ? (
        <Section id="overview" command="cat overview.md" label="Overview">
          <Prose paragraphs={caseStudy.overview} />
        </Section>
      ) : null}

      {caseStudy.problem.length > 0 ? (
        <Section id="problem" command="cat problem.md" label="Problem">
          <Prose paragraphs={caseStudy.problem} />
        </Section>
      ) : null}

      {caseStudy.solution.length > 0 ? (
        <Section id="solution" command="cat solution.md" label="Solution">
          <Prose paragraphs={caseStudy.solution} />
        </Section>
      ) : null}

      {caseStudy.features.length > 0 ? (
        <Section id="features" command="cat features" label="Features">
          <ul className="grid gap-xs font-mono text-body-s">
            {caseStudy.features.map((feature) => (
              <li key={feature}>— {feature}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Technical id="architecture" name="architecture" section={caseStudy.architecture} />
      {caseStudy.diagram ? (
        <Section id="diagram" command="cat architecture.txt" label="Architecture diagram">
          <ArchitectureDiagram diagram={caseStudy.diagram} />
        </Section>
      ) : null}
      <Technical id="frontend" name="frontend" section={caseStudy.frontend} />
      <Technical id="backend" name="backend" section={caseStudy.backend} />
      <Technical id="database" name="database" section={caseStudy.database} />
      <Technical id="realtime" name="realtime" section={caseStudy.realtime} />
      <Technical id="infrastructure" name="infrastructure" section={caseStudy.infrastructure} />
      <Technical id="security" name="security" section={caseStudy.security} />

      {caseStudy.challenges.length > 0 ? (
        <Section id="challenges" command="cat challenges.md" label="Challenges">
          <ol className="grid gap-md">
            {caseStudy.challenges.map((challenge) => (
              <li key={challenge.title}>
                <h3 className="font-mono text-body-s text-accent">{challenge.title}</h3>
                <p className="mt-xs max-w-[62ch] text-body-m text-muted">{challenge.problem}</p>
                {challenge.approach ? (
                  <p className="mt-xs max-w-[62ch] text-body-m text-muted">{challenge.approach}</p>
                ) : null}
                {challenge.result ? (
                  <p className="mt-xs max-w-[62ch] text-body-m">{challenge.result}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section id="performance" command="cat performance" label="Performance">
        {caseStudy.performance.measured ? (
          <dl className="grid grid-cols-2 gap-md font-mono text-body-s sm:grid-cols-4">
            {caseStudy.performance.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-muted">{metric.label}</dt>
                <dd className="text-heading-s">{metric.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          /* content.md §20 — stated, never guessed. */
          <TerminalPending>not measured yet</TerminalPending>
        )}
      </Section>

      {caseStudy.learnings.length > 0 ? (
        <Section id="learnings" command="cat learnings.md" label="Learnings">
          <ul className="grid gap-xs font-mono text-body-s">
            {caseStudy.learnings.map((learning) => (
              <li key={learning}>— {learning}</li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

export function TerminalProjectDetail({ project }: ProjectViewProps) {
  const metadata: Array<[string, string | null]> = [
    ["role", project.role],
    ["status", project.status],
    ["year", project.year === null ? null : String(project.year)],
    ["type", project.category],
  ];

  const links = [
    { label: "live", link: project.links.live },
    { label: "source", link: project.links.repository },
  ];

  return (
    <main id="main" className="p-md sm:p-lg">
      <p className="mb-sm font-mono text-caption text-muted">
        <Link href="/projects" className="hover:text-accent">
          ../projects
        </Link>
      </p>

      <>
        <h1 className="font-mono text-heading-m font-normal">
          <span aria-hidden="true" className="text-muted">
            azeez@portfolio ~/projects %{" "}
          </span>
          cd {project.slug}
          <span className="sr-only">{project.title}</span>
        </h1>

        <div className="mt-lg">
          <Section id="manifest" command="cat manifest" label="Project metadata">
            <dl className="grid gap-xs font-mono text-body-s">
              <div className="grid gap-xs sm:grid-cols-[10rem_1fr] sm:gap-md">
                <dt className="text-muted">name</dt>
                <dd>{project.title}</dd>
              </div>
              <div className="grid gap-xs sm:grid-cols-[10rem_1fr] sm:gap-md">
                <dt className="text-muted">description</dt>
                <dd>
                  {project.shortDescription ?? <em className="text-muted">pending</em>}
                </dd>
              </div>
              {metadata.map(([label, value]) => (
                <div key={label} className="grid gap-xs sm:grid-cols-[10rem_1fr] sm:gap-md">
                  <dt className="text-muted">{label}</dt>
                  <dd>{value ?? <em className="text-muted">pending</em>}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {project.media.hero ? (
            <Section
              id="preview"
              command={`open ${project.media.hero.src.split("/").pop()}`}
              label="Screenshot"
            >
              <ProjectImage
                asset={project.media.hero}
                className="max-w-[52rem] rounded-sm border border-border"
                priority
              />
            </Section>
          ) : null}

          <Section id="stack" command="cat stack" label="Technology stack">
            {project.technologies.length === 0 ? (
              <TerminalPending>stack pending verification</TerminalPending>
            ) : (
              <dl className="grid gap-xs font-mono text-body-s">
                {project.technologies.map((group) => (
                  <div
                    key={group.group}
                    className="grid gap-xs sm:grid-cols-[10rem_1fr] sm:gap-md"
                  >
                    <dt className="text-muted">{group.group.toLowerCase()}</dt>
                    <dd>{group.items.join(" ")}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Section>

          {project.caseStudy === null ? (
            <Section id="case-study" command="cat case-study.md" label="Case study">
              <TerminalPending>
                case study not written yet — overview, problem, architecture, challenges and
                learnings are collected before this page is published
              </TerminalPending>
            </Section>
          ) : (
            <CaseStudyBody caseStudy={project.caseStudy} />
          )}

          <Section id="links" command="ls links" label="Links">
            <ul className="grid gap-xs font-mono text-body-s">
              {links.map(({ label, link }) => (
                <li key={label}>
                  {link.status === "available" ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-accent hover:underline"
                    >
                      {label} → {link.url}
                    </a>
                  ) : (
                    /* content.md §25 — absence is stated, never invented. */
                    <span className="text-muted">
                      {label}: {link.status === "unavailable" ? "not public" : "pending"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </>
    </main>
  );
}
