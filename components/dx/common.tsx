"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export const reducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Filter pills with one highlight that slides to the active pill. */
export function Pills({ items, value, onChange, label }: { items: string[]; value: number; onChange: (i: number) => void; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [hl, setHl] = useState({ x: 0, w: 0 });
  const measure = useCallback(() => {
    const b = box.current?.querySelectorAll<HTMLElement>(".pill")[value];
    if (b && b.offsetWidth) setHl({ x: b.offsetLeft, w: b.offsetWidth });
  }, [value]);
  useLayoutEffect(measure, [measure, items.length]);
  useEffect(() => {
    document.fonts?.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [measure]);
  return (
    <div className="pills" ref={box} role="group" aria-label={label}>
      <span className="hl2" aria-hidden="true" style={{ transform: `translateX(${hl.x}px)`, width: hl.w }} />
      {items.map((t, i) => <button key={t} type="button" className="pill" aria-pressed={i === value} onClick={() => onChange(i)}>{t}</button>)}
    </div>
  );
}

/** Questions that open smoothly (grid-rows 0fr to 1fr). */
export function Accordion({ items, className }: { items: { q: string; a: React.ReactNode }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={className}>
      {items.map((it, i) => (
        <div key={it.q} className={`acc-item${open === i ? " open" : ""}`}>
          <button className="acc-btn" type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}><span>{it.q}</span><i /></button>
          <div className="acc-body"><div>{typeof it.a === "string" ? <p>{it.a}</p> : it.a}</div></div>
        </div>
      ))}
    </div>
  );
}

/** Live countdown boxes. Renders nothing until mounted so server and browser markup match. */
export function Cd({ to, small, label = "Time until it starts" }: { to: number | string; small?: boolean; label?: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => { const t = new Date(to).getTime(), tick = () => setLeft(Math.max(0, t - Date.now())); tick(); const id = setInterval(tick, 1000); return () => clearInterval(id); }, [to]);
  if (left === null) return <div className={`cd${small ? " sm" : ""}`} style={{ minHeight: small ? 58 : 76 }} aria-hidden />;
  const v = [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60], l = ["days", "hrs", "min", "sec"];
  return <div className={`cd${small ? " sm" : ""}`} role="timer" aria-label={label}>{v.map((n, i) => <div key={l[i]}><b>{String(n).padStart(2, "0")}</b><span>{l[i]}</span></div>)}</div>;
}

/** Brief "sticky bar" that appears once `watch` has scrolled out of view. */
export function useScrolledPast(selector: string, ratio = 0.6) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = document.querySelector(selector); if (!el) return;
    const io = new IntersectionObserver((es) => setPast(es[0].intersectionRatio <= ratio && es[0].boundingClientRect.top < 0 || es[0].intersectionRatio <= ratio), { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, [selector, ratio]);
  return past;
}
