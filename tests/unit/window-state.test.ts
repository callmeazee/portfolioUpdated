import { describe, expect, it } from "vitest";

import {
  initialDesktop,
  MIN_HEIGHT,
  MIN_WIDTH,
  windowReducer,
  type DesktopState,
} from "@/themes/runtime/window-state";

const GEOMETRY = { x: 40, y: 40, width: 800, height: 600 };

function makeWindow(id: string, isRoute = false) {
  return { id, title: id, isRoute, geometry: GEOMETRY };
}

function openAll(ids: string[]): DesktopState {
  return ids.reduce(
    (state, id) => windowReducer(state, { type: "open", window: makeWindow(id) }),
    initialDesktop,
  );
}

describe("window state machine", () => {
  it("opens a window, focuses it, and stacks it on top", () => {
    const state = openAll(["a", "b"]);
    expect(state.windows).toHaveLength(2);
    expect(state.focusedId).toBe("b");
    expect(state.windows[1].z).toBeGreaterThan(state.windows[0].z);
  });

  it("re-opening raises and unminimises rather than duplicating", () => {
    let state = openAll(["a", "b"]);
    state = windowReducer(state, { type: "minimize", id: "a" });
    state = windowReducer(state, { type: "open", window: makeWindow("a") });

    expect(state.windows).toHaveLength(2);
    expect(state.windows.find((w) => w.id === "a")?.minimized).toBe(false);
    expect(state.focusedId).toBe("a");
  });

  it("refuses to close the routed window — that would blank the page", () => {
    let state = windowReducer(initialDesktop, { type: "open", window: makeWindow("main", true) });
    state = windowReducer(state, { type: "close", id: "main" });

    expect(state.windows).toHaveLength(1);
  });

  it("moves focus to the topmost remaining window after a close", () => {
    let state = openAll(["a", "b", "c"]);
    expect(state.focusedId).toBe("c");

    state = windowReducer(state, { type: "close", id: "c" });
    expect(state.focusedId).toBe("b");
  });

  it("moves focus off a minimised window, skipping other minimised ones", () => {
    let state = openAll(["a", "b", "c"]);
    state = windowReducer(state, { type: "minimize", id: "b" });
    state = windowReducer(state, { type: "minimize", id: "c" });

    expect(state.focusedId).toBe("a");
  });

  it("leaves focus alone when a background window is minimised", () => {
    let state = openAll(["a", "b"]);
    state = windowReducer(state, { type: "minimize", id: "a" });

    expect(state.focusedId).toBe("b");
  });

  it("reports no focus when every window is minimised", () => {
    let state = openAll(["a"]);
    state = windowReducer(state, { type: "minimize", id: "a" });

    expect(state.focusedId).toBeNull();
  });

  it("restores a minimised window and focuses it", () => {
    let state = openAll(["a", "b"]);
    state = windowReducer(state, { type: "minimize", id: "a" });
    state = windowReducer(state, { type: "restore", id: "a" });

    expect(state.windows.find((w) => w.id === "a")?.minimized).toBe(false);
    expect(state.focusedId).toBe("a");
  });

  it("zooms to the given bounds and returns to the previous geometry", () => {
    const bounds = { x: 0, y: 0, width: 1440, height: 900 };
    let state = openAll(["a"]);

    state = windowReducer(state, { type: "toggleZoom", id: "a", bounds });
    expect(state.windows[0].zoomed).toBe(true);
    expect(state.windows[0].geometry).toEqual(bounds);
    expect(state.windows[0].restoreTo).toEqual(GEOMETRY);

    state = windowReducer(state, { type: "toggleZoom", id: "a", bounds });
    expect(state.windows[0].zoomed).toBe(false);
    expect(state.windows[0].geometry).toEqual(GEOMETRY);
  });

  it("un-zooming a never-moved window returns it to default placement", () => {
    const bounds = { x: 0, y: 0, width: 1440, height: 900 };
    /* geometry null means "CSS default" — zoom must not strand it in pixels. */
    let state = windowReducer(initialDesktop, {
      type: "open",
      window: { id: "a", title: "a", isRoute: true },
    });

    state = windowReducer(state, { type: "toggleZoom", id: "a", bounds });
    expect(state.windows[0].geometry).toEqual(bounds);

    state = windowReducer(state, { type: "toggleZoom", id: "a", bounds });
    expect(state.windows[0].geometry).toBeNull();
  });

  it("clamps geometry to the minimum window size", () => {
    let state = openAll(["a"]);
    state = windowReducer(state, {
      type: "setGeometry",
      id: "a",
      geometry: { x: 0, y: 0, width: 10, height: 10 },
    });

    expect(state.windows[0].geometry?.width).toBe(MIN_WIDTH);
    expect(state.windows[0].geometry?.height).toBe(MIN_HEIGHT);
  });

  it("dragging a zoomed window un-zooms it, as macOS does", () => {
    let state = openAll(["a"]);
    state = windowReducer(state, {
      type: "toggleZoom",
      id: "a",
      bounds: { x: 0, y: 0, width: 1440, height: 900 },
    });
    state = windowReducer(state, {
      type: "setGeometry",
      id: "a",
      geometry: { x: 100, y: 100, width: 800, height: 600 },
    });

    expect(state.windows[0].zoomed).toBe(false);
  });

  it("ignores actions aimed at windows that do not exist", () => {
    const state = openAll(["a"]);
    for (const action of [
      { type: "close" as const, id: "ghost" },
      { type: "minimize" as const, id: "ghost" },
      { type: "setGeometry" as const, id: "ghost", geometry: GEOMETRY },
    ]) {
      expect(windowReducer(state, action).windows).toEqual(state.windows);
    }
  });

  it("does not churn state when focusing the already-focused window", () => {
    const state = openAll(["a"]);
    expect(windowReducer(state, { type: "focus", id: "a" })).toBe(state);
  });
});
