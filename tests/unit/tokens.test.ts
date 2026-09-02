import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, acc);
    else if (/\.tsx?$/.test(entry)) acc.push(full);
  }
  return acc;
}

const files = sourceFiles("src");

/**
 * ISS-010 — Tailwind bakes `shadow-md` into a literal at build time, so a bare
 * shadow utility silently ignores every [data-theme] override (the brutalist
 * hard offsets would never apply). The convention was documented in tokens.css
 * but nothing enforced it; this does.
 */
describe("design token conventions", () => {
  it("uses shadow-(--shadow-*) rather than bare Tailwind shadow utilities", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/["'`\s](shadow-(?:sm|md|lg|xl|2xl|none))[\s"'`]/g)) {
        offenders.push(`${file}: ${match[1]}`);
      }
    }

    expect(offenders, `use shadow-(--shadow-md) instead:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("keeps hard-coded colours out of components (design.md §5)", () => {
    const offenders: string[] = [];

    for (const file of files) {
      /* The OG card is the sanctioned exception: Satori cannot read CSS vars. */
      if (file.includes("app/og/")) continue;

      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        const line = source.slice(0, match.index).split("\n").pop() ?? "";
        if (line.trimStart().startsWith("*") || line.includes("//")) continue;
        offenders.push(`${file}: ${match[0]}`);
      }
    }

    expect(offenders, `use semantic tokens instead:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("theme components never import canonical content directly (ADR-013)", () => {
    const offenders = files
      .filter((file) => file.includes("components/themes/"))
      .filter((file) => /from\s+["']@\/content/.test(readFileSync(file, "utf8")));

    expect(offenders, `themes must receive content as props:\n${offenders.join("\n")}`).toEqual([]);
  });
});
