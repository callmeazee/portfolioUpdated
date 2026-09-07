import type { Profile } from "@/types/content";

/**
 * Sourced from the résumé supplied 2026-09-02. Every value here is the
 * subject's own wording or a direct restatement of it — nothing inferred.
 *
 * `philosophy` remains null: the résumé states what was built, not how its
 * author thinks about building, and inventing an engineering philosophy would
 * be exactly the kind of flattering fiction CLAUDE.md §9 forbids.
 */
export const profile: Profile = {
  fullName: "Azeez Ahmed Khan",
  displayName: "Azeez",
  title: "Full-Stack Developer",

  headline: "I build SaaS products, AI features and real-time web applications.",

  positioning:
    "Full-stack developer with 2+ years building scalable SaaS products and modern web applications — React, Next.js, TypeScript, Node.js and MongoDB, deployed on AWS and Docker.",

  location: "Bhopal, India",
  availability: "Open to full-time roles and freelance work",

  shortBio:
    "Full-stack developer with 2+ years of experience building scalable SaaS products and modern web applications. I work across AI integration, e-commerce, real-time systems, payment integration and production deployments.",

  longBio: [
    "I am a full-stack developer based in Bhopal, India, with over two years of experience building SaaS products and modern web applications. My day-to-day is React, Next.js and TypeScript on the front end, Node.js and Express with MongoDB behind it, and AWS and Docker to ship it.",
    "Most of my work sits in one of four areas: AI features, e-commerce, real-time systems and payment integration. At Affy Cloud I build production AI SaaS features — reusable components, dashboards and API integrations — and spend a fair amount of time on performance and keeping a shared codebase workable.",
    "Outside of work I have built and deployed several products end to end: an AI cloud-cost optimisation platform, a production e-commerce platform with Razorpay payments and an admin dashboard, a real-time social platform on Socket.IO, and a secure file-sharing service. Each one is live and linked from this site.",
  ],

  /* Not stated in the résumé; left pending rather than guessed. */
  philosophy: null,
  currentFocus: "Production AI SaaS features — RAG, vector search and LLM integration.",

  primaryCta: { label: "View work", href: "/projects" },
  secondaryCta: { label: "Get in touch", href: "/contact" },
};
