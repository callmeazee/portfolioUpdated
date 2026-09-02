import { expect, test, type Page } from "@playwright/test";

/**
 * ISS-019 — the palette's interaction was entirely unexercised. This is the
 * one genuinely interactive component in the application, in a keyboard-first
 * theme, so every path it claims to support is asserted here.
 */
test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    { name: "portfolio-theme", value: "terminal", url: "http://localhost:3100" },
  ]);
});

const dialog = (page: Page) => page.getByRole("dialog", { name: "Command palette" });

/**
 * Opens the palette, retrying until the page is interactive.
 *
 * The ⌘K listener is attached on hydration, so a keypress fired before React
 * hydrates is silently dropped — a genuine property of the component, not a
 * test artefact, and one the visible trigger shares. `toPass` retries the whole
 * open-and-assert block rather than assuming a fixed settling time.
 */
async function openPalette(page: Page, via: "keyboard" | "button" = "keyboard") {
  await expect(page.getByRole("button", { name: /Search/ })).toBeVisible();

  await expect(async () => {
    if (via === "keyboard") {
      await page.keyboard.press("ControlOrMeta+k");
    } else {
      await page.getByRole("button", { name: /Search/ }).click();
    }
    await expect(dialog(page)).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
}

test.describe("command palette", () => {
  test("opens with the keyboard shortcut and with the visible button", async ({ page }) => {
    await page.goto("/");

    await openPalette(page, "keyboard");

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();

    /* theme.md §7.5 — reachable without knowing the shortcut. */
    await openPalette(page, "button");
  });

  test("Escape closes and restores focus to the trigger (no keyboard trap)", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /Search/ });

    await openPalette(page, "button");

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("arrow keys move the selection and Enter navigates", async ({ page }) => {
    await page.goto("/");
    await openPalette(page);

    await page.getByRole("combobox", { name: "Command" }).fill("projects");
    const options = page.getByRole("option");
    await expect(options.first()).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("the §7.3 vocabulary resolves to real destinations", async ({ page }) => {
    await page.goto("/");
    await openPalette(page);
    await page.getByRole("combobox", { name: "Command" }).fill("whoami");

    await expect(page.getByRole("option").first()).toContainText("About");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/about$/);
  });

  test("`theme <id>` switches theme", async ({ page }) => {
    await page.goto("/");
    await openPalette(page);
    await page.getByRole("combobox", { name: "Command" }).fill("theme notion");

    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "notion");
  });

  test("an unknown command says so instead of inventing output", async ({ page }) => {
    await page.goto("/");
    await openPalette(page);
    await page.getByRole("combobox", { name: "Command" }).fill("sudo rm -rf /");

    await expect(dialog(page)).toContainText("command not found");
    await expect(page.getByRole("option")).toHaveCount(0);
  });

  test("empty query lists the full vocabulary (help)", async ({ page }) => {
    await page.goto("/");
    await openPalette(page);

    const all = await page.getByRole("option").count();
    expect(all).toBeGreaterThan(5);

    await page.getByRole("combobox", { name: "Command" }).fill("help");
    await expect(page.getByRole("option")).toHaveCount(all);
  });

  test("Tab stays inside the dialog while it is open", async ({ page }) => {
    await page.goto("/");
    await openPalette(page);

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"]');
        return d ? d.contains(document.activeElement) : false;
      });
      expect(inside).toBe(true);
    }
  });
});
