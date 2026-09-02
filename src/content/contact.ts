import type { Contact } from "@/types/content";

/**
 * content.md §36: only details intentionally meant to be public are published.
 * Pending the interview — no address or handle is guessed, and none is carried
 * over from the boilerplate's invented `hello@example.com`.
 */
export const contact: Contact = {
  email: null,
  github: { status: "pending" },
  linkedin: { status: "pending" },
  resume: {
    url: null,
    label: "Résumé",
  },
};
