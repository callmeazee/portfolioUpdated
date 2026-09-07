/**
 * WINDOW STATE MACHINE
 *
 * Deliberately pure and React-free so the transitions can be unit-tested
 * directly — z-ordering and focus-after-close are the kind of logic that breaks
 * quietly and is miserable to debug through a UI.
 *
 * Geometry is presentation state only. Closing a window never destroys content:
 * the routed window's content comes from the server, and utility windows read
 * the static content layer.
 */

export const MIN_WIDTH = 320;
export const MIN_HEIGHT = 200;

export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  title: string;
  /** The window bound to the current route; it cannot be closed, only zoomed. */
  isRoute: boolean;
  minimized: boolean;
  zoomed: boolean;
  /**
   * `null` means "use the theme's default placement", expressed in CSS.
   *
   * This matters for hydration: measuring the viewport to seed pixel geometry
   * during the first render would desync server and client markup. A window
   * stays CSS-placed until the user actually drags, resizes or zooms it, at
   * which point the interaction seeds real pixels from a measured rect.
   */
  geometry: WindowGeometry | null;
  /** Geometry to return to when un-zooming — `null` returns to default placement. */
  restoreTo: WindowGeometry | null;
  z: number;
}

/** What a caller must supply to open a window; geometry is optional. */
export type OpenWindowInput = Omit<
  WindowState,
  "z" | "minimized" | "zoomed" | "restoreTo" | "geometry"
> & { geometry?: WindowGeometry | null };

export interface DesktopState {
  windows: WindowState[];
  focusedId: string | null;
  nextZ: number;
}

export type WindowAction =
  | { type: "open"; window: OpenWindowInput }
  | { type: "close"; id: string }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "restore"; id: string }
  | { type: "toggleZoom"; id: string; bounds: WindowGeometry }
  | { type: "setGeometry"; id: string; geometry: WindowGeometry };

export const initialDesktop: DesktopState = { windows: [], focusedId: null, nextZ: 1 };

/** Highest window that is actually visible — used after close and minimize. */
function topmostVisible(windows: WindowState[], excludeId?: string): string | null {
  const candidates = windows.filter((w) => !w.minimized && w.id !== excludeId);
  if (candidates.length === 0) return null;
  return candidates.reduce((top, w) => (w.z > top.z ? w : top)).id;
}

function mapWindow(
  state: DesktopState,
  id: string,
  update: (window: WindowState) => WindowState,
): DesktopState {
  return { ...state, windows: state.windows.map((w) => (w.id === id ? update(w) : w)) };
}

export function windowReducer(state: DesktopState, action: WindowAction): DesktopState {
  switch (action.type) {
    case "open": {
      const existing = state.windows.find((w) => w.id === action.window.id);

      /* Re-opening a window raises and unminimises it rather than duplicating. */
      if (existing) {
        return {
          ...mapWindow(state, action.window.id, (w) => ({
            ...w,
            minimized: false,
            z: state.nextZ,
          })),
          focusedId: action.window.id,
          nextZ: state.nextZ + 1,
        };
      }

      return {
        ...state,
        windows: [
          ...state.windows,
          {
            ...action.window,
            geometry: action.window.geometry ?? null,
            minimized: false,
            zoomed: false,
            restoreTo: null,
            z: state.nextZ,
          },
        ],
        focusedId: action.window.id,
        nextZ: state.nextZ + 1,
      };
    }

    case "close": {
      /* The routed window has nowhere to go — closing it would blank the page. */
      const target = state.windows.find((w) => w.id === action.id);
      if (!target || target.isRoute) return state;

      const windows = state.windows.filter((w) => w.id !== action.id);
      return {
        ...state,
        windows,
        focusedId: state.focusedId === action.id ? topmostVisible(windows) : state.focusedId,
      };
    }

    case "focus": {
      if (state.focusedId === action.id) return state;
      return {
        ...mapWindow(state, action.id, (w) => ({ ...w, z: state.nextZ, minimized: false })),
        focusedId: action.id,
        nextZ: state.nextZ + 1,
      };
    }

    case "minimize": {
      const next = mapWindow(state, action.id, (w) => ({ ...w, minimized: true }));
      return {
        ...next,
        focusedId:
          state.focusedId === action.id ? topmostVisible(next.windows, action.id) : state.focusedId,
      };
    }

    case "restore":
      return {
        ...mapWindow(state, action.id, (w) => ({ ...w, minimized: false, z: state.nextZ })),
        focusedId: action.id,
        nextZ: state.nextZ + 1,
      };

    case "toggleZoom":
      return mapWindow(state, action.id, (w) =>
        w.zoomed
          ? /* restoreTo may be null — that returns the window to default placement. */
            { ...w, geometry: w.restoreTo, zoomed: false, restoreTo: null }
          : { ...w, restoreTo: w.geometry, geometry: action.bounds, zoomed: true },
      );

    case "setGeometry":
      return mapWindow(state, action.id, (w) => ({
        ...w,
        geometry: {
          ...action.geometry,
          width: Math.max(MIN_WIDTH, action.geometry.width),
          height: Math.max(MIN_HEIGHT, action.geometry.height),
        },
        /* Dragging or resizing a zoomed window un-zooms it, as macOS does. */
        zoomed: false,
      }));

    default:
      return state;
  }
}
