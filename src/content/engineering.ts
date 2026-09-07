import type { EngineeringArea } from "@/types/content";

/**
 * content.md §31 — technical areas, each tied back to projects that actually
 * demonstrate it.
 *
 * Every area here is evidenced by the résumé: the technology appears in the
 * skills list AND in at least one shipped project. Nothing is listed on the
 * strength of familiarity alone, and `notes` stays null because the source
 * says what was used, not how.
 */
export const engineeringAreas: EngineeringArea[] = [
  {
    id: "ai-integration",
    name: "AI integration",
    shortDescription:
      "Building product features on top of LLMs — retrieval, vector search and prompt design — in production SaaS.",
    technologies: ["RAG", "Vector search", "Prompt engineering", "LLM integration"],
    relatedProjectSlugs: ["cloudspire-ai"],
    notes: null,
  },
  {
    id: "realtime",
    name: "Real-time systems",
    shortDescription:
      "Socket.IO for live interaction — notifications and activity delivered as they happen rather than on refresh.",
    technologies: ["Socket.IO", "Node.js"],
    relatedProjectSlugs: ["connectverse"],
    notes: null,
  },
  {
    id: "payments",
    name: "Payments and commerce",
    shortDescription:
      "Razorpay integration alongside cart, order management and an admin dashboard in a production e-commerce build.",
    technologies: ["Razorpay", "Express.js", "MongoDB"],
    relatedProjectSlugs: ["snitcher"],
    notes: null,
  },
  {
    id: "auth",
    name: "Authentication and APIs",
    shortDescription:
      "JWT-based authentication over REST APIs, with protected routes and role-separated admin access.",
    technologies: ["JWT", "REST APIs", "Express.js"],
    relatedProjectSlugs: ["snitcher", "filemoon-cloud"],
    notes: null,
  },
  {
    id: "cloud",
    name: "Cloud and deployment",
    shortDescription:
      "Shipping and running applications on AWS with Docker, from local containers through to deployed services.",
    technologies: ["AWS", "Docker", "Git"],
    relatedProjectSlugs: ["cloudspire-ai"],
    notes: null,
  },
];
