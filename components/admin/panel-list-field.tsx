"use client";
import { useState } from "react";
import { PANEL_PLACES, PANEL_TONES, okLink, readPanels, type PagePanel } from "@/lib/page-text";
import { Input, Select, Textarea } from "@/components/ui/fields";

const blank: PagePanel = { title: "", text: "", btn: "", href: "", btn2: "", href2: "", where: "bottom", tone: "gold" };
const btn = "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-rotary disabled:opacity-40";
const swatch: Record<PagePanel["tone"], string> = { gold: "bg-gold text-navy", blue: "bg-rotary text-white", navy: "bg-navy text-white" };

/** Add, edit, reorder and remove extra panels for a page. Saved with the rest of the page. */
export function PanelListField({ name, label, defaultValue, help }: { name: string; label: string; defaultValue: string; help?: string }) {
  const [list, setList] = useState<PagePanel[]>(() => readPanels(defaultValue));
  const set = (i: number, patch: Partial<PagePanel>) => setList((l) => l.map((p, k) => (k === i ? { ...p, ...patch } : p)));
  const move = (i: number, d: number) => setList((l) => { const n = [...l]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  const linkHint = (label: string, href: string) => (label && !okLink(href) ? "Add a link like /join, https://… , mailto:… or tel:… or this button won’t show." : "");
  return (
    <div className="rounded-xl border border-slate-300 p-4">
      <p className="mb-1 text-sm font-semibold">{label}</p>
      {help && <p className="mb-3 text-sm text-slate-blue">{help}</p>}
      <input type="hidden" name={name} value={JSON.stringify(list)} />
      <ol className="space-y-4">
        {list.map((p, i) => (
          <li key={i} className="rounded-xl bg-surface p-4">
            <div className={`mb-3 rounded-lg px-4 py-3 font-serif text-lg font-bold ${swatch[p.tone]}`}>{p.title || "New panel"}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">Heading<Input value={p.title} onChange={(e) => set(i, { title: e.target.value })} placeholder="e.g. Join us for the Golf Day" /></label>
              {!p.title.trim() && <p className="-mt-2 text-xs font-medium text-amber-800 sm:col-span-2">A panel needs a heading to show.</p>}
              <label className="text-sm font-semibold sm:col-span-2">Text<Textarea rows={2} value={p.text} onChange={(e) => set(i, { text: e.target.value })} /></label>
              <label className="text-sm font-semibold">Button<Input value={p.btn} onChange={(e) => set(i, { btn: e.target.value })} placeholder="e.g. Book now" /></label>
              <label className="text-sm font-semibold">Button link<Input value={p.href} onChange={(e) => set(i, { href: e.target.value.trim() })} placeholder="/events or https://…" /></label>
              {linkHint(p.btn, p.href) && <p className="-mt-2 text-xs font-medium text-amber-800 sm:col-span-2">{linkHint(p.btn, p.href)}</p>}
              <label className="text-sm font-semibold">Second button (optional)<Input value={p.btn2} onChange={(e) => set(i, { btn2: e.target.value })} /></label>
              <label className="text-sm font-semibold">Second button link<Input value={p.href2} onChange={(e) => set(i, { href2: e.target.value.trim() })} /></label>
              {linkHint(p.btn2, p.href2) && <p className="-mt-2 text-xs font-medium text-amber-800 sm:col-span-2">{linkHint(p.btn2, p.href2)}</p>}
              <label className="text-sm font-semibold">Where<Select value={p.where} onChange={(e) => set(i, { where: e.target.value as PagePanel["where"] })}>{PANEL_PLACES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></label>
              <label className="text-sm font-semibold">Colour<Select value={p.tone} onChange={(e) => set(i, { tone: e.target.value as PagePanel["tone"] })}>{PANEL_TONES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move panel ${i + 1} up`}>↑ Up</button>
              <button type="button" className={btn} disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label={`Move panel ${i + 1} down`}>↓ Down</button>
              <button type="button" className={`${btn} ml-auto text-red-800`} onClick={() => setList((l) => l.filter((_, k) => k !== i))} aria-label={`Remove panel ${i + 1}`}>Remove</button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="mt-4 rounded-full bg-rotary px-5 py-2.5 font-bold text-white hover:bg-rotary-dark" onClick={() => setList((l) => [...l, { ...blank }])}>+ Add a panel</button>
    </div>
  );
}
