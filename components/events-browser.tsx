"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, CalendarDays } from "lucide-react";
import { EventCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { eventCategories } from "@/lib/seed";
import type { EventItem } from "@/lib/types";

const pad = (n: number) => String(n).padStart(2, "0");
const key = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function EventsBrowser({ upcoming, past }: { upcoming: EventItem[]; past: EventItem[] }) {
  const [cat, setCat] = useState<string>("all");
  const [view, setView] = useState<"grid" | "calendar">("grid");
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const match = (e: EventItem) => cat === "all" || e.category === cat;
  const up = upcoming.filter(match), pa = past.filter(match);

  const byDay = useMemo(() => {
    const m = new Map<string, EventItem[]>();
    [...upcoming, ...past].filter(match).forEach((e) => { const k = key(new Date(e.starts_at)); m.set(k, [...(m.get(k) ?? []), e]); });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcoming, past, cat]);

  const first = month.getDay() === 0 ? 6 : month.getDay() - 1; // Monday-first
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((first + days) / 7) * 7 }, (_, i) => (i >= first && i < first + days ? new Date(month.getFullYear(), month.getMonth(), i - first + 1) : null));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {[{ slug: "all", name: "All" }, ...eventCategories].map((c) => (
            <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}
              className={`min-h-11 rounded-full border-2 px-4 text-sm font-semibold ${cat === c.slug ? "border-rotary bg-rotary text-white" : "border-slate-300 hover:border-rotary"}`}>{c.name}</button>
          ))}
        </div>
        <div role="group" aria-label="Change view" className="flex gap-2">
          <Button variant={view === "grid" ? "primary" : "outline"} size="sm" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid aria-hidden className="h-4 w-4" />Grid</Button>
          <Button variant={view === "calendar" ? "primary" : "outline"} size="sm" aria-pressed={view === "calendar"} onClick={() => setView("calendar")}><CalendarDays aria-hidden className="h-4 w-4" />Calendar</Button>
        </div>
      </div>

      {view === "grid" ? (
        <>
          <h2 className="mb-5 mt-10 text-2xl">Upcoming events</h2>
          {up.length ? <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{up.map((e) => <li key={e.id}><EventCard event={e} showTime /></li>)}</ul>
            : <p className="rounded-card bg-surface p-6">No upcoming events in this category. <Link href="/contact?subject=Events" className="font-semibold text-rotary underline">Ask us what&apos;s planned</Link>.</p>}
          <h2 className="mb-5 mt-14 text-2xl">Past events</h2>
          {pa.length ? <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{pa.map((e) => <li key={e.id}><EventCard event={e} showTime /></li>)}</ul>
            : <p className="rounded-card bg-surface p-6">No past events to show.</p>}
        </>
      ) : (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft aria-hidden /></Button>
            <h2 className="text-xl" aria-live="polite">{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h2>
            <Button variant="ghost" size="sm" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight aria-hidden /></Button>
          </div>
          <div className="hidden grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-slate-blue sm:grid">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}</div>
          <ol className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-7">
            {cells.map((d, i) => {
              const evs = d ? byDay.get(key(d)) ?? [] : [];
              return (
                <li key={i} className={`min-h-20 rounded-xl border p-2 text-sm ${d ? "border-slate-200 bg-white" : "hidden border-transparent sm:block"} ${!evs.length && d ? "max-sm:hidden" : ""}`}>
                  {d && <span className="font-semibold text-slate-blue">{d.getDate()} <span className="sm:hidden">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span></span>}
                  {evs.map((e) => <Link key={e.id} href={`/events/${e.slug}`} className="mt-1 block rounded-lg bg-rotary px-2 py-1 text-xs font-semibold text-white hover:bg-rotary-dark">{e.title}</Link>)}
                </li>
              );
            })}
          </ol>
          {![...byDay.keys()].some((k) => k.startsWith(`${month.getFullYear()}-${pad(month.getMonth() + 1)}`)) && <p className="mt-4 text-center text-slate-blue">No events this month.</p>}
        </div>
      )}
    </div>
  );
}
