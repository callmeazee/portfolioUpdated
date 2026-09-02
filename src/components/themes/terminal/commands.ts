import type { PaletteCommand } from "@/components/shared/CommandPalette";
import type { ThemeConfig } from "@/types/theme";
import type { Contact } from "@/types/content";

/**
 * Builds the command vocabulary from real destinations only.
 *
 * The keyword lists carry theme.md §7.3's command names (`whoami`, `skills`,
 * `architecture`, `github`, …) so that vocabulary works, without inventing
 * commands that print something and do nothing (CLAUDE.md §39).
 *
 * `github` and `resume` appear only when a real URL exists — an absent link
 * yields no command rather than one that fails (content.md §25).
 */
export function buildCommands(
  navigation: ReadonlyArray<{ label: string; href: string }>,
  themes: ThemeConfig[],
  contact: Contact,
): PaletteCommand[] {
  const keywordsByHref: Record<string, string[]> = {
    "/": ["home", "index"],
    "/projects": ["projects", "work", "ls"],
    "/experience": ["experience", "cv", "history"],
    "/engineering": ["engineering", "skills", "architecture", "stack"],
    "/about": ["about", "whoami", "bio"],
    "/notes": ["notes", "writing", "blog"],
    "/contact": ["contact", "email", "hire"],
    "/resume": ["resume", "cv"],
  };

  const routes: PaletteCommand[] = [
    { label: "Home", href: "/" },
    ...navigation.map((item) => ({ label: item.label, href: item.href })),
    { label: "Résumé", href: "/resume" },
  ].map((entry) => ({
    id: `nav${entry.href}`,
    label: entry.label,
    hint: entry.href,
    keywords: keywordsByHref[entry.href] ?? [entry.label.toLowerCase()],
    kind: "navigate" as const,
    value: entry.href,
  }));

  const externals: PaletteCommand[] = [
    { label: "GitHub", link: contact.github, keywords: ["github", "source", "code"] },
    { label: "LinkedIn", link: contact.linkedin, keywords: ["linkedin"] },
  ]
    .filter((entry) => entry.link.status === "available")
    .map((entry) => ({
      id: `ext-${entry.label}`,
      label: entry.label,
      hint: "external",
      keywords: entry.keywords,
      kind: "external" as const,
      value: entry.link.status === "available" ? entry.link.url : "",
    }));

  /* theme.md §18 — `theme <id>` is the terminal's switcher presentation. */
  const themeCommands: PaletteCommand[] = themes.map((theme) => ({
    id: `theme-${theme.id}`,
    label: `theme ${theme.id}`,
    hint: theme.tagline,
    keywords: ["theme", theme.id, theme.name.toLowerCase()],
    kind: "theme" as const,
    value: theme.id,
  }));

  return [...routes, ...externals, ...themeCommands];
}
