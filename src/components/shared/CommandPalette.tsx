"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";

import { setThemePreference } from "@/themes/actions";
import type { ThemeId } from "@/types/theme";

/**
 * COMMAND PALETTE — the terminal theme's command system.
 *
 * theme.md §7.3 asks for a command vocabulary and §7.4 asks for a ⌘K palette.
 * This is deliberately ONE mechanism rather than two: a free-text REPL beside a
 * palette would duplicate navigation, double the keyboard surface, and tempt
 * exactly the fake commands CLAUDE.md §39 forbids. Here every command performs
 * real work — it navigates, switches theme, or opens a real link. Nothing
 * prints invented output.
 *
 * The §7.3 vocabulary (`whoami`, `projects`, `resume`, `theme`, …) is reachable
 * as keywords, so typing `whoami` finds About. The empty state is `help`: it
 * lists everything available.
 *
 * ACCESSIBILITY (theme.md §7.5 — the terminal is an enhancement, never a
 * requirement): the palette is opened by a real visible button as well as by
 * ⌘K, so it is not keyboard-only trivia; every destination it reaches is also a
 * plain link in the navigation. Escape always closes and returns focus, so the
 * modal is not a keyboard trap.
 */

export interface PaletteCommand {
  id: string;
  label: string;
  hint?: string;
  /** Alternate spellings, including the theme.md §7.3 command names. */
  keywords: string[];
  kind: "navigate" | "external" | "theme";
  value: string;
}

/** No subscription needed: the platform cannot change during a session. */
const subscribeNothing = () => () => {};
const getIsMac = () => /mac/i.test(navigator.userAgent);

export function CommandPalette({ commands }: { commands: PaletteCommand[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  /*
   * The shortcut label differs per platform but must not desync during
   * hydration. `useSyncExternalStore` with a server snapshot of `false` is the
   * supported way to read a browser-only value: the server and the first client
   * render both say "Ctrl K", then it corrects itself.
   */
  const isMac = useSyncExternalStore(subscribeNothing, getIsMac, () => false);
  const shortcutLabel = isMac ? "⌘ K" : "Ctrl K";

  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "" || q === "help") return commands;

    return commands.filter((command) =>
      [command.label, ...command.keywords].some((term) => term.toLowerCase().includes(q)),
    );
  }, [commands, query]);

  /*
   * Reset the highlight when the query changes. Done during render via the
   * previous-value pattern rather than in an effect, so the list never paints
   * one frame with a stale selection.
   */
  const [previousQuery, setPreviousQuery] = useState(query);
  if (previousQuery !== query) {
    setPreviousQuery(query);
    setActiveIndex(0);
  }

  /* Global shortcut (theme.md §7.4): ⌘K on macOS, Ctrl+K elsewhere. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  }

  function run(command: PaletteCommand) {
    close();

    if (command.kind === "navigate") {
      router.push(command.value);
      return;
    }

    if (command.kind === "external") {
      window.open(command.value, "_blank", "noopener,noreferrer");
      return;
    }

    startTransition(async () => {
      await setThemePreference(command.value as ThemeId);
    });
  }

  function onDialogKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) =>
        results.length === 0 ? 0 : (i - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const command = results[activeIndex];
      if (command) run(command);
      return;
    }

    /*
     * Keep Tab inside the dialog — but Escape above is always available, so
     * this is a modal, not a trap (README §14: no keyboard traps).
     */
    if (event.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "input, button:not([disabled])",
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-sm rounded-sm border border-border px-sm py-xs font-mono text-caption text-muted transition-colors hover:text-foreground"
      >
        Search
        <kbd className="rounded-sm border border-border px-xs py-0 text-micro">
          {shortcutLabel}
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 p-md pt-2xl backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onDialogKeyDown}
            className="w-full max-w-[36rem] overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-lg)"
          >
            <div className="flex items-center gap-sm border-b border-border px-md py-sm">
              <span aria-hidden="true" className="font-mono text-body-s text-accent">
                %
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type a command, or help"
                aria-label="Command"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={
                  results[activeIndex] ? `${listId}-${results[activeIndex].id}` : undefined
                }
                className="w-full bg-transparent font-mono text-body-s outline-none"
              />
              <button
                type="button"
                onClick={close}
                className="rounded-sm px-xs font-mono text-micro text-muted hover:text-foreground"
              >
                Esc
              </button>
            </div>

            <ul id={listId} role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-xs">
              {results.length === 0 ? (
                /* Honest: no invented output, no pretend success. */
                <li className="px-sm py-md font-mono text-body-s text-muted">
                  command not found: {query}
                </li>
              ) : (
                results.map((command, index) => (
                  <li
                    key={command.id}
                    id={`${listId}-${command.id}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => run(command)}
                    className={[
                      "flex cursor-pointer items-baseline justify-between gap-md rounded-sm px-sm py-xs font-mono text-body-s",
                      index === activeIndex ? "bg-surface-secondary text-foreground" : "text-muted",
                    ].join(" ")}
                  >
                    <span>{command.label}</span>
                    {command.hint ? <span className="text-micro">{command.hint}</span> : null}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
