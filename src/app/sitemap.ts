import type { MetadataRoute } from "next";

import { getProjectSlugs, notes } from "@/content";
import { siteConfig } from "@/config/site";

/**
 * Theme-independent (README §16). Project and note entries derive from the
 * canonical content layer rather than a hand-maintained list, so the sitemap
 * cannot fall out of step with what actually exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/projects",
    "/experience",
    "/engineering",
    "/about",
    "/notes",
    "/contact",
    "/resume",
  ];

  const projectRoutes = getProjectSlugs().map((slug) => `/projects/${slug}`);
  const noteRoutes = notes.map((note) => `/notes/${note.slug}`);

  return [...staticRoutes, ...projectRoutes, ...noteRoutes].map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
