"use client";
import { startTransition, useActionState } from "react";
import { requestReset, setPassword } from "@/app/login/password-actions";
import { Field, Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export function ForgotForm() {
  const [s, action, pending] = useActionState(requestReset, {});
  if (s.ok) return <p role="status" className="rounded-xl bg-rotary-light p-4">If that email has an account, a reset link is on its way. Check your inbox (and spam).</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="space-y-5">
      <Field label="Email" name="email" required>{(a) => <Input {...a} type="email" autoComplete="email" />}</Field>
      {s.error && <p role="alert" className="text-sm font-medium text-red-800">{s.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Sending…" : "Send reset link"}</Button>
    </form>
  );
}

export function ResetForm() {
  const [s, action, pending] = useActionState(setPassword, {});
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="space-y-5">
      <Field label="New password" name="password" required hint="At least 10 characters.">{(a) => <Input {...a} type="password" autoComplete="new-password" minLength={10} />}</Field>
      <Field label="Confirm new password" name="confirm" required>{(a) => <Input {...a} type="password" autoComplete="new-password" minLength={10} />}</Field>
      {s.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{s.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Saving…" : "Save password"}</Button>
    </form>
  );
}
