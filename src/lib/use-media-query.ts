"use client";

import { useEffect, useState } from "react";

/** Returns true when the media query matches. SSR-safe (defaults to false). */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True on tablet/desktop (>= 768px). Used to gate heavy scroll animations. */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 768px)");
}
