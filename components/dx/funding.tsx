"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { submitFunding } from "@/app/actions/forms";
import { Counter } from "@/components/motion";
import { Fl, OkMark, ServerMessage, emailOk, useSubmit } from "./forms";
import { reducedMotion } from "./common";
import { gbp } from "@/lib/utils";
import { useFormText } from "@/components/form-text";
import { fill, toLines } from "@/lib/page-text";

/** What we store for each "Who’s applying?" choice; the wording on the buttons comes from Page text → Forms. The last one is "something else". */
const TYPES = ["Charity", "School", "Community group", "other"];
/** Days from today for each "When do you need the money?" choice (no date for the last). */
const BY_DAYS = [14, 90, 0];
const KEY = "fr-draft";

interface Draft { step: number; type: string; org: string; name: string; email: string; phone: string; title: string; what: string; amt: number; cost: string; ppl: string; who: string; by: string; num: string; extra: string }
const EMPTY: Draft = { step: 0, type: "", org: "", name: "", email: "", phone: "", title: "", what: "", amt: 1000, cost: "", ppl: "", who: "", by: "", num: "", extra: "" };

const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

/** The whole application in three short steps, inside the hero. Saves a draft in this browser as you type. */
export function Application() {
  const [d, setD] = useState<Draft>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [welcome, setWelcome] = useState(false);
  const [bad, setBad] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [dir, setDir] = useState(1);
  const { state, pending, submit, reset } = useSubmit(submitFunding, "funding_application");
  const ft = useFormText();
  const STEPS = toLines(ft.f_steps), PPL = toLines(ft.f_ppl), WHEN = toLines(ft.f_when), typeLabels = toLines(ft.f_types);
  const first = d.name ? `, ${d.name.split(" ")[0]}` : "";
  const body = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { // pick up a saved draft
    try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s?.org) { setD({ ...EMPTY, ...s, step: Math.min(s.step ?? 0, 2) }); setWelcome(true); } } catch { /* storage unavailable */ }
  }, []);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((p) => { const n = { ...p, [k]: v }; try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* ignore */ } return n; });
    setBad((b) => { const { [k as string]: _x, ...rest } = b; return rest; });
    setSaved(true); clearTimeout(timer.current); timer.current = setTimeout(() => setSaved(false), 1800);
  };
  const anim = () => { if (!reducedMotion()) body.current?.animate([{ opacity: 0, transform: `translateX(${dir * 18}px)` }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.23,1,.32,1)" }); };
  useEffect(anim, [d.step]); // eslint-disable-line react-hooks/exhaustive-deps
  const go = (n: number) => { setDir(n > d.step ? 1 : -1); setD((p) => { const x = { ...p, step: n }; try { localStorage.setItem(KEY, JSON.stringify(x)); } catch { /* ignore */ } return x; }); document.getElementById("fhero")?.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" }); };
  const clear = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setD(EMPTY); setFiles([]); setWelcome(false); setBad({}); reset(); };

  const next = () => {
    const b: Record<string, string> = {};
    if (d.step === 0) {
      if (!d.type) { b.type = ft.f_typeErr; }
      if (d.type === "other") { b.type = ft.f_otherNote; }
      if (!d.org.trim()) b.org = ft.f_orgErr;
      if (!d.name.trim()) b.name = ft.g_nameErr;
      if (!emailOk(d.email)) b.email = ft.g_emailErr;
    }
    if (d.step === 1) {
      if (!d.title.trim()) b.title = ft.f_titleErr;
      if (d.what.trim().length < 20) b.what = ft.f_whatErr;
    }
    setBad(b);
    const first = Object.keys(b)[0];
    if (first) { document.getElementById(`f-${first}`)?.focus(); return; }
    go(d.step + 1);
  };
  const send = () => {
    const start = BY_DAYS[WHEN.indexOf(d.by)];
    const who = [d.ppl && `About ${d.ppl} people`, d.who.trim()].filter(Boolean).join(": ");
    submit({
      organisation_name: d.org.trim(), contact_name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim(), charity_number: d.num.trim(),
      project_name: d.title.trim(), project_description: d.what.trim(), amount_requested: String(d.amt), total_project_cost: d.cost.trim(),
      who_benefits: who, start_date: start ? addDays(start) : "", additional_info: [`Applicant type: ${d.type}`, d.extra.trim()].filter(Boolean).join("\n\n"),
    }, files);
  };
  useEffect(() => { if (state.ok) { try { localStorage.removeItem(KEY); } catch { /* ignore */ } document.getElementById("fhero")?.scrollIntoView({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" }); } }, [state.ok]);
  const err = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="fdone" role="status">
        <OkMark />
        <h3>{fill(ft.f_doneTitle, { name: first })}</h3>
        {state.reference && <p className="fref">{ft.f_ref} <b>{state.reference}</b></p>}
        <p>{fill(ft.f_doneText, { amount: gbp(d.amt), project: d.title, email: d.email })}</p>
        <ol className="fnx"><li><b>{ft.f_n1}</b> {ft.f_n1Text}</li><li><b>{ft.f_n2}</b> {ft.f_n2Text}</li><li><b>{ft.f_n3}</b> {ft.f_n3Text}</li></ol>
        <div className="acts3"><Link className="btn blue" href="/">{ft.f_home}</Link><button className="btn ghost" type="button" onClick={clear}>{ft.f_again}</button></div>
      </div>
    );
  }
  const chips = (k: "type" | "ppl" | "by", list: [string, string][], cls: string) => (
    <div className={`chps ${cls}`} role="radiogroup" aria-label={k}>{list.map(([l, v]) => <button key={v} type="button" role="radio" aria-checked={d[k] === v} onClick={() => set(k, v)}>{l}</button>)}</div>
  );
  return (
    <div aria-busy={pending}>
      <div className="fhead">
        <div className="fsteps" aria-hidden="true">{STEPS.map((_, i) => <i key={i} className={i < d.step ? "fsd" : i === d.step ? "on" : ""} />)}</div>
        <div className="fmeta"><b>{fill(ft.f_stepOf, { n: String(d.step + 1) })}</b><span>{STEPS[d.step]}</span><em aria-live="polite" className={saved ? "on" : ""}>{saved ? ft.f_saved : ""}</em></div>
      </div>
      {welcome && <p className="fwelcome">{fill(ft.f_welcome, { name: first })} <button type="button" onClick={clear}>{ft.f_restart}</button></p>}
      <div className="fbody" ref={body}>
        {d.step === 0 && <>
          <p className="fq">{ft.f_whoQ}</p>
          {chips("type", TYPES.map((v, i) => [typeLabels[i] ?? v, v] as [string, string]), "two")}
          {(bad.type || d.type === "other") && <div className="fnote">{d.type === "other" ? <>{ft.f_otherNote} <Link href="/contact?subject=Funding">{ft.f_otherLink}</Link></> : bad.type}</div>}
          <Fl id="f-org" label={ft.f_org} value={d.org} onChange={(v) => set("org", v)} auto="organization" bad={bad.org} error={err.organisation_name} />
          <Fl id="f-name" label={ft.g_name} value={d.name} onChange={(v) => set("name", v)} auto="name" bad={bad.name} error={err.contact_name} />
          <Fl id="f-email" label={ft.g_email} type="email" mode="email" value={d.email} onChange={(v) => set("email", v)} auto="email" bad={bad.email} error={err.email} />
          <Fl id="f-phone" label={ft.f_phone} type="tel" mode="tel" value={d.phone} onChange={(v) => set("phone", v)} auto="tel" error={err.phone} />
          <button className="btn gold blk" type="button" onClick={next}>{ft.f_next1}</button>
          <p className="fine">{ft.f_fine1}</p>
        </>}
        {d.step === 1 && <>
          <Fl id="f-title" label={ft.f_title} value={d.title} onChange={(v) => set("title", v)} bad={bad.title} error={err.project_name} />
          <Fl id="f-what" label={ft.f_what} area value={d.what} onChange={(v) => set("what", v)} bad={bad.what} error={err.project_description} />
          <p className="fq">{ft.f_amtQ}</p>
          <div className="amt"><b>{gbp(d.amt)}</b><input type="range" min={250} max={10000} step={250} value={d.amt} aria-label="Amount requested in pounds" onChange={(e) => set("amt", +e.target.value)} style={{ ["--v" as string]: (d.amt - 250) / 9750 }} /></div>
          <div className="chps quick">{[500, 1000, 2500, 5000].map((v) => <button key={v} type="button" className={d.amt === v ? "on" : ""} onClick={() => set("amt", v)}>{gbp(v)}</button>)}</div>
          {err.amount_requested && <ServerMessage message={err.amount_requested} />}
          <p className="fq">{ft.f_pplQ}</p>
          {chips("ppl", PPL.map((p) => [p, p] as [string, string]), "four")}
          <Fl id="f-who" label={ft.f_whoLabel} value={d.who} onChange={(v) => set("who", v)} />
          <div className="fnav"><button type="button" className="fback" onClick={() => go(0)}>{ft.f_back}</button><button className="btn gold" type="button" onClick={next}>{ft.f_next2}</button></div>
        </>}
        {d.step === 2 && <>
          <p className="fq">{ft.f_whenQ}</p>
          {chips("by", WHEN.map((l) => [l, l] as [string, string]), "three")}
          <p className="fq">{ft.f_quoteQ} <span className="opt">{ft.f_quoteOpt}</span></p>
          <label className="drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFiles((f) => [...f, ...Array.from(e.dataTransfer.files)]); }}>
            <input type="file" multiple hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" onChange={(e) => { setFiles((f) => [...f, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }} />
            <span><b>{ft.f_drop}</b> {ft.f_dropOr}</span>
          </label>
          {files.length > 0 && <ul className="fl-files">{files.map((f, i) => <li key={i}>{f.name}<button type="button" aria-label={`Remove ${f.name}`} className="rm" onClick={() => setFiles((x) => x.filter((_, k) => k !== i))}>{ft.f_remove}</button></li>)}</ul>}
          <Fl id="f-cost" label={ft.f_cost} mode="numeric" value={d.cost} onChange={(v) => set("cost", v.replace(/[^0-9.]/g, ""))} error={err.total_project_cost} />
          <Fl id="f-num" label={ft.f_num} value={d.num} onChange={(v) => set("num", v)} />
          <Fl id="f-extra" label={ft.f_extra} area value={d.extra} onChange={(v) => set("extra", v)} />
          {Object.keys(err).length > 0 && !state.ok && <ServerMessage message={Object.values(err)[0]} />}
          <ServerMessage message={!state.ok && !Object.keys(err).length ? state.message : undefined} />
          <button className="btn gold blk" type="button" onClick={send} disabled={pending}>{pending ? ft.g_sending : ft.f_send}</button>
          <div className="fnav one"><button type="button" className="fback" onClick={() => go(1)}>{ft.f_back}</button></div>
          <p className="fine">{ft.f_consent} <Link href="/privacy">{ft.g_privacy}</Link>.</p>
        </>}
      </div>
    </div>
  );
}

/** The sticky bar that returns you to the application once you have scrolled away from it. */
export function ContinueBar() {
  const [past, setPast] = useState(false);
  const ft = useFormText();
  useEffect(() => {
    const el = document.getElementById("fhero"); if (!el) return;
    const io = new IntersectionObserver((es) => setPast(es[0].intersectionRatio < 0.35), { threshold: [0, 0.2, 0.35, 0.6, 0.9] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`jbar${past ? " up" : ""}`} hidden={!past}>
      <span><em>{ft.f_bar}</em></span>
      <button className="btn gold" type="button" onClick={() => jump()}>{ft.f_barBtn}</button>
    </div>
  );
}
export function jump() {
  document.getElementById("fhero")?.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
  setTimeout(() => document.querySelector<HTMLElement>("#fhero input, #fhero textarea")?.focus({ preventScroll: true }), reducedMotion() ? 0 : 450);
}
export function StartButton({ children }: { children: React.ReactNode }) {
  return <button className="btn gold" type="button" onClick={jump}>{children}</button>;
}

/** Colour and icon for each "What we fund" card; the wording comes from the admin. */
const FUND: [string, string, string, string][] = [
  ["Community projects", "Equipment, venue hire, activity programmes", "#005DAA", "M3 11l9-7 9 7v9H3zM9 20v-6h6v6"],
  ["Schools and young people", "Enterprise days, books, trips, sport", "#4d93cc", "M3 9l9-5 9 5-9 5zM7 11.5V16q5 3 10 0v-4.5"],
  ["Health and wellbeing", "Lunch clubs, mental health support", "#F7A81B", "M12 21s-7.5-4.6-9.2-9.4C1.6 8 3.6 5 6.6 5c2 0 3.6 1.1 5.4 3.2C13.8 6.1 15.4 5 17.4 5c3 0 5 3 3.8 6.6C19.5 16.4 12 21 12 21z"],
  ["Families in need", "Starter packs, Christmas support", "#c9780a", "M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7c-2.5 0-4-1-4-2.5S9.5 2 12 5c2.5-3 4-1 4 2"],
  ["Events and heritage", "Festivals, gardens, local history", "#0B1F3A", "M5 21V4h11l-1.5 4 1.5 4H5"],
];
export function FundCards({ cards }: { cards: [string, string][] }) {
  return (
    <div className="fgrid">
      {FUND.map(([, , c, ic], i) => [cards[i]?.[0] ?? "", cards[i]?.[1] ?? "", c, ic]).filter(([t]) => t).map(([t, p, c, ic], i) => (
        <article className="fcard" data-rv key={t} style={{ ["--c" as string]: c, ["--i" as string]: i }}>
          <span className="pic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={ic} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <h3>{t}</h3><p>{p}</p>
        </article>
      ))}
    </div>
  );
}

export function Track({ steps }: { steps: [string, string][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reducedMotion()) { setOn(true); return; }
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = steps.filter(([b]) => b);
  return (
    <div className={`ftrack${on ? " in" : ""}`} ref={ref}>
      <i className="fline" />
      {T.map(([b, s], i) => <div className="fstep" key={b} style={{ ["--i" as string]: i }}><i>{i + 1}</i><b>{b}</b><span>{s}</span></div>)}
    </div>
  );
}

export function GrantWall({ grants }: { grants: { id: string; name: string; what: string; amount: number }[] }) {
  return (
    <div className="gwall">
      {grants.map((g, i) => <article className="gcard" data-rv key={g.id} style={{ ["--i" as string]: i }}><b className="gn"><Counter value={g.amount} prefix="£" /></b><h3>{g.name}</h3><p>{g.what}</p></article>)}
    </div>
  );
}
