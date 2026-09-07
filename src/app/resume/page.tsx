import type { Metadata } from "next";

import { contact, profile } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = createSeoMetadata({
  title: "Résumé",
  description: "Résumé of Azeez Ahmed Khan, Full-Stack Developer.",
  canonicalPath: "/resume",
});

/** content.md §37 — the résumé must be reachable from every theme. */
export default async function ResumePage() {
  const { Page, Empty, Action } = await getPageKit();

  return (
    <Page title="Résumé" intro={`${profile.fullName} — ${profile.title}`}>
      <div className="mt-lg">
        {contact.resume.url === null ? (
          <Empty>Résumé not available yet.</Empty>
        ) : (
          <Action href={contact.resume.url} external>
            Download {contact.resume.label}
          </Action>
        )}
      </div>
    </Page>
  );
}
