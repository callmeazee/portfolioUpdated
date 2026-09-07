"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import type { PaletteCommand } from "@/components/shared/CommandPalette";
import { setThemePreference } from "@/themes/actions";
import type { ThemeId } from "@/types/theme";

/**
 * A terminal that actually executes.
 *
 * Every command performs real work — navigation, a theme switch, or listing the
 * commands that exist. Nothing prints canned output, and an unknown command
 * reports `command not found` rather than pretending (CLAUDE.md §39,
 * design.md §19: "Do not fabricate terminal output").
 *
 * It shares its vocabulary with the ⌘K palette via `buildCommands`, so the two
 * can never drift apart.
 */
interface Line {
  input: string;
  output: string[];
}

export function MacTerminalApp({ commands }: { commands: PaletteCommand[] }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  function run(raw: string) {
    const query = raw.trim().toLowerCase();
    if (query === "") return;

    if (query === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    if (query === "help") {
      setLines((previous) => [
        ...previous,
        {
          input: raw,
          output: ["Available commands:", ...commands.map((c) => `  ${c.label}`), "  help", "  clear"],
        },
      ]);
      setInput("");
      return;
    }

    const match = commands.find(
      (command) =>
        command.label.toLowerCase() === query ||
        command.keywords.some((keyword) => keyword.toLowerCase() === query),
    );

    if (!match) {
      setLines((previous) => [
        ...previous,
        { input: raw, output: [`command not found: ${raw.trim()}`, "Type 'help' for a list."] },
      ]);
      setInput("");
      return;
    }

    if (match.kind === "navigate") {
      setLines((previous) => [...previous, { input: raw, output: [`opening ${match.value}`] }]);
      router.push(match.value);
    } else if (match.kind === "external") {
      setLines((previous) => [...previous, { input: raw, output: [`opening ${match.value}`] }]);
      window.open(match.value, "_blank", "noopener,noreferrer");
    } else {
      setLines((previous) => [...previous, { input: raw, output: [`theme → ${match.value}`] }]);
      void setThemePreference(match.value as ThemeId);
    }

    setInput("");
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ block: "end" }));
  }

  return (
    <div className="h-full overflow-auto p-md font-mono text-body-s">
      <p className="text-muted">Type a command, or `help`.</p>

      <ol className="mt-sm grid gap-sm">
        {lines.map((line, index) => (
          <li key={index}>
            <p>
              <span className="text-muted">azeez@portfolio ~ % </span>
              {line.input}
            </p>
            {line.output.map((out, i) => (
              <p key={i} className="text-muted whitespace-pre">
                {out}
              </p>
            ))}
          </li>
        ))}
      </ol>

      <form
        className="mt-sm flex items-center gap-sm"
        onSubmit={(event) => {
          event.preventDefault();
          run(input);
        }}
      >
        <label htmlFor="mac-terminal-input" className="text-muted">
          <span aria-hidden="true">azeez@portfolio ~ %</span>
          <span className="sr-only">Terminal command</span>
        </label>
        <input
          id="mac-terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />
      </form>

      <div ref={endRef} />
    </div>
  );
}
