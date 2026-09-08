import { ImageResponse } from "next/og";

import { profile } from "@/content";

export const size = {
  width: 1200,
  height: 630,
};

/*
 * The social card is served from a plain route handler rather than the
 * `opengraph-image.tsx` file convention.
 *
 * WHY (verified against Next.js 16.3.4, not assumed): file-based metadata takes
 * precedence over the `metadata` object site-wide, but the generated image only
 * attaches to the segment holding the file. With `app/opengraph-image.tsx` in
 * place, `/` got the card while `/about` and `/contact` had their explicit
 * `openGraph.images` stripped and emitted no `og:image` at all — an absolute URL
 * set directly on the page was dropped too.
 *
 * As an ordinary route there is no precedence rule to lose to, so
 * createSeoMetadata can point every route at one canonical card. That matters
 * here because SEO must stay identical across all four themes (README §16).
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fafaf8",
          color: "#141414",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#2a4b8d",
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {profile.displayName.slice(0, 1)}
          </div>
          <div style={{ fontSize: 28, color: "#5c5a52", letterSpacing: 3 }}>
            {profile.fullName.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            {profile.title}
          </div>
          {/*
            The real positioning statement from the content layer, not a
            hand-written line that could drift from what the site says.
          */}
          {profile.positioning ? (
            <div
              style={{
                fontSize: 30,
                color: "#5c5a52",
                marginTop: 26,
                maxWidth: 940,
                lineHeight: 1.4,
              }}
            >
              {profile.positioning}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#5c5a52" }}>
          <div style={{ width: 40, height: 3, background: "#2a4b8d" }} />
          {profile.location ?? ""}
          {profile.availability ? ` · ${profile.availability}` : ""}
        </div>
      </div>
    ),
    size,
  );
}
