import { siteConfig } from "@/config/site";
import { contact, getAllProjects, profile } from "@/content";

/**
 * JSON-LD structured data (README §25 — "where genuinely useful").
 *
 * Theme-independent by construction: it is built from the canonical content
 * layer and emitted by the root layout, so all four themes publish exactly the
 * same machine-readable identity (README §16).
 *
 * NO FABRICATION (CLAUDE.md §9) applies here more sharply than anywhere else,
 * because search engines treat this as assertions of fact. Every field is
 * omitted unless a real value exists — an empty `sameAs` is dropped rather than
 * shipped, and pending values never become empty strings.
 */

function compact<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  ) as Partial<T>;
}

/** Verified public profiles only — never a guessed handle. */
function sameAs(): string[] {
  return [contact.github, contact.linkedin]
    .filter((link) => link.status === "available")
    .map((link) => (link.status === "available" ? link.url : ""))
    .filter(Boolean);
}

export function personJsonLd() {
  return compact({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    jobTitle: profile.title,
    url: siteConfig.url,
    description: profile.shortBio,
    email: contact.email ? `mailto:${contact.email}` : null,
    address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location } : null,
    sameAs: sameAs(),
  });
}

export function websiteJsonLd() {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: { "@type": "Person", name: profile.fullName },
  });
}

/**
 * A project becomes a CreativeWork only once it says something true about
 * itself. A record with no description and no verified stack would emit an
 * entry asserting nothing, so it is skipped entirely.
 */
export function projectJsonLd(slug: string) {
  const project = getAllProjects().find((entry) => entry.slug === slug);
  if (!project || project.shortDescription === null) return null;

  const technologies = project.technologies.flatMap((group) => group.items);

  return compact({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: `${siteConfig.url}/projects/${project.slug}`,
    genre: project.category,
    dateCreated: project.year ? String(project.year) : null,
    creator: { "@type": "Person", name: profile.fullName },
    keywords: technologies,
  });
}
