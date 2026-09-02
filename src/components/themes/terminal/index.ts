import { TerminalHome } from "./TerminalHome";
import { TerminalLayout } from "./TerminalLayout";
import { TerminalProjectDetail } from "./TerminalProjectDetail";
import type { ThemeSections } from "@/types/views";

export const sections: ThemeSections = {
  Layout: TerminalLayout,
  Home: TerminalHome,
  ProjectDetail: TerminalProjectDetail,
};
