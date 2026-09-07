import { NotionHome } from "./NotionHome";
import { notionPageKit } from "./NotionPageKit";
import { NotionProjectDetail } from "./NotionProjectDetail";
import { NotionShell } from "./NotionShell";
import type { ThemeSections } from "@/types/views";

export const sections: ThemeSections = {
  Shell: NotionShell,
  PageKit: notionPageKit,
  Home: NotionHome,
  ProjectDetail: NotionProjectDetail,
};
