import type { Metadata } from "next";

import { experience } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = createSeoMetadata({
  title: "Experience",
  description: "Professional experience of Azeez Ahmed Khan.",
  canonicalPath: "/experience",
});

export default async function ExperiencePage() {
  const { Page, Card, Empty } = await getPageKit();

  return (
    <Page title="Experience">
      {experience.length === 0 ? (
        <Empty>Experience details pending.</Empty>
      ) : (
        <ol className="mt-lg">
          {experience.map((entry) => (
            <Card
              key={entry.id}
              eyebrow={entry.company}
              title={entry.role}
              description={entry.description}
              meta={`${entry.startDate} – ${entry.endDate}`}
            />
          ))}
        </ol>
      )}
    </Page>
  );
}
