"use client";

import { useEffect } from "react";

import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

/**
 * One delegated click listener for the whole application.
 *
 * The alternative — a tracked-link component used everywhere — would mean
 * editing every link in four themes and pulling otherwise-server components
 * into the client bundle. Classifying by `href` instead keeps the themes
 * untouched and server-rendered, and a link added later is tracked without
 * anyone remembering to instrument it.
 *
 * Attached to `document` with capture so it still fires for links that navigate
 * away; `track` uses `sendBeacon`, which survives the unload.
 */
function classify(anchor: HTMLAnchorElement): { event: AnalyticsEvent; props: AnalyticsProps } | null {
  const raw = anchor.getAttribute("href") ?? "";
  if (!raw) return null;

  if (raw.startsWith("mailto:")) return { event: "contact_clicked", props: { via: "email" } };

  if (raw.startsWith("/projects/")) {
    const slug = raw.split("/").filter(Boolean)[1];
    return slug ? { event: "project_opened", props: { slug } } : null;
  }

  if (raw === "/resume") return { event: "resume_clicked", props: {} };
  if (raw === "/contact") return { event: "contact_clicked", props: { via: "page" } };

  if (/^https?:\/\//.test(raw)) {
    let host = "";
    try {
      host = new URL(raw).hostname;
    } catch {
      return null;
    }
    /* Anything off-site is either the source or the deployed project. */
    return host.includes("github.com")
      ? { event: "github_clicked", props: { host } }
      : { event: "live_demo_clicked", props: { host } };
  }

  return null;
}

export function AnalyticsClicks() {
  useEffect(() => {
    function onClick(nativeEvent: MouseEvent) {
      const target = nativeEvent.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const classified = classify(anchor as HTMLAnchorElement);
      if (classified) track(classified.event, classified.props);
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

/** Fires once when a page is viewed — for events that are not clicks. */
export function TrackView({ event, props }: { event: AnalyticsEvent; props?: AnalyticsProps }) {
  const serialised = JSON.stringify(props ?? {});

  useEffect(() => {
    track(event, JSON.parse(serialised) as AnalyticsProps);
  }, [event, serialised]);

  return null;
}
