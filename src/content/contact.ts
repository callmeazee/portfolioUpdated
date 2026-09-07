import type { Contact } from "@/types/content";

/**
 * content.md §36: only details intentionally meant to be public.
 *
 * Every value here appears on the résumé the subject circulates, so all of it
 * is already public by their own choice.
 *
 * The phone number is the one judgement call — it is on the résumé, but a
 * résumé is handed to specific people while a website is handed to crawlers.
 * It is therefore recorded but NOT rendered anywhere; flip `publishPhone` in
 * the contact page if that is wanted.
 */
export const contact: Contact = {
  email: "azeezahmedkhan@gmail.com",
  phone: "+91 7724066665",
  github: { status: "available", url: "https://github.com/callmeazee" },
  linkedin: { status: "available", url: "https://linkedin.com/in/azeez222" },
  resume: {
    /* The PDF is not in the repository yet — see ISS-030. */
    url: null,
    label: "Résumé",
  },
};
