"use client";
import { startTransition, useActionState, useState } from "react";
import { saveRecord } from "@/app/admin/actions";
import type { Resource } from "@/lib/admin/resources";
import { Field, Input, Select, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { ImageField } from "./image-field";
import { STATUSES } from "@/lib/types";

const toLocal = (iso?: string | null) => { if (!iso) return ""; const d = new Date(iso); const p = (n: number) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };

export function RecordForm({ resource, id, record }: { resource: Resource; id: string; record: Record<string, unknown> | null }) {
  const [state, action, pending] = useActionState(saveRecord.bind(null, resource.key, id), {});
  const [status, setStatus] = useState(String(record?.status ?? "draft"));
  const e = state.errors ?? {};
  const val = (n: string) => record?.[n];
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="space-y-5">
      {resource.fields.map((f) => {
        const v = val(f.name);
        if (f.type === "image" || f.type === "file") return <ImageField key={f.name} name={f.name} label={f.label} defaultValue={v as string} accept={f.type === "image" ? "image" : "file"} help={f.help} />;
        if (f.type === "checkbox") return <label key={f.name} className="flex items-center gap-3 font-semibold"><input type="checkbox" name={f.name} defaultChecked={Boolean(v)} className="h-5 w-5 accent-rotary" />{f.label}</label>;
        const dv = f.type === "datetime" ? toLocal(v as string) : f.type === "tags" ? ((v as string[]) ?? []).join(", ") : f.type === "json" ? JSON.stringify(v ?? [], null, 2) : (v ?? "");
        return (
          <Field key={f.name} label={f.label} name={f.name} error={e[f.name]} hint={f.help} required={f.required}>
            {(a) => f.type === "textarea" || f.type === "json" ? <Textarea {...a} rows={f.rows ?? (f.type === "json" ? 5 : 4)} defaultValue={String(dv)} className={f.type === "json" ? "font-mono text-sm" : ""} />
              : f.type === "select" ? <Select {...a} defaultValue={String(v ?? "")}><option value="">Choose…</option>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select>
              : <Input {...a} type={f.type === "datetime" ? "datetime-local" : f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} step={f.type === "number" ? "any" : undefined} defaultValue={String(dv)} />}
          </Field>
        );
      })}
      {resource.workflow && (
        <fieldset className="rounded-xl bg-surface p-4"><legend className="px-2 font-bold">Publishing</legend>
          <Field label="Status" name="status" error={e.status} required>{(a) => <Select {...a} value={status} onChange={(ev) => setStatus(ev.target.value)}>{STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</Select>}</Field>
          {status === "scheduled" && <div className="mt-3"><Field label="Publish at" name="publish_at" error={e.publish_at} required>{(a) => <Input {...a} type="datetime-local" defaultValue={toLocal(val("publish_at") as string)} />}</Field></div>}
          <p className="mt-2 text-sm text-slate-blue">Draft and Archived are hidden from the public. Scheduled goes live automatically at the chosen time.</p>
        </fieldset>
      )}
      {state.message && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{state.message}</p>}
      <Button type="submit" size="lg" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
    </form>
  );
}
