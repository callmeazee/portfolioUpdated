import type { Project } from "@/types/content";

/**
 * Sourced from the résumé supplied 2026-09-02, which supersedes the working
 * name "E-commerce Platform" used in the planning documents.
 */
export const snitcher: Project = {
  id: "snitcher",
  slug: "snitcher",
  title: "Snitcher",
  shortTitle: null,
  category: "E-commerce",
  status: "Completed",
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "Production-ready MERN e-commerce platform with authentication, search and filtering, cart, Razorpay payments, order management and an admin dashboard.",

  technologies: [
    { group: "Frontend", items: ["React"] },
    { group: "Backend", items: ["Node.js", "Express.js", "JWT", "Razorpay"] },
    { group: "Database", items: ["MongoDB"] },
  ],

  links: {
    live: { status: "available", url: "https://snitcher-six.vercel.app" },
    repository: { status: "pending" },
  },

  media: {
    /* Captured from the live deployment on 2026-09-02. */
    hero: {
      src: "/projects/snitcher.webp",
      alt: "The Snitcher storefront, showing the product catalogue with pricing.",
    },
    screenshots: [],
    architectureDiagram: null,
  },

  caseStudy: {
    overview: [
      "Snitcher is a production-ready e-commerce platform built on the MERN stack. It covers the full commerce path — browsing and search through to payment and order management — with an admin dashboard behind it.",
    ],
    problem: [],
    solution: [],
    features: [
      "Authentication",
      "Advanced search",
      "Filters",
      "Shopping cart",
      "Razorpay payments",
      "Order management",
      "Admin dashboard",
    ],
    architecture: null,
    frontend: null,
    backend: null,
    database: null,
    realtime: null,
    infrastructure: null,
    security: null,
    performance: { measured: false },
    challenges: [],
    learnings: [],
  },

  featured: true,
  order: 2,
};
