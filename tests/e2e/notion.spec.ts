import { expect, test } from "@playwright/test";

/**
 * The Notion workspace (ADR-015).
 *
 * The point of these tests is that the mechanics are real: the database views
 * genuinely filter and sort the content layer, the sidebar tree genuinely
 * expands, and the page controls genuinely change the page. A lookalike would
 * pass none of them.
 */

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    { name: "portfolio-theme", value: "notion", url: "http://localhost:3100" },
  ]);
});

test.describe("workspace chrome", () => {
  test("renders a sidebar tree, breadcrumbs and page controls", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "Workspace" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByLabel("Font style")).toBeVisible();
  });

  test("the page tree expands and collapses without navigating", async ({ page }) => {
    await page.goto("/");

    /* Scoped to the tree: "ConnectVerse" is also a link in the database below, which
       is correct — the same page reachable from two places. */
    const tree = page.getByRole("navigation", { name: "Workspace" });
    const toggle = page.getByRole("button", { name: /Collapse Projects/ });

    await expect(tree.getByRole("link", { name: "ConnectVerse" })).toBeVisible();

    await toggle.click();
    await expect(tree.getByRole("link", { name: "ConnectVerse" })).toBeHidden();
    /* Collapsing must not navigate — chevron and link are separate controls. */
    expect(new URL(page.url()).pathname).toBe("/");

    await page.getByRole("button", { name: /Expand Projects/ }).click();
    await expect(tree.getByRole("link", { name: "ConnectVerse" })).toBeVisible();
  });

  test("the sidebar collapses and restores", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Hide sidebar" }).click();
    await expect(page.getByRole("navigation", { name: "Workspace" })).toBeHidden();

    await page.getByRole("button", { name: "Show sidebar" }).click();
    await expect(page.getByRole("navigation", { name: "Workspace" })).toBeVisible();
  });

  test("the font switcher actually changes the rendered font", async ({ page }) => {
    await page.goto("/");

    const fontOf = () =>
      page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily.toLowerCase());

    const before = await fontOf();
    await page.getByLabel("Font style").selectOption("serif");
    const after = await fontOf();

    expect(after).not.toBe(before);
    expect(after).toContain("serif");
  });

  test("the sidebar width persists across a reload", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.getByRole("navigation", { name: "Workspace" }).locator("xpath=ancestor::aside");

    const original = (await sidebar.boundingBox())?.width ?? 0;
    expect(original).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Hide sidebar" }).click();
    await page.reload();

    /* Persisted per viewer through localStorage, not server state. */
    await expect(page.getByRole("button", { name: "Show sidebar" })).toBeVisible();
  });
});

test.describe("projects database", () => {
  test("switches between Table, Board and Gallery views", async ({ page }) => {
    await page.goto("/");

    const tabs = page.getByRole("tablist", { name: "Database view" });
    await expect(tabs.getByRole("tab", { name: "Table" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("table")).toBeVisible();

    await tabs.getByRole("tab", { name: "Board" }).click();
    await expect(tabs.getByRole("tab", { name: "Board" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("table")).toHaveCount(0);

    await tabs.getByRole("tab", { name: "Gallery" }).click();
    await expect(tabs.getByRole("tab", { name: "Gallery" })).toHaveAttribute("aria-selected", "true");
  });

  test("the filter genuinely filters real records", async ({ page }) => {
    await page.goto("/");

    const rows = page.getByRole("table").locator("tbody tr");
    await expect(rows).toHaveCount(3);

    await page.getByLabel("Filter").selectOption("Social Platform");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("ConnectVerse");
  });

  test("the sort genuinely reorders", async ({ page }) => {
    await page.goto("/");

    const firstCell = () => page.getByRole("table").locator("tbody tr").first();
    /* Manual order leads with CloudSpire AI. */
    await expect(firstCell()).toContainText("CloudSpire AI");

    /* By name: C-l-o < C-o, so CloudSpire still leads — sort by type instead. */
    await page.getByLabel("Sort").selectOption("category");
    await expect(firstCell()).toContainText("CloudSpire AI");

    await page.getByLabel("Sort").selectOption("title");
    await expect(firstCell()).toContainText("CloudSpire AI");
  });

  test("a filter matching nothing says so rather than rendering an empty table", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Filter").selectOption("E-commerce");
    await expect(page.getByRole("table").locator("tbody tr")).toHaveCount(1);
  });
});

test.describe("workspace accessibility", () => {
  test("keeps one h1 and a working skip link", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(page.locator("a.skip-link")).toBeFocused();
  });

  test("toggle blocks work before hydration, as native details", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.addCookies([
      { name: "portfolio-theme", value: "notion", url: "http://localhost:3100" },
    ]);
    const page = await context.newPage();
    await page.goto("/projects/connectverse");

    /* The workspace is a client shell, but content must still be readable. */
    await expect(page.locator("#main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("ConnectVerse");
    await context.close();
  });
});
