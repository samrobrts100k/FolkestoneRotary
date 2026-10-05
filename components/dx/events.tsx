"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Accordion, Cd, Pills, reducedMotion } from "./common";
import { googleCalendarUrl } from "@/lib/ics";
import { formatDate, formatTime } from "@/lib/utils";
import { site } from "@/lib/site";
import type { EventItem } from "@/lib/types";

export const CAT: Record<string, [string, string, boolean]> = {
  fundraising: ["Fundraising", "#F7A81B", true], community: ["Community", "#005DAA", false], social: ["Social", "#4d93cc", false], business: ["Business", "#0B1F3A", false], youth: ["Youth", "#c9780a", false],
};
const cat = (c: string) => CAT[c] ?? [c, "#005DAA", false];
const D = (iso: string) => new Date(iso);
const day = (iso: string) => formatDate(iso, { day: "numeric" });
const mon = (iso: string) => formatDate(iso, { month: "short" });

export function NextUp({ event }: { event: EventItem }) {
  return (
    <div className="glass" aria-label="Next event">
      <Link className="link" href={`/events/${event.slug}`}>{event.title}</Link>
      <Cd to={event.starts_at} label={`Time until ${event.title}`} />
    </div>
  );
}

/** Flags on the Harbour Arm: every upcoming date, with a ticket-style panel for the selected one. */
export function EventsTimeline({ events }: { events: EventItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [lay, setLay] = useState<{ MW: number; months: number; FW: number } | null>(null);
  const [sel, setSel] = useState(0);
  const [seen, setSeen] = useState(false);
  const start = useMemo(() => { const s = new Date(); s.setDate(1); s.setHours(0, 0, 0, 0); return s; }, []);
  const frac = (d: Date) => { const m = (d.getFullYear() - start.getFullYear()) * 12 + d.getMonth() - start.getMonth(); return m + (d.getDate() - 1 + d.getHours() / 24) / new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); };

  useEffect(() => {
    if (!events.length) return;
    const last = D(events[events.length - 1].starts_at);
    const months = Math.max(4, Math.ceil(frac(last)) + 1);
    const MW = Math.max(innerWidth < 700 ? 210 : 290, Math.floor(Math.min(innerWidth - 40, 1100) / months));
    setLay({ MW, months, FW: Math.min(170, MW * 0.72) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);
  useEffect(() => {
    const el = scroller.current; if (!el) return;
    if (reducedMotion()) { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [lay]);

  const go = (k: number, scroll = true) => {
    const n = (k + events.length) % events.length; setSel(n);
    if (!scroll || !lay) return;
    const f = scroller.current?.querySelectorAll<HTMLElement>(".flag")[n];
    if (f && scroller.current) scroller.current.scrollTo({ left: Math.max(0, f.offsetLeft + lay.FW / 2 - scroller.current.clientWidth / 2), behavior: reducedMotion() ? "auto" : "smooth" });
  };
  // drag along the arm with a mouse
  const drag = useRef<{ x: number; l: number } | null>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => { if (drag.current && scroller.current) scroller.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x); };
    const up = () => { drag.current = null; scroller.current?.classList.remove("drag"); };
    addEventListener("pointermove", move); addEventListener("pointerup", up);
    return () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
  }, []);

  if (!events.length) return null;
  const e = events[sel], [cn, col, gold] = cat(e.category);
  const lanes: number[] = [];
  const flags = lay ? events.map((ev, k) => { const x = frac(D(ev.starts_at)) * lay.MW; let l = 0; while (lanes[l] !== undefined && lanes[l] > x - 8) l++; lanes[l] = x + lay.FW; return { ev, x, l, k }; }) : [];
  const jump = () => {
    const c = document.getElementById(`ev-${e.slug}`); if (!c) return;
    c.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    c.classList.remove("flash"); void c.offsetWidth; c.classList.add("flash");
  };
  return (
    <div className={`yr${seen ? " in" : ""}`} role="group" aria-label="Events over the coming months">
      <div className="yrscroll" ref={scroller} tabIndex={0} aria-label="Event timeline, scroll sideways. Left and right arrow keys move between events."
        onKeyDown={(k) => { if (k.key === "ArrowRight") { k.preventDefault(); go(sel + 1); } if (k.key === "ArrowLeft") { k.preventDefault(); go(sel - 1); } }}
        onPointerDown={(p) => { if (p.pointerType !== "mouse" || (p.target as HTMLElement).closest(".flag")) return; drag.current = { x: p.clientX, l: scroller.current!.scrollLeft }; scroller.current!.classList.add("drag"); }}>
        <div className="yrin" style={lay ? { width: lay.months * lay.MW, ["--fw" as string]: `${lay.FW}px` } : { minHeight: 440 }}>
          {lay && <>
            {Array.from({ length: lay.months }, (_, i) => { const m = new Date(start); m.setMonth(start.getMonth() + i); return <div key={i} className="ym" style={{ left: i * lay.MW, width: lay.MW }}><b>{m.toLocaleDateString("en-GB", { month: "long" })}</b><small>{m.getFullYear()}</small></div>; })}
            <svg className="yart" viewBox="0 0 232 56" style={{ left: Math.round(1.27 * lay.MW) }} role="img" aria-label="The FOLKESTONE letter art on the Harbour Arm"><use href="#folkart" /></svg>
            <div className="ysun" style={{ left: Math.round(lay.months * lay.MW * 0.78) }} /><div className="ycl" /><div className="ycl b" /><div className="yarm" /><div className="ysea"><i /><i /></div>
            <div className="ylh" style={{ left: frac(new Date()) * lay.MW }} aria-hidden="true"><i className="beam" /><svg viewBox="0 0 40 90"><path d="M12 90L15 30H25L28 90Z" fill="#f4efe2" /><path d="M13.5 62h13l.6 10h-14.2zM14.5 40h11l.5 9h-12z" fill="#d9433a" /><rect x="12" y="24" width="16" height="7" fill="#4a5560" /><rect x="14" y="12" width="12" height="12" fill="#ffd27a" /><path d="M12 12Q20 0 28 12Z" fill="#4a5560" /></svg><span>Today</span></div>
            {flags.map(({ ev, x, l, k }) => {
              const [, c] = cat(ev.category);
              return (
                <button key={ev.id} type="button" className="flag dot" aria-pressed={k === sel} onClick={() => go(k)}
                  style={{ left: x, ["--c" as string]: c, ["--l" as string]: l, ["--k" as string]: k, color: cat(ev.category)[2] ? "var(--navy)" : undefined }}
                  aria-label={`${ev.title}, ${formatDate(ev.starts_at, { weekday: "short", day: "numeric", month: "short" })}`}>
                  <i className="pole" /><span className="cloth"><b>{day(ev.starts_at)}</b><em>{ev.title}</em></span>
                </button>
              );
            })}
          </>}
        </div>
      </div>
      <div className="yrnav">
        <button type="button" onClick={() => go(sel - 1)} aria-label="Previous event"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <span aria-live="polite">{sel + 1} of {events.length}</span>
        <button type="button" onClick={() => go(sel + 1)} aria-label="Next event"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
      <article className={`yrdet${gold ? " gold" : ""}`} key={e.id} style={{ ["--c" as string]: col }} aria-live="polite">
        <div className="stub"><b>{day(e.starts_at)}</b><span>{mon(e.starts_at)}</span><small>{formatDate(e.starts_at, { weekday: "long" })}</small></div>
        <div className="main">
          <span className="tag">{cn}</span>
          <h3>{e.title}</h3>
          <p className="meta">{formatTime(e.starts_at)} · {e.venue_name}</p>
          <p>{e.short_description}</p>
          <Cd to={e.starts_at} small label={`Time until ${e.title}`} />
          <div className="acts3">
            {e.book_url ? <a className="btn blue" href={e.book_url} target="_blank" rel="noopener noreferrer">Book tickets</a> : e.enter_url ? <a className="btn blue" href={e.enter_url} target="_blank" rel="noopener noreferrer">Enter</a> : <Link className="btn blue" href={`/events/${e.slug}`}>Find out more</Link>}
            <a className="btn ghost" href={googleCalendarUrl(e, `${site.url}/events/${e.slug}`)} target="_blank" rel="noopener noreferrer">Add to calendar</a>
            <button className="lnk" type="button" onClick={jump}>See it in the list</button>
          </div>
        </div>
      </article>
    </div>
  );
}

function ECard({ e }: { e: EventItem }) {
  const [cn, col, gold] = cat(e.category);
  return (
    <article className={`ecard${gold ? " gold" : ""}`} id={`ev-${e.slug}`} style={{ ["--c" as string]: col }} data-c={e.category}>
      <div className="d"><b>{day(e.starts_at)}</b><span>{mon(e.starts_at)}</span></div>
      <div className="bd">
        <span className="tag">{cn}</span>
        <h3><Link href={`/events/${e.slug}`}>{e.title}</Link></h3>
        <p className="meta"><time dateTime={e.starts_at}>{formatDate(e.starts_at, { weekday: "short", day: "numeric", month: "short" })}, {formatTime(e.starts_at)}</time> · {e.venue_name}</p>
        <p className="ds">{e.short_description}</p>
        <div className="acts2">
          {e.book_url ? <a href={e.book_url} target="_blank" rel="noopener noreferrer">Book tickets</a> : <Link href={`/events/${e.slug}`}>Find out more</Link>}
          <a href={googleCalendarUrl(e, `${site.url}/events/${e.slug}`)} target="_blank" rel="noopener noreferrer">Add to calendar</a>
        </div>
      </div>
    </article>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const key = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Category pills + Grid / List / Calendar views of every event, with past events tucked away. */
export function EventsExplorer({ upcoming, past, categories }: { upcoming: EventItem[]; past: EventItem[]; categories: { slug: string; name: string }[] }) {
  const [ci, setCi] = useState(0);
  const [view, setView] = useState<"grid" | "list" | "calendar">("grid");
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const names = ["All", ...categories.map((c) => c.name)], keys = ["all", ...categories.map((c) => c.slug)];
  const ok = (e: EventItem) => ci === 0 || e.category === keys[ci];
  const up = upcoming.filter(ok), pa = past.filter(ok);
  const grid = useRef<HTMLDivElement>(null);
  const flip = (mutate: () => void) => {
    const box = grid.current;
    if (!box || reducedMotion()) return mutate();
    const first = new Map([...box.children].map((k) => [k, k.getBoundingClientRect()]));
    mutate();
    requestAnimationFrame(() => [...box.children].forEach((k) => {
      const f = first.get(k), l = k.getBoundingClientRect();
      if (f && f.width) { const dx = f.left - l.left, dy = f.top - l.top; if (dx || dy) k.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 300, easing: "cubic-bezier(.23,1,.32,1)" }); }
      else k.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "cubic-bezier(.33,1,.68,1)" });
    }));
  };
  const byDay = useMemo(() => { const m = new Map<string, EventItem[]>(); [...upcoming, ...past].filter(ok).forEach((e) => { const k = key(D(e.starts_at)); m.set(k, [...(m.get(k) ?? []), e]); }); return m; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcoming, past, ci]);
  const first = month.getDay() === 0 ? 6 : month.getDay() - 1, days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((first + days) / 7) * 7 }, (_, i) => (i >= first && i < first + days ? new Date(month.getFullYear(), month.getMonth(), i - first + 1) : null));
  return (
    <>
      <div className="ctl">
        <Pills items={names} value={ci} label="Filter events" onChange={(i) => flip(() => setCi(i))} />
        <div className="seg" role="group" aria-label="Layout">
          {(["grid", "list", "calendar"] as const).map((v) => <button key={v} type="button" aria-pressed={view === v} onClick={() => flip(() => setView(v))}>{v[0].toUpperCase() + v.slice(1)}</button>)}
        </div>
      </div>
      {view !== "calendar" ? (
        <>
          <div className={`egrid${view === "list" ? " list" : ""}`} ref={grid}>{up.map((e) => <ECard key={e.id} e={e} />)}</div>
          {!up.length && <p className="empty">Nothing in this category yet. <Link href="/contact?subject=Events">Ask us what’s planned.</Link></p>}
          {pa.length > 0 && <div style={{ marginTop: 44 }}><Accordion items={[{ q: "Past events", a: <div className="egrid list" style={{ paddingBottom: 20 }}>{pa.map((e) => <ECard key={e.id} e={e} />)}</div> }]} /></div>}
        </>
      ) : (
        <div style={{ marginTop: 24 }}>
          <div className="calhd">
            <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>&lsaquo;</button>
            <h3 aria-live="polite">{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h3>
            <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>&rsaquo;</button>
          </div>
          <div className="calwk" aria-hidden>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}</div>
          <ol className="calgrid">
            {cells.map((d, i) => { const evs = d ? byDay.get(key(d)) ?? [] : []; return (
              <li key={i} className={d ? (evs.length ? "has" : "") : "blank"}>
                {d && <span className="n">{d.getDate()} <span className="wd">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span></span>}
                {evs.map((e) => <Link key={e.id} href={`/events/${e.slug}`} style={{ background: cat(e.category)[1], color: cat(e.category)[2] ? "var(--navy)" : "#fff" }}>{e.title}</Link>)}
              </li>); })}
          </ol>
        </div>
      )}
    </>
  );
}
