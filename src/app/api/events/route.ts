import { NextResponse } from "next/server";

/**
 * First-party analytics sink (README §24).
 *
 * Writes one structured line per event to the server log. On any host with log
 * search — Vercel included — that is enough to answer what README §24 actually
 * asks: which theme visitors prefer, which projects get opened, which lead to a
 * GitHub or résumé click.
 *
 * Deliberately stores nothing. No database, no cookie, no IP, no user agent, no
 * fingerprint. There is no identity to leak and nothing to delete, which is why
 * the site needs no consent banner. Swapping in a hosted product later is a
 * single call in this handler.
 */

const EVENTS = new Set([
  "theme_changed",
  "project_opened",
  "case_study_viewed",
  "github_clicked",
  "resume_clicked",
  "contact_clicked",
  "live_demo_clicked",
]);

/** Values are short labels; anything longer is a mistake or an abuse attempt. */
const MAX_VALUE = 64;
const MAX_PROPS = 6;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { event, props } = (payload ?? {}) as { event?: unknown; props?: unknown };

  /* Reject anything outside the fixed vocabulary rather than logging it. */
  if (typeof event !== "string" || !EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const clean: Record<string, string> = {};
  if (props && typeof props === "object") {
    for (const [key, value] of Object.entries(props).slice(0, MAX_PROPS)) {
      if (typeof value === "string") clean[key.slice(0, 32)] = value.slice(0, MAX_VALUE);
    }
  }

  console.log(JSON.stringify({ type: "analytics", event, ...clean }));

  /* 204: the client has nothing to do with a response. */
  return new NextResponse(null, { status: 204 });
}
