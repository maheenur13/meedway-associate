"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Re-applies the saved theme after client navigations. The <html> className is
 * server-rendered, so a soft navigation (e.g. switching locale) reconciles the
 * element and wipes the imperatively-added `dark` class — this restores it.
 */
export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const dark = stored
        ? stored === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", dark);
    } catch {}
  }, [pathname]);

  return null;
}
