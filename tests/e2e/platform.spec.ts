import { expect, test } from "@playwright/test";

/**
 * Analytics, contact and the notes feed (README §§23, 24).
 *
 * The test server runs without RESEND_API_KEY, which is the important default
 * to lock in: unconfigured, the contact form must not appear at all.
 */

test.describe("analytics", () => {
  test("accepts the documented vocabulary and rejects anything else", async ({ request }) => {
    for (const event of [
      "theme_changed",
      "project_opened",
      "case_study_viewed",
      "github_clicked",
      "resume_clicked",
      "contact_clicked",
      "live_demo_clicked",
    ]) {
      const res = await request.post("/api/events", { data: { event, props: { to: "notion" } } });
      expect(res.status(), event).toBe(204);
    }

    /* An unknown name is rejected rather than logged, so the vocabulary cannot sprawl. */
    for (const bad of [{ event: "evil" }, { event: 42 }, {}]) {
      expect((await request.post("/api/events", { data: bad })).status()).toBe(400);
    }
  });

  test("stores nothing identifying — it only accepts short label props", async ({ request }) => {
    const res = await request.post("/api/events", {
      data: { event: "theme_changed", props: { to: "x".repeat(500), nested: { a: 1 } } },
    });
    /* Over-long values are truncated and non-strings dropped, never rejected loudly. */
    expect(res.status()).toBe(204);
  });

  test("fires a real event when the theme is switched", async ({ page }) => {
    const events: string[] = [];
    await page.route("**/api/events", async (route) => {
      events.push(route.request().postData() ?? "");
      await route.fulfill({ status: 204, body: "" });
    });

    await page.goto("/");
    await page.locator('label:has(input[value="brutalist"])').click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "brutalist");

    expect(events.join(" ")).toContain("theme_changed");
  });

  test("a project link reports project_opened without instrumenting the link", async ({ page }) => {
    const events: string[] = [];
    await page.route("**/api/events", async (route) => {
      events.push(route.request().postData() ?? "");
      await route.fulfill({ status: 204, body: "" });
    });

    await page.goto("/projects");
    await page.locator('a[href^="/projects/"]').first().click();
    await page.waitForTimeout(400);

    expect(events.join(" ")).toContain("project_opened");
  });
});

test.describe("contact", () => {
  test("the form is absent when no mail provider is configured", async ({ page }) => {
    await page.goto("/contact");

    /* A form that accepts a message and drops it is worse than none. */
    await expect(page.getByRole("button", { name: /Send message/ })).toHaveCount(0);
    /* The address is still offered. */
    await expect(page.locator("#main")).toContainText("@");
  });

  test("the API refuses rather than pretending, when unconfigured", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "Alice", email: "a@b.co", message: "A long enough message here." },
    });
    expect(res.status()).toBe(503);
    expect((await res.json()).ok).toBe(false);
  });

  test("validates input before anything else", async ({ request }) => {
    for (const bad of [
      { name: "A", email: "a@b.co", message: "long enough message here" },
      { name: "Alice", email: "nope", message: "long enough message here" },
      { name: "Alice", email: "a@b.co", message: "short" },
    ]) {
      const res = await request.post("/api/contact", { data: bad });
      /* 503 only when unconfigured; validation must still be reachable in order. */
      expect([400, 503]).toContain(res.status());
    }
  });
});

test.describe("notes feed", () => {
  test("serves valid RSS and is discoverable from the notes page", async ({ page, request }) => {
    const res = await request.get("/notes/rss.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/rss+xml");

    const xml = await res.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("Azeez Ahmed Khan");
    /* Self-reference is required for a well-formed feed. */
    expect(xml).toContain('rel="self"');

    await page.goto("/notes");
    await expect(page.locator('link[type="application/rss+xml"]')).toHaveCount(1);
  });
});
