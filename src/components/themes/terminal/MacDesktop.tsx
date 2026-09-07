"use client";

import { usePathname } from "next/navigation";
import {
  Briefcase,
  FolderOpen,
  House,
  Layers,
  Mail,
  NotebookPen,
  SquareTerminal,
  UserRound,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { CommandPalette, type PaletteCommand } from "@/components/shared/CommandPalette";
import { useWindowManager, WindowManagerProvider } from "@/themes/runtime/window-manager";
import type { Note, Project } from "@/types/content";
import type { ThemeConfig, ThemeId } from "@/types/theme";

import { MacDock, type DockItem } from "./MacDock";
import { MacFinder } from "./MacFinder";
import { MacMenuBar } from "./MacMenuBar";
import { MacTerminalApp } from "./MacTerminalApp";
import { MacWindow } from "./MacWindow";

const ROUTE_WINDOW = "route";
const FINDER = "finder";
const TERMINAL = "terminal-app";

const ROUTE_ICONS: Record<string, ReactNode> = {
  "/": <House size={20} />,
  "/projects": <Layers size={20} />,
  "/experience": <Briefcase size={20} />,
  "/engineering": <Wrench size={20} />,
  "/about": <UserRound size={20} />,
  "/notes": <NotebookPen size={20} />,
  "/contact": <Mail size={20} />,
};

function titleForPath(pathname: string, navigation: ReadonlyArray<{ label: string; href: string }>) {
  if (pathname === "/") return "Home";
  const match = navigation.find((item) => item.href === pathname);
  if (match) return match.label;
  /* Deep routes such as /projects/besties. */
  return pathname.split("/").filter(Boolean).slice(-1)[0] ?? "Portfolio";
}

function Desktop({
  children,
  navigation,
  projects,
  notes,
  themes,
  activeTheme,
  commands,
}: {
  children: ReactNode;
  navigation: ReadonlyArray<{ label: string; href: string }>;
  projects: Project[];
  notes: Note[];
  themes: ThemeConfig[];
  activeTheme: ThemeId;
  commands: PaletteCommand[];
}) {
  const manager = useWindowManager();
  const pathname = usePathname();
  const routeTitle = titleForPath(pathname, navigation);

  /*
   * The routed window always exists — it holds the server-rendered page. It is
   * opened once and then only retitled, so navigating never resets a window the
   * visitor has positioned themselves.
   */
  const surfaceRef = useRef<HTMLDivElement>(null);
  const { dispatch } = manager;
  useEffect(() => {
    /*
     * `dispatch` from useReducer is stable, so this runs on navigation only —
     * no lint suppression needed. Re-opening an existing window raises and
     * un-minimises it, which is the behaviour wanted when navigating back to a
     * window the visitor had minimised.
     */
    dispatch({
      type: "open",
      window: { id: ROUTE_WINDOW, title: routeTitle, isRoute: true },
    });
  }, [dispatch, routeTitle]);

  const routeWindow = manager.windows.find((w) => w.id === ROUTE_WINDOW);
  const finderWindow = manager.windows.find((w) => w.id === FINDER);
  const terminalWindow = manager.windows.find((w) => w.id === TERMINAL);

  /*
   * Utility windows open at a modest, cascaded size rather than filling the
   * desktop — otherwise a new Finder buries the routed window completely, which
   * is neither macOS-like nor usable.
   *
   * Measured in the click handler, so no viewport reading happens during render
   * and hydration stays in step.
   */
  function cascade(index: number) {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return undefined;

    const width = Math.min(720, Math.max(360, box.width * 0.55));
    const height = Math.min(520, Math.max(280, box.height * 0.6));
    const offset = 32 + index * 28;

    return { x: offset, y: offset, width, height };
  }

  const openFinder = () =>
    manager.open({ id: FINDER, title: "Finder", isRoute: false, geometry: cascade(0) });
  const openTerminal = () =>
    manager.open({ id: TERMINAL, title: "Terminal", isRoute: false, geometry: cascade(1) });

  const dockItems: DockItem[] = [
    ...[{ label: "Home", href: "/" }, ...navigation].map((item) => ({
      id: `route:${item.href}`,
      label: item.label,
      href: item.href,
      icon: ROUTE_ICONS[item.href] ?? <Layers size={20} />,
    })),
    { id: FINDER, label: "Finder", icon: <FolderOpen size={20} />, onActivate: openFinder },
    { id: TERMINAL, label: "Terminal", icon: <SquareTerminal size={20} />, onActivate: openTerminal },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MacMenuBar
        appName="Portfolio"
        navigation={navigation}
        themes={themes}
        activeTheme={activeTheme}
        onOpenFinder={openFinder}
        onOpenTerminal={openTerminal}
      />

      {/*
        The desktop surface. Windows are absolutely positioned inside it, so
        `pb-` reserves room for the dock and zooming measures this element.
      */}
      <div ref={surfaceRef} className="relative flex-1 overflow-hidden">
        {routeWindow ? (
          <MacWindow
            window={{ ...routeWindow, title: routeTitle }}
            toolbar={<CommandPalette commands={commands} />}
          >
            {children}
          </MacWindow>
        ) : (
          /* Pre-hydration and no-JS: the page renders plainly, never blank. */
          <div className="absolute inset-sm overflow-auto rounded-lg border border-border bg-surface sm:inset-md">
            {children}
          </div>
        )}

        {finderWindow ? (
          <MacWindow window={finderWindow} onClose={() => manager.close(FINDER)}>
            <MacFinder projects={projects} notes={notes} />
          </MacWindow>
        ) : null}

        {terminalWindow ? (
          <MacWindow window={terminalWindow} onClose={() => manager.close(TERMINAL)}>
            <MacTerminalApp commands={commands} />
          </MacWindow>
        ) : null}

      </div>

      <MacDock items={dockItems} />
    </div>
  );
}

export function MacDesktop(props: Omit<Parameters<typeof Desktop>[0], never>) {
  return (
    <WindowManagerProvider>
      <Desktop {...props} />
    </WindowManagerProvider>
  );
}
