"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Counter } from "@/components/motion";
import { gbp } from "@/lib/utils";

const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "cubic-bezier(.23,1,.32,1)";

const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = f < 0 ? 0 : 255, t = Math.abs(f);
  return "#" + [r, g, b].map((v) => Math.round(v + (m - v) * t).toString(16).padStart(2, "0")).join("");
};
const HUT_COLOURS = ["#005DAA", "#4d93cc", "#F7A81B", "#0B1F3A"];
const ICONS: { d: string; mode: "fill" | "line" | "ring" }[] = [
  { d: "M12 21s-7.5-4.6-9.2-9.4C1.6 8 3.6 5 6.6 5c2 0 3.6 1.1 5.4 3.2C13.8 6.1 15.4 5 17.4 5c3 0 5 3 3.8 6.6C19.5 16.4 12 21 12 21z", mode: "fill" },
  { d: "M4 5.5C6.5 4.6 9.5 4.6 12 6c2.5-1.4 5.5-1.4 8-.5V19c-2.5-.9-5.5-.9-8 .5-2.5-1.4-5.5-1.4-8-.5z M12 6v13.5", mode: "line" },
  { d: "M12 3a9 9 0 100 18 9 9 0 000-18zm0 5l3.2 2.3-1.2 3.8h-4l-1.2-3.8z", mode: "ring" },
  { d: "M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z", mode: "fill" },
];

export interface Cause { id: string; name: string; value: number }

/** Where every pound went: four beach huts. Hover, focus or tap a door to open it. */
export function Huts({ causes, total }: { causes: Cause[]; total: number }) {
  const max = Math.max(...causes.map((c) => c.value), 1);
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<Set<number>>(new Set());
  const [all, setAll] = useState(false);
  const [hint, setHint] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const idle = "Hover over a hut to open its door.";
  useEffect(() => {
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setHint(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const toggleAll = () => {
    const on = !all; setAll(on);
    if (!on) { setPinned(new Set()); return; }
    causes.forEach((_, k) => setTimeout(() => setPinned((p) => new Set(p).add(k)), reduced() ? 0 : k * 140));
  };
  const focus = hover ?? [...pinned].at(-1) ?? null;
  const tip = all ? `All ${causes.length} huts: ${gbp(total)} raised, every pound kept in Folkestone.` : focus !== null ? `${causes[focus].name}: ${gbp(causes[focus].value)}, ${Math.round((causes[focus].value / total) * 100)}% of everything raised.` : idle;
  return (
    <>
      <p style={{ margin: "0 0 18px" }}><button className="btn blue" type="button" aria-pressed={all} onClick={toggleAll}>{all ? "Close the huts" : "Open all the huts"}</button></p>
      <div className={`jars huts${hint ? " hint" : ""}`} ref={box} role="group" aria-label="Where the money went">
        <svg className="bunt" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 8Q250 56 500 24T1000 10" fill="none" stroke="#0B1F3A" strokeWidth="2" opacity=".5" />
          {Array.from({ length: 26 }, (_, n) => { const x = 20 + n * 38, y = 8 + (n < 13 ? n * 1.9 : (25 - n) * 1.5) + 10; return <path key={n} d={`M${x} ${y}l16 4l-8 18z`} fill={["#F7A81B", "#fff", "#005DAA", "#4d93cc", "#d9433a"][n % 5]} stroke="#0B1F3A" strokeWidth=".6" strokeOpacity=".3" />; })}
        </svg>
        {causes.map((c, i) => {
          const pct = Math.round((c.value / total) * 100), col = HUT_COLOURS[i % 4];
          const open = hover === i || pinned.has(i);
          return (
            <Hut key={c.id} i={i} name={c.name} value={c.value} pct={pct} k={c.value / max} col={col} open={open}
              onEnter={() => setHover(i)} onLeave={() => setHover((h) => (h === i ? null : h))}
              onClick={() => setPinned((p) => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; })} />
          );
        })}
      </div>
      <p className="tip" aria-live="polite">{tip}</p>
    </>
  );
}

function Hut({ i, name, value, pct, k, col, open, onEnter, onLeave, onClick }: { i: number; name: string; value: number; pct: number; k: number; col: string; open: boolean; onEnter: () => void; onLeave: () => void; onClick: () => void }) {
  const [n, setN] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const from = n, to = open ? pct : 0, t0 = performance.now(), dur = reduced() ? 0 : 900;
    const f = (now: number) => { const p = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - p, 4); setN(Math.round(from + (to - from) * e)); if (p < 1) raf.current = requestAnimationFrame(f); };
    raf.current = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pct]);
  const ic = ICONS[i % 4];
  const strokeProps = ic.mode === "fill" ? { fill: "currentColor" } : { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinejoin: "round" as const };
  return (
    <button type="button" className={`hut jar${open ? " fill pin" : ""}`} aria-pressed={open}
      style={{ ["--c" as string]: col, ["--ds" as string]: shade(col, -0.14), ["--dk" as string]: shade(col, -0.28), ["--lt" as string]: shade(col, 0.3), ["--k" as string]: k.toFixed(3), ["--pct" as string]: `${pct}%`, ["--hd" as string]: `${i * 120}ms` }}
      aria-label={`${name}: ${gbp(value)}, ${pct} percent of the total. Hover or focus to open the beach hut.`}
      onMouseEnter={onEnter} onMouseLeave={onLeave} onFocus={onEnter} onBlur={onLeave} onClick={onClick}>
      <span className="roof" />
      <span className="wall">
        <span className="inside"><span className="lvl" /><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d={ic.d} {...strokeProps} /></svg><span className="pc"><b>{n}</b>%</span><span className="of">of every £1</span><span className="gbp">{gbp(value)}</span></span>
        <span className="door"><span className="hsign">{name}</span><span className="knob" /></span>
      </span>
      <span className="step" />
      <b className="nm">{name}</b><span className="am">{gbp(value)}</span>
    </button>
  );
}

export interface StoryView { id: string; slug: string; title: string; organisation: string; summary: string; outcome: string; amount?: number | null; body?: string }
const GRADS = ["linear-gradient(150deg,#005DAA,#0B1F3A)", "linear-gradient(150deg,#4d93cc,#005DAA)", "linear-gradient(150deg,#e29a12,#c9780a)", "linear-gradient(150deg,#16304F,#0B1F3A)", "linear-gradient(150deg,#004A88,#4d93cc)"];

/** Stories behind the numbers: a bento of cards; each opens a sheet that grows out of the card. */
export function StoryBento({ stories, sample }: { stories: StoryView[]; sample: boolean }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const from = useRef<HTMLElement | null>(null);
  const [cur, setCur] = useState<number | null>(null);
  const open = (i: number, el: HTMLElement | null) => {
    from.current = el; setCur(i);
    requestAnimationFrame(() => {
      const d = dlg.current; if (!d) return;
      if (!d.open) d.showModal();
      if (el && !reduced()) { const r = el.getBoundingClientRect(), b = d.getBoundingClientRect(); d.animate([{ transform: `translate(${r.left - b.left}px,${r.top - b.top}px) scale(${r.width / b.width},${r.height / b.height})`, opacity: 0.5 }, { transform: "none", opacity: 1 }], { duration: 320, easing: EASE }); }
    });
  };
  const shut = () => {
    const d = dlg.current; if (!d) return;
    if (reduced() || !d.open) { d.close(); return; }
    const r = (from.current ?? document.body).getBoundingClientRect(), b = d.getBoundingClientRect();
    d.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${r.left - b.left}px,${r.top - b.top}px) scale(${r.width / b.width},${r.height / b.height})`, opacity: 0 }], { duration: 200, easing: "ease-in" }).onfinish = () => d.close();
  };
  useEffect(() => { // deep links such as /impact#baby-basics-folkestone
    const h = decodeURIComponent(location.hash.slice(1));
    const i = stories.findIndex((s) => s.slug === h);
    if (i >= 0) { const el = document.getElementById(h); el?.scrollIntoView({ block: "center" }); open(i, el); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const s = cur !== null ? stories[cur] : null;
  const g = cur !== null ? GRADS[cur % 5] : GRADS[0];
  return (
    <>
      <div className="bento">
        {stories.map((st, i) => (
          <button key={st.id} id={st.slug} className={`story s${(i % 5) + 1}`} type="button" onClick={(e) => open(i, e.currentTarget)} style={{ scrollMarginTop: 100 }}>
            <span className="amt">{st.amount ? gbp(st.amount) : ""}</span><small>{st.organisation}</small><h3>{st.title}</h3><span className="more">Read the story</span>
          </button>
        ))}
      </div>
      <dialog className="sheet" ref={dlg} aria-labelledby="sh-t" onCancel={(e) => { e.preventDefault(); shut(); }} onClick={(e) => { if (e.target === dlg.current) shut(); }}>
        <button className="x" type="button" aria-label="Close story" onClick={shut}><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg></button>
        <div className="top" style={{ background: g }}><small>{s?.organisation}</small><h3 id="sh-t">{s?.title}</h3><b style={{ font: "700 28px var(--serif)" }}>{s?.amount ? `${gbp(s.amount)} awarded` : ""}</b></div>
        <div className="bodyx"><p>{s?.summary}</p>{s?.outcome && <p><strong>Outcome:</strong> {s.outcome}</p>}{s?.body && <p>{s.body}</p>}{sample && <p style={{ color: "var(--mute)" }}><strong>Sample story.</strong> Replace with the real outcome in the admin.</p>}<p><Link className="btn blue" href="/funding" onClick={() => dlg.current?.close()}>Apply for similar funding</Link></p></div>
      </dialog>
    </>
  );
}

export interface Quote { id: string; quote: string; by: string }

export function Quotes({ items }: { items: Quote[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (reduced() || hold || items.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [hold, items.length]);
  if (!items.length) return null;
  return (
    <>
      <div className="qs" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)}>
        {items.map((q, k) => <figure key={q.id} className={k === i ? "on" : ""}><blockquote>{q.quote}</blockquote><figcaption>{q.by}</figcaption></figure>)}
      </div>
      <div className="dots" role="group" aria-label="Choose a quote" onFocus={() => setHold(true)}>
        {items.map((q, k) => <button key={q.id} type="button" className={k === i ? "on" : ""} aria-label={`Show quote ${k + 1}`} onClick={() => setI(k)}><i /></button>)}
      </div>
    </>
  );
}

export function VolunteerRing({ hours }: { hours: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduced()) { setOn(true); return; }
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`vring${on ? " in" : ""}`} ref={ref} style={{ ["--c" as string]: 440, ["--o" as string]: 88 }}>
      <svg viewBox="0 0 160 160" aria-hidden="true"><circle className="bg" cx="80" cy="80" r="70" /><circle className="fg" cx="80" cy="80" r="70" /></svg>
      <b><span><span><Counter value={hours} suffix="+" /></span><small>volunteer hours</small></span></b>
    </div>
  );
}
