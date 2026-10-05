"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Pills, reducedMotion } from "./common";
import { formatDate } from "@/lib/utils";

export interface NewsRow { id: string; slug: string; title: string; summary: string; body: string; category: string; published_at: string }
const mins = (b: string) => Math.max(1, Math.round(b.split(/\s+/).length / 200));
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
const hi = (s: string, q: string) => (q ? esc(s).replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>") : esc(s));

/** Search + category pills over the news list. Rows link to the full article pages. */
export function NewsExplorer({ items, categories, initialQ = "", initialCategory = "" }: { items: NewsRow[]; categories: { slug: string; name: string }[]; initialQ?: string; initialCategory?: string }) {
  const keys = ["all", ...categories.map((c) => c.slug)], names = ["All", ...categories.map((c) => c.name)];
  const [ci, setCi] = useState(Math.max(0, keys.indexOf(initialCategory || "all")));
  const [q, setQ] = useState(initialQ);
  const list = useRef<HTMLDivElement>(null);
  const flip = (mutate: () => void) => {
    const box = list.current;
    if (!box || reducedMotion()) return mutate();
    const first = new Map([...box.children].map((k) => [k, k.getBoundingClientRect()]));
    mutate();
    requestAnimationFrame(() => [...box.children].forEach((k) => {
      const f = first.get(k), l = k.getBoundingClientRect();
      if (f && f.width) { const dy = f.top - l.top; if (dy) k.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 300, easing: "cubic-bezier(.23,1,.32,1)" }); }
      else k.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "cubic-bezier(.33,1,.68,1)" });
    }));
  };
  const term = q.trim().toLowerCase();
  const shown = items.filter((a) => (ci === 0 || a.category === keys[ci]) && (!term || `${a.title} ${a.summary}`.toLowerCase().includes(term)));
  return (
    <>
      <div className="ctl">
        <form className="srch" role="search" onSubmit={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <label className="sr" htmlFor="nq">Search news</label>
          <input id="nq" type="search" placeholder="Search news" autoComplete="off" value={q} onChange={(e) => flip(() => setQ(e.target.value))} />
        </form>
        <Pills items={names} value={ci} label="Filter by category" onChange={(i) => flip(() => setCi(i))} />
      </div>
      <div ref={list}>
        {shown.map((a) => (
          <Link key={a.id} href={`/news/${a.slug}`} className="nrow">
            <time dateTime={a.published_at}>{formatDate(a.published_at)}</time>
            <div><h3 dangerouslySetInnerHTML={{ __html: hi(a.title, term) }} /><p dangerouslySetInnerHTML={{ __html: hi(a.summary, term) }} /></div>
            <span className="rt">{mins(a.body)} min read</span>
          </Link>
        ))}
      </div>
      {!shown.length && <p className="empty">No stories match. <button className="copy" type="button" onClick={() => flip(() => { setQ(""); setCi(0); })}>Clear search</button></p>}
    </>
  );
}
