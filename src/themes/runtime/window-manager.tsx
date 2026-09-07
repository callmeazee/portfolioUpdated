"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";

import {
  initialDesktop,
  windowReducer,
  type DesktopState,
  type OpenWindowInput,
  type WindowAction,
  type WindowGeometry,
} from "./window-state";

interface WindowManager extends DesktopState {
  dispatch: (action: WindowAction) => void;
  open: (window: OpenWindowInput) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  toggleZoom: (id: string, bounds: WindowGeometry) => void;
}

const WindowManagerContext = createContext<WindowManager | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, initialDesktop);

  const value = useMemo<WindowManager>(
    () => ({
      ...state,
      dispatch,
      open: (window) => dispatch({ type: "open", window }),
      close: (id) => dispatch({ type: "close", id }),
      focus: (id) => dispatch({ type: "focus", id }),
      minimize: (id) => dispatch({ type: "minimize", id }),
      restore: (id) => dispatch({ type: "restore", id }),
      toggleZoom: (id, bounds) => dispatch({ type: "toggleZoom", id, bounds }),
    }),
    [state],
  );

  return (
    <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
  );
}

export function useWindowManager(): WindowManager {
  const context = useContext(WindowManagerContext);
  if (context === null) {
    throw new Error("useWindowManager must be used inside WindowManagerProvider");
  }
  return context;
}

/** Convenience for a single window's slice of state and its controls. */
export function useWindow(id: string) {
  const manager = useWindowManager();
  const window = manager.windows.find((w) => w.id === id) ?? null;

  const isFocused = manager.focusedId === id;

  const setGeometry = useCallback(
    (geometry: WindowGeometry) => manager.dispatch({ type: "setGeometry", id, geometry }),
    [manager, id],
  );

  return { window, isFocused, setGeometry, manager };
}
