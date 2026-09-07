import type { Metadata } from "next";

import { engineeringAreas, skills } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = createSeoMetadata({
  title: "Engineering",
  description:
    "Engineering areas and technical capabilities — architecture, APIs, real-time systems, databases and infrastructure.",
  canonicalPath: "/engineering",
});

export default async function EngineeringPage() {
  const { Page, Section, Card, DefinitionList, Empty } = await getPageKit();

  return (
    <Page title="Engineering">
      {/* Grouped, never rated — no percentage bars (README §30 rule 15). */}
      <Section id="skills" title="Skills" compact={skills.length === 0}>
        {skills.length === 0 ? (
          <Empty>Skills pending.</Empty>
        ) : (
          <DefinitionList
            items={skills.map((group) => ({
              term: group.group,
              description: group.items.join(" · "),
            }))}
          />
        )}
      </Section>

      <Section id="areas" title="Areas" compact={engineeringAreas.length === 0}>
        {engineeringAreas.length === 0 ? (
          <Empty>Engineering areas pending.</Empty>
        ) : (
          <ul>
            {engineeringAreas.map((area) => (
              <Card key={area.id} title={area.name} description={area.shortDescription} />
            ))}
          </ul>
        )}
      </Section>
    </Page>
  );
}
