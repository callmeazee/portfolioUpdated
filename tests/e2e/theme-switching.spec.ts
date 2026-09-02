import { expect, test } from "@playwright/test";

/** README §3 / theme.md §4 — switching must persist, survive reload, and keep the route. */
test.describe("theme switching", () => {
  test("editorial switcher changes theme and persists across reload", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "editorial");

    /* The radio is sr-only; a real user clicks the visible label. */
    await page.locator('label:has(input[value="terminal"])').click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "terminal");

    /* The route must survive the switch — it is a refresh, not a navigation. */
    expect(new URL(page.url()).pathname).toBe("/projects");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "terminal");
  });

  test("switching does not lose scroll position", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 600));
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(0);

    await page.locator('label:has(input[value="notion"])').click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "notion");

    const after = await page.evaluate(() => window.scrollY);
    expect(Math.abs(after - before)).toBeLessThan(150);
  });

  test("a ?theme= link outranks the stored cookie and then persists", async ({ page }) => {
    await page.context().addCookies([
      { name: "portfolio-theme", value: "terminal", url: "http://localhost:3100" },
    ]);

    await page.goto("/?theme=brutalist");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "brutalist");

    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "brutalist");
  });

  test("an invalid ?theme= falls back without breaking the page", async ({ page }) => {
    const response = await page.goto("/?theme=hacker");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "editorial");
    await expect(page.locator("#main")).toBeVisible();
  });

  test("terminal footer ?theme= links work without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await context.addCookies([
      { name: "portfolio-theme", value: "terminal", url: "http://localhost:3100" },
    ]);

    await page.goto("/projects");
    await page.getByRole("link", { name: "notion", exact: true }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "notion");
    /* The path must be preserved by the relative href. */
    expect(new URL(page.url()).pathname).toBe("/projects");

    await context.close();
  });
});
