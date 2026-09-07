import { expect, test } from "@playwright/test";

/**
 * PHASE 14 — PRODUCTION QA
 *
 * Runs against a production build and fails on anything the browser complains
 * about. This matters most for hydration: the theme system deliberately renders
 * server-side defaults it then corrects on the client — the macOS clock, the
 * ⌘K shortcut label, every `usePersistentUi` value — and each of those is a
 * hydration mismatch waiting to happen if the server snapshot is wrong.
 *
 * theme.md §16's checklist asks for "no console errors"; this is that check.
 */

const THEMES = ["editorial", "terminal", "brutalist", "notion"] as const;
const ROUTES = ["/", "/projects", "/projects/besties", "/engineering", "/notes"] as const;

/* Noise outside the app's control — nothing is suppressed that we could fix. */
const IGNORED = [/favicon/i, /Download the React DevTools/i];

for (const theme of THEMES) {
  test(`no console errors or page errors: ${theme}`, async ({ page }) => {
    const problems: string[] = [];

    page.on("console", (message) => {
      if (message.type() !== "error" && message.type() !== "warning") return;
      const text = message.text();
      if (IGNORED.some((pattern) => pattern.test(text))) return;
      problems.push(`[${message.type()}] ${text}`);
    });

    page.on("pageerror", (error) => problems.push(`[pageerror] ${error.message}`));

    await page.context().addCookies([
      { name: "portfolio-theme", value: theme, url: "http://localhost:3100" },
    ]);

    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: "networkidle" });
    }

    expect(problems, `${theme}:\n  ${problems.join("\n  ")}`).toEqual([]);
  });
}

test.describe("structured data", () => {
  test("is emitted, valid JSON, and identical across themes", async ({ browser }) => {
    const perTheme: string[] = [];

    for (const theme of THEMES) {
      const page = await browser.newPage();
      await page.context().addCookies([
        { name: "portfolio-theme", value: theme, url: "http://localhost:3100" },
      ]);
      await page.goto("/");

      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length, `${theme} JSON-LD blocks`).toBeGreaterThan(0);

      /* Must parse — malformed JSON-LD is worse than none. */
      const parsed = blocks.map((block) => JSON.parse(block));
      expect(parsed.map((entry) => entry["@type"])).toContain("Person");

      perTheme.push(JSON.stringify(parsed));
      await page.close();
    }

    /* README §16 — one canonical machine-readable identity, whatever the theme. */
    expect(new Set(perTheme).size).toBe(1);
  });

  test("never asserts a fact the content layer does not have", async ({ page }) => {
    await page.goto("/");

    const person = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}",
    );

    /* Pending values must be absent, never empty strings or placeholders. */
    for (const [key, value] of Object.entries(person)) {
      expect(value, `${key} was empty`).not.toBe("");
      expect(value, `${key} was null`).not.toBeNull();
      if (Array.isArray(value)) expect(value.length, `${key} was an empty array`).toBeGreaterThan(0);
    }

    /* No email or profile links exist yet, so they must not appear at all. */
    expect(person.email).toBeUndefined();
    expect(person.sameAs).toBeUndefined();
  });

  test("a project with nothing to say emits no CreativeWork", async ({ page }) => {
    await page.goto("/projects/cloudcost-ai");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((block) => JSON.parse(block)["@type"]);

    /* Its description is pending — an entry here would assert nothing. */
    expect(types).not.toContain("CreativeWork");

    await page.goto("/projects/besties");
    const bestiesTypes = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((block) => JSON.parse(block)["@type"]);
    expect(bestiesTypes).toContain("CreativeWork");
  });
});
