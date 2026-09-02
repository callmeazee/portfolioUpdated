import Link from "next/link";

import type { CaseStudy, TechnicalSection } from "@/types/content";
import type { ProjectViewProps } from "@/types/views";

/**
 * Case-study information hierarchy, in the order design.md §26 fixes:
 * title → description → metadata → overview → problem → solution → features →
 * architecture → technical detail → challenges → learnings → links.
 *
 * Every section is conditional. A project renders only the sections it actually
 * has content for (CLAUDE.md §37), so a thin record produces a short, honest
 * page rather than a scaffold of empty headings.
 */

function Prose({ id, title, paragraphs }: { id: string; title: string; paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;

  return (
    <section className="border-t border-border py-lg" aria-labelledby={id}>
      <h2 id={id} className="font-mono text-caption tracking-[0.18em] text-muted uppercase">
        {title}
      </h2>
      <div className="mt-md grid max-w-[62ch] gap-md">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-body-l">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function Technical({
  id,
  title,
  section,
}: {
  id: string;
  title: string;
  section: TechnicalSection | null;
}) {
  if (section === null) return null;

  return (
    <section className="border-t border-border py-lg" aria-labelledby={id}>
      <h2 id={id} className="font-mono text-caption tracking-[0.18em] text-muted uppercase">
        {title}
      </h2>
      <p className="mt-md max-w-[62ch] text-body-l">{section.summary}</p>
      {section.points.length > 0 ? (
        <ul className="mt-md grid max-w-[62ch] gap-xs text-body-m text-muted">
          {section.points.map((point) => (
            <li key={point} className="border-t border-border pt-xs">
              {point}
            </li>
          ))}
        </ul>
      ) : null}
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
        <section className="border-t border-border py-lg" aria-labelledby="features">
          <h2
            id="features"
            className="font-mono text-caption tracking-[0.18em] text-muted uppercase"
          >
            Features
          </h2>
          <ul className="mt-md grid max-w-[62ch] gap-xs text-body-m">
            {caseStudy.features.map((feature) => (
              <li key={feature} className="border-t border-border pt-xs">
                {feature}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Technical id="architecture" title="Architecture" section={caseStudy.architecture} />
      <Technical id="frontend" title="Frontend" section={caseStudy.frontend} />
      <Technical id="backend" title="Backend" section={caseStudy.backend} />
      <Technical id="database" title="Database" section={caseStudy.database} />
      <Technical id="realtime" title="Real-time" section={caseStudy.realtime} />
      <Technical id="infrastructure" title="Infrastructure" section={caseStudy.infrastructure} />
      <Technical id="security" title="Security" section={caseStudy.security} />

      {caseStudy.challenges.length > 0 ? (
        <section className="border-t border-border py-lg" aria-labelledby="challenges">
          <h2
            id="challenges"
            className="font-mono text-caption tracking-[0.18em] text-muted uppercase"
          >
            Challenges
          </h2>
          <ol className="mt-md grid max-w-[62ch] gap-lg">
            {caseStudy.challenges.map((challenge) => (
              <li key={challenge.title}>
                <h3 className="text-heading-s font-display">{challenge.title}</h3>
                <p className="mt-xs text-body-m text-muted">{challenge.problem}</p>
                {challenge.approach ? (
                  <p className="mt-xs text-body-m text-muted">{challenge.approach}</p>
                ) : null}
                {challenge.result ? (
                  <p className="mt-xs text-body-m">{challenge.result}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* content.md §20 — "not measured yet" is stated, never filled with a guess. */}
      <section className="border-t border-border py-lg" aria-labelledby="performance">
        <h2
          id="performance"
          className="font-mono text-caption tracking-[0.18em] text-muted uppercase"
        >
          Performance
        </h2>
        {caseStudy.performance.measured ? (
          <dl className="mt-md grid grid-cols-2 gap-md sm:grid-cols-4">
            {caseStudy.performance.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="font-mono text-micro text-muted uppercase">{metric.label}</dt>
                <dd className="text-heading-s font-display">{metric.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-md text-body-m text-muted italic">Not measured yet.</p>
        )}
      </section>

      {caseStudy.learnings.length > 0 ? (
        <section className="border-t border-border py-lg" aria-labelledby="learnings">
          <h2
            id="learnings"
            className="font-mono text-caption tracking-[0.18em] text-muted uppercase"
          >
            Learnings
          </h2>
          <ul className="mt-md grid max-w-[62ch] gap-xs text-body-m">
            {caseStudy.learnings.map((learning) => (
              <li key={learning} className="border-t border-border pt-xs">
                {learning}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

export function EditorialProjectDetail({ project }: ProjectViewProps) {
  const metadata: Array<[string, string | null]> = [
    ["Role", project.role],
    ["Status", project.status],
    ["Year", project.year === null ? null : String(project.year)],
    ["Type", project.category],
  ];

  const links = [
    { label: "Live", link: project.links.live },
    { label: "Source", link: project.links.repository },
  ];

  return (
    <main id="main" className="py-2xl">
      <p className="font-mono text-caption tracking-[0.18em] text-muted uppercase">
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>
        {" / "}
        {String(project.order).padStart(2, "0")}
      </p>

      <h1 className="mt-md text-display-m font-display tracking-[-0.03em]">{project.title}</h1>

      {project.shortDescription === null ? (
        <p className="mt-md max-w-[50ch] text-body-l text-muted italic">Description pending.</p>
      ) : (
        <p className="mt-md max-w-[50ch] text-body-l text-muted">{project.shortDescription}</p>
      )}

      <dl className="mt-lg grid grid-cols-2 gap-md border-t border-border pt-md sm:grid-cols-4">
        {metadata.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-micro tracking-[0.14em] text-muted uppercase">
              {label}
            </dt>
            <dd className={value === null ? "text-body-m text-muted italic" : "text-body-m"}>
              {value ?? "Pending"}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-lg border-t border-border py-lg" aria-labelledby="stack">
        <h2 id="stack" className="font-mono text-caption tracking-[0.18em] text-muted uppercase">
          Stack
        </h2>
        {project.technologies.length === 0 ? (
          <p className="mt-md text-body-m text-muted italic">
            Technology stack pending verification.
          </p>
        ) : (
          <dl className="mt-md grid gap-md sm:grid-cols-2">
            {project.technologies.map((group) => (
              <div key={group.group}>
                <dt className="font-mono text-micro tracking-[0.14em] text-muted uppercase">
                  {group.group}
                </dt>
                <dd className="mt-xs text-body-m">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {project.caseStudy === null ? (
        <p className="border-t border-border py-lg text-body-m text-muted italic">
          Case study not written yet. The overview, problem, architecture, challenges and
          learnings for this project are collected before this page is published.
        </p>
      ) : (
        <CaseStudyBody caseStudy={project.caseStudy} />
      )}

      <section className="border-t border-border py-lg" aria-labelledby="links">
        <h2 id="links" className="font-mono text-caption tracking-[0.18em] text-muted uppercase">
          Links
        </h2>
        <ul className="mt-md flex flex-wrap gap-md text-body-m">
          {links.map(({ label, link }) => (
            <li key={label}>
              {link.status === "available" ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-accent"
                >
                  {label} →
                </a>
              ) : (
                /* content.md §25 — an absent link is stated, never invented. */
                <span className="text-muted italic">
                  {label}: {link.status === "unavailable" ? "not public" : "pending"}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
