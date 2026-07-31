"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/jobs", key: "jobs" },
  { href: "/services", key: "services" },
  { href: "/request-workers", key: "employers" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

function HamburgerIcon({ open }: { open: boolean }) {
  const common = "absolute left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-ink";
  return (
    <span className="relative block h-4 w-5">
      <motion.span
        className={common}
        style={{ top: 3 }}
        animate={open ? { rotate: 45, top: 7 } : { rotate: 0, top: 3 }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        className={common}
        style={{ top: 7 }}
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className={common}
        style={{ top: 11 }}
        animate={open ? { rotate: -45, top: 7 } : { rotate: 0, top: 11 }}
        transition={{ duration: 0.25 }}
      />
    </span>
  );
}

export function Navbar({ brandName }: { brandName?: string }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo name={brandName} />

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <LocaleSwitcher />
            <Button href="/jobs" variant="dark" size="sm">
              {t("applyNow")}
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <HamburgerIcon open={open} />
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-paper/95 backdrop-blur-md lg:hidden"
          >
            <Container>
              <nav className="flex flex-col py-3">
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-3 text-[15px] text-ink-soft hover:text-ink"
                    >
                      {t(l.key)}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <LocaleSwitcher />
                  <Button
                    href="/jobs"
                    variant="dark"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    {t("applyNow")}
                  </Button>
                </div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
