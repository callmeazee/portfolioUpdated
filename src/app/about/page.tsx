import type { Metadata } from "next";

import { profile } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getPageKit } from "@/themes/page-kit";

export const metadata: Metadata = createSeoMetadata({
  title: "About",
  description:
    "About Azeez Ahmed Khan, a full-stack developer building web applications, SaaS products and real-time systems.",
  canonicalPath: "/about",
});

export default async function AboutPage() {
  const { Page, Section, Prose, DefinitionList, Empty } = await getPageKit();

  const facts = [
    { term: "Role", description: profile.title },
    { term: "Availability", description: profile.availability ?? "Pending" },
    { term: "Location", description: profile.location ?? "Pending" },
  ];

  return (
    <Page title="About" intro={profile.shortBio ?? undefined}>
      <Section id="bio" title="Background" compact={profile.longBio === null}>
        {profile.longBio === null ? (
          <Empty>Biography pending.</Empty>
        ) : (
          <Prose paragraphs={profile.longBio} />
        )}
      </Section>

      <Section id="facts" title="Details">
        <DefinitionList items={facts} />
      </Section>

      {profile.currentFocus === null ? null : (
        <Section id="focus" title="Currently">
          <Prose paragraphs={[profile.currentFocus]} />
        </Section>
      )}
    </Page>
  );
}
