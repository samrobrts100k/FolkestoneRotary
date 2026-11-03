"use client";
import { startTransition, useActionState, useState } from "react";
import { saveRecord } from "@/app/admin/actions";
import type { Resource } from "@/lib/admin/resources";
import { Field, Input, Select, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { ImageField } from "./image-field";
import { RichTextField } from "./rich-text-field";
import { STATUSES } from "@/lib/types";
import { isoToLocalInput, londonParts } from "@/lib/event-time";

/** Dates and times in the form are UK time, matching how they are saved. */
const toLocal = isoToLocalInput;
/** Fills a date + optional time pair. 00:00 on a start and 23:59 on an end mean "no time given". */
const whenParts = (iso: unknown, isEnd: boolean) => {
  if (typeof iso !== "string" || !iso) return { date: "", time: "" };
  const p = londonParts(iso);
  return { date: p.date, time: p.time === (isEnd ? "23:59" : "00:00") ? "" : p.time };
};

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
        if (f.type === "rich") return <div key={f.name}><RichTextField name={f.name} label={f.label} defaultValue={(v as string) ?? ""} help={f.help} rows={f.rows} required={f.required} />{e[f.name] && <p role="alert" className="mt-1 text-sm font-medium text-red-700">{e[f.name]}</p>}</div>;
        if (f.type === "when") {
          const w = whenParts(v, Boolean(f.after));
          return (
            <fieldset key={f.name} className="space-y-1" aria-describedby={f.help ? `${f.name}-help` : undefined}>
              <legend className="text-sm font-semibold">{f.label}{f.required && <span className="text-red-700"> *</span>}</legend>
              <div className="flex flex-wrap gap-3">
                <label className="text-sm">Date<Input type="date" name={`${f.name}__date`} defaultValue={w.date} required={f.required} aria-invalid={Boolean(e[f.name])} /></label>
                <label className="text-sm">Time <span className="text-slate-blue">(optional)</span><Input type="time" name={`${f.name}__time`} defaultValue={w.time} aria-invalid={Boolean(e[f.name])} /></label>
              </div>
              {f.help && <p id={`${f.name}-help`} className="text-sm text-slate-blue">{f.help}</p>}
              {e[f.name] && <p role="alert" className="text-sm font-medium text-red-700">{e[f.name]}</p>}
            </fieldset>
          );
        }
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
