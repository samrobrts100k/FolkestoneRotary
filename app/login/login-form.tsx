"use client";
import { startTransition, useActionState } from "react";
import { signIn } from "./actions";
import { Field, Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <Field label="Email" name="email" required>{(a) => <Input {...a} type="email" autoComplete="username" />}</Field>
      <Field label="Password" name="password" required>{(a) => <Input {...a} type="password" autoComplete="current-password" />}</Field>
      {state.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
