"use client";
import { startTransition, useActionState } from "react";
import { inviteUser } from "@/app/admin/actions";
import { Field, Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export function InviteForm() {
  const [s, action, pending] = useActionState(inviteUser, {});
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Field label="Full name" name="full_name">{(a) => <Input {...a} />}</Field>
      <Field label="Email" name="email" required error={s.errors?.email}>{(a) => <Input {...a} type="email" />}</Field>
      <Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send invite"}</Button>
      {s.message && <p role="status" className="text-sm font-medium">{s.message}</p>}
    </form>
  );
}
