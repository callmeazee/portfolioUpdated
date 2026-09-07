"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2, Menu, PanelLeftClose, PanelLeftOpen, Type, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { CommandPalette, type PaletteCommand } from "@/components/shared/CommandPalette";
import { usePersistentUi } from "@/themes/runtime/use-persistent-ui";
import { useDragGesture } from "@/themes/runtime/use-drag";
import type { Note, Profile, Project } from "@/types/content";
import type { ThemeConfig, ThemeId } from "@/types/theme";

import { NotionSidebar } from "./NotionSidebar";

/**
 * The Notion workspace shell (ADR-015).
 *
 * Faithful behaviour, original assets: a resizable and collapsible sidebar, a
 * breadcrumb bar, and the two page controls Notion actually has — the font
 * switcher (Default / Serif / Mono) and the full-width toggle. Both drive real
 * state and persist per viewer.
 *
 * MOBILE (theme.md §12): the sidebar becomes a drawer rather than shrinking.
 */

const MIN_WIDTH = 180;
const MAX_WIDTH = 420;

const FONTS = [
  { id: "default", label: "Default" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Mono" },
] as const;

type FontId = (typeof FONTS)[number]["id"];

function labelForSegment(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function NotionWorkspace({
  children,
  profile,
  navigation,
  projects,
  notes,
  themes,
  activeTheme,
  commands,
}: {
  children: ReactNode;
  profile: Profile;
  navigation: ReadonlyArray<{ label: string; href: string }>;
  projects: Project[];
  notes: Note[];
  themes: ThemeConfig[];
  activeTheme: ThemeId;
  commands: PaletteCommand[];
}) {
  const pathname = usePathname();

  const [width, setWidth] = usePersistentUi("notion:sidebar-width", 248);
  const [collapsed, setCollapsed] = usePersistentUi("notion:sidebar-collapsed", false);
  const [font, setFont] = usePersistentUi<FontId>("notion:font", "default");
  const [fullWidth, setFullWidth] = usePersistentUi("notion:full-width", false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const resize = useDragGesture({
    onDrag: ({ dx }) => setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width + dx))),
  });

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    label: labelForSegment(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));

  const sidebar = (
    <NotionSidebar
      profile={profile}
      navigation={navigation}
      projects={projects}
      notes={notes}
      search={<CommandPalette commands={commands} />}
    />
  );

  return (
    <div
      data-notion-font={font}
      className="flex h-screen overflow-hidden bg-background text-foreground"
    >
      {/* Desktop sidebar */}
      {collapsed ? null : (
        <aside
          style={{ width }}
          className="relative hidden shrink-0 border-r border-border bg-surface-secondary lg:block"
        >
          {sidebar}
          {/* Pointer-only resize; width is a convenience, never a requirement. */}
          <span
            {...resize}
            aria-hidden="true"
            className="absolute inset-y-0 -right-1 w-2 cursor-col-resize touch-none hover:bg-accent/30"
          />
        </aside>
      )}

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-foreground/30"
          />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] border-r border-border bg-surface-secondary">
            <div className="flex justify-end p-xs">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="rounded-sm p-xs text-muted hover:bg-border/60"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-sm border-b border-border px-md py-sm">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="rounded-sm p-xs text-muted hover:bg-surface-secondary lg:hidden"
          >
            <Menu size={16} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
            aria-pressed={collapsed}
            className="hidden rounded-sm p-xs text-muted hover:bg-surface-secondary lg:block"
          >
            {collapsed ? (
              <PanelLeftOpen size={16} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={16} aria-hidden="true" />
            )}
          </button>

          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex flex-wrap items-center gap-xs text-body-s text-muted">
              <li>
                <Link href="/" className="rounded-sm px-xs hover:bg-surface-secondary">
                  {profile.displayName}
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-xs">
                  <span aria-hidden="true">/</span>
                  <Link href={crumb.href} className="rounded-sm px-xs hover:bg-surface-secondary">
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* Real Notion page controls, driven by real persisted state. */}
          <div className="flex shrink-0 items-center gap-xs">
            <label className="flex items-center gap-xs text-body-s text-muted">
              <Type size={15} aria-hidden="true" />
              <span className="sr-only">Font style</span>
              <select
                value={font}
                onChange={(event) => setFont(event.target.value as FontId)}
                className="rounded-sm border border-border bg-surface px-xs py-0 text-foreground"
              >
                {FONTS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setFullWidth(!fullWidth)}
              aria-pressed={fullWidth}
              aria-label="Full width"
              className="rounded-sm p-xs text-muted hover:bg-surface-secondary"
            >
              <Maximize2 size={15} aria-hidden="true" />
            </button>

            {/*
              theme.md §18 — Notion's property-style dropdown, built from a
              native `<details>` and relative `?theme=` anchors.

              Not a `<select>` with an onChange handler: that would need
              JavaScript to navigate, stranding a no-JS visitor who opened a
              shared ?theme=notion link. `<details>` is keyboard operable
              unscripted, and the anchors keep the current path.
            */}
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-sm border border-border px-sm py-0 text-body-s text-muted hover:text-foreground">
                {themes.find((theme) => theme.id === activeTheme)?.name ?? "Theme"}
              </summary>
              <ul className="absolute top-full right-0 z-50 mt-xs min-w-[10rem] rounded-md border border-border bg-surface p-xs shadow-(--shadow-lg)">
                {themes.map((theme) => (
                  <li key={theme.id}>
                    <a
                      href={`?theme=${theme.id}`}
                      aria-current={theme.id === activeTheme ? "true" : undefined}
                      className="block rounded-sm px-sm py-xs text-body-s text-muted hover:bg-surface-secondary hover:text-foreground"
                    >
                      {theme.name}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </header>

        {/* Keyboard-scrollable: see the note in MacWindow — same axe finding. */}
        <div tabIndex={0} className="min-h-0 flex-1 overflow-y-auto">
          <div className={fullWidth ? "px-lg" : "mx-auto max-w-[46rem] px-lg"}>{children}</div>
        </div>
      </div>
    </div>
  );
}
