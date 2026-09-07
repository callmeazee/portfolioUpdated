import type { Profile } from "@/types/content";

/**
 * Name and title are established in README §1; `availability` was confirmed in
 * the content interview. Everything else — the positioning line, CTAs, bios,
 * philosophy and focus — is marked `[TO BE DEFINED]` in content.md §4 and stays
 * pending rather than being written on the subject's behalf.
 */
export const profile: Profile = {
  fullName: "Azeez Ahmed Khan",
  displayName: "Azeez",
  title: "Full-Stack Developer",
  headline: null,
  positioning: null,
  location: null,
  /* Confirmed 2026-09-02: open to employment and client work. */
  availability: "Open to full-time roles and freelance work",
  shortBio: null,
  longBio: null,
  philosophy: null,
  currentFocus: null,
  primaryCta: null,
  secondaryCta: null,
};
