import type { Metadata } from "next";

import { EmptyState, PageShell } from "@/components/shared/PageShell";
import { contact } from "@/content";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Résumé",
  description: "Résumé of Azeez Ahmed Khan, Full-Stack Developer.",
  canonicalPath: "/resume",
});

/** content.md §37 — the résumé must be reachable from every theme. */
export default function ResumePage() {
  return (
    <PageShell title="Résumé">
      {contact.resume.url === null ? (
        <EmptyState>Résumé not available yet.</EmptyState>
      ) : (
        <a
          href={contact.resume.url}
          className="mt-lg inline-block rounded-md bg-accent px-md py-sm font-medium text-accent-foreground"
        >
          Download {contact.resume.label}
        </a>
      )}
    </PageShell>
  );
}
