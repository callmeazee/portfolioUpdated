import type { ExperienceEntry } from "@/types/content";

/**
 * Empty pending the content interview.
 *
 * Note this array is genuinely ambiguous under the pending convention — an
 * empty list could mean "no roles yet" or "not asked yet". It is currently the
 * latter, tracked as ISS-002; `completeness.ts` reports it explicitly so the
 * ambiguity never goes unnoticed.
 */
export const experience: ExperienceEntry[] = [];
