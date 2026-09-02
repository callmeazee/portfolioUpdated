import type { SiteConfig } from "@/interfaces/common";

/*
 * Canonical site identity.
 *
 * NO FABRICATION (CLAUDE.md §9): every value here is either a fact established
 * in the project documentation or an explicit, honest gap. The boilerplate's
 * invented identity ("Azee Studio", https://example.com, twitter.com/yourhandle,
 * hello@example.com) has been removed rather than rewritten into new inventions.
 *
 * OPEN GAPS — tracked in ISSUES.md, to be filled from the content interview:
 *   - production domain (currently env-driven, localhost fallback)
 *   - public email, GitHub, LinkedIn
 * Until a real value exists the field is absent, not guessed. Absent fields must
 * render an honest empty state (design.md §30), never a placeholder link.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Azeez Ahmed Khan",
  title: "Azeez Ahmed Khan — Full-Stack Developer",
  description:
    "Full-stack developer building modern web applications, SaaS products, real-time systems and scalable backend architectures.",
  url: siteUrl,
  basePath: "",
  defaultLocale: "en",
  author: "Azeez Ahmed Khan",
  keywords: [
    "Azeez Ahmed Khan",
    "Full-Stack Developer",
    "React",
    "TypeScript",
    "Node.js",
    "Next.js",
  ],
  // Populated from the content interview. Empty until real handles are supplied.
  socials: {},
} as const satisfies SiteConfig;

/*
 * The core route set from README §12. Navigation MEANING is shared across all
 * four themes; only its presentation changes (design.md §24).
 */
export const navigation = [
  { label: "Work", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Engineering", href: "/engineering" },
  { label: "About", href: "/about" },
  { label: "Notes", href: "/notes" },
  { label: "Contact", href: "/contact" },
] as const;
