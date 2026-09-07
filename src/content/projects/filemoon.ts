import type { Project } from "@/types/content";

/** Additional project — appears on /projects, not the homepage (README §11). */
export const filemoon: Project = {
  id: "filemoon-cloud",
  slug: "filemoon-cloud",
  title: "FileMoon Cloud",
  shortTitle: "FileMoon",
  category: "Developer Tool",
  status: "Completed",
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "Secure cloud file-sharing application supporting uploads, downloads and shareable links.",

  technologies: [
    { group: "Frontend", items: ["React"] },
    { group: "Backend", items: ["Node.js"] },
    { group: "Database", items: ["MongoDB"] },
  ],

  links: {
    live: { status: "available", url: "https://filemooncloud.onrender.com" },
    repository: { status: "pending" },
  },

  media: { hero: null, screenshots: [], architectureDiagram: null },
  caseStudy: null,
  featured: false,
  order: 4,
};
