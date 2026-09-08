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
    expect(getProjectBySlug("connectverse")?.title).toBe("ConnectVerse");
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("features exactly three projects, led by the ones with real case studies", () => {
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual([
      "cloudspire-ai",
      "snitcher",
      "besties",
    ]);
  });

  it("only features projects that have a case study", () => {
    /* The homepage is the strongest work (README §30 rule 14); a featured
       project with nothing behind it wastes the slot. */
    for (const project of getFeaturedProjects()) {
      expect(project.caseStudy, `${project.slug} has no case study`).not.toBeNull();
    }
  });

  it("keeps the additional projects off the homepage (README §30 rule 14)", () => {
    const unfeatured = getAllProjects().filter((project) => !project.featured);
    expect(unfeatured.map((p) => p.slug)).toEqual(["connectverse", "filemoon-cloud", "movieplas"]);
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

  it("treats a pending link as a leaf gap, not a container to descend into", () => {
    /*
     * A structural property of the walker rather than an assertion about which
     * fields happen to be empty today — the latter goes stale the moment real
     * content lands, which is exactly what happened to the previous version of
     * this test.
     */
    for (const gap of status.gaps) {
      expect(gap.endsWith(".status")).toBe(false);
      expect(gap.endsWith(".url") && gap.startsWith("projects")).toBe(false);
    }
  });

  it("reports the profile fields that are genuinely still open", () => {
    /* Not stated on the résumé; deliberately not invented. */
    expect(status.gaps).toContain("profile.philosophy");
    /* Supplied, so they must no longer be reported. */
    expect(status.gaps).not.toContain("profile.positioning");
    expect(status.gaps).not.toContain("contact.email");
  });

  it("every featured project satisfies the publish gate", () => {
    /*
     * The gate (ADR-006) requires a description, status, role, a verified stack
     * and a case study on each featured project. Asserting the fields directly
     * means this keeps working whether or not the gate is currently open.
     */
    for (const project of getFeaturedProjects()) {
      expect(project.shortDescription, `${project.slug} description`).not.toBeNull();
      expect(project.status, `${project.slug} status`).not.toBeNull();
      expect(project.role, `${project.slug} role`).not.toBeNull();
      expect(project.technologies.length, `${project.slug} stack`).toBeGreaterThan(0);
      expect(project.caseStudy, `${project.slug} case study`).not.toBeNull();
    }

    expect(status.publishBlockers).toEqual([]);
    expect(status.isPublishable).toBe(true);
  });

  it("agrees with isPublishable", () => {
    expect(status.isPublishable).toBe(status.publishBlockers.length === 0);
  });
});
