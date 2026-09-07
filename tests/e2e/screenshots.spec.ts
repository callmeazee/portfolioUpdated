import { test, type Page } from "@playwright/test";

/**
 * Not assertions — a visual QA harness (design.md §27, ISS-009). Run with
 * `npx playwright test screenshots` to regenerate.
 */
const OUT = process.env.SHOT_DIR ?? "test-results/shots";
const THEMES = ["editorial", "terminal", "brutalist", "notion"] as const;

async function shoot(page: Page, theme: string, route: string, label: string, width: number) {
  await page.context().addCookies([
    { name: "portfolio-theme", value: theme, url: "http://localhost:3100" },
  ]);
  await page.setViewportSize({ width, height: width < 500 ? 780 : 900 });
  await page.goto(route);
  await page.screenshot({ path: `${OUT}/${theme}-${label}.png`, fullPage: true });
}

for (const theme of THEMES) {
  test(`shots: ${theme}`, async ({ page }) => {
    await shoot(page, theme, "/", "home-desktop", 1440);
    await shoot(page, theme, "/", "home-mobile", 390);
    await shoot(page, theme, "/projects/connectverse", "case-desktop", 1440);
    /* A generic route, to confirm PageKit themes it rather than a neutral shell (ISS-016). */
    await shoot(page, theme, "/engineering", "generic-desktop", 1440);
  });
}
