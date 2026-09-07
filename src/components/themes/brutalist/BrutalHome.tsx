import Link from "next/link";

import type { HomeViewProps } from "@/types/views";

import { BrutalProjectGrid } from "./BrutalProjectGrid";
import { BrutalBlock, BrutalButton, BrutalEmpty, BrutalLabel } from "./BrutalPrimitives";

/**
 * The brutalist home page.
 *
 * Same seven sections in the order theme.md §6.2 fixes — design.md §39 requires
 * the content hierarchy to stay recognisable across themes. The hero follows
 * theme.md §8.2: the name stacked one word per line at display scale.
 */
export function BrutalHome({
  profile,
  featuredProjects,
  engineeringAreas,
  skills,
  experience,
  notes,
  contact,
}: HomeViewProps) {
  const nameLines = profile.fullName.split(" ");

  return (
    <main id="main">
      <section aria-labelledby="hero" className="border-b-2 border-foreground py-xl">
        <h1
          id="hero"
          className="font-display text-display-l leading-[0.82] font-bold uppercase tracking-[-0.04em]"
        >
          {nameLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-md font-display text-heading-xl leading-[0.95] font-bold uppercase">
          {profile.title}
        </p>

        {profile.positioning === null ? (
          <p className="mt-md max-w-[45ch] text-body-l italic">Positioning statement pending.</p>
        ) : (
          <p className="mt-md max-w-[45ch] text-body-l font-medium">{profile.positioning}</p>
        )}

        <div className="mt-lg flex flex-wrap gap-sm">
          <BrutalButton href="/projects" tone="accent">
            See my work →
          </BrutalButton>
          <BrutalButton href="/about">About</BrutalButton>
        </div>

        {profile.availability ? (
          <p className="mt-lg inline-block border-2 border-foreground bg-surface-secondary px-sm py-xs text-body-s font-bold uppercase">
            {profile.availability}
          </p>
        ) : null}
      </section>

      <BrutalProjectGrid projects={featuredProjects} />

      <section aria-labelledby="engineering" className="border-b-2 border-foreground py-xl">
        <h2 id="engineering">
          <BrutalLabel>Engineering</BrutalLabel>
        </h2>
        <div className="mt-md">
          {skills.length === 0 && engineeringAreas.length === 0 ? (
            <BrutalEmpty>Engineering capabilities pending.</BrutalEmpty>
          ) : (
            <div className="grid gap-md md:grid-cols-2">
              {/* Grouped, never rated — no percentage bars (README §30 rule 15). */}
              {skills.map((group) => (
                <BrutalBlock key={group.group} className="p-md" tone="secondary">
                  <h3 className="text-body-s font-bold uppercase">{group.group}</h3>
                  <p className="mt-xs text-body-m">{group.items.join(" / ")}</p>
                </BrutalBlock>
              ))}
              {engineeringAreas.map((area) => (
                <BrutalBlock key={area.id} className="p-md">
                  <h3 className="text-body-s font-bold uppercase">{area.name}</h3>
                  <p className="mt-xs text-body-m">{area.shortDescription}</p>
                </BrutalBlock>
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="experience" className="border-b-2 border-foreground py-xl">
        <h2 id="experience">
          <BrutalLabel>Experience</BrutalLabel>
        </h2>
        <div className="mt-md">
          {experience.length === 0 ? (
            <BrutalEmpty>Experience details pending.</BrutalEmpty>
          ) : (
            <ol className="grid gap-md">
              {experience.map((entry) => (
                <li key={entry.id}>
                  <BrutalBlock className="p-md">
                    <p className="font-display text-heading-m font-bold uppercase leading-[0.95]">
                      {entry.role}
                    </p>
                    <p className="mt-xs text-body-m font-bold uppercase">
                      {entry.company} · {entry.startDate} – {entry.endDate}
                    </p>
                  </BrutalBlock>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section aria-labelledby="about" className="border-b-2 border-foreground py-xl">
        <h2 id="about">
          <BrutalLabel>About</BrutalLabel>
        </h2>
        <div className="mt-md">
          {profile.longBio === null ? (
            <BrutalEmpty>Biography pending.</BrutalEmpty>
          ) : (
            <div className="grid max-w-[58ch] gap-md">
              {profile.longBio.map((paragraph, i) => (
                <p key={i} className="text-body-l">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="notes" className="border-b-2 border-foreground py-xl">
        <h2 id="notes">
          <BrutalLabel>Notes</BrutalLabel>
        </h2>
        <div className="mt-md">
          {notes.length === 0 ? (
            /* design.md §30 gives this copy verbatim. */
            <BrutalEmpty>No notes published yet.</BrutalEmpty>
          ) : (
            <ul className="grid gap-md">
              {notes.slice(0, 3).map((note) => (
                <li key={note.slug}>
                  <Link
                    href={`/notes/${note.slug}`}
                    className="font-display text-heading-m font-bold uppercase hover:underline"
                  >
                    {note.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="contact" className="py-xl">
        <h2 id="contact">
          <BrutalLabel>Contact</BrutalLabel>
        </h2>
        <div className="mt-md">
          {contact.email === null ? (
            <BrutalEmpty>Contact details pending.</BrutalEmpty>
          ) : (
            <a
              href={`mailto:${contact.email}`}
              className="font-display text-heading-xl font-bold uppercase break-all underline"
            >
              {contact.email}
            </a>
          )}
          <p className="mt-lg">
            <BrutalButton href="/resume">Résumé</BrutalButton>
          </p>
        </div>
      </section>
    </main>
  );
}
