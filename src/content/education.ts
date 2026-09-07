import type { Achievement, Certification, EducationEntry } from "@/types/content";

/** content.md §32. */
export const education: EducationEntry[] = [
  {
    id: "rgpv-be",
    degree: "Bachelor of Engineering",
    field: "Mechanical Engineering",
    institution: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)",
    /* The résumé gives 2017 without a start year. */
    startYear: 2017,
    endYear: 2017,
    description: null,
  },
];

/** content.md §33 — genuine certifications only. None stated on the résumé. */
export const certifications: Certification[] = [];

/** content.md §34 — nothing inflated or unverifiable. None stated on the résumé. */
export const achievements: Achievement[] = [];
