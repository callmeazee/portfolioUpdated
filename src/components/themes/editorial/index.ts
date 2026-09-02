import { EditorialHome } from "./EditorialHome";
import { EditorialLayout } from "./EditorialLayout";
import { EditorialProjectDetail } from "./EditorialProjectDetail";
import type { ThemeSections } from "@/types/views";

/** The module contract the ThemeRenderer loads (see src/themes/renderer.ts). */
export const sections: ThemeSections = {
  Layout: EditorialLayout,
  Home: EditorialHome,
  ProjectDetail: EditorialProjectDetail,
};
