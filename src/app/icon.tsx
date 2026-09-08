import { ImageResponse } from "next/og";

import { profile } from "@/content";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * A monogram favicon, replacing the Create Next App default that shipped with
 * the boilerplate — a portfolio wearing the framework's stock icon reads as
 * unfinished.
 *
 * Generated rather than a committed binary so it stays tied to the content
 * layer: the initial comes from `profile.displayName`.
 *
 * Colours are literal because Satori cannot read CSS custom properties — the
 * same sanctioned exception as the Open Graph card.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a4b8d",
          color: "#ffffff",
          fontSize: 42,
          fontWeight: 700,
          fontFamily: "sans-serif",
          borderRadius: 12,
        }}
      >
        {profile.displayName.slice(0, 1).toUpperCase()}
      </div>
    ),
    size,
  );
}
