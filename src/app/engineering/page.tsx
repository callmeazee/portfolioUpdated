import type { Metadata } from "next";

import { EmptyState, PageShell } from "@/components/shared/PageShell";
import { engineeringAreas, skills } from "@/content";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Engineering",
  description:
    "Engineering areas and technical capabilities — architecture, APIs, real-time systems, databases and infrastructure.",
  canonicalPath: "/engineering",
});

export default function EngineeringPage() {
  return (
    <PageShell title="Engineering">
      <section className="mt-lg" aria-labelledby="skills">
        <h2 id="skills" className="text-heading-s font-display">
          Skills
        </h2>
        {/* Grouped, never rated — no percentage bars (README §30 rule 15). */}
        {skills.length === 0 ? (
          <EmptyState>Skills pending.</EmptyState>
        ) : (
          <div className="mt-sm grid gap-md sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.group}>
                <h3 className="font-mono text-micro text-muted uppercase">{group.group}</h3>
                <p className="mt-xs text-body-s">{group.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-xl" aria-labelledby="areas">
        <h2 id="areas" className="text-heading-s font-display">
          Areas
        </h2>
        {engineeringAreas.length === 0 ? (
          <EmptyState>Engineering areas pending.</EmptyState>
        ) : (
          <ul className="mt-sm grid gap-md">
            {engineeringAreas.map((area) => (
              <li key={area.id}>
                <h3 className="text-heading-s font-display">{area.name}</h3>
                <p className="text-body-s text-muted">{area.shortDescription}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
