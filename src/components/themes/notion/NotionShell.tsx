import { buildCommands } from "../terminal/commands";
import { NotionWorkspace } from "./NotionWorkspace";
import type { ThemeShellProps } from "@/types/views";

/**
 * The Notion workspace (ADR-015).
 *
 * A Server Component that assembles real data and hands it to the client
 * workspace. The routed page arrives as `children`, already server rendered, so
 * SEO and the `#main` skip-link target survive the workspace chrome.
 *
 * The command vocabulary is shared with the macOS theme rather than duplicated:
 * one definition of what commands exist, used by both ⌘K palettes.
 */
export function NotionShell({
  children,
  profile,
  contact,
  navigation,
  projects,
  notes,
  activeTheme,
  themes,
}: ThemeShellProps) {
  return (
    <NotionWorkspace
      profile={profile}
      navigation={navigation}
      projects={projects}
      notes={notes}
      themes={themes}
      activeTheme={activeTheme}
      commands={buildCommands(navigation, themes, contact)}
    >
      {children}
    </NotionWorkspace>
  );
}
