import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { notes } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

/*
 * No `generateStaticParams` — under ADR-007 the root layout reads a cookie, so
 * every route is dynamic and enumerating params buys nothing. With an empty
 * notes list its presence also made Next classify this segment as prerenderable,
 * which then failed at request time with DYNAMIC_SERVER_USAGE.
 */

export async function generateMetadata(props: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const note = notes.find((entry) => entry.slug === slug);

  if (!note) return createSeoMetadata({ title: "Note not found" });

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

  if (!note) notFound();

  const { Page, Prose } = await getPageKit();

  return (
    <Page
      title={note.title}
      intro={note.summary}
      breadcrumb={[
        { label: "Notes", href: "/notes" },
        { label: note.title, href: `/notes/${note.slug}` },
      ]}
    >
      <div className="mt-lg">
        <Prose paragraphs={note.body} />
      </div>
    </Page>
  );
}
