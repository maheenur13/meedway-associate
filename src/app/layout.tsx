import type { ReactNode } from "react";

// Root layout is a pass-through; the real <html>/<body> lives in [locale]/layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
