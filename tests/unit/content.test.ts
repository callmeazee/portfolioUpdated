import { describe, expect, it } from "vitest";

import {
  getAllProjects,
  getContentStatus,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/content";

describe("project accessors", () => {
  it("orders projects by the explicit order field, not array position (content.md §28)", () => {
    const orders = getAllProjects().map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("has unique slugs and ids", () => {
    const slugs = getProjectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    const ids = getAllProjects().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a project by slug and returns undefined otherwise", () => {
    expect(getProjectBySlug("besties")?.title).toBe("Besties");
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("features the three primary projects (README §11)", () => {
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual([
      "besties",
      "ecommerce",
      "cloudcost-ai",
    ]);
  });
});

describe("no-fabrication invariants (CLAUDE.md §9)", () => {
  it("never carries an invented placeholder URL", () => {
    for (const project of getAllProjects()) {
      for (const link of [project.links.live, project.links.repository]) {
        if (link.status === "available") {
          expect(link.url).not.toMatch(/example\.com|yourhandle|TODO|lorem/i);
          expect(link.url).toMatch(/^https?:\/\//);
        }
      }
    }
  });

  it("uses null for pending values, never a filler string (ADR-011)", () => {
    for (const project of getAllProjects()) {
      for (const value of [project.shortDescription, project.role, project.status]) {
        /* null is the sanctioned "pending" marker; anything present must be real. */
        if (value === null) continue;
        expect(value).not.toBe("");
        expect(value).not.toMatch(/^(TBD|TODO|N\/A|-|pending)$/i);
      }
    }
  });

  it("only reports measured performance when metrics exist (content.md §20)", () => {
    for (const project of getAllProjects()) {
      const performance = project.caseStudy?.performance;
      if (performance?.measured) {
        expect(performance.metrics.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("content completeness reporting (ADR-006)", () => {
  const status = getContentStatus();

  it("reports gaps as dotted paths", () => {
    expect(status.gaps.length).toBeGreaterThan(0);
    for (const gap of status.gaps) {
      expect(gap).toMatch(/^(profile|contact|projects)\./);
    }
  });

  it("counts every pending profile and contact field", () => {
    expect(status.gaps).toContain("profile.positioning");
    expect(status.gaps).toContain("profile.shortBio");
    expect(status.gaps).toContain("contact.email");
    /* Pending links are leaf gaps, not containers to descend into. */
    expect(status.gaps).toContain("contact.github");
    expect(status.gaps).not.toContain("contact.github.status");
  });

  it("blocks publishing while any featured project is a placeholder", () => {
    expect(status.isPublishable).toBe(false);
    for (const project of getFeaturedProjects()) {
      expect(status.publishBlockers.some((b) => b.startsWith(project.slug))).toBe(true);
    }
  });

  it("agrees with isPublishable", () => {
    expect(status.isPublishable).toBe(status.publishBlockers.length === 0);
  });
});
