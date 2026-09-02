import type { Project } from "@/types/content";

import { besties } from "./besties";
import { cloudcost } from "./cloudcost";
import { ecommerce } from "./ecommerce";

/**
 * Every project, ordered by the explicit `order` field rather than by array
 * position, so adding a project cannot silently reshuffle the others
 * (content.md §28).
 */
export const projects: Project[] = [besties, ecommerce, cloudcost].sort(
  (a, b) => a.order - b.order,
);
