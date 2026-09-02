import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/shared/PageShell";
import { notes } from "@/content";
import { createSeoMetadata } from "@/lib/seo";

/*
 * No `generateStaticParams` here — deliberately.
 *
 * ADR-007 reads a cookie in the root layout to resolve the theme, which makes
 * every route dynamic, so static param enumeration has no effect. Worse, while
 * `notes` is empty it actively broke this route: an empty param list led Next
 * to classify the segment as statically prerenderable, and an on-demand request
 * for an unknown slug then failed with DYNAMIC_SERVER_USAGE (a 500) instead of
 * rendering a 404.
 *
 * Reinstate this only if theme resolution ever becomes static-compatible.
 */

export async function generateMetadata(props: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const note = notes.find((entry) => entry.slug === slug);

  if (!note) {
    return createSeoMetadata({ title: "Note not found" });
  }

  return createSeoMetadata({
    title: note.title,
    description: note.summary,
    canonicalPath: `/notes/${note.slug}`,
    type: "article",
    publishedTime: note.publishedAt,
    keywords: note.tags,
  });
}

export default async function NotePage(props: PageProps<"/notes/[slug]">) {
  const { slug } = await props.params;
  const note = notes.find((entry) => entry.slug === slug);

  if (!note) {
    notFound();
  }

  return (
    <PageShell title={note.title} intro={note.summary}>
      <div className="mt-lg grid max-w-[65ch] gap-md">
        {note.body.map((paragraph, i) => (
          <p key={i} className="text-body-m">
            {paragraph}
          </p>
        ))}
      </div>
    </PageShell>
  );
}
