import type { ExperienceEntry } from "@/types/content";

/**
 * From the résumé supplied 2026-09-02. Responsibilities are the subject's own
 * bullet points, lightly normalised for tense — not rewritten into claims they
 * did not make.
 *
 * NOTE: the résumé states "2+ years of experience" but lists one role beginning
 * July 2025. Earlier work is therefore not represented here. Tracked as ISS-031
 * rather than invented.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "affy-cloud",
    company: "Affy Cloud",
    role: "Full Stack Developer",
    location: null,
    employmentType: null,
    startDate: "2025-07",
    endDate: "present",
    description:
      "Building production AI SaaS features across the stack, from reusable UI through to API integrations and deployment.",
    responsibilities: [
      "Building production AI SaaS features using React, TypeScript, Node.js, Docker and AWS.",
      "Developing reusable components, dashboards and API integrations.",
      "Optimising performance and collaborating on scalable codebases.",
    ],
    achievements: [],
    technologies: ["React", "TypeScript", "Node.js", "Docker", "AWS"],
    relatedProjectSlugs: [],
  },
];
