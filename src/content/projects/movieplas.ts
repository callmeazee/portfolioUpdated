import type { Project } from "@/types/content";

/** Additional project — appears on /projects, not the homepage (README §11). */
export const movieplas: Project = {
  id: "movieplas",
  slug: "movieplas",
  title: "MoviePlas",
  shortTitle: null,
  category: "Developer Tool",
  status: "Completed",
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "Movie discovery platform with TMDB integration, YouTube trailer playback, cast details, ratings and reviews.",

  technologies: [
    { group: "Frontend", items: ["React"] },
    { group: "Other", items: ["TMDB API"] },
  ],

  links: {
    live: { status: "available", url: "https://movieplas-web.onrender.com" },
    /* Verified by content: `render.yaml` plus frontend/backend, matching the Render deploy. */
    repository: { status: "available", url: "https://github.com/callmeazee/movieplas" },
  },

  media: {
    /* Captured from the live deployment on 2026-09-02. */
    hero: {
      src: "/projects/movieplas.webp",
      alt: "The MoviePlas home page, showing search and trending titles.",
    },
    screenshots: [],
    architectureDiagram: null,
  },
  caseStudy: null,
  featured: false,
  order: 6,
};
