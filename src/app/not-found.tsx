import Link from "next/link";

// Fallback for requests that don't resolve to a locale at all.
// The root layout is a pass-through, so this must render its own <html>/<body>.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafaf7",
          color: "#0a0a0a",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              fontSize: "5rem",
              fontWeight: 600,
              margin: 0,
              color: "#4f46e5",
              letterSpacing: "-0.045em",
            }}
          >
            404
          </p>
          <p style={{ marginTop: "0.5rem", color: "#5a5a5a" }}>
            This page could not be found.
          </p>
          <Link
            href="/en"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.7rem 1.4rem",
              borderRadius: "11px",
              background: "#0a0a0a",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
