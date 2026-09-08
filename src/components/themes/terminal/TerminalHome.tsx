import Link from "next/link";

import type { HomeViewProps } from "@/types/views";

import { PromptHeading, TerminalOutput, TerminalPending } from "./TerminalWindow";

/**
 * The same seven sections as every other theme, in the same order
 * (theme.md §6.2) — only the framing changes. design.md §39 requires the
 * content hierarchy to stay recognisable across themes.
 *
 * Each section is a prompt line plus its output. The output is real portfolio
 * content from the content layer; nothing is invented to fill a shell
 * (design.md §19).
 */
export function TerminalHome({
  profile,
  featuredProjects,
  engineeringAreas,
  skills,
  experience,
  notes,
  contact,
}: HomeViewProps) {
  return (
    /* No window chrome here — MacWindow provides it (ADR-016). */
    <main id="main" className="p-md sm:p-lg">
      <>
        {/* whoami */}
        <PromptHeading id="whoami" command="whoami" label={profile.fullName} level={1} />
        <TerminalOutput>
          <p className="text-heading-m font-display">{profile.fullName}</p>
          <p className="mt-xs font-mono text-body-s text-muted">{profile.title}</p>
          {profile.positioning === null ? (
            <TerminalPending>positioning: pending</TerminalPending>
          ) : (
            <p className="mt-sm max-w-[60ch] text-body-m">{profile.positioning}</p>
          )}
          {/* Motion, intensity MEDIUM (theme.md §7.6): a blinking cursor, nothing more. */}
          <p aria-hidden="true" className="mt-sm font-mono text-body-s text-accent">
            <span className="terminal-cursor">▋</span>
          </p>
        </TerminalOutput>

        {/* ls projects */}
        <PromptHeading id="projects" command="ls projects" label="Selected work" />
        <TerminalOutput>
          {featuredProjects.length === 0 ? (
            <TerminalPending>no projects published yet</TerminalPending>
          ) : (
            <ul className="grid gap-sm font-mono text-body-s">
              {featuredProjects.map((project) => (
                <li key={project.slug} className="grid gap-xs sm:grid-cols-[14rem_1fr] sm:gap-md">
                  <Link href={`/projects/${project.slug}`} className="text-accent hover:underline">
                    {project.slug}/
                  </Link>
                  <span className="text-muted">
                    {project.shortDescription ?? <em>description pending</em>}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Only the featured projects are listed above (README §30 rule 14). */}
          <p className="mt-md font-mono text-body-s">
            {/*
              Always underlined, not only on hover: this link sits inside a text
              block, so colour alone would be its only distinction — axe flagged
              it as `link-in-text-block` (WCAG 1.4.1, "do not use colour as the
              only visual means of conveying information").
            */}
            <Link href="/projects" className="text-accent underline">
              ls projects --all
            </Link>
            <span className="text-muted"> — view all projects</span>
          </p>
        </TerminalOutput>

        {/* cat skills */}
        <PromptHeading id="engineering" command="cat engineering.txt" label="Engineering" />
        <TerminalOutput>
          {skills.length === 0 && engineeringAreas.length === 0 ? (
            <TerminalPending>engineering: pending</TerminalPending>
          ) : (
            <>
              <dl className="grid gap-sm font-mono text-body-s">
                {skills.map((group) => (
                  <div key={group.group} className="grid gap-xs sm:grid-cols-[14rem_1fr] sm:gap-md">
                    <dt className="text-muted">{group.group.toLowerCase()}</dt>
                    <dd>{group.items.join(" ")}</dd>
                  </div>
                ))}
              </dl>
              {engineeringAreas.length > 0 ? (
                <ul className="mt-md grid gap-sm">
                  {engineeringAreas.map((area) => (
                    <li key={area.id}>
                      <h3 className="font-mono text-body-s text-accent">{area.name}</h3>
                      <p className="text-body-s text-muted">{area.shortDescription}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </TerminalOutput>

        {/* cat experience */}
        <PromptHeading id="experience" command="cat experience.log" label="Experience" />
        <TerminalOutput>
          {experience.length === 0 ? (
            <TerminalPending>experience: pending</TerminalPending>
          ) : (
            <ol className="grid gap-md font-mono text-body-s">
              {experience.map((entry) => (
                <li key={entry.id}>
                  <p className="text-muted">
                    {entry.startDate} → {entry.endDate}
                  </p>
                  <p>
                    <span className="text-accent">{entry.role}</span> @ {entry.company}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </TerminalOutput>

        {/* cat about */}
        <PromptHeading id="about" command="cat about.md" label="About" />
        <TerminalOutput>
          {profile.longBio === null ? (
            <TerminalPending>about: pending</TerminalPending>
          ) : (
            <div className="grid max-w-[62ch] gap-sm">
              {profile.longBio.map((paragraph, i) => (
                <p key={i} className="text-body-m">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </TerminalOutput>

        {/* ls notes */}
        <PromptHeading id="notes" command="ls notes/" label="Notes" />
        <TerminalOutput>
          {notes.length === 0 ? (
            <TerminalPending>no notes published yet</TerminalPending>
          ) : (
            <ul className="grid gap-xs font-mono text-body-s">
              {notes.slice(0, 5).map((note) => (
                <li key={note.slug}>
                  <Link href={`/notes/${note.slug}`} className="text-accent hover:underline">
                    {note.slug}.md
                  </Link>
                  <span className="text-muted"> — {note.title}</span>
                </li>
              ))}
            </ul>
          )}
        </TerminalOutput>

        {/* cat contact */}
        <PromptHeading id="contact" command="cat contact" label="Contact" />
        <TerminalOutput>
          {contact.email === null ? (
            <TerminalPending>contact: pending</TerminalPending>
          ) : (
            <a
              href={`mailto:${contact.email}`}
              className="font-mono text-body-m text-accent hover:underline"
            >
              {contact.email}
            </a>
          )}
          <p className="mt-sm font-mono text-body-s">
            <Link href="/resume" className="text-muted hover:text-accent">
              ./resume
            </Link>
          </p>
        </TerminalOutput>
      </>
    </main>
  );
}
