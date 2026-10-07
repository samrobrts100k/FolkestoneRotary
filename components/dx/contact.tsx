"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { submitContact } from "@/app/actions/forms";
import { Cd } from "./common";
import { useToast } from "./dx-root";
import { nextMeetings } from "@/lib/meetings";
import { Fl, OkMark, ServerMessage, emailOk, useSubmit } from "./forms";
import { contactSubjects } from "@/lib/forms/subjects";

const WHO: Record<(typeof contactSubjects)[number], [string, string]> = {
  "General Enquiry": ["Anyone on the committee can answer this.", "Your message"],
  Membership: ["The membership team will reply.", "Tell us a little about yourself"],
  Funding: ["The funding panel will point you the right way.", "Tell us about your project"],
  Events: ["The events team will get back to you.", "Which event, and how can we help?"],
  Sponsorship: ["Our sponsorship lead will reply.", "Tell us about your business"],
  Media: ["Our media contact will reply.", "What are you working on?"],
  Other: ["We’ll pass it to the right person.", "Your message"],
};

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [subject, setSubject] = useState<(typeof contactSubjects)[number]>(contactSubjects.find((s) => s === defaultSubject) ?? "General Enquiry");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [msg, setMsg] = useState("");
  const [bad, setBad] = useState<Record<string, string>>({});
  const { state, pending, submit, reset } = useSubmit(submitContact);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const b: Record<string, string> = {};
    if (!name.trim()) b.n = "Please tell us your name.";
    if (!emailOk(email)) b.e = "Enter an email like name@example.com.";
    if (msg.trim().length < 10) b.m = "Write a few words so we can help (10+ characters).";
    setBad(b);
    const first = Object.keys(b)[0];
    if (first) { document.getElementById(`c-${first}`)?.focus(); return; }
    submit({ name: name.trim(), email: email.trim(), subject, message: msg.trim() });
  };
  useEffect(() => { if (state.ok) document.getElementById("cdone")?.scrollIntoView({ block: "center", behavior: "smooth" }); }, [state.ok]);
  if (state.ok) {
    return (
      <div className="done" id="cdone" role="status" tabIndex={-1}>
        <OkMark /><h3>Message sent</h3><p>{state.message} We’ve emailed you a confirmation.</p>
        <button className="btn blue" type="button" onClick={() => { setName(""); setEmail(""); setMsg(""); reset(); }}>Send another</button>
      </div>
    );
  }
  return (
    <>
      <h2 className="s">What’s it about?</h2>
      <div className="tiles" role="radiogroup" aria-label="Subject">
        {contactSubjects.map((s) => <label className="tile" key={s}><input type="radio" name="subj" value={s} checked={subject === s} onChange={() => setSubject(s)} /><span>{s}</span></label>)}
      </div>
      <p className="who" aria-live="polite">{WHO[subject][0]}</p>
      <form onSubmit={send} noValidate aria-busy={pending}>
        <Fl id="c-n" label="Your name" value={name} onChange={(v) => { setName(v); setBad((b) => ({ ...b, n: "" })); }} auto="name" bad={bad.n} error={state.errors?.name} />
        <Fl id="c-e" label="Email" type="email" mode="email" value={email} onChange={(v) => { setEmail(v); setBad((b) => ({ ...b, e: "" })); }} auto="email" bad={bad.e} error={state.errors?.email} />
        <Fl id="c-m" label={WHO[subject][1]} area value={msg} onChange={(v) => { setMsg(v); setBad((b) => ({ ...b, m: "" })); }} bad={bad.m} error={state.errors?.message} />
        <ServerMessage message={!state.ok ? state.message : undefined} />
        <p className="fine" style={{ color: "var(--mute)", margin: "0 0 14px" }}>By sending you agree to Folkestone Rotary storing your details to reply, as described in the <Link href="/privacy" style={{ color: "var(--blue)" }}>Privacy Policy</Link>.</p>
        <button className="btn blue" type="submit" disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
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
