import Link from "next/link";

import type {
  Contact,
  EngineeringArea,
  ExperienceEntry,
  Note,
  Profile,
  TechGroup,
} from "@/types/content";

/**
 * The remaining homepage sections in the order theme.md §6.2 specifies:
 * Capabilities → Experience → About → Notes → Contact.
 *
 * They share one rhythm on purpose — an uppercase mono section label in a
 * narrow left column, content in a wide right column, a hairline between
 * sections. That repetition is what makes the page read as one editorial
 * spread rather than a stack of unrelated widgets.
 */

function SectionFrame({
  id,
  label,
  children,
  last = false,
  compact = false,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  last?: boolean;
  /**
   * Generous whitespace is the point of this theme (design.md §18) — but a
   * section holding one line of "pending" does not earn 8rem of padding above
   * and below. Visual QA showed a column of near-empty bands that read as a
   * broken page. Sections shrink until they have something to space out.
   */
  compact?: boolean;
}) {
  const padding = compact ? "py-xl" : "py-2xl";

  return (
    <section
      /* editorial-in-view: a scroll-driven reveal, CSS-only (theme.md §6.5). */
      className={`editorial-in-view ${last ? padding : `border-b border-border ${padding}`}`}
      aria-labelledby={id}
    >
      <div className="grid gap-lg lg:grid-cols-12">
        <h2
          id={id}
          className="font-mono text-caption tracking-[0.18em] text-muted uppercase lg:col-span-3"
        >
          {label}
        </h2>
        <div className="lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </section>
  );
}

function Pending({ children }: { children: React.ReactNode }) {
  return <p className="text-body-m text-muted italic">{children}</p>;
}

export function EditorialCapabilities({
  areas,
  skills,
}: {
  areas: EngineeringArea[];
  skills: TechGroup[];
}) {
  const isEmpty = skills.length === 0 && areas.length === 0;

  return (
    <SectionFrame id="capabilities" label="Engineering" compact={isEmpty}>
      {skills.length === 0 && areas.length === 0 ? (
        <Pending>Engineering capabilities pending.</Pending>
      ) : (
        <>
          {/* Grouped, never rated — no percentage bars (README §30 rule 15). */}
          <dl className="grid gap-md sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.group} className="border-t border-border pt-sm">
                <dt className="font-mono text-micro tracking-[0.14em] text-muted uppercase">
                  {group.group}
                </dt>
                <dd className="mt-xs text-body-m">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>

          {areas.length > 0 ? (
            <ul className="mt-lg grid gap-md">
              {areas.map((area) => (
                <li key={area.id} className="border-t border-border pt-sm">
                  <h3 className="text-heading-s font-display">{area.name}</h3>
                  <p className="mt-xs text-body-m text-muted">{area.shortDescription}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </SectionFrame>
  );
}

export function EditorialExperience({ experience }: { experience: ExperienceEntry[] }) {
  return (
    <SectionFrame id="experience" label="Experience" compact={experience.length === 0}>
      {experience.length === 0 ? (
        <Pending>Experience details pending.</Pending>
      ) : (
        <ol className="grid gap-lg">
          {experience.map((entry) => (
            <li key={entry.id} className="border-t border-border pt-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-sm">
                <h3 className="text-heading-s font-display">{entry.role}</h3>
                <p className="font-mono text-caption text-muted">
                  {entry.startDate} – {entry.endDate}
                </p>
              </div>
              <p className="mt-xs text-body-m text-muted">{entry.company}</p>
              {entry.responsibilities.length > 0 ? (
                <ul className="mt-sm grid gap-xs text-body-m text-muted">
                  {entry.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </SectionFrame>
  );
}

export function EditorialAbout({ profile }: { profile: Profile }) {
  return (
    <SectionFrame id="about" label="About" compact={profile.longBio === null}>
      {profile.longBio === null ? (
        <Pending>Biography pending.</Pending>
      ) : (
        <div className="grid max-w-[60ch] gap-md">
          {profile.longBio.map((paragraph, i) => (
            <p key={i} className="text-body-l">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {profile.currentFocus === null ? null : (
        <p className="mt-lg border-t border-border pt-sm text-body-m text-muted">
          <span className="font-mono text-micro tracking-[0.14em] uppercase">
            Currently
          </span>
          <br />
          {profile.currentFocus}
        </p>
      )}
    </SectionFrame>
  );
}

export function EditorialNotes({ notes }: { notes: Note[] }) {
  return (
    <SectionFrame id="notes" label="Notes" compact={notes.length === 0}>
      {notes.length === 0 ? (
        /* design.md §30 gives this copy verbatim. */
        <Pending>No notes published yet.</Pending>
      ) : (
        <ul className="grid gap-md">
          {notes.slice(0, 3).map((note) => (
            <li key={note.slug} className="border-t border-border pt-sm">
              <h3 className="text-heading-s font-display">
                <Link href={`/notes/${note.slug}`} className="hover:text-accent">
                  {note.title}
                </Link>
              </h3>
              <p className="mt-xs text-body-m text-muted">{note.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </SectionFrame>
  );
}

export function EditorialContact({ contact }: { contact: Contact }) {
  const hasEmail = contact.email !== null;
  const links = [
    { label: "GitHub", link: contact.github },
    { label: "LinkedIn", link: contact.linkedin },
  ].filter((entry) => entry.link.status === "available");

  return (
    <SectionFrame id="contact" label="Contact" last compact={!hasEmail}>
      {hasEmail ? (
        <a
          href={`mailto:${contact.email}`}
          className="text-heading-l font-display tracking-[-0.02em] hover:text-accent"
        >
          {contact.email}
        </a>
      ) : (
        <Pending>Contact details pending.</Pending>
      )}

      {links.length > 0 ? (
        <ul className="mt-lg flex flex-wrap gap-md text-body-m">
          {links.map((entry) => (
            <li key={entry.label}>
              <a
                href={entry.link.status === "available" ? entry.link.url : undefined}
                className="text-muted hover:text-foreground"
                rel="noreferrer noopener"
                target="_blank"
              >
                {entry.label} →
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {/* content.md §37 — the résumé is reachable from every theme. */}
      <p className="mt-lg">
        <Link href="/resume" className="text-body-m text-muted hover:text-foreground">
          Résumé →
        </Link>
      </p>
    </SectionFrame>
  );
}
