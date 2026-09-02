import { expect, test, type Page } from "@playwright/test";

const THEMES = ["editorial", "terminal", "brutalist", "notion"] as const;
const ROUTES = ["/", "/projects", "/projects/besties", "/experience", "/notes", "/contact"];

async function setTheme(page: Page, theme: string) {
  await page.context().addCookies([
    { name: "portfolio-theme", value: theme, url: "http://localhost:3100" },
  ]);
}

/** ISS-009: the accessibility baseline was only ever verified in the stylesheet. */
test.describe("accessibility baseline", () => {
  test("skip link is hidden until focused, then visible and functional", async ({ page }) => {
    await page.goto("/");

    const skip = page.locator("a.skip-link");
    /* Off-screen by transform, so it occupies no visual space until focused. */
    const before = await skip.evaluate((el) => getComputedStyle(el).transform);

    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();

    const after = await skip.evaluate((el) => getComputedStyle(el).transform);
    expect(before).not.toBe(after);

    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeVisible();
  });

  for (const theme of THEMES) {
    test(`${theme}: keyboard focus is always visible`, async ({ page }) => {
      await setTheme(page, theme);
      await page.goto("/");

      /* Walk the first several tab stops and assert each paints a focus ring. */
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press("Tab");

        const ring = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const style = getComputedStyle(el);
          const width = parseFloat(style.outlineWidth || "0");
          return {
            tag: el.tagName,
            outline: width,
            style: style.outlineStyle,
            /* The switcher hides its radio and rings the wrapping label instead. */
            parentOutline: el.parentElement
              ? parseFloat(getComputedStyle(el.parentElement).outlineWidth || "0")
              : 0,
          };
        });

        if (ring === null) continue;
        const visible = (ring.outline > 0 && ring.style !== "none") || ring.parentOutline > 0;
        expect(visible, `${theme}: ${ring.tag} had no visible focus indicator`).toBe(true);
      }
    });
  }

  for (const theme of THEMES) {
    test(`${theme}: exactly one h1 per page`, async ({ page }) => {
      await setTheme(page, theme);
      for (const route of ROUTES) {
        await page.goto(route);
        const count = await page.locator("h1").count();
        expect(count, `${theme} ${route} had ${count} h1 elements`).toBe(1);
      }
    });
  }

  test("reduced motion collapses animation", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const duration = await page.evaluate(() => {
      const el = document.querySelector(".editorial-reveal");
      return el ? getComputedStyle(el).animationDuration : null;
    });

    /*
     * The global prefers-reduced-motion block clamps everything to 0.01ms.
     * Chromium serialises that as "1e-05s", so compare seconds, not strings.
     */
    expect(duration).not.toBeNull();
    expect(parseFloat(duration as string)).toBeLessThan(0.001);

    const scroll = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(scroll).toBe("auto");

    await context.close();
  });
});

/** ISS-009: no horizontal overflow, on every theme, at the narrowest target. */
test.describe("responsive", () => {
  for (const theme of THEMES) {
    test(`${theme}: no horizontal overflow at 360px`, async ({ page }) => {
      await setTheme(page, theme);
      await page.setViewportSize({ width: 360, height: 780 });

      for (const route of ROUTES) {
        await page.goto(route);
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(
          overflow.scrollWidth,
          `${theme} ${route} overflowed by ${overflow.scrollWidth - overflow.clientWidth}px`,
        ).toBeLessThanOrEqual(overflow.clientWidth + 1);
      }
    });
  }
});
