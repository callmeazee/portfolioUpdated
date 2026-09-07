import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * PHASE 10 — AUTOMATED ACCESSIBILITY AUDIT
 *
 * axe against WCAG 2.1 A and AA, across every theme on representative routes.
 *
 * Automated checks catch perhaps a third of real accessibility problems, so this
 * complements rather than replaces the hand-written assertions elsewhere —
 * keyboard operation of window controls, focus restoration, reduced motion. It
 * is very good at the things humans miss by eye: contrast ratios, landmark
 * structure, and names on interactive elements.
 */

const THEMES = ["editorial", "terminal", "brutalist", "notion"] as const;
const ROUTES = ["/", "/projects/besties", "/engineering"] as const;

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`a11y: ${theme} ${route}`, async ({ page }) => {
      await page.context().addCookies([
        { name: "portfolio-theme", value: theme, url: "http://localhost:3100" },
      ]);
      await page.goto(route);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const summary = results.violations.map(
        (violation) =>
          `${violation.id} (${violation.impact}) × ${violation.nodes.length}: ${violation.help}` +
          `\n      ${violation.nodes[0]?.target.join(" ")}`,
      );

      expect(summary, `${theme} ${route}\n  ${summary.join("\n  ")}`).toEqual([]);
    });
  }
}
