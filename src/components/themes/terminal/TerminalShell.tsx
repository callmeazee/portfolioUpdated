import { buildCommands } from "./commands";
import { MacDesktop } from "./MacDesktop";
import type { ThemeShellProps } from "@/types/views";

/**
 * The macOS environment (ADR-015, ADR-016).
 *
 * A Server Component whose only job is to assemble real data and hand it to the
 * client desktop. The routed page arrives as `children` — already server
 * rendered — and is mounted inside the focused window, so SEO, deep links and
 * the `#main` skip-link target all survive the simulation.
 *
 * The dock and menu bar are plain links to the same routes, satisfying
 * theme.md §7.5: the desktop metaphor is an enhancement, never the only way in.
 */
export function TerminalShell({
  children,
  contact,
  navigation,
  projects,
  notes,
  activeTheme,
  themes,
}: ThemeShellProps) {
  return (
    <MacDesktop
      navigation={navigation}
      projects={projects}
      notes={notes}
      themes={themes}
      activeTheme={activeTheme}
      commands={buildCommands(navigation, themes, contact)}
    >
      {children}
    </MacDesktop>
  );
}
