import type { Project } from "@/types/content";

/**
 * Third primary project (README §11, content.md §28).
 *
 * `shortDescription` is pending: README §11 characterises this one only as an
 * "AI/product-oriented project", which describes its role in the portfolio
 * rather than what the product does. Writing a product description from that
 * would be invention.
 */
export const cloudcost: Project = {
  id: "cloudcost-ai",
  slug: "cloudcost-ai",
  title: "CloudCost AI",
  shortTitle: "CloudCost",
  category: "AI",
  status: null,
  year: null,
  role: null,
  shortDescription: null,
  technologies: [],
  links: {
    live: { status: "pending" },
    repository: { status: "pending" },
  },
  media: {
    hero: null,
    screenshots: [],
    architectureDiagram: null,
  },
  caseStudy: null,
  featured: true,
  order: 3,
};
