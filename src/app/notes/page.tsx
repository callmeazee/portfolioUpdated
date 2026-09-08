import type { Metadata } from "next";

import { notes } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "Notes",
    description: "Technical notes and writing by Azeez Ahmed Khan.",
    canonicalPath: "/notes",
  }),
  /* Feed readers discover the feed from the head, not from a visible link. */
  alternates: {
    canonical: "/notes",
    types: { "application/rss+xml": "/notes/rss.xml" },
  },
};

export default async function NotesPage() {
  const { Page, Card, Empty } = await getPageKit();

  return (
    <Page title="Notes">
      {notes.length === 0 ? (
        /* design.md §30 gives this copy verbatim. */
        <Empty>No notes published yet.</Empty>
      ) : (
        <ul className="mt-lg">
          {notes.map((note) => (
            <Card
              key={note.slug}
              href={`/notes/${note.slug}`}
              eyebrow={note.slug}
              title={note.title}
              description={note.summary}
              meta={formatDate(note.publishedAt)}
            />
          ))}
        </ul>
      )}
    </Page>
  );
}
