import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState, PageShell } from "@/components/shared/PageShell";
import { notes } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = createSeoMetadata({
  title: "Notes",
  description: "Technical notes and writing by Azeez Ahmed Khan.",
  canonicalPath: "/notes",
});

export default function NotesPage() {
  return (
    <PageShell title="Notes">
      {notes.length === 0 ? (
        /* design.md §30 gives this exact copy — an empty writing section is a
           legitimate published state, not a defect to hide. */
        <EmptyState>No notes published yet.</EmptyState>
      ) : (
        <ul className="mt-lg grid gap-lg">
          {notes.map((note) => (
            <li key={note.slug} className="border-t border-border pt-md">
              <p className="font-mono text-micro text-muted">{formatDate(note.publishedAt)}</p>
              <h2 className="mt-xs text-heading-s font-display">
                <Link href={`/notes/${note.slug}`}>{note.title}</Link>
              </h2>
              <p className="mt-xs text-body-s text-muted">{note.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
