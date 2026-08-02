export type Anchor = "left" | "right" | "top" | "bottom";

/**
 * Pin positions on the dotted world map (viewBox 103×52) as percentages,
 * pre-computed from dotted-map.
 *
 * These stay in code on purpose: Qatar does not move, and asking an admin to
 * enter map coordinates is a good way to get a pin in the Atlantic. The admin
 * panel edits names, worker counts, visibility and order; anything without an
 * entry here simply isn't placeable and is skipped.
 *
 * `anchor` is which side of the pin a callout pill hangs off, chosen so the
 * tightly-packed Gulf labels don't collide.
 *
 * Safe to import from client components — plain data, no server imports.
 */
export const REACH_COORDS: Record<string, { left: number; top: number; anchor: Anchor }> = {
  my: { left: 80.6, top: 58.3, anchor: "bottom" },
  sa: { left: 63.1, top: 45.0, anchor: "left" },
  ae: { left: 66.0, top: 45.0, anchor: "right" },
  om: { left: 66.5, top: 46.6, anchor: "right" },
  qa: { left: 65.1, top: 45.0, anchor: "right" },
  kw: { left: 64.1, top: 41.6, anchor: "top" },
  bh: { left: 65.1, top: 44.4, anchor: "right" },
  jo: { left: 61.2, top: 41.6, anchor: "left" },
};

/** Country codes that can be placed on the map, for the admin picker. */
export const REACH_CODES = Object.keys(REACH_COORDS);

/**
 * The head-office marker. Hardcoded rather than stored: it is not a
 * destination market, carries no worker count, and should not be deletable
 * from a CMS by accident.
 */
export const HQ = {
  code: "bd",
  left: 77.2,
  top: 46.6,
  anchor: "top" as Anchor,
};
