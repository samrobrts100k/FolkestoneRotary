import type { FieldDef, Resource } from "./resources";
import { slugify } from "../utils";
import { STATUSES } from "../types";
import { localInputToISO, londonToISO } from "../event-time";

export type BuildResult = { ok: true; row: Record<string, unknown> } | { ok: false; errors: Record<string, string> };

/** Turns submitted FormData into a DB row using the resource's field definitions. Pure, so it can be unit-tested. */
export function buildRow(res: Resource, fd: { get(k: string): unknown }): BuildResult {
  const row: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  const str = (n: string) => String(fd.get(n) ?? "").trim();

  for (const f of res.fields) {
    if (f.type === "when") { row[f.name] = parseWhen(f, str, errors, row); continue; }
    const v = str(f.name);
    if (f.required && !v && f.type !== "checkbox") { errors[f.name] = `${f.label} is required`; continue; }
    row[f.name] = parseField(f, v, fd.get(f.name), errors);
  }
  if (res.slugFrom) {
    const slug = slugify(str("slug") || str(res.slugFrom));
    if (!slug) errors.slug = "A URL slug is required"; else row.slug = slug;
  }
  if (res.workflow) {
    const status = str("status");
    if (!(STATUSES as string[]).includes(status)) errors.status = "Choose a status";
    row.status = status;
    if (status === "scheduled") {
      const at = str("publish_at");
      const iso = at ? localInputToISO(at) : null;
      if (!iso) errors.publish_at = "Choose when to publish";
      else row.publish_at = iso;
    } else row.publish_at = null;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, row };
}

/** A date box (`name__date`) and an optional time box (`name__time`), in UK time. */
function parseWhen(f: FieldDef, str: (n: string) => string, errors: Record<string, string>, row: Record<string, unknown>): string | null {
  const time = str(`${f.name}__time`);
  let date = str(`${f.name}__date`);
  if (!date && time && f.after) date = str(`${f.after}__date`); // an end time on its own: same day as the start
  if (!date) { if (f.required) errors[f.name] = `${f.label} is required`; else if (time) errors[f.name] = "Add a date"; return null; }
  const iso = londonToISO(date, time || (f.after ? "23:59" : "00:00"));
  if (!iso) { errors[f.name] = "Enter a valid date and time"; return null; }
  const start = f.after ? row[f.after] : null;
  if (typeof start === "string" && iso < start) { errors[f.name] = "The end is before the start"; return null; }
  return iso;
}

function parseField(f: FieldDef, v: string, raw: unknown, errors: Record<string, string>): unknown {
  switch (f.type) {
    case "checkbox": return raw === "on";
    case "number": { if (!v) return null; const n = Number(v); if (Number.isNaN(n)) { errors[f.name] = "Enter a number"; return null; } return n; }
    // Read as UK time, so a summer time isn't stored an hour out on a server running GMT.
    case "datetime": { if (!v) return null; const iso = localInputToISO(v); if (!iso) { errors[f.name] = "Enter a valid date"; return null; } return iso; }
    case "tags": return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
    case "json": { if (!v) return []; try { return JSON.parse(v); } catch { errors[f.name] = "That isn't valid JSON"; return []; } }
    case "url": { if (v && !/^(https?:\/\/|\/)/.test(v)) errors[f.name] = "Enter a full web address starting with https://"; return v || null; }
    default: return v || null;
  }
}
