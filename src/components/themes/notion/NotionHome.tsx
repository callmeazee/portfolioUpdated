import Link from "next/link";

import type { HomeViewProps } from "@/types/views";

import { NotionCallout, NotionProperties, NotionTag, NotionToggle } from "./NotionBlocks";
import { NotionDatabase } from "./NotionDatabase";
import { NotionDocument, NotionHeading } from "./NotionPage";

/**
 * The workspace home page.
 *
 * Same seven sections as every other theme, in the order theme.md §6.2 fixes —
 * design.md §39 requires the content hierarchy to stay recognisable across
 * themes. Only the presentation is Notion's.
 */
export function NotionHome({
  profile,
  featuredProjects,
  engineeringAreas,
  skills,
  experience,
  notes,
  contact,
}: HomeViewProps) {
  return (
    <NotionDocument icon="👋" title={profile.fullName} description={profile.positioning}>
      <NotionProperties
        items={[
          { label: "Role", value: profile.title },
          {
            label: "Availability",
            value: profile.availability ?? <span className="text-muted italic">Pending</span>,
          },
          {
            label: "Location",
            value: profile.location ?? <span className="text-muted italic">Pending</span>,
          },
        ]}
      />

      <section aria-labelledby="work">
        <NotionHeading id="work">Selected work</NotionHeading>
        <NotionDatabase projects={featuredProjects} />
        <p className="mt-sm text-body-s">
          <Link href="/projects" className="text-muted hover:underline">
            → View all projects
          </Link>
        </p>
      </section>

      <section aria-labelledby="engineering">
        <NotionHeading id="engineering">Engineering</NotionHeading>
        {skills.length === 0 && engineeringAreas.length === 0 ? (
          <NotionCallout>Engineering capabilities pending.</NotionCallout>
        ) : (
          <>
            {/* Grouped, never rated — no percentage bars (README §30 rule 15). */}
            <NotionProperties
              items={skills.map((group) => ({
                label: group.group,
                value: (
                  <span className="flex flex-wrap gap-xs">
                    {group.items.map((item) => (
                      <NotionTag key={item}>{item}</NotionTag>
                    ))}
                  </span>
                ),
              }))}
            />
            {engineeringAreas.map((area) => (
              <NotionToggle key={area.id} summary={area.name}>
                <p className="text-body-m text-muted">{area.shortDescription}</p>
              </NotionToggle>
            ))}
          </>
        )}
      </section>

      <section aria-labelledby="experience">
        <NotionHeading id="experience">Experience</NotionHeading>
        {experience.length === 0 ? (
          <NotionCallout>Experience details pending.</NotionCallout>
        ) : (
          experience.map((entry) => (
            <NotionToggle key={entry.id} summary={`${entry.role} — ${entry.company}`}>
              <NotionProperties
                items={[
                  { label: "Dates", value: `${entry.startDate} – ${entry.endDate}` },
                  { label: "Type", value: entry.employmentType ?? "—" },
                ]}
              />
              {entry.responsibilities.length > 0 ? (
                <ul className="grid gap-xs pl-md text-body-m text-muted">
                  {entry.responsibilities.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </NotionToggle>
          ))
        )}
      </section>

      <section aria-labelledby="about">
        <NotionHeading id="about">About</NotionHeading>
        {profile.longBio === null ? (
          <NotionCallout>Biography pending.</NotionCallout>
        ) : (
          <div className="grid gap-md">
            {profile.longBio.map((paragraph, i) => (
              <p key={i} className="text-body-m leading-[1.75]">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="notes">
        <NotionHeading id="notes">Notes</NotionHeading>
        {notes.length === 0 ? (
          /* design.md §30 gives this copy verbatim. */
          <NotionCallout>No notes published yet.</NotionCallout>
        ) : (
          <ul className="grid">
            {notes.slice(0, 5).map((note) => (
              <li key={note.slug} className="border-b border-border py-sm">
                <Link href={`/notes/${note.slug}`} className="text-body-m hover:underline">
                  📄 {note.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="contact">
        <NotionHeading id="contact">Contact</NotionHeading>
        {contact.email === null ? (
          <NotionCallout>Contact details pending.</NotionCallout>
        ) : (
          <p className="text-body-l">
            <a href={`mailto:${contact.email}`} className="underline">
              {contact.email}
            </a>
          </p>
        )}
        <p className="mt-sm text-body-m">
          <Link href="/resume" className="text-muted hover:underline">
            📄 Résumé
          </Link>
        </p>
      </section>
    </NotionDocument>
  );
}
