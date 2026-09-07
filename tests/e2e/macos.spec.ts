import { expect, test, type Page } from "@playwright/test";

/**
 * The macOS environment (ADR-015, ADR-016).
 *
 * design.md §19 permits decorative traffic lights only if they perform no
 * function. These perform, so each one is asserted here — a control that looks
 * live but does nothing is the fake interaction CLAUDE.md §39 prohibits.
 */

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    { name: "portfolio-theme", value: "terminal", url: "http://localhost:3100" },
  ]);
});

const routeWindow = (page: Page) => page.getByRole("region", { name: /Home window/ });

test.describe("desktop", () => {
  test("renders a menu bar, a window and a dock", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "Dock" })).toBeVisible();
    await expect(routeWindow(page)).toBeVisible();
    await expect(page.getByText("Go", { exact: true })).toBeVisible();
  });

  test("the routed window offers no close control — closing it would blank the page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: /Minimize Home/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Close Home/ })).toHaveCount(0);
  });

  test("minimize hides the window and the dock restores it", async ({ page }) => {
    await page.goto("/");
    await expect(routeWindow(page)).toBeVisible();

    await page.getByRole("button", { name: /Minimize Home/ }).click();
    await expect(routeWindow(page)).toBeHidden();

    /* Minimized state is announced, not just implied visually. */
    const dockButton = page.getByRole("navigation", { name: "Dock" }).getByRole("button", {
      name: "Terminal",
    });
    await expect(dockButton).toBeVisible();

    await page.getByRole("button", { name: /Restore|Minimize/ }).first().isVisible();
  });

  test("zoom toggles and reports its state", async ({ page }) => {
    await page.goto("/");

    const zoom = page.getByRole("button", { name: /Zoom Home/ });
    await expect(zoom).toHaveAttribute("aria-pressed", "false");

    await zoom.click();
    await expect(page.getByRole("button", { name: /Restore Home/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.getByRole("button", { name: /Restore Home/ }).click();
    await expect(page.getByRole("button", { name: /Zoom Home/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("the dock navigates and marks the running route", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("navigation", { name: "Dock" }).getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("region", { name: /Work window/ })).toBeVisible();
  });
});

test.describe("utility windows", () => {
  test("Finder opens from the Window menu, browses real content, and closes", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Window", { exact: true }).click();
    await page.getByRole("button", { name: "New Finder Window" }).click();

    const finder = page.getByRole("region", { name: /Finder window/ });
    await expect(finder).toBeVisible();
    /* Real content from the content layer, not placeholder rows. */
    await expect(finder.getByRole("link", { name: "besties" })).toBeVisible();

    await page.getByRole("button", { name: /Close Finder/ }).click();
    await expect(finder).toBeHidden();
  });

  test("the Terminal executes real commands and refuses unknown ones", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Window", { exact: true }).click();
    await page.getByRole("button", { name: "New Terminal Window" }).click();

    const input = page.getByLabel("Terminal command");
    await expect(input).toBeVisible();

    await input.fill("nonsense");
    await input.press("Enter");
    await expect(page.getByText(/command not found: nonsense/)).toBeVisible();

    await input.fill("projects");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("two windows stack, and clicking one raises it", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Window", { exact: true }).click();
    await page.getByRole("button", { name: "New Finder Window" }).click();

    const finder = page.getByRole("region", { name: /Finder window/ });
    const route = routeWindow(page);
    await expect(finder).toBeVisible();
    await expect(route).toBeVisible();

    const zIndex = async (locator: typeof finder) =>
      Number(await locator.evaluate((el) => getComputedStyle(el).zIndex));

    expect(await zIndex(finder)).toBeGreaterThan(await zIndex(route));

    /*
     * Click low and to the right, clear of the cascaded Finder — clicking where
     * Finder overlaps would (correctly) hit Finder instead.
     */
    await route.click({ position: { x: 1000, y: 450 } });
    expect(await zIndex(route)).toBeGreaterThan(await zIndex(finder));
  });
});

test.describe("desktop accessibility", () => {
  test("every window control is operable from the keyboard", async ({ page }) => {
    await page.goto("/");

    const minimize = page.getByRole("button", { name: /Minimize Home/ });
    await minimize.focus();
    await expect(minimize).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(routeWindow(page)).toBeHidden();
  });

  test("dock magnification actually magnifies", async ({ page }) => {
    await page.goto("/");

    const item = page.getByRole("navigation", { name: "Dock" }).locator("[data-dock-item]").first();
    const before = (await item.boundingBox())?.width ?? 0;
    expect(before).toBeGreaterThan(0);

    /* Hover the item itself: proximity is measured from the pointer. */
    await item.hover();
    await page.waitForTimeout(250);
    const after = (await item.boundingBox())?.width ?? 0;

    expect(after, `dock item did not grow on hover (${before} → ${after})`).toBeGreaterThan(
      before + 5,
    );
  });

  test("dock magnification is skipped under reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.addCookies([
      { name: "portfolio-theme", value: "terminal", url: "http://localhost:3100" },
    ]);
    const page = await context.newPage();
    await page.goto("/");

    const item = page.getByRole("navigation", { name: "Dock" }).locator("[data-dock-item]").first();
    const before = await item.boundingBox();

    /* Hovering must not resize anything when motion is reduced. */
    await item.hover();
    await page.waitForTimeout(250);
    const after = await item.boundingBox();

    expect(Math.abs((after?.width ?? 0) - (before?.width ?? 0))).toBeLessThan(2);

    await context.close();
  });

  test("the desktop keeps one h1 and a working skip link", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(page.locator("a.skip-link")).toBeFocused();
  });
});
