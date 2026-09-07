import { expect, test, type Page } from "@playwright/test";

/**
 * PER-THEME JAVASCRIPT BUDGET
 *
 * ADR-013 claimed the dynamic-import renderer keeps each environment's code out
 * of the other three, and theme.md §14 requires it. These tests were written to
 * verify that claim and instead disproved it — see ISS-026.
 *
 * Root cause: `src/themes/renderer.ts` dynamic-imports theme modules from a
 * Server Component. Next builds the client-reference manifest statically per
 * route, so because any of the four themes could be selected, every theme's
 * client components land in the same route bundle. `import()` in a server
 * component splits the SERVER graph, not the client one.
 *
 * The tests below therefore assert what is actually true today, plus a ceiling
 * that catches growth. When the splitting is fixed, `themes currently share one
 * bundle` is the test that should start failing — that failure is the signal
 * the fix landed, and it should then be replaced with a per-theme assertion.
 */

async function chunksFor(page: Page, theme: string) {
  /* Keyed by URL: the same chunk can be reported more than once per load. */
  const chunks = new Map<string, number>();

  page.on("response", async (response) => {
    const url = response.url();
    if (!url.includes("/_next/static") || !url.endsWith(".js")) return;
    try {
      chunks.set(url, (await response.body()).byteLength);
    } catch {
      chunks.set(url, 0);
    }
  });

  await page.context().addCookies([
    { name: "portfolio-theme", value: theme, url: "http://localhost:3100" },
  ]);
  await page.goto("/", { waitUntil: "networkidle" });

  const names = [...chunks.keys()].map((url) => url.split("/").pop()!).sort();
  const bytes = [...chunks.values()].reduce((total, size) => total + size, 0);

  return { names, bytes };
}

test.describe("per-theme JavaScript budget", () => {
  test("every theme stays under the page-weight ceiling", async ({ browser }) => {
    for (const theme of ["editorial", "terminal", "brutalist", "notion"]) {
      const page = await browser.newPage();
      const { bytes } = await chunksFor(page, theme);
      await page.close();

      expect(bytes, `${theme} shipped ${Math.round(bytes / 1024)}KB of JavaScript`).toBeGreaterThan(0);
      expect(bytes, `${theme} shipped ${Math.round(bytes / 1024)}KB of JavaScript`).toBeLessThan(
        800 * 1024,
      );
    }
  });

  test("themes currently share one bundle — ISS-026, not yet split", async ({ browser }) => {
    const editorialPage = await browser.newPage();
    const editorial = await chunksFor(editorialPage, "editorial");
    await editorialPage.close();

    const terminalPage = await browser.newPage();
    const terminal = await chunksFor(terminalPage, "terminal");
    await terminalPage.close();

    /*
     * Documents the defect rather than hiding it. If this ever fails, per-theme
     * splitting has started working — replace this test with one asserting that
     * Editorial ships strictly less than the macOS desktop.
     */
    expect(editorial.names).toEqual(terminal.names);
  });
});
