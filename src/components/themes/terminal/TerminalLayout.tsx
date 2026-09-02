import Link from "next/link";

import { CommandPalette } from "@/components/shared/CommandPalette";
import { getAllThemes } from "@/themes/registry";
import type { ThemeLayoutProps } from "@/types/views";

import { buildCommands } from "./commands";

/**
 * A developer-tooling chrome rather than a "hacker" one (theme.md §7.1): no
 * matrix rain, no green-on-black, no boot sequence.
 *
 * Mobile navigation is a native `<details>` disclosure — theme.md §12 asks for
 * a drawer, and the native element gives keyboard operation and screen-reader
 * semantics for zero JavaScript.
 *
 * Every palette destination is also a plain link here, because terminal
 * interaction must never be the only way to reach content (theme.md §7.5).
 */
export function TerminalLayout({ children, profile, contact, navigation }: ThemeLayoutProps) {
  const themes = getAllThemes();
  const commands = buildCommands(navigation, themes, contact);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-md">
          <div className="flex items-center gap-sm py-sm">
            <span aria-hidden="true" className="flex shrink-0 gap-xs">
              <span className="block size-[0.7rem] rounded-full bg-danger" />
              <span className="block size-[0.7rem] rounded-full bg-warning" />
              <span className="block size-[0.7rem] rounded-full bg-success" />
            </span>

            <Link href="/" className="truncate font-mono text-caption text-muted hover:text-foreground">
              azeez@portfolio — {profile.title.toLowerCase().replace(/\s+/g, "-")}
            </Link>

            <div className="ml-auto flex items-center gap-sm">
              <CommandPalette commands={commands} />
            </div>
          </div>

          <nav aria-label="Main" className="border-t border-border py-xs">
            <ul className="hidden flex-wrap items-center gap-md font-mono text-caption lg:flex">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-accent">
                    {item.label.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>

            <details className="lg:hidden">
              <summary className="cursor-pointer font-mono text-caption text-muted">
                menu
              </summary>
              <ul className="mt-sm grid gap-xs pb-sm font-mono text-caption">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted hover:text-accent">
                      {item.label.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-md">{children}</div>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-wrap items-center justify-between gap-md px-md py-lg font-mono text-caption text-muted">
          <p>
            <span aria-hidden="true">azeez@portfolio ~ % </span>
            {profile.fullName}
          </p>
          {contact.email === null ? (
            <p className="italic">contact: pending</p>
          ) : (
            <a href={`mailto:${contact.email}`} className="hover:text-accent">
              {contact.email}
            </a>
          )}
        </div>

        {/*
          * design.md §33 makes `theme <id>` the terminal's switcher, which lives
          * in the command palette. On its own that is a discoverability trap:
          * someone who opens a shared ?theme=terminal link and dislikes it has no
          * visible way out.
          *
          * These are relative `?theme=` links, so the browser keeps the current
          * path and the proxy applies the change (theme.md §3). Real anchors —
          * they work with JavaScript disabled, and they are keyboard reachable.
          */}
        <div className="mx-auto w-full max-w-[var(--container-max)] px-md pb-lg font-mono text-caption">
          <span aria-hidden="true" className="text-muted">
            azeez@portfolio ~ %{" "}
          </span>
          <span className="sr-only">Switch theme: </span>
          theme{" "}
          {themes.map((theme, index) => (
            <span key={theme.id}>
              {index > 0 ? <span className="text-muted"> | </span> : null}
              <a
                href={`?theme=${theme.id}`}
                className="text-accent hover:underline"
                aria-current={undefined}
              >
                {theme.id}
              </a>
            </span>
          ))}
        </div>
      </footer>
    </>
  );
}
