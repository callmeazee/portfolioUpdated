/**
 * ANALYTICS
 *
 * The event vocabulary is fixed by README §24. Typing it as a union means a
 * typo is a build error rather than a silently missing metric, and the list
 * cannot quietly sprawl.
 *
 * DESIGN: first-party and anonymous. Events post to this application's own
 * route, not to a third party. Nothing identifying is sent — no cookie, no
 * device id, no IP recorded, no cross-site anything — so there is nothing to
 * consent to and no banner to show. That is a deliberate trade: it answers
 * "which theme do visitors prefer" and "which projects get opened" without
 * building a tracking apparatus for a portfolio.
 *
 * `navigator.sendBeacon` is used where available so a click that navigates away
 * still reports; the fetch fallback is `keepalive` for the same reason.
 */

export type AnalyticsEvent =
  | "theme_changed"
  | "project_opened"
  | "case_study_viewed"
  | "github_clicked"
  | "resume_clicked"
  | "contact_clicked"
  | "live_demo_clicked";

/** Values are short, non-identifying labels — a theme id, a project slug. */
export type AnalyticsProps = Record<string, string>;

const ENDPOINT = "/api/events";

/** Honour Do Not Track and Global Privacy Control even though nothing is identifying. */
function optedOut(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string };
  return nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined" || optedOut()) return;

  const body = JSON.stringify({ event, props });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    });
  } catch {
    /* Analytics must never break a page. A dropped event is unimportant. */
  }
}
