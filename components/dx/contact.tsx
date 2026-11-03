"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { submitContact } from "@/app/actions/forms";
import { Cd } from "./common";
import { useToast } from "./dx-root";
import { nextMeetings } from "@/lib/meetings";
import { Fl, OkMark, ServerMessage, emailOk, useSubmit } from "./forms";
import { contactSubjects } from "@/lib/forms/subjects";
import { useFormText } from "@/components/form-text";
import type { TextKey } from "@/lib/page-text";

/** Which wording to use for each subject: [who replies, message box label] from Page text → Forms. */
const WHO_KEYS: Record<(typeof contactSubjects)[number], [TextKey<"forms">, TextKey<"forms">]> = {
  "General Enquiry": ["c_generalWho", "c_generalLabel"], Membership: ["c_membershipWho", "c_membershipLabel"], Funding: ["c_fundingWho", "c_fundingLabel"],
  Events: ["c_eventsWho", "c_eventsLabel"], Sponsorship: ["c_sponsorshipWho", "c_sponsorshipLabel"], Media: ["c_mediaWho", "c_mediaLabel"], Other: ["c_otherWho", "c_otherLabel"],
};

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [subject, setSubject] = useState<(typeof contactSubjects)[number]>(contactSubjects.find((s) => s === defaultSubject) ?? "General Enquiry");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [msg, setMsg] = useState("");
  const [bad, setBad] = useState<Record<string, string>>({});
  const { state, pending, submit, reset } = useSubmit(submitContact);
  const ft = useFormText();
  const WHO = (s: (typeof contactSubjects)[number]) => [ft[WHO_KEYS[s][0]], ft[WHO_KEYS[s][1]]];
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const b: Record<string, string> = {};
    if (!name.trim()) b.n = ft.g_nameErr;
    if (!emailOk(email)) b.e = ft.g_emailErr;
    if (msg.trim().length < 10) b.m = ft.c_msgErr;
    setBad(b);
    const first = Object.keys(b)[0];
    if (first) { document.getElementById(`c-${first}`)?.focus(); return; }
    submit({ name: name.trim(), email: email.trim(), subject, message: msg.trim() });
  };
  useEffect(() => { if (state.ok) document.getElementById("cdone")?.scrollIntoView({ block: "center", behavior: "smooth" }); }, [state.ok]);
  if (state.ok) {
    return (
      <div className="done" id="cdone" role="status" tabIndex={-1}>
        <OkMark /><h3>{ft.c_doneTitle}</h3><p>{state.message} {ft.c_doneText}</p>
        <button className="btn blue" type="button" onClick={() => { setName(""); setEmail(""); setMsg(""); reset(); }}>{ft.c_another}</button>
      </div>
    );
  }
  return (
    <>
      <h2 className="s">{ft.c_subjectTitle}</h2>
      <div className="tiles" role="radiogroup" aria-label="Subject">
        {contactSubjects.map((s) => <label className="tile" key={s}><input type="radio" name="subj" value={s} checked={subject === s} onChange={() => setSubject(s)} /><span>{s}</span></label>)}
      </div>
      <p className="who" aria-live="polite">{WHO(subject)[0]}</p>
      <form onSubmit={send} noValidate aria-busy={pending}>
        <Fl id="c-n" label={ft.g_name} value={name} onChange={(v) => { setName(v); setBad((b) => ({ ...b, n: "" })); }} auto="name" bad={bad.n} error={state.errors?.name} />
        <Fl id="c-e" label={ft.g_email} type="email" mode="email" value={email} onChange={(v) => { setEmail(v); setBad((b) => ({ ...b, e: "" })); }} auto="email" bad={bad.e} error={state.errors?.email} />
        <Fl id="c-m" label={WHO(subject)[1]} area value={msg} onChange={(v) => { setMsg(v); setBad((b) => ({ ...b, m: "" })); }} bad={bad.m} error={state.errors?.message} />
        <ServerMessage message={!state.ok ? state.message : undefined} />
        <p className="fine" style={{ color: "var(--mute)", margin: "0 0 14px" }}>{ft.c_consent} <Link href="/privacy" style={{ color: "var(--blue)" }}>{ft.g_privacy}</Link>.</p>
        <button className="btn blue" type="submit" disabled={pending}>{pending ? ft.g_sending : ft.c_send}</button>
      </form>
    </>
  );
}

export function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const toast = useToast();
  return <button className="copy" type="button" onClick={() => { try { navigator.clipboard?.writeText(text); } catch { /* ignore */ } toast(`Copied: ${text}`); }}>{label}</button>;
}

/** The next lunch (2nd or 4th Monday, 12:15) as a timestamp, worked out in the browser. */
export function NextMeeting() {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => { setT(nextMeetings(1)[0].getTime()); }, []);
  return t ? <Cd to={t} label="Time until the next meeting" /> : <div className="cd" style={{ minHeight: 76 }} aria-hidden />;
}
