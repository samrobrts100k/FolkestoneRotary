"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import "@/app/dx.css";
import "@/app/dx-extra.css";

const ToastCtx = createContext<(m: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

/** Wraps a redesigned page: scopes the dx styles, shows toasts, reveals [data-rv] blocks on scroll and drifts the hero skyline. */
export function DxRoot({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useCallback((m: string) => {
    setMsg(m); setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2400);
  }, []);

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [...document.querySelectorAll<HTMLElement>(".dx [data-rv]")];
    if (!rm && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.15 });
      els.forEach((e, i) => { e.classList.add("rv"); e.style.transitionDelay = `${(Number(e.style.getPropertyValue("--i")) || i % 4) * 70}ms`; io.observe(e); });
      return () => io.disconnect();
    }
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.querySelector<HTMLElement>(".dx .ph");
    if (!hero) return;
    let raf = 0;
    const on = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; hero.style.setProperty("--sy", String(Math.min(scrollY, 500))); }); };
    addEventListener("scroll", on, { passive: true });
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-toast]");
      if (t) { e.preventDefault(); toast(t.dataset.toast ?? ""); }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [toast]);

  return (
    <ToastCtx.Provider value={toast}>
      <div className="dx">
        {children}
        <div className={`toast${show ? " show" : ""}`} role="status" aria-live="polite">{msg}</div>
      </div>
    </ToastCtx.Provider>
  );
}
