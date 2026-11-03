"use client";
import { startTransition, useActionState, useRef } from "react";
import { savePageText } from "@/app/admin/actions";
import type { TextGroup } from "@/lib/page-text";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { ImageField } from "./image-field";
import { PhotoListField } from "./photo-list-field";
import { PanelListField } from "./panel-list-field";

const hintFor = (help?: string, tokens?: boolean) => [help, tokens ? "{meeting} and {venue} fill in the meeting time and place." : ""].filter(Boolean).join(" ") || undefined;

/** One box per piece of wording, grouped by section of the page. Shows the current wording, so you edit it in place. */
export function PageTextForm({ page, groups, values }: { page: string; groups: readonly TextGroup[]; values: Record<string, string> }) {
  const [state, action, pending] = useActionState(savePageText.bind(null, page), {});
  const form = useRef<HTMLFormElement>(null);
  const reset = (name: string, def: string) => {
    const el = form.current?.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) { el.value = def; el.focus(); }
  };
  return (
    <form ref={form} onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="space-y-8 pb-24">
      {groups.map((g) => (
        <fieldset key={g.title} className="space-y-5 rounded-card border border-slate-200 p-5">
          <legend className="px-2 text-lg font-bold">{g.title}</legend>
          {Object.entries(g.fields).map(([name, f]) => {
            const v = values[name] ?? f.def;
            if (f.kind === "photos") return <PhotoListField key={name} name={name} label={f.label} defaultValue={v} help={f.help} decorative={name === "heroPhotos"} />;
            if (f.kind === "panels") return <PanelListField key={name} name={name} label={f.label} defaultValue={v} help={f.help} />;
            if (f.kind === "switch") return (
              <label key={name} className="flex items-center gap-3 font-semibold">
                {/* The checkbox comes first, so a ticked box sends "show"; unticked, the hidden "hide" is sent. */}
                <input type="checkbox" name={name} value="show" defaultChecked={v !== "hide"} className="h-5 w-5 accent-rotary" />
                <input type="hidden" name={name} value="hide" />{f.label}
              </label>
            );
            if (f.kind === "image") return <ImageField key={name} name={name} label={f.label} defaultValue={v} help={f.help} />;
            return (
              <div key={name}>
                <Field label={f.label} name={name} hint={hintFor(f.help, /\{(meeting|venue)\}/.test(f.def))}>
                  {(a) => f.long || f.lines
                    ? <Textarea {...a} rows={f.lines ? Math.max(3, v.split("\n").length + 1) : Math.max(2, Math.ceil(v.length / 70))} defaultValue={v} />
                    : <Input {...a} type="text" defaultValue={v} />}
                </Field>
                <button type="button" onClick={() => reset(name, f.def)} className="mt-1 text-sm font-semibold text-rotary underline hover:text-navy">Use original</button>
              </div>
            );
          })}
        </fieldset>
      ))}
      <div className="sticky bottom-3 flex flex-wrap items-center gap-4 rounded-card border border-slate-200 bg-white p-3 shadow-lift">
        <Button type="submit" size="lg" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
        <p role="status" className={`m-0 text-sm font-medium ${state.ok ? "text-green-800" : "text-red-800"}`}>{state.message ?? ""}</p>
      </div>
    </form>
  );
}
