import { describe, expect, it } from "vitest";

import { DEFAULT_THEME, THEME_IDS, getAllThemes, isThemeId } from "@/themes/registry";
import { parseTheme, resolveTheme } from "@/themes/resolve";

/**
 * Theme resolution is the one piece of logic a bad shared link can reach, so
 * the fallback path (theme.md §15) matters as much as the happy path.
 */
describe("theme resolution", () => {
  it("defaults to editorial with no input", () => {
    expect(resolveTheme({})).toBe("editorial");
    expect(DEFAULT_THEME).toBe("editorial");
  });

  it("honours every registered theme from the URL parameter", () => {
    for (const id of THEME_IDS) {
      expect(resolveTheme({ param: id })).toBe(id);
    }
  });

  it("falls back to the cookie when no parameter is present", () => {
    expect(resolveTheme({ cookie: "terminal" })).toBe("terminal");
  });

  it("lets the URL parameter outrank the cookie (theme.md §3)", () => {
    expect(resolveTheme({ param: "notion", cookie: "terminal" })).toBe("notion");
  });

  it("falls back to editorial for unknown or hostile values", () => {
    for (const bad of ["hacker", "", "../etc/passwd", "EDITORIAL", "<script>"]) {
      expect(resolveTheme({ param: bad })).toBe("editorial");
      expect(resolveTheme({ cookie: bad })).toBe("editorial");
    }
  });

  it("ignores an invalid parameter and still honours a valid cookie", () => {
    expect(resolveTheme({ param: "bogus", cookie: "brutalist" })).toBe("brutalist");
  });

  it("parseTheme returns null rather than guessing", () => {
    expect(parseTheme("nope")).toBeNull();
    expect(parseTheme(null)).toBeNull();
    expect(parseTheme(undefined)).toBeNull();
  });

  it("isThemeId rejects non-strings", () => {
    expect(isThemeId(42)).toBe(false);
    expect(isThemeId(null)).toBe(false);
    expect(isThemeId({})).toBe(false);
  });

  it("registers a config for every declared theme id", () => {
    const configs = getAllThemes();
    expect(configs).toHaveLength(THEME_IDS.length);
    for (const config of configs) {
      expect(THEME_IDS).toContain(config.id);
      expect(config.name.length).toBeGreaterThan(0);
      expect(config.description.length).toBeGreaterThan(0);
    }
  });
});
