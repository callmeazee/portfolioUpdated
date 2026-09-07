import { BrutalHome } from "./BrutalHome";
import { brutalistPageKit } from "./BrutalPageKit";
import { BrutalProjectDetail } from "./BrutalProjectDetail";
import { BrutalShell } from "./BrutalShell";
import type { ThemeSections } from "@/types/views";

export const sections: ThemeSections = {
  Shell: BrutalShell,
  PageKit: brutalistPageKit,
  Home: BrutalHome,
  ProjectDetail: BrutalProjectDetail,
};
