import type { Project } from "@/types/content";

import { cloudspire } from "./cloudspire";
import { connectverse } from "./connectverse";
import { filemoon } from "./filemoon";
import { movieplas } from "./movieplas";
import { snitcher } from "./snitcher";

/**
 * Every project, ordered by the explicit `order` field rather than by array
 * position, so adding a project cannot silently reshuffle the others
 * (content.md §28).
 *
 * The three featured projects are the ones the résumé leads with; FileMoon and
 * MoviePlas appear on /projects only (README §11 — do not show every project on
 * the homepage).
 */
export const projects: Project[] = [
  cloudspire,
  snitcher,
  connectverse,
  filemoon,
  movieplas,
].sort((a, b) => a.order - b.order);
