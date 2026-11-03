"use client";
import "@/app/dx.css";
import "@/app/dx-extra.css";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { submitMembership } from "@/app/actions/forms";
import { Cd, reducedMotion, useScrolledPast } from "./common";
import { Fl, OkMark, ServerMessage, emailOk, useSubmit } from "./forms";
import { formatDate } from "@/lib/utils";
import { googleCalendarUrl } from "@/lib/ics";
import { meetingEnd, nextMeetings } from "@/lib/meetings";
import { site } from "@/lib/site";
import { fill, toLines, type PageText } from "@/lib/page-text";
import { useFormText } from "@/components/form-text";

/** Wording for the "Reserve your seat" card, from Admin → Page text (Join). */
export interface CardText { title: string; btn: string; fine: string }
const CARD: CardText = { title: "Reserve your seat", btn: "Reserve my seat", fine: "No obligation. We’ll be in touch to arrange your visit. By reserving you agree to us storing your details to reply, as described in the" };

/** The next three lunch meetings (2nd and 4th Monday, 12:15), worked out in the browser. */
function useDates() {
  const [dates, setDates] = useState<Date[]>([]);
  useEffect(() => {
    setDates(nextMeetings(3));
  }, []);
  return dates;
}

interface Ctx { open: (who?: string) => void; sel: number; setSel: (n: number) => void }
const JoinCtx = createContext<Ctx>({ open: () => {}, sel: 0, setSel: () => {} });
export const useReserve = () => useContext(JoinCtx);
export function Reserve({ who, children, className }: { who?: string; children: React.ReactNode; className?: string }) {
  const { open } = useReserve();
  return <button type="button" className={className} onClick={() => open(who)}>{children}</button>;
}

/** The enquiry itself: pick a lunch date, give a name and email. Used in the hero and in the pop-up. */
function ReserveForm({ prefix, sel, setSel, who, onDone, text = CARD }: { prefix: string; sel: number; setSel: (n: number) => void; who: string; onDone?: () => void; text?: CardText }) {
  const dates = useDates();
  const { state, pending, submit } = useSubmit(submitMembership, "membership_enquiry");
  const ft = useFormText();
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [bad, setBad] = useState<{ n?: string; e?: string }>({});
  const day = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-GB", o);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const b = { n: name.trim() ? undefined : ft.g_nameErr, e: emailOk(email) ? undefined : ft.g_emailErr };
    setBad(b);
    if (b.n || b.e) { document.getElementById(`${prefix}${b.n ? "n" : "e"}`)?.focus(); return; }
    const when = dates[sel] ? day(dates[sel], { weekday: "long", day: "numeric", month: "long" }) : "the next lunch";
    submit({ name: name.trim(), email: email.trim(), why_interested: `Guest visit request for ${when}${who ? ` (${who})` : ""}.`, preferred_contact: "email" });
  };
  useEffect(() => { if (state.ok) onDone?.(); }, [state.ok]); // eslint-disable-line react-hooks/exhaustive-deps
  if (state.ok) {
    const d = dates[sel];
    return (
      <div className="jdone" aria-live="polite">
        <OkMark />
        <h3>{fill(ft.r_doneTitle, { date: d ? day(d, { weekday: "long", day: "numeric", month: "long" }) : "the next lunch" })}</h3>
        <ul>{toLines(ft.r_donePts).map((x) => <li key={x}>{x}</li>)}</ul>
        <div className="acts3">
          {d && <a className="btn blue" target="_blank" rel="noopener noreferrer" href={googleCalendarUrl({ title: "Folkestone Rotary lunch (guest)", short_description: "Guest visit", description: "Guest visit", starts_at: d.toISOString(), ends_at: meetingEnd(d).toISOString(), venue_name: site.meeting.venue, slug: "join" } as never, "")}>{ft.r_doneCal}</a>}
          <Link className="btn ghost" href="/contact?subject=Membership">{ft.r_doneAsk}</Link>
        </div>
      </div>
    );
  }
  return (
    <form className="jf" onSubmit={send} noValidate aria-busy={pending}>
      <div className="jdates" role="radiogroup" aria-label="Which lunch suits you?">
        {(dates.length ? dates : [null, null, null]).map((d, i) => (
          <button key={i} type="button" role="radio" aria-checked={i === sel} onClick={() => setSel(i)}>
            <b>{d ? day(d, { day: "numeric" }) : "–"}</b><span>{d ? day(d, { month: "short" }) : ""}{i === 0 ? " · next" : ""}</span>
          </button>
        ))}
      </div>
      <Fl id={`${prefix}n`} label={ft.g_name} value={name} onChange={(v) => { setName(v); setBad((b) => ({ ...b, n: undefined })); }} auto="name" bad={bad.n} error={state.errors?.name} />
      <Fl id={`${prefix}e`} label={ft.g_email} type="email" mode="email" value={email} onChange={(v) => { setEmail(v); setBad((b) => ({ ...b, e: undefined })); }} auto="email" bad={bad.e} error={state.errors?.email} />
      <ServerMessage message={!state.ok ? state.message : undefined} />
      <button className="btn gold blk" type="submit" disabled={pending}>{pending ? ft.g_sending : text.btn}</button>
      <p className="fine">{text.fine} <Link href="/privacy">{ft.g_privacy}</Link>.</p>
    </form>
  );
}

/** Wraps the Join page: owns the chosen date, the pop-up and the sticky bar. */
export function JoinShell({ children, hero, text = CARD, barBtn = "Reserve a seat" }: { children: React.ReactNode; hero: React.ReactNode; text?: CardText; barBtn?: string }) {
  const [sel, setSel] = useState(0);
  const [who, setWho] = useState("");
  const [booked, setBooked] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);
  const dates = useDates();
  const past = useScrolledPast("#jhero", 0.6);
  const open = (w?: string) => { setWho(w ?? ""); dlg.current?.showModal(); };
  const shut = () => {
    const d = dlg.current; if (!d) return;
    if (reducedMotion() || !d.open) { d.close(); return; }
    d.classList.add("closing"); setTimeout(() => { d.close(); d.classList.remove("closing"); }, 150);
  };
  return (
    <JoinCtx.Provider value={{ open, sel, setSel }}>
      {hero}
      {children}
      <dialog className="sheet jdlg" ref={dlg} aria-labelledby="jdt" onCancel={(e) => { e.preventDefault(); shut(); }} onClick={(e) => { if (e.target === dlg.current) shut(); }}>
        <button className="x" type="button" aria-label="Close" onClick={shut}><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg></button>
        <div className="top"><h3 id="jdt">{text.title}</h3><p style={{ margin: 0, color: "#dbe8f6" }}>{who ? `Reserving as ${who}.` : "No obligation. Someone will be in touch."}</p></div>
        <div className="bodyx"><ReserveForm prefix="d" sel={sel} setSel={setSel} who={who} onDone={() => setBooked(true)} text={text} /></div>
      </dialog>
      <div className={`jbar${past && !booked ? " up" : ""}`} hidden={!past || booked}>
        <span><b>Next lunch</b> <em>{dates[0] ? dates[0].toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + ", 12:15" : ""}</em></span>
        <button className="btn gold" type="button" onClick={() => open()}>{barBtn}</button>
      </div>
    </JoinCtx.Provider>
  );
}

export function JoinHeroCard({ text = CARD }: { text?: CardText }) {
  const { sel, setSel } = useReserve();
  const dates = useDates();
  return (
    <div className="glass jhero" id="jhero">
      <div className="jtop"><div><b className="t">{text.title}</b><span className="jwhen">{dates[sel] ? formatDate(dates[sel].toISOString(), { weekday: "long", day: "numeric", month: "long" }) + ", 12:15" : ""}</span></div>{dates[0] && <Cd to={dates[0].getTime()} small label="Time until the next lunch" />}</div>
      <ReserveForm prefix="h" sel={sel} setSel={setSel} who="" text={text} />
    </div>
  );
}

const PERSONAS: { t: string; who: string; hk: string; pts: string[]; c: string; ic: string }[] = [
  { t: "Business owners", who: "a business owner", hk: "Meet the people who buy, sell and hire in Folkestone.", pts: ["Lunch with other local business people", "Help with the Golf Day sponsorship drive", "Mentor young people at Dragons’ Den"], c: "#005DAA", ic: "M4 8h16v11H4zM9 8V5h6v3M4 13h16" },
  { t: "Retired", who: "retired", hk: "Be useful, social and out of the house at lunchtime.", pts: ["Meet people who live nearby", "Help at collections and the Half Marathon", "Plan an event, or just turn up and help"], c: "#F7A81B", ic: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2" },
  { t: "Teachers", who: "a teacher", hk: "Bring your school’s ideas to people who can fund them.", pts: ["Link your school with funding", "Run enterprise days with Dragons’ Den", "Hear what local charities need"], c: "#4d93cc", ic: "M3 9l9-5 9 5-9 5zM7 11.5V16q5 3 10 0v-4.5" },
  { t: "New to Folkestone", who: "new to Folkestone", hk: "One lunch and you know a roomful of locals.", pts: ["Meet a friendly crowd in one lunch", "Learn the town from the people who run it", "Find a reason to be on the seafront on a Saturday"], c: "#0B1F3A", ic: "M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
  { t: "Under 30", who: "under 30", hk: "Your ideas, your skills, a network that opens doors.", pts: ["Bring ideas the club hasn’t tried", "Run the social media for an event", "Build skills and a local network"], c: "#c9780a", ic: "M12 3l2.6 5.8 6.4.7-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3L3 9.5l6.4-.7z" },
];

export function Personas({ t }: { t: PageText<"join"> }) {
  const cards = PERSONAS.map((p, i) => { const n = i + 1 as 1 | 2 | 3 | 4 | 5; return { ...p, t: t[`p${n}Title`], hk: t[`p${n}Hook`], pts: toLines(t[`p${n}Pts`]) }; });
  return (
    <div className="pgrid">
      {cards.map((p, i) => (
        <article className="pcard" data-rv key={p.t} style={{ ["--c" as string]: p.c, ["--i" as string]: i }}>
          <span className="pic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={p.ic} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <h3>{p.t}</h3><p className="hk">{p.hk}</p>
          <ul>{p.pts.map((x) => <li key={x}>{x}</li>)}</ul>
          <Reserve className="pbtn" who={p.who}>{t.cardCta}<i aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></i></Reserve>
        </article>
      ))}
    </div>
  );
}

/** Seat colours round the table; null is a free chair. */
const SLOTS: (string | null)[] = ["#4d93cc", "#F7A81B", null, "#005DAA", "#c9780a", "#0B1F3A", null, "#4d93cc", "#005DAA", null];

/** Pull up a chair: the kinds of people you would sit with, and the free seats. */
export function Table({ t }: { t: PageText<"join"> }) {
  const [on, setOn] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reducedMotion()) { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Names come from the admin; colours and the three free chairs keep their places.
  const names = toLines(t.seats);
  let n = 0;
  const SEATS = SLOTS.map((c) => (c && names[n] ? ((x) => [x, x[0].toUpperCase(), c] as [string, string, string])(names[n++]) : null));
  const seat = (m: (typeof SEATS)[number], i: number) => m
    ? <button key={i} type="button" className={`sit${on === i ? " on" : ""}`} style={{ ["--c" as string]: m[2], ["--i" as string]: i }} aria-pressed={on === i} aria-label={m[0]} onClick={() => setOn(on === i ? null : i)}><span className="av">{m[1]}</span><b>{m[0]}</b></button>
    : <Reserve key={i} className="sit free"><span className="av" style={{ ["--i" as string]: i }}>+</span><b>Your seat</b></Reserve>;
  return (
    <div className={`tbl${seen ? " in" : ""}`} ref={ref} id="tbl">
      <div className="trow">{SEATS.slice(0, 5).map((m, i) => seat(m, i))}</div>
      <div className="tbar" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="trow">{SEATS.slice(5).map((m, i) => seat(m, i + 5))}</div>
      <p className="tbl-note" aria-live="polite">{on !== null && SEATS[on] ? `${SEATS[on]![0]}. The kind of person you might sit next to.` : t.tableNote}</p>
    </div>
  );
}

export function JoinCta({ t }: { t: PageText<"join"> }) {
  return (
    <div className="jcta" data-rv><div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><Reserve className="btn gold">{t.ctaBtn}</Reserve></div>
  );
}

/** The Join page's "Reserve your seat" card on its own, for the home hero. Brings the dx styles with it. */
export function HomeReserveCard({ text }: { text: CardText }) {
  const [sel, setSel] = useState(0);
  return (
    <JoinCtx.Provider value={{ open: () => {}, sel, setSel }}>
      <div className="dx dx-bare"><JoinHeroCard text={text} /></div>
    </JoinCtx.Provider>
  );
}
