import type { Metadata } from "next";

import { contact } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = createSeoMetadata({
  title: "Contact",
  description: "Get in touch with Azeez Ahmed Khan.",
  canonicalPath: "/contact",
});

export default async function ContactPage() {
  const { Page, Section, DefinitionList, Empty, Action } = await getPageKit();

  /* content.md §36 — only what is intentionally public, never a guess. */
  const channels = [
    contact.email
      ? { term: "Email", description: <a href={`mailto:${contact.email}`}>{contact.email}</a> }
      : null,
    contact.github.status === "available"
      ? { term: "GitHub", description: <a href={contact.github.url}>{contact.github.url}</a> }
      : null,
    contact.linkedin.status === "available"
      ? { term: "LinkedIn", description: <a href={contact.linkedin.url}>{contact.linkedin.url}</a> }
      : null,
  ].filter((entry) => entry !== null);

  return (
    <Page title="Contact">
      <Section id="channels" title="Reach me" compact={channels.length === 0}>
        {channels.length === 0 ? (
          <Empty>Contact details pending.</Empty>
        ) : (
          <DefinitionList items={channels} />
        )}
      </Section>

      <Section id="resume" title="Résumé">
        <Action href="/resume">Résumé</Action>
      </Section>
    </Page>
  );
}
