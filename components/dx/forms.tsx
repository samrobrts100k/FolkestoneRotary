"use client";
import { useRef, useState, useTransition } from "react";
import type { FormState } from "@/lib/forms/schemas";
import { track } from "@/lib/analytics";

type Action = (s: FormState, fd: FormData) => Promise<FormState>;
type Ev = Parameters<typeof track>[0];

/**
 * Posts to one of the existing server actions. Adds the spam fields every action expects (timer + honeypot) and
 * the consent flag (the form states clearly that sending means agreeing). Fields stay put when the server returns an error.
 */
export function useSubmit(action: Action, trackAs?: Ev) {
  const [state, setState] = useState<FormState>({ ok: false });
  const [pending, start] = useTransition();
  const t0 = useRef(Date.now());
  const submit = (values: Record<string, string | undefined>, files: File[] = [], fileField = "file_supporting") => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v); });
    fd.append("_t", String(t0.current)); fd.append("website_url", ""); fd.append("consent", "on");
    files.forEach((f) => fd.append(fileField, f));
    start(async () => {
      try {
        const res = await action({ ok: false }, fd);
        setState(res);
        if (res.ok && trackAs) track(trackAs);
      } catch { setState({ ok: false, message: "Sorry, something went wrong. Please try again." }); }
    });
  };
  const reset = () => { setState({ ok: false }); t0.current = Date.now(); };
  return { state, pending, submit, reset, setState };
}

/** Floating-label text field in the dx style. `error` is the server's message for this field; `bad` is client-side. */
export function Fl({ id, label, value, onChange, type = "text", error, bad, area, auto, mode, required }: {
  id: string; label: string; value: string; onChange: (v: string) => void; type?: string; error?: string; bad?: string | false; area?: boolean; auto?: string; mode?: "email" | "tel" | "numeric"; required?: boolean;
}) {
  const msg = bad || error;
  const common = { id, value, placeholder: " ", onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onChange(e.target.value), "aria-invalid": msg ? true : undefined, "aria-describedby": msg ? `${id}-e` : undefined, autoComplete: auto, required };
  return (
    <div className={`fl${area ? " ta" : ""}${msg ? " bad" : ""}`}>
      {area ? <textarea {...common} /> : <input {...common} type={type} inputMode={mode} />}
      <label htmlFor={id}>{label}</label>
      <div className="err"><span id={`${id}-e`} role={msg ? "alert" : undefined}>{msg}</span></div>
    </div>
  );
}

export const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());

/** Check marks that animate (reuses the dx okmark styles). */
export const OkMark = () => <svg className="okmark" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="40" /><path d="M26 43l11 11 21-24" /></svg>;

export function ServerMessage({ message }: { message?: string }) {
  return message ? <p role="alert" className="fmsg">{message}</p> : null;
}
