import { notFound } from "next/navigation";

// Any unmatched path under a locale falls through to here and renders the
// localized not-found UI (which lives inside [locale]/layout with <html>/<body>).
export default function CatchAllPage() {
  notFound();
}
