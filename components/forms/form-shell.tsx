"use client";
import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import type { FieldErrors, FormState } from "@/lib/forms/schemas";

type Action = (s: FormState, fd: FormData) => Promise<FormState>;
type Ev = Parameters<typeof track>[0];

/** Wraps a server action with spam fields, pending/error/success states and analytics. */
export function FormShell({ action, children, submitLabel, successTitle = "Thank you!", trackAs, className, successExtra }: {
  action: Action; children: (errors: FieldErrors) => React.ReactNode; submitLabel: string; successTitle?: string; trackAs?: Ev; className?: string; successExtra?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, { ok: false });
  const [t, setT] = useState("");
  useEffect(() => setT(String(Date.now())), [state]);
  useEffect(() => { if (state.ok && trackAs) track(trackAs); }, [state.ok, trackAs]);

  if (state.ok) {
    return (
      <div role="status" className="rounded-card bg-rotary-light p-6 text-center">
        <CheckCircle2 aria-hidden className="mx-auto h-10 w-10 text-rotary" />
        <h3 className="mt-3 text-xl font-bold">{successTitle}</h3>
        <p className="mt-1 text-slate-700">{state.message}</p>
        {state.reference && <p className="mt-2 text-sm">Reference: <strong>{state.reference}</strong></p>}
        {successExtra}
      </div>
    );
  }
  return (
    <form action={formAction} noValidate={false} className={className ?? "space-y-5"} aria-busy={pending}>
      <input type="hidden" name="_t" value={t} />
      {/* Honeypot: hidden from people and assistive tech, bots fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave blank<input type="text" name="website_url" tabIndex={-1} autoComplete="off" /></label></div>
      {children(state.errors ?? {})}
      {state.message && !state.ok && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800"><AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{state.message}</p>
      )}
      <Button type="submit" disabled={pending || !t} size="lg" className="w-full sm:w-auto">
        {pending && <Loader2 aria-hidden className="h-5 w-5 animate-spin" />}{pending ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}

export const PrivacyConsent = ({ what }: { what: string }) => (
  <>I agree to Folkestone Rotary storing my details to {what}, as described in the <a href="/privacy" className="font-semibold text-rotary underline">Privacy Policy</a>.</>
);
