import type { TechGroup } from "@/types/content";

/**
 * Grouped, never rated. README §30 rule 15 and content.md §30 both forbid skill
 * percentage bars — the grouping is the entire model.
 *
 * Taken verbatim from the résumé's Technical Skills section, with two obvious
 * typos corrected ("Rags" → "RAG", "integrayion" → "integration"). "Vector" was
 * expanded to "Vector search", which is an interpretation — see ISS-032.
 */
export const skills: TechGroup[] = [
  {
    group: "Frontend",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "Tailwind CSS"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT", "Socket.IO", "Razorpay"],
  },
  {
    group: "Other",
    items: ["RAG", "Vector search", "Prompt engineering", "LLM integration"],
  },
  {
    group: "Cloud & Infrastructure",
    items: ["AWS", "Docker", "Git", "GitHub"],
  },
];
