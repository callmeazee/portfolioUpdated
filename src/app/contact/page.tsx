import type { Metadata } from "next";

import { ContactForm } from "@/components/shared/ContactForm";
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
  /* Protocol stripped for display only — the href keeps the real URL. */
  const readable = (url: string) => url.replace(/^https?:\/\//, "");

  const channels = [
    contact.email
      ? { term: "Email", description: <a href={`mailto:${contact.email}`}>{contact.email}</a> }
      : null,
    contact.github.status === "available"
      ? {
          term: "GitHub",
          description: (
            <a href={contact.github.url} target="_blank" rel="noreferrer noopener">
              {readable(contact.github.url)}
            </a>
          ),
        }
      : null,
    contact.linkedin.status === "available"
      ? {
          term: "LinkedIn",
          description: (
            <a href={contact.linkedin.url} target="_blank" rel="noreferrer noopener">
              {readable(contact.linkedin.url)}
            </a>
          ),
        }
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

      {/*
        The form appears only when a mail provider is configured. Rendering it
        without one would accept messages and drop them, which is worse than
        pointing at an address that works (README §23).
      */}
      {process.env.RESEND_API_KEY && contact.email ? (
        <Section id="message" title="Send a message">
          <ContactForm email={contact.email} />
        </Section>
      ) : null}

      <Section id="resume" title="Résumé">
        <Action href="/resume">Résumé</Action>
      </Section>
    </Page>
  );
}
