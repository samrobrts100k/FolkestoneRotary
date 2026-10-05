"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { submitFunding } from "@/app/actions/forms";
import { Counter } from "@/components/motion";
import { Fl, OkMark, ServerMessage, emailOk, useSubmit } from "./forms";
import { reducedMotion } from "./common";
import { gbp } from "@/lib/utils";

const TYPES: [string, string][] = [["Charity", "Charity"], ["School", "School"], ["Community group", "Community group"], ["Something else", "other"]];
const PPL = ["1 to 10", "11 to 50", "51 to 200", "200 or more"];
const BY: [string, number][] = [["Within a month", 14], ["In 3 months", 90], ["No rush", 0]];
const STEPS = ["You", "Your project", "The details"];
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
      if (!d.type) { b.type = "Please pick who’s applying"; }
      if (d.type === "other") { b.type = "We can’t fund individuals or private businesses. Please talk to us."; }
      if (!d.org.trim()) b.org = "Tell us the name of your group.";
      if (!d.name.trim()) b.name = "Please tell us your name.";
      if (!emailOk(d.email)) b.email = "Enter an email like name@example.com.";
    }
    if (d.step === 1) {
      if (!d.title.trim()) b.title = "Give your project a short name.";
      if (d.what.trim().length < 20) b.what = "A couple of sentences is plenty (at least 20 characters).";
    }
    setBad(b);
    const first = Object.keys(b)[0];
    if (first) { document.getElementById(`f-${first}`)?.focus(); return; }
    go(d.step + 1);
  };
  const send = () => {
    const start = BY.find(([l]) => l === d.by)?.[1];
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
        <h3>Thank you{d.name ? `, ${d.name.split(" ")[0]}` : ""}. It’s with us.</h3>
        {state.reference && <p className="fref">Your reference: <b>{state.reference}</b></p>}
        <p>You asked for <b>{gbp(d.amt)}</b> for <b>{d.title}</b>. We’ve emailed a confirmation to {d.email}.</p>
        <ol className="fnx"><li><b>Received</b> Your application is with the funding panel</li><li><b>Under review</b> A panel member reads it and may be in touch</li><li><b>Decision</b> You’ll hear from us by email</li></ol>
        <div className="acts3"><Link className="btn blue" href="/">Back to the home page</Link><button className="btn ghost" type="button" onClick={clear}>Apply for another project</button></div>
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
        <div className="fmeta"><b>Step {d.step + 1} of 3</b><span>{STEPS[d.step]}</span><em aria-live="polite" className={saved ? "on" : ""}>{saved ? "Saved just now" : ""}</em></div>
      </div>
      {welcome && <p className="fwelcome">Welcome back{d.name ? `, ${d.name.split(" ")[0]}` : ""}. We kept your answers. <button type="button" onClick={clear}>Start again</button></p>}
      <div className="fbody" ref={body}>
        {d.step === 0 && <>
          <p className="fq">Who’s applying?</p>
          {chips("type", TYPES, "two")}
          {(bad.type || d.type === "other") && <div className="fnote">{d.type === "other" ? <>We can’t fund individuals or private businesses, but there may be another way. <Link href="/contact?subject=Funding">Talk to us.</Link></> : bad.type}</div>}
          <Fl id="f-org" label="Group or organisation name" value={d.org} onChange={(v) => set("org", v)} auto="organization" bad={bad.org} error={err.organisation_name} />
          <Fl id="f-name" label="Your name" value={d.name} onChange={(v) => set("name", v)} auto="name" bad={bad.name} error={err.contact_name} />
          <Fl id="f-email" label="Email" type="email" mode="email" value={d.email} onChange={(v) => set("email", v)} auto="email" bad={bad.email} error={err.email} />
          <Fl id="f-phone" label="Phone (optional)" type="tel" mode="tel" value={d.phone} onChange={(v) => set("phone", v)} auto="tel" error={err.phone} />
          <button className="btn gold blk" type="button" onClick={next}>Next: your project</button>
          <p className="fine">About 5 minutes. Your answers save as you go.</p>
        </>}
        {d.step === 1 && <>
          <Fl id="f-title" label="Your project in one line" value={d.title} onChange={(v) => set("title", v)} bad={bad.title} error={err.project_name} />
          <Fl id="f-what" label="What will the money do?" area value={d.what} onChange={(v) => set("what", v)} bad={bad.what} error={err.project_description} />
          <p className="fq">How much are you asking for?</p>
          <div className="amt"><b>{gbp(d.amt)}</b><input type="range" min={250} max={10000} step={250} value={d.amt} aria-label="Amount requested in pounds" onChange={(e) => set("amt", +e.target.value)} style={{ ["--v" as string]: (d.amt - 250) / 9750 }} /></div>
          <div className="chps quick">{[500, 1000, 2500, 5000].map((v) => <button key={v} type="button" className={d.amt === v ? "on" : ""} onClick={() => set("amt", v)}>{gbp(v)}</button>)}</div>
          {err.amount_requested && <ServerMessage message={err.amount_requested} />}
          <p className="fq">Roughly how many people will benefit?</p>
          {chips("ppl", PPL.map((p) => [p, p] as [string, string]), "four")}
          <Fl id="f-who" label="Who are they? (optional)" value={d.who} onChange={(v) => set("who", v)} />
          <div className="fnav"><button type="button" className="fback" onClick={() => go(0)}>Back</button><button className="btn gold" type="button" onClick={next}>Next: the details</button></div>
        </>}
        {d.step === 2 && <>
          <p className="fq">When do you need the money?</p>
          {chips("by", BY.map(([l]) => [l, l] as [string, string]), "three")}
          <p className="fq">Got a quote or budget? <span className="opt">Optional, you can send it later</span></p>
          <label className="drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFiles((f) => [...f, ...Array.from(e.dataTransfer.files)]); }}>
            <input type="file" multiple hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" onChange={(e) => { setFiles((f) => [...f, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }} />
            <span><b>Add files</b> or drop them here</span>
          </label>
          {files.length > 0 && <ul className="fl-files">{files.map((f, i) => <li key={i}>{f.name}<button type="button" aria-label={`Remove ${f.name}`} className="rm" onClick={() => setFiles((x) => x.filter((_, k) => k !== i))}>Remove</button></li>)}</ul>}
          <Fl id="f-cost" label="Total project cost, if more than you’re asking for (£)" mode="numeric" value={d.cost} onChange={(v) => set("cost", v.replace(/[^0-9.]/g, ""))} error={err.total_project_cost} />
          <Fl id="f-num" label="Charity number (optional)" value={d.num} onChange={(v) => set("num", v)} />
          <Fl id="f-extra" label="Anything else we should know? (optional)" area value={d.extra} onChange={(v) => set("extra", v)} />
          {Object.keys(err).length > 0 && !state.ok && <ServerMessage message={Object.values(err)[0]} />}
          <ServerMessage message={!state.ok && !Object.keys(err).length ? state.message : undefined} />
          <button className="btn gold blk" type="button" onClick={send} disabled={pending}>{pending ? "Sending…" : "Send my application"}</button>
          <div className="fnav one"><button type="button" className="fback" onClick={() => go(1)}>Back</button></div>
          <p className="fine">By sending you agree to us storing your details to review your application, as described in the <Link href="/privacy">Privacy Policy</Link>.</p>
        </>}
      </div>
    </div>
  );
}

/** The sticky bar that returns you to the application once you have scrolled away from it. */
export function ContinueBar() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = document.getElementById("fhero"); if (!el) return;
    const io = new IntersectionObserver((es) => setPast(es[0].intersectionRatio < 0.35), { threshold: [0, 0.2, 0.35, 0.6, 0.9] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`jbar${past ? " up" : ""}`} hidden={!past}>
      <span><em>5-minute application</em></span>
      <button className="btn gold" type="button" onClick={() => jump()}>Continue</button>
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

const FUND: [string, string, string, string][] = [
  ["Community projects", "Equipment, venue hire, activity programmes", "#005DAA", "M3 11l9-7 9 7v9H3zM9 20v-6h6v6"],
  ["Schools and young people", "Enterprise days, books, trips, sport", "#4d93cc", "M3 9l9-5 9 5-9 5zM7 11.5V16q5 3 10 0v-4.5"],
  ["Health and wellbeing", "Lunch clubs, mental health support", "#F7A81B", "M12 21s-7.5-4.6-9.2-9.4C1.6 8 3.6 5 6.6 5c2 0 3.6 1.1 5.4 3.2C13.8 6.1 15.4 5 17.4 5c3 0 5 3 3.8 6.6C19.5 16.4 12 21 12 21z"],
  ["Families in need", "Starter packs, Christmas support", "#c9780a", "M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7c-2.5 0-4-1-4-2.5S9.5 2 12 5c2.5-3 4-1 4 2"],
  ["Events and heritage", "Festivals, gardens, local history", "#0B1F3A", "M5 21V4h11l-1.5 4 1.5 4H5"],
];
export function FundCards() {
  return (
    <div className="fgrid">
      {FUND.map(([t, p, c, ic], i) => (
        <article className="fcard" data-rv key={t} style={{ ["--c" as string]: c, ["--i" as string]: i }}>
          <span className="pic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={ic} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <h3>{t}</h3><p>{p}</p>
        </article>
      ))}
    </div>
  );
}

export function Track() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reducedMotion()) { setOn(true); return; }
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = [["Received", "You get a reference by email."], ["Read by a panel member", "They may ask a question or two."], ["Panel decides", "Approved, declined, or more information needed."], ["Funds paid", "Then tell us how it went."]];
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
