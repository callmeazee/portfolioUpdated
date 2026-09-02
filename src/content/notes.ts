import type { Note } from "@/types/content";

/**
 * content.md §35. Empty is a perfectly valid published state here: design.md
 * §30 specifies the empty state "No notes published yet." rather than hiding
 * the section.
 *
 * The boilerplate's three fabricated articles were deleted in Phase 1; nothing
 * replaces them until real writing exists.
 */
export const notes: Note[] = [];
