import {
  HardHat,
  Factory,
  Car,
  Truck,
  SprayCan,
  UtensilsCrossed,
  Zap,
  Wrench,
  Flame,
  HeartHandshake,
  Users,
  Hammer,
  PaintRoller,
  Shirt,
  Scissors,
  Stethoscope,
  Tractor,
  Warehouse,
  Building2,
  Cog,
  Ship,
  Bed,
  Sprout,
  ShoppingCart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The icons an admin may choose for a trade category.
 *
 * Deliberately an explicit allowlist rather than a dynamic lookup: the stored
 * value is just a string from the database, and mapping it straight onto an
 * import would let a bad row pull in anything (or crash the render). Anything
 * not in here falls back to `Users`.
 *
 * Safe to import from client components — it is only lucide re-exports.
 */
export const TRADE_ICONS: Record<string, LucideIcon> = {
  HardHat,
  Factory,
  Car,
  Truck,
  SprayCan,
  UtensilsCrossed,
  Zap,
  Wrench,
  Flame,
  HeartHandshake,
  Users,
  Hammer,
  PaintRoller,
  Shirt,
  Scissors,
  Stethoscope,
  Tractor,
  Warehouse,
  Building2,
  Cog,
  Ship,
  Bed,
  Sprout,
  ShoppingCart,
};

export const TRADE_ICON_NAMES = Object.keys(TRADE_ICONS);

export const DEFAULT_TRADE_ICON = "Users";

/** Resolves a stored icon name, falling back rather than throwing. */
export function tradeIcon(name: string | null | undefined): LucideIcon {
  return (name && TRADE_ICONS[name]) || TRADE_ICONS[DEFAULT_TRADE_ICON];
}
