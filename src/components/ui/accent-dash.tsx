"use client";

import { motion } from "framer-motion";

/** A short accent line that grows in when scrolled into view. */
export function AccentDash() {
  return (
    <motion.span
      aria-hidden
      initial={{ width: 0 }}
      whileInView={{ width: 26 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block h-px shrink-0 bg-accent/70"
    />
  );
}
