import { EditorialHome } from "./EditorialHome";
import { editorialPageKit } from "./EditorialPageKit";
import { EditorialProjectDetail } from "./EditorialProjectDetail";
import { EditorialShell } from "./EditorialShell";
import type { ThemeSections } from "@/types/views";

/** The module contract the ThemeRenderer loads (see src/themes/renderer.ts). */
export const sections: ThemeSections = {
  Shell: EditorialShell,
  PageKit: editorialPageKit,
  Home: EditorialHome,
  ProjectDetail: EditorialProjectDetail,
};
