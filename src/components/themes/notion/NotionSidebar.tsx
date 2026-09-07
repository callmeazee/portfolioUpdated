"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText, House, Layers, NotebookPen } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import type { Note, Project } from "@/types/content";
import type { Profile } from "@/types/content";

/**
 * The workspace page tree.
 *
 * The disclosure chevron and the page link are separate controls, as they are
 * in Notion: expanding a section must not navigate, and navigating must not
 * collapse. A single combined control would make one of the two impossible.
 */

function Row({
  href,
  label,
  icon,
  depth = 0,
  children,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  depth?: number;
  /** When present, the row gains a disclosure control for nested pages. */
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const listId = useId();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <div
        className={`flex items-center gap-xs rounded-sm pr-xs text-body-s ${
          isActive ? "bg-surface-secondary font-medium" : "hover:bg-surface-secondary"
        }`}
        style={{ paddingLeft: `${0.25 + depth * 0.75}rem` }}
      >
        {children ? (
          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            aria-expanded={open}
            aria-controls={listId}
            aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
            className="grid size-5 shrink-0 place-items-center rounded-sm text-muted hover:bg-border/60"
          >
            <ChevronRight
              size={14}
              aria-hidden="true"
              className={`transition-transform ${open ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="size-5 shrink-0" aria-hidden="true" />
        )}

        <Link href={href} className="flex min-w-0 flex-1 items-center gap-xs py-xs">
          <span aria-hidden="true" className="shrink-0 text-muted">
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </Link>
      </div>

      {children ? (
        <ul id={listId} hidden={!open} className="grid">
          {children}
        </ul>
      ) : null}
    </li>
  );
}

export function NotionSidebar({
  profile,
  navigation,
  projects,
  notes,
  search,
}: {
  profile: Profile;
  navigation: ReadonlyArray<{ label: string; href: string }>;
  projects: Project[];
  notes: Note[];
  /** The ⌘K palette, supplied by the workspace so the mechanism stays shared. */
  search: ReactNode;
}) {
  /* Routes that own nested pages are rendered explicitly; the rest follow. */
  const flat = navigation.filter(
    (item) => item.href !== "/projects" && item.href !== "/notes",
  );

  return (
    <div className="flex h-full flex-col gap-sm p-sm">
      <div className="flex items-center gap-sm px-xs py-xs">
        <span
          aria-hidden="true"
          className="grid size-6 shrink-0 place-items-center rounded-sm bg-foreground text-caption font-semibold text-background"
        >
          {profile.displayName.slice(0, 1)}
        </span>
        <span className="truncate text-body-s font-medium">{profile.displayName}</span>
      </div>

      {search}

      <nav aria-label="Workspace" className="min-h-0 flex-1 overflow-y-auto">
        <ul className="grid">
          <Row href="/" label="Home" icon={<House size={15} />} />

          <Row href="/projects" label="Projects" icon={<Layers size={15} />}>
            {projects.map((project) => (
              <Row
                key={project.slug}
                href={`/projects/${project.slug}`}
                label={project.title}
                icon={<FileText size={15} />}
                depth={1}
              />
            ))}
          </Row>

          {flat.map((item) => (
            <Row key={item.href} href={item.href} label={item.label} icon={<FileText size={15} />} />
          ))}

          <Row href="/notes" label="Notes" icon={<NotebookPen size={15} />}>
            {notes.length === 0 ? (
              <li className="py-xs pl-lg text-body-s text-muted italic">No notes yet</li>
            ) : (
              notes.map((note) => (
                <Row
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  label={note.title}
                  icon={<FileText size={15} />}
                  depth={1}
                />
              ))
            )}
          </Row>

          <Row href="/resume" label="Résumé" icon={<FileText size={15} />} />
        </ul>
      </nav>
    </div>
  );
}
