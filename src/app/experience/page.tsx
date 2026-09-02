import type { Metadata } from "next";

import { EmptyState, PageShell } from "@/components/shared/PageShell";
import { experience } from "@/content";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Experience",
  description: "Professional experience of Azeez Ahmed Khan.",
  canonicalPath: "/experience",
});

export default function ExperiencePage() {
  return (
    <PageShell title="Experience">
      {experience.length === 0 ? (
        <EmptyState>Experience details pending.</EmptyState>
      ) : (
        <ol className="mt-lg grid gap-lg">
          {experience.map((entry) => (
            <li key={entry.id} className="border-t border-border pt-md">
              <h2 className="text-heading-s font-display">{entry.role}</h2>
              <p className="text-body-s text-muted">
                {entry.company} · {entry.startDate} – {entry.endDate}
              </p>
            </li>
          ))}
        </ol>
      )}
    </PageShell>
  );
}
