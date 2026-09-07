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

  test("no on-screen section is ever transparent, at any viewport height", async ({ page }) => {
    /*
     * The previous version of this test scrolled to the bottom and checked one
     * section, and passed while the bug was live: at 1440x900 the "Selected
     * work" section sat IN the viewport at opacity 0.01, and taller monitors
     * hid a different one. Viewport height is the variable that mattered.
     */
    for (const height of [720, 900, 1200, 1800]) {
      await page.setViewportSize({ width: 1440, height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(250);

      const transparent = await page.$$eval("section", (elements) =>
        elements
          .filter((el) => el.getBoundingClientRect().top < window.innerHeight)
          .map((el) => ({
            id: el.getAttribute("aria-labelledby") ?? "?",
            opacity: Number(getComputedStyle(el).opacity),
          }))
          .filter((entry) => entry.opacity < 0.9),
      );

      expect(
        transparent,
        `at 1440x${height}, sections on screen but transparent: ${transparent
          .map((t) => `${t.id}=${t.opacity}`)
          .join(", ")}`,
      ).toEqual([]);
    }
  });

  test("the case study contents list only advertises sections that exist", async ({ page }) => {
    await page.goto("/projects/connectverse");

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
    await page.goto("/projects/connectverse");

    /* Plain anchors — only the "currently reading" highlight needs JavaScript. */
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeAttached();
    await context.close();
  });
});
