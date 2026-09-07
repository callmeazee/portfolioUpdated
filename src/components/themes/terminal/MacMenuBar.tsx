"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { ThemeConfig, ThemeId } from "@/types/theme";

/**
 * The menu bar. Every entry navigates or switches theme — nothing here is
 * ornamental, and there is deliberately no battery or wifi indicator, which
 * would be invented status (CLAUDE.md §39).
 *
 * Menus are native `<details>` elements: keyboard operable and screen-reader
 * announced for free, with no popup state machine to get wrong.
 */
function Clock() {
  /*
   * Real time, so the indicator reports something true. Rendered empty on the
   * server and filled after mount — a server-rendered clock would hydrate to a
   * different second and desync.
   */
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));

    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-micro text-muted tabular-nums" suppressHydrationWarning>
      {time ?? ""}
    </span>
  );
}

function Menu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-sm px-sm font-mono text-micro text-muted hover:text-foreground">
        {label}
      </summary>
      <ul className="absolute top-full left-0 z-50 mt-xs min-w-[12rem] rounded-md border border-border bg-surface p-xs shadow-(--shadow-lg)">
        {children}
      </ul>
    </details>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-sm px-sm py-xs font-mono text-caption text-muted hover:bg-surface-secondary hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}

export function MacMenuBar({
  appName,
  navigation,
  themes,
  activeTheme,
  onOpenFinder,
  onOpenTerminal,
}: {
  appName: string;
  navigation: ReadonlyArray<{ label: string; href: string }>;
  themes: ThemeConfig[];
  activeTheme: ThemeId;
  onOpenFinder: () => void;
  onOpenTerminal: () => void;
}) {
  const pathname = usePathname();
  const current =
    navigation.find((item) => item.href === pathname)?.label ?? (pathname === "/" ? "Home" : appName);

  return (
    <div className="relative z-50 flex items-center gap-md border-b border-border bg-surface/90 px-md py-xs backdrop-blur">
      <span className="font-mono text-micro font-semibold">{current}</span>

      <Menu label="Go">
        <MenuLink href="/">Home</MenuLink>
        {navigation.map((item) => (
          <MenuLink key={item.href} href={item.href}>
            {item.label}
          </MenuLink>
        ))}
      </Menu>

      <Menu label="Window">
        <li>
          <button
            type="button"
            onClick={onOpenFinder}
            className="block w-full rounded-sm px-sm py-xs text-left font-mono text-caption text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            New Finder Window
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onOpenTerminal}
            className="block w-full rounded-sm px-sm py-xs text-left font-mono text-caption text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            New Terminal Window
          </button>
        </li>
      </Menu>

      {/*
        theme.md §18 — the mechanism is shared; this is the terminal's presentation.

        Relative `?theme=` anchors rather than buttons calling the Server Action:
        anchors keep the current path, are applied by the proxy (theme.md §3),
        and work with JavaScript disabled. A button here would strand a no-JS
        visitor who opened a shared ?theme=terminal link and wanted out.
      */}
      <Menu label="Theme">
        {themes.map((theme) => (
          <li key={theme.id}>
            <a
              href={`?theme=${theme.id}`}
              aria-current={theme.id === activeTheme ? "true" : undefined}
              className="block w-full rounded-sm px-sm py-xs text-left font-mono text-caption text-muted hover:bg-surface-secondary hover:text-foreground"
            >
              {theme.id === activeTheme ? "\u2022 " : "\u00a0\u00a0"}
              {theme.name}
            </a>
          </li>
        ))}
      </Menu>

      <span className="ml-auto">
        <Clock />
      </span>
    </div>
  );
}
