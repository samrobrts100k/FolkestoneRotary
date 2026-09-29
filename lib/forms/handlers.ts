import "server-only";
import type { ZodTypeAny, z } from "zod";
import { createAdminClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/env";
import { sendSafely } from "../email/provider";
import { templates } from "../email/templates";
import { checkSpam } from "./spam";
import { flattenErrors, type FormState } from "./schemas";

export function formToObject(fd: FormData) {
  const o: Record<string, FormDataEntryValue> = {};
  fd.forEach((v, k) => { if (typeof v === "string") o[k] = v; });
  return o;
}

interface Options<S extends ZodTypeAny> {
  fd: FormData; schema: S; table: string; kind: string;
  /** Map validated data to a DB row. Defaults to the data minus `consent`. */
  toRow?: (d: z.infer<S>) => Record<string, unknown>;
  confirmation?: (d: z.infer<S>, row: Record<string, unknown>) => { to: string; subject: string; html: string };
  summary: (d: z.infer<S>) => Record<string, string>;
  after?: (row: { id: string }, d: z.infer<S>) => Promise<void>;
}

/** Shared pipeline for every public form: spam check → validate → store → email. */
export async function processForm<S extends ZodTypeAny>(o: Options<S>): Promise<FormState> {
  const spam = await checkSpam(o.fd);
  if (spam) return { ok: false, message: spam };

  const parsed = o.schema.safeParse(formToObject(o.fd));
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: flattenErrors(parsed.error) };
  const data = parsed.data as z.infer<S>;

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(`[forms] ${o.kind}: Supabase not configured — submission not stored`);
    return { ok: false, message: "This form isn't connected yet. Please email us directly." };
  }
  const { consent: _c, ...rest } = data as Record<string, unknown>;
  const row = { ...(o.toRow ? o.toRow(data) : rest), consent_given_at: new Date().toISOString() };
  const { data: inserted, error } = await createAdminClient().from(o.table).insert(row).select("id").single();
  if (error || !inserted) {
    console.error(`[forms] ${o.kind} insert failed`, error);
    return { ok: false, message: "Sorry, something went wrong saving your submission. Please try again." };
  }
  await o.after?.(inserted, data);
  if (o.confirmation) await sendSafely(o.confirmation(data, { ...row, id: inserted.id }));
  const admin = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (admin) await sendSafely({ to: admin, ...templates.adminNotification({ kind: o.kind, fields: o.summary(data) }) });
  return { ok: true, message: "Thank you — your submission has been received.", reference: inserted.id.slice(0, 8).toUpperCase() };
}
