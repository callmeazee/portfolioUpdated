import { TerminalHome } from "./TerminalHome";
import { terminalPageKit } from "./TerminalPageKit";
import { TerminalProjectDetail } from "./TerminalProjectDetail";
import { TerminalShell } from "./TerminalShell";
import type { ThemeSections } from "@/types/views";

export const sections: ThemeSections = {
  Shell: TerminalShell,
  PageKit: terminalPageKit,
  Home: TerminalHome,
  ProjectDetail: TerminalProjectDetail,
};
