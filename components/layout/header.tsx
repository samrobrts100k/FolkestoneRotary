"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { donateHref, nav } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { Logo } from "./logo";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const donate = <ButtonLink href={donateHref} variant="gold" size="sm" onClick={() => track("donate_click", { location: "header" })}>Donate</ButtonLink>;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-rotary-light ${isActive(l.href) ? "text-rotary underline decoration-gold decoration-2 underline-offset-8" : "text-navy"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {donate}
          <ButtonLink href="/login" variant="outline" size="sm" className="hidden sm:inline-flex">Member Login</ButtonLink>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-rotary-light xl:hidden"
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Mobile" className="overflow-hidden border-t border-slate-200 bg-white xl:hidden"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <ul className="container flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-4">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 text-lg font-semibold hover:bg-rotary-light ${isActive(l.href) ? "bg-rotary-light text-rotary" : ""}`}>{l.label}</Link>
                </li>
              ))}
              <li className="mt-3 grid grid-cols-2 gap-3">
                <ButtonLink href={donateHref} variant="gold" onClick={() => track("donate_click", { location: "mobile_menu" })}>Donate</ButtonLink>
                <ButtonLink href="/login" variant="outline">Member Login</ButtonLink>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
