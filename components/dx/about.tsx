"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Counter } from "@/components/motion";

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** "Rotary is a group of neighbours / friends / leaders / problem-solvers." with one word swapping in place. */
export function SwapWords() {
  const words = ["neighbours.", "friends.", "leaders.", "problem-solvers."];
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  useEffect(() => {
    if (reduced()) return;
    const id = setInterval(() => setCur((c) => { setPrev(c); return (c + 1) % words.length; }), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  useEffect(() => { if (prev < 0) return; const t = setTimeout(() => setPrev(-1), 450); return () => clearTimeout(t); }, [prev]);
  return (
    <p className="swap" aria-label="Rotary is a group of neighbours, friends, leaders and problem-solvers.">
      Rotary is a group of{" "}
      <span className="swapbox" aria-hidden="true">
        {words.map((w, i) => <span key={w} className={i === cur ? "on" : i === prev ? "off" : ""}>{w}</span>)}
      </span>
    </p>
  );
}

export interface Milestone { id: string; title: string; body: string }

/** Our story: a line that draws as you scroll, with a little boat riding down it. */
export function History({ items }: { items: Milestone[] }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const kids = [...el.querySelectorAll<HTMLElement>(".hi")];
    const upd = () => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--p", String(clamp((innerHeight * 0.55 - r.top) / r.height)));
      kids.forEach((k) => k.classList.toggle("on", k.getBoundingClientRect().top < innerHeight * 0.62));
    };
    upd();
    addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    return () => { removeEventListener("scroll", upd); removeEventListener("resize", upd); };
  }, [items.length]);
  return (
    <div className="hist" ref={box}>
      <svg className="boat" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="22" fill="#fff" stroke="#005DAA" strokeWidth="3" /><path d="M12 28h22l-4 6H16z" fill="#0B1F3A" /><path d="M23 10v16M23 12l9 11H23" fill="#F7A81B" stroke="#0B1F3A" strokeWidth="1.5" /></svg>
      {items.map((m, i) => {
        const year = /\b(1[89]|20)\d{2}\b/.exec(`${m.title} ${m.body}`)?.[0];
        const last = i === items.length - 1 && items.length > 1;
        return (
          <div className="hi" key={m.id}>
            <div className="yr">{year ?? (last ? "Today" : m.title)}</div>
            {(year || last) && <h3>{m.title}</h3>}
            <p>{m.body}</p>
          </div>
        );
      })}
    </div>
  );
}

const ASK: [RegExp, string][] = [
  [/president/i, "what the club is planning this year"], [/secretary/i, "visiting as a guest"], [/treasurer/i, "where the money goes"],
  [/member/i, "joining, and what it costs"], [/event/i, "Race Night, the Golf Day and the Half Marathon"], [/youth|school/i, "working with young people"],
];
const COLS = ["#005DAA", "#0B1F3A", "#c9780a", "#4d93cc", "#005DAA", "#0B1F3A", "#c9780a"];

export interface Leader { id: string; title: string; body?: string }

/** The club round a lunch table. Tap a seat to find out who they are; the empty one is the visitor's. */
export function RoundTable({ leaders, joinHref = "/join" }: { leaders: Leader[]; joinHref?: string }) {
  const list = leaders.slice(0, 7);
  const N = list.length + 1;
  const [sel, setSel] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduced()) { setInView(true); return; }
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const pos = (i: number) => { const a = ((-90 + (i * 360) / N) * Math.PI) / 180; return { a, x: 50 + 36 * Math.cos(a), y: 50 + 36 * Math.sin(a), px: 50 + 20 * Math.cos(a), py: 50 + 20 * Math.sin(a) }; };
  const you = sel === list.length;
  const person = sel !== null && !you ? list[sel] : null;
  return (
    <div className="tw">
      <div className={`round${inView ? " in" : ""}`} ref={ref} role="group" aria-label="The club’s officers around a lunch table">
        <div className="tbl" aria-hidden="true"><div><b>Tuesday lunch</b><small>Every week · guests welcome</small></div></div>
        {Array.from({ length: N }, (_, i) => { const p = pos(i); return <i key={`p${i}`} className="plate" style={{ left: `${p.px}%`, top: `${p.py}%` }} />; })}
        {Array.from({ length: N }, (_, i) => {
          const p = pos(i), isYou = i === list.length, l = list[i];
          return (
            <button key={i} type="button" className={`seat${isYou ? " you" : ""}`} aria-pressed={sel === i} onClick={() => setSel(i)}
              style={{ left: `${p.x}%`, top: `${p.y}%`, ["--k" as string]: i, ["--c" as string]: isYou ? "#fff" : COLS[i % COLS.length], ["--r" as string]: `${(p.a * 180) / Math.PI + 90}deg` }}
              aria-label={isYou ? "The empty chair. It could be yours." : `${l.title}${l.body ? `, ${l.body.replace(/\s*\(sample\)\.?/i, "")}` : ""}`}>
              <span className="av2">{isYou ? "?" : l.title[0]}</span>
              <span className="lb">{isYou ? "Your seat" : l.title}</span>
            </button>
          );
        })}
      </div>
      <div className="bubble" aria-live="polite">
        {sel === null && <div className="pop"><h3>Take a seat</h3><p className="nm">Folkestone Rotary</p><p style={{ margin: "0 0 14px", fontSize: 19 }}>Tap anyone to find out what they do, and what to ask them. One chair is empty, and it’s yours if you want it.</p></div>}
        {you && <div className="pop" key="you"><h3>This chair is free</h3><p className="nm">Reserved for: you</p><p style={{ fontSize: 19, margin: "0 0 16px" }}>Come to a Tuesday lunch as our guest. Nobody will ask you to sign anything.</p><Link className="btn gold" href={joinHref}>Visit as a guest</Link></div>}
        {person && <div className="pop" key={person.id}><h3>{person.title}</h3><p className="nm">{person.body?.replace(/\s*\(sample\)\.?/i, "") || "Name to be confirmed"}</p><p className="ask">{ASK.find(([r]) => r.test(person.title))?.[1] ?? "what they do in the club"}</p></div>}
      </div>
    </div>
  );
}

export function WorldNumbers({ clubGroups }: { clubGroups: number }) {
  const items: [number, string, string][] = [[1, "m+", "Rotarians worldwide"], [200, "+", "countries and regions"], [clubGroups, "+", "local groups we’ve backed"]];
  return (
    <div className="worldn" style={{ marginTop: 18 }}>
      {items.map(([n, s, l]) => <div key={l}><b><Counter value={n} suffix={s} /></b><span>{l}</span></div>)}
    </div>
  );
}
