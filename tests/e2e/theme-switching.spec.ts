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

  test("switching between document-scrolling themes keeps scroll position", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 600));
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(0);

    await page.locator('label:has(input[value="brutalist"])').click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "brutalist");

    /* A refresh, not a navigation — the scroll position survives. */
    const after = await page.evaluate(() => window.scrollY);
    expect(Math.abs(after - before)).toBeLessThan(150);
  });

  test("switching into an app-shell theme keeps the route, though not scroll", async ({ page }) => {
    /*
     * README §3 asks for scroll preservation "where practical". It is not
     * practical here: the macOS desktop and the Notion workspace are
     * fixed-viewport shells that scroll an inner container, so window scroll is
     * 0 by definition after the switch. What must survive is the route, and
     * this asserts that it does.
     */
    await page.goto("/projects");
    await page.evaluate(() => window.scrollTo(0, 400));

    await page.locator('label:has(input[value="notion"])').click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "notion");

    expect(new URL(page.url()).pathname).toBe("/projects");
    await expect(page.locator("#main")).toBeVisible();
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

  test("the macOS Theme menu works without JavaScript", async ({ browser }) => {
    /*
     * The desktop is a client environment, but switching away from it must not
     * require JavaScript — otherwise a shared ?theme=terminal link could strand
     * someone. `<details>` menus and `?theme=` anchors both work unscripted.
     */
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await context.addCookies([
      { name: "portfolio-theme", value: "terminal", url: "http://localhost:3100" },
    ]);

    await page.goto("/projects");
    await page.getByText("Theme", { exact: true }).click();
    await page.getByRole("link", { name: /Notion/ }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "notion");
    /* The path must be preserved by the relative href. */
    expect(new URL(page.url()).pathname).toBe("/projects");

    await context.close();
  });
});
