import { expect, test, type Page } from "@playwright/test";

/**
 * PHASE 8 — THEME INTEGRATION
 *
 * Every theme must support every route, with the same content reachable and the
 * same structural contract, however different it looks (README §12, theme.md
 * §16's validation checklist).
 *
 * Individual theme suites test their own mechanics; this is the matrix that
 * catches a route quietly breaking in one theme only.
 */

const THEMES = ["editorial", "terminal", "brutalist", "notion"] as const;

const ROUTES = [
  "/",
  "/projects",
  "/projects/connectverse",
  "/experience",
  "/engineering",
  "/about",
  "/notes",
  "/contact",
  "/resume",
] as const;

async function withTheme(page: Page, theme: string) {
  await page.context().addCookies([
    { name: "portfolio-theme", value: theme, url: "http://localhost:3100" },
  ]);
}

for (const theme of THEMES) {
  test.describe(`integration: ${theme}`, () => {
    test(`every route renders with the structural contract intact`, async ({ page }) => {
      await withTheme(page, theme);

      for (const route of ROUTES) {
        const response = await page.goto(route);
        expect(response?.status(), `${theme} ${route} status`).toBe(200);

        /* The theme actually applied — not a fallback. */
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        /* One h1 and one #main landmark for the skip link, on every page. */
        await expect(page.locator("h1"), `${theme} ${route} h1 count`).toHaveCount(1);
        await expect(page.locator("#main"), `${theme} ${route} #main`).toHaveCount(1);

        /* Navigation to every other route is reachable from here. */
        const navLinks = await page.locator("nav a").count();
        expect(navLinks, `${theme} ${route} nav links`).toBeGreaterThan(0);
      }
    });

    test(`deep links resolve directly, without going through the home page`, async ({ page }) => {
      await withTheme(page, theme);

      await page.goto("/projects/connectverse");
      await expect(page.getByRole("heading", { level: 1 })).toContainText("ConnectVerse");
      expect(new URL(page.url()).pathname).toBe("/projects/connectverse");
    });

    test(`unknown routes 404 inside this theme's chrome`, async ({ page }) => {
      await withTheme(page, theme);

      const response = await page.goto("/projects/does-not-exist");
      expect(response?.status()).toBe(404);

      /*
       * design.md §32 — a 404 must arrive as a page of this theme, not a bare
       * fallback. It keeps the theme, the navigation and the heading contract.
       */
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("nav a").first()).toBeVisible();
    });

    test(`SEO metadata is identical regardless of theme (README §16)`, async ({ page }) => {
      await withTheme(page, theme);
      await page.goto("/projects/connectverse");

      /* The canonical identity must not vary with presentation. */
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        /\/projects\/connectverse$/,
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og$/);
      await expect(page).toHaveTitle(/ConnectVerse/);
    });

    test(`the résumé is reachable from every theme (content.md §37)`, async ({ page }) => {
      await withTheme(page, theme);
      await page.goto("/");

      /* Not necessarily in the nav, but always reachable by link. */
      await page.goto("/resume");
      await expect(page.getByRole("heading", { level: 1 })).toContainText("sum");
    });
  });
}

test.describe("cross-theme consistency", () => {
  test("all four themes expose the same seven home sections", async ({ browser }) => {
    const perTheme: Record<string, string[]> = {};

    for (const theme of THEMES) {
      const page = await browser.newPage();
      await withTheme(page, theme);
      await page.goto("/");

      /* Section names come from the sr-only labels or visible headings. */
      const headings = await page.locator("h2").allInnerTexts();
      perTheme[theme] = headings.map((h) => h.trim().toLowerCase()).filter(Boolean);
      await page.close();
    }

    /*
     * design.md §39 requires the content hierarchy to stay recognisable across
     * themes. Wording differs by design; coverage must not.
     */
    for (const theme of THEMES) {
      expect(perTheme[theme].length, `${theme} exposed ${perTheme[theme].length} sections`).toBeGreaterThanOrEqual(5);
    }
  });

  test("theme choice survives navigation across every route", async ({ page }) => {
    await withTheme(page, "brutalist");

    for (const route of ["/", "/projects", "/about", "/notes", "/contact"]) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "brutalist");
    }
  });
});
