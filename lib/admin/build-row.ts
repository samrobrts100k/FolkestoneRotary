import type { FieldDef, Resource } from "./resources";
import { slugify } from "../utils";
import { STATUSES } from "../types";

export type BuildResult = { ok: true; row: Record<string, unknown> } | { ok: false; errors: Record<string, string> };

/** Turns submitted FormData into a DB row using the resource's field definitions. Pure, so it can be unit-tested. */
export function buildRow(res: Resource, fd: { get(k: string): unknown }): BuildResult {
  const row: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  const str = (n: string) => String(fd.get(n) ?? "").trim();

  for (const f of res.fields) {
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
      if (!at || Number.isNaN(Date.parse(at))) errors.publish_at = "Choose when to publish";
      else row.publish_at = new Date(at).toISOString();
    } else row.publish_at = null;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, row };
}

function parseField(f: FieldDef, v: string, raw: unknown, errors: Record<string, string>): unknown {
  switch (f.type) {
    case "checkbox": return raw === "on";
    case "number": { if (!v) return null; const n = Number(v); if (Number.isNaN(n)) { errors[f.name] = "Enter a number"; return null; } return n; }
    case "datetime": { if (!v) return null; const d = Date.parse(v); if (Number.isNaN(d)) { errors[f.name] = "Enter a valid date"; return null; } return new Date(v).toISOString(); }
    case "tags": return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
    case "json": { if (!v) return []; try { return JSON.parse(v); } catch { errors[f.name] = "That isn't valid JSON"; return []; } }
    case "url": { if (v && !/^(https?:\/\/|\/)/.test(v)) errors[f.name] = "Enter a full web address starting with https://"; return v || null; }
    default: return v || null;
  }
}
