"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { donateHref, nav } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

/** Header height in px; the home hero tucks underneath it by this much. */
const H = 72;

export function Header() {
  const path = usePathname();
  const isHome = path === "/";
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen((o) => { if (o) burger.current?.focus(); return false; });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Over the home film the header is transparent; it turns solid once the film has scrolled away.
  useEffect(() => {
    if (!isHome) return;
    const hero = document.getElementById("hero");
    const on = () => setPastHero(window.scrollY > (hero?.offsetHeight ?? 600) - 140);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [isHome]);

  const solid = !isHome || pastHero || open;
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header
      className={cn("sticky top-0 z-40 transition-[background-color,box-shadow] duration-200", solid ? "bg-white shadow-[0_1px_0_#D9E2EC]" : "on-dark bg-transparent")}
      style={isHome ? { marginBottom: -H } : undefined}
    >
      <div className="container flex items-center justify-between gap-4" style={{ height: H }}>
        <Logo light={!solid} />
        <DesktopNav solid={solid} path={path} />
        <div className="flex items-center gap-2.5">
          <ButtonLink href={donateHref} variant="gold" size="sm" onClick={() => track("donate_click", { location: "header" })}>Donate</ButtonLink>
          <ButtonLink href="/login" variant={solid ? "outline" : "outline-light"} size="sm" className="hidden sm:inline-flex">Member Login</ButtonLink>
          <button ref={burger} type="button" onClick={() => setOpen((o) => !o)}
            className={cn("relative h-11 w-11 rounded-full xl:hidden", solid ? "text-navy hover:bg-rotary-light" : "text-white hover:bg-white/15")}
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
            {[16, 21, 26].map((top, i) => (
              <span key={top} aria-hidden style={{ top }}
                className={cn("absolute left-3 right-3 h-0.5 rounded-sm bg-current transition-[transform,opacity] duration-200 ease-in-out-cubic",
                  open && i === 0 && "translate-y-[5px] rotate-45", open && i === 1 && "opacity-0", open && i === 2 && "-translate-y-[5px] -rotate-45")} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu: enters ease-out 250ms, leaves ease-in 150ms */}
      <nav id="mobile-menu" aria-label="Mobile" inert={!open}
        className={cn("on-dark absolute inset-x-0 top-full bg-navy xl:hidden",
          open ? "visible translate-y-0 opacity-100 transition-[opacity,transform] duration-[250ms] ease-out-quint" : "invisible -translate-y-2 opacity-0 transition-[opacity,transform,visibility] duration-150 ease-in")}>
        <ul className="container flex max-h-[calc(100dvh-72px)] flex-col overflow-y-auto pb-6 pt-2">
          {nav.map((l) => (
            <li key={l.href} className="border-b border-white/15 last:border-0">
              <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}
                className={cn("block py-3.5 text-lg font-semibold no-underline", isActive(l.href) ? "text-gold" : "text-white")}>{l.label}</Link>
            </li>
          ))}
          <li className="mt-4 sm:hidden">
            <ButtonLink href="/login" variant="outline-light" className="w-full">Member Login</ButtonLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

/** Desktop links with one gold underline that slides between them; it rests under the current page. */
function DesktopNav({ solid, path }: { solid: boolean; path: string }) {
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const list = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);

  const moveTo = useCallback((el: Element | null | undefined) => {
    if (!el || !list.current) return setBar(null);
    const r = el.getBoundingClientRect(), n = list.current.getBoundingClientRect();
    setBar({ x: r.left - n.left, w: r.width });
  }, []);
  const rest = useCallback(() => moveTo(list.current?.querySelector('[aria-current="page"]')), [moveTo]);

  useEffect(() => {
    rest();
    // Re-measure once web fonts settle and on resize, so the bar lines up with the final text width.
    document.fonts?.ready.then(rest);
    window.addEventListener("resize", rest);
    return () => window.removeEventListener("resize", rest);
  }, [rest, path]);

  return (
    <nav aria-label="Main" className="relative hidden xl:block">
      <ul ref={list} className="flex items-center gap-5 whitespace-nowrap text-base font-semibold"
        onMouseLeave={rest} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) rest(); }}>
        {/* The logo already links home, so the desktop bar skips "Home" to keep one line. */}
        {nav.filter((l) => l.href !== "/").map((l) => (
          <li key={l.href}>
            <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}
              onMouseEnter={(e) => moveTo(e.currentTarget)} onFocus={(e) => moveTo(e.currentTarget)}
              className={cn("block py-2 no-underline transition-colors duration-200", solid ? "text-navy hover:text-rotary" : "text-white hover:text-gold")}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <span aria-hidden className="pointer-events-none absolute -bottom-0.5 left-0 h-[3px] rounded-sm bg-gold transition-[transform,width,opacity] duration-[250ms] ease-in-out-cubic"
          style={{ width: bar?.w ?? 0, transform: `translateX(${bar?.x ?? 0}px)`, opacity: bar ? 1 : 0 }} />
    </nav>
  );
}
