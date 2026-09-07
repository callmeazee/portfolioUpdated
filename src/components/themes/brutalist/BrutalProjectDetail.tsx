import Link from "next/link";

import type { CaseStudy, TechnicalSection } from "@/types/content";
import type { ProjectViewProps } from "@/types/views";

import { BrutalBlock, BrutalEmpty, BrutalLabel } from "./BrutalPrimitives";

/**
 * The case study as a brutalist poster sequence — same information hierarchy as
 * every other theme (design.md §26), rendered as stacked bordered blocks.
 *
 * Every section is conditional, so a thin record yields a short page rather
 * than a scaffold of empty headings (CLAUDE.md §37).
 */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t-2 border-foreground py-lg">
      <h2 id={id}>
        <BrutalLabel>{title}</BrutalLabel>
      </h2>
      <div className="mt-md">{children}</div>
    </section>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="grid max-w-[58ch] gap-md">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-body-l">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Technical({ name, section }: { name: string; section: TechnicalSection | null }) {
  if (section === null) return null;

  return (
    <BrutalBlock className="mb-md p-md">
      <h3 className="text-body-s font-bold uppercase">{name}</h3>
      <p className="mt-xs max-w-[58ch] text-body-m">{section.summary}</p>
      {section.points.length > 0 ? (
        <ul className="mt-sm grid gap-xs">
          {section.points.map((point) => (
            <li key={point} className="border-t-2 border-foreground pt-xs text-body-m">
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </BrutalBlock>
  );
}

function CaseStudyBody({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <>
      {caseStudy.overview.length > 0 ? (
        <Section id="overview" title="Overview">
          <Prose paragraphs={caseStudy.overview} />
        </Section>
      ) : null}

      {caseStudy.problem.length > 0 ? (
        <Section id="problem" title="Problem">
          <Prose paragraphs={caseStudy.problem} />
        </Section>
      ) : null}

      {caseStudy.solution.length > 0 ? (
        <Section id="solution" title="Solution">
          <Prose paragraphs={caseStudy.solution} />
        </Section>
      ) : null}

      {caseStudy.features.length > 0 ? (
        <Section id="features" title="Features">
          <ul className="grid gap-xs md:grid-cols-2">
            {caseStudy.features.map((feature) => (
              <li key={feature} className="border-2 border-foreground p-sm text-body-m font-medium">
                {feature}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section id="technical" title="Technical">
        <Technical name="Architecture" section={caseStudy.architecture} />
        <Technical name="Frontend" section={caseStudy.frontend} />
        <Technical name="Backend" section={caseStudy.backend} />
        <Technical name="Database" section={caseStudy.database} />
        <Technical name="Real-time" section={caseStudy.realtime} />
        <Technical name="Infrastructure" section={caseStudy.infrastructure} />
        <Technical name="Security" section={caseStudy.security} />
      </Section>

      {caseStudy.challenges.length > 0 ? (
        <Section id="challenges" title="Challenges">
          <ol className="grid gap-md">
            {caseStudy.challenges.map((challenge) => (
              <li key={challenge.title}>
                <BrutalBlock className="p-md" tone="secondary">
                  <h3 className="font-display text-heading-m font-bold uppercase leading-[0.95]">
                    {challenge.title}
                  </h3>
                  <p className="mt-sm max-w-[58ch] text-body-m">{challenge.problem}</p>
                  {challenge.approach ? (
                    <p className="mt-sm max-w-[58ch] text-body-m">{challenge.approach}</p>
                  ) : null}
                  {challenge.result ? (
                    <p className="mt-sm max-w-[58ch] text-body-m font-bold">{challenge.result}</p>
                  ) : null}
                </BrutalBlock>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section id="performance" title="Performance">
        {caseStudy.performance.measured ? (
          <ul className="grid gap-md sm:grid-cols-4">
            {caseStudy.performance.metrics.map((metric) => (
              <li key={metric.label} className="border-2 border-foreground p-sm">
                <span className="block text-micro font-bold uppercase">{metric.label}</span>
                <span className="mt-xs block font-display text-heading-m font-bold">
                  {metric.value}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          /* content.md §20 — stated, never guessed. */
          <BrutalEmpty>Not measured yet.</BrutalEmpty>
        )}
      </Section>

      {caseStudy.learnings.length > 0 ? (
        <Section id="learnings" title="Learnings">
          <ul className="grid gap-xs">
            {caseStudy.learnings.map((learning) => (
              <li key={learning} className="border-2 border-foreground p-sm text-body-m">
                {learning}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

export function BrutalProjectDetail({ project }: ProjectViewProps) {
  const pending = <em className="text-muted">Pending</em>;

  const meta: Array<[string, React.ReactNode]> = [
    ["Role", project.role ?? pending],
    ["Status", project.status ?? pending],
    ["Year", project.year ?? pending],
    ["Type", project.category],
  ];

  const links = [
    { label: "Live", link: project.links.live },
    { label: "Source", link: project.links.repository },
  ];

  return (
    <main id="main" className="py-xl">
      <p className="text-body-s font-bold uppercase">
        <Link href="/projects" className="hover:underline">
          ← All projects
        </Link>
      </p>

      <h1 className="mt-md font-display text-display-l leading-[0.85] font-bold uppercase tracking-[-0.04em]">
        {project.title}
      </h1>

      {project.shortDescription === null ? (
        <p className="mt-md max-w-[45ch] text-body-l italic">Description pending.</p>
      ) : (
        <p className="mt-md max-w-[45ch] text-body-l font-medium">{project.shortDescription}</p>
      )}

      <dl className="mt-lg grid grid-cols-2 border-2 border-foreground md:grid-cols-4">
        {meta.map(([label, value], index) => (
          <div
            key={label}
            className={`p-sm ${index > 0 ? "border-l-2 border-foreground" : ""} ${
              index === 2 ? "border-t-2 md:border-t-0" : ""
            }`}
          >
            <dt className="text-micro font-bold uppercase">{label}</dt>
            <dd className="mt-xs text-body-m">{value}</dd>
          </div>
        ))}
      </dl>

      <Section id="stack" title="Stack">
        {project.technologies.length === 0 ? (
          <BrutalEmpty>Technology stack pending verification.</BrutalEmpty>
        ) : (
          <ul className="flex flex-wrap gap-xs">
            {project.technologies.flatMap((group) =>
              group.items.map((item) => (
                <li
                  key={`${group.group}-${item}`}
                  className="border-2 border-foreground px-sm py-xs text-body-s font-bold uppercase"
                >
                  {item}
                </li>
              )),
            )}
          </ul>
        )}
      </Section>

      {project.caseStudy === null ? (
        <Section id="case-study" title="Case study">
          <BrutalEmpty>
            Case study not written yet. The overview, problem, architecture, challenges and
            learnings for this project are collected before this page is published.
          </BrutalEmpty>
        </Section>
      ) : (
        <CaseStudyBody caseStudy={project.caseStudy} />
      )}

      <Section id="links" title="Links">
        <ul className="flex flex-wrap gap-md">
          {links.map(({ label, link }) => (
            <li key={label}>
              {link.status === "available" ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-b-2 border-foreground text-body-m font-bold uppercase"
                >
                  {label} →
                </a>
              ) : (
                /* content.md §25 — absence is stated, never invented. */
                <span className="text-body-m font-bold uppercase opacity-60">
                  {label}: {link.status === "unavailable" ? "not public" : "pending"}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
