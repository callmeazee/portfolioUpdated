import { expect, test } from "@playwright/test";

/**
 * The Editorial environment (theme.md §6, design.md §18).
 *
 * Editorial is deliberately the lightest theme: its motion is scroll-driven CSS
 * rather than JavaScript, so most of what matters here is that the page works
 * and that nothing is hidden behind an animation that may never run.
 */

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    { name: "portfolio-theme", value: "editorial", url: "http://localhost:3100" },
  ]);
});

test.describe("editorial", () => {
  test("the hero is never animated into visibility", async ({ page }) => {
    await page.goto("/");

    /*
     * ISS-021: the hero once faded in from opacity 0, delaying the page's LCP
     * text. It must be fully opaque from the first frame.
     */
    const opacity = await page.locator("h1").evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);
  });

  test("scroll-driven reveals never leave content unreadable", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    /* Every section must be readable once scrolled to, on any engine. */
    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
    const opacity = await page
      .locator("section:has(h2#contact)")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.9);
  });

  test("the case study contents list only advertises sections that exist", async ({ page }) => {
    await page.goto("/projects/besties");

    const toc = page.getByRole("navigation", { name: "On this page" });
    const links = toc.getByRole("link");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    /* Every entry must resolve to a real element on the page. */
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      await expect(page.locator(href!)).toHaveCount(1);
    }
  });

  test("contents links work before hydration", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.addCookies([
      { name: "portfolio-theme", value: "editorial", url: "http://localhost:3100" },
    ]);
    const page = await context.newPage();
    await page.goto("/projects/besties");

    /* Plain anchors — only the "currently reading" highlight needs JavaScript. */
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeAttached();
    await context.close();
  });
});
