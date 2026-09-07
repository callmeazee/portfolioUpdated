"use client";

/**
 * Last-resort boundary: this replaces the root layout, so it must render its
 * own `<html>` and `<body>` and cannot rely on anything the layout provides —
 * no theme attribute, no fonts, no stylesheet guarantees.
 *
 * Styles are therefore inline and deliberately theme-agnostic. This renders
 * only when the root layout itself failed, which is exactly the case where
 * depending on the theme system would be unwise.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#fafaf8",
          color: "#141414",
        }}
      >
        <main style={{ maxWidth: "40rem" }}>
          <h1 style={{ fontSize: "2rem", margin: 0, letterSpacing: "-0.02em" }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "1rem", lineHeight: 1.6, color: "#5c5a52" }}>
            The page could not be loaded. Reloading usually resolves it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.25rem",
              border: 0,
              borderRadius: "0.5rem",
              background: "#2a4b8d",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "#5c5a52" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
