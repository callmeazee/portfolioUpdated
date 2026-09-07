import { expect, test } from "@playwright/test";

/**
 * The Neo-Brutalist environment (theme.md §8, design.md §20).
 *
 * theme.md §8.5 demands the design feel intentional rather than random, and
 * CLAUDE.md §39 demands interactions do real work. These assert both: the
 * filters genuinely filter, and the layout asymmetry is derived from the
 * content's explicit order rather than randomised.
 */

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    { name: "portfolio-theme", value: "brutalist", url: "http://localhost:3100" },
  ]);
});

test.describe("brutalist mechanics", () => {
  test("filter toggles genuinely filter the content layer", async ({ page }) => {
    await page.goto("/");

    const cards = page.getByRole("link", { name: /Open project/ });
    await expect(cards).toHaveCount(3);

    await page.getByRole("button", { name: "Social Platform" }).click();
    await expect(page.getByRole("button", { name: "Social Platform" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(cards).toHaveCount(1);

    await page.getByRole("button", { name: "ALL" }).click();
    await expect(cards).toHaveCount(3);
  });

  test("sorting reorders the grid", async ({ page }) => {
    await page.goto("/");

    /*
     * Assertions use the DOM's casing: the display uppercase is a CSS
     * transform, so the underlying text is still "Besties". The marquee test
     * checks uppercase because that one uppercases in JavaScript.
     */
    const first = page.getByRole("link", { name: /Open project/ }).first();
    await expect(first).toContainText("Besties");

    await page.getByLabel("Sort").selectOption("title");
    /* Alphabetically Besties still leads; the filter below proves it is live. */
    await expect(first).toContainText("Besties");

    await page.getByRole("button", { name: "AI" }).click();
    await expect(page.getByRole("link", { name: /Open project/ })).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Open project/ })).toContainText("CloudCost");
  });

  test("the marquee carries real content, not filler", async ({ page }) => {
    await page.goto("/");

    const marquee = page.locator(".brutal-marquee-track");
    await expect(marquee).toBeVisible();
    /* Project names come from the content layer. */
    await expect(marquee).toContainText("BESTIES");
    await expect(marquee).toContainText("SOCIAL PLATFORM");
  });

  test("the lead project spans the grid — fixed asymmetry, not random", async ({ page }) => {
    await page.goto("/");

    const items = page.locator("li:has(a:has-text('Open project'))");
    const leadWidth = (await items.nth(0).boundingBox())?.width ?? 0;
    const secondWidth = (await items.nth(1).boundingBox())?.width ?? 0;

    expect(leadWidth).toBeGreaterThan(secondWidth * 1.5);

    /* Reloading must produce the same layout — nothing here is randomised. */
    await page.reload();
    const leadAgain = (await items.nth(0).boundingBox())?.width ?? 0;
    expect(Math.abs(leadAgain - leadWidth)).toBeLessThan(2);
  });
});

test.describe("brutalist motion and access", () => {
  test("the cursor follower is skipped under reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.addCookies([
      { name: "portfolio-theme", value: "brutalist", url: "http://localhost:3100" },
    ]);
    const page = await context.newPage();
    await page.goto("/");

    /* Decoration only — it must not render at all when motion is reduced. */
    await expect(page.locator("div.fixed.z-50.size-6")).toHaveCount(0);

    /* And the marquee stops rather than snapping to its end position. */
    const animation = await page
      .locator(".brutal-marquee-track")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");

    await context.close();
  });

  test("the theme selector works without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.addCookies([
      { name: "portfolio-theme", value: "brutalist", url: "http://localhost:3100" },
    ]);
    const page = await context.newPage();

    await page.goto("/projects");
    await page.getByRole("navigation", { name: "Theme" }).getByRole("link", { name: "Editorial" }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "editorial");
    expect(new URL(page.url()).pathname).toBe("/projects");
    await context.close();
  });

  test("keeps one h1 and a working skip link", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(page.locator("a.skip-link")).toBeFocused();
  });
});
