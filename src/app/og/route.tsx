import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

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
          justifyContent: "center",
          padding: "80px",
          background: "#fafaf8",
          color: "#141414",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "#5c5a52", letterSpacing: 4 }}>
          {siteConfig.author.toUpperCase()}
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3, marginTop: 24 }}>
          Full-Stack Developer
        </div>
        <div style={{ fontSize: 34, color: "#5c5a52", marginTop: 28, maxWidth: 900 }}>
          Web applications, SaaS products and real-time systems.
        </div>
      </div>
    ),
    size,
  );
}
