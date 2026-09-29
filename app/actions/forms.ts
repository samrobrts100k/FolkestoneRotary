"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { processForm } from "@/lib/forms/handlers";
import { contactSchema, fundingSchema, membershipSchema, newsletterSchema, type FormState } from "@/lib/forms/schemas";
import { templates } from "@/lib/email/templates";

export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  return processForm({
    fd, schema: contactSchema, table: "contact_enquiries", kind: "contact enquiry",
    confirmation: (d) => ({ to: d.email, ...templates.contactConfirmation({ name: d.name }) }),
    summary: (d) => ({ Name: d.name, Email: d.email, Phone: d.phone ?? "", Subject: d.subject, Message: d.message }),
  });
}

export async function submitMembership(_: FormState, fd: FormData): Promise<FormState> {
  return processForm({
    fd, schema: membershipSchema, table: "membership_enquiries", kind: "membership enquiry",
    confirmation: (d) => ({ to: d.email, ...templates.membershipConfirmation({ name: d.name }) }),
    summary: (d) => ({ Name: d.name, Email: d.email, Phone: d.phone, Why: d.why_interested, "Preferred contact": d.preferred_contact }),
  });
}

export async function submitNewsletter(_: FormState, fd: FormData): Promise<FormState> {
  const res = await processForm({
    fd, schema: newsletterSchema, table: "newsletter_subscribers", kind: "newsletter signup",
    confirmation: (d) => ({ to: d.email, ...templates.newsletterConfirmation({ name: d.first_name }) }),
    summary: (d) => ({ Name: `${d.first_name} ${d.last_name}`, Email: d.email }),
  });
  return res.ok ? { ...res, message: "You're subscribed — thank you!" } : res;
}

const MAX_FILE = 10 * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/webp", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
const DOC_TYPES = ["quote", "supporting", "budget", "image"] as const;

export async function submitFunding(_: FormState, fd: FormData): Promise<FormState> {
  // Validate files up-front so a bad upload never creates a half-saved application.
  const files: { type: (typeof DOC_TYPES)[number]; file: File }[] = [];
  for (const type of DOC_TYPES) {
    for (const f of fd.getAll(`file_${type}`)) {
      if (!(f instanceof File) || f.size === 0) continue;
      if (f.size > MAX_FILE) return { ok: false, message: `"${f.name}" is larger than 10MB.` };
      if (!ALLOWED.includes(f.type)) return { ok: false, message: `"${f.name}" isn't a supported file type (PDF, Word, Excel, JPG, PNG).` };
      files.push({ type, file: f });
    }
  }
  if (files.length > 12) return { ok: false, message: "Please upload no more than 12 files." };

  return processForm({
    fd, schema: fundingSchema, table: "funding_applications", kind: "funding application",
    toRow: (d) => { const { consent: _c, ...rest } = d; return { ...rest, status: "received" }; },
    after: async (row) => {
      const sb = createAdminClient();
      for (const { type, file } of files) {
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${row.id}/${crypto.randomUUID()}-${safe}`;
        const { error } = await sb.storage.from("funding-documents").upload(path, file, { contentType: file.type });
        if (!error) await sb.from("funding_documents").insert({ application_id: row.id, doc_type: type, file_name: file.name, storage_path: path, size_bytes: file.size });
      }
    },
    confirmation: (d, row) => ({ to: d.email, ...templates.fundingConfirmation({ name: d.contact_name, organisation: d.organisation_name, project: d.project_name, reference: String(row.id ?? "") || "see below" }) }),
    summary: (d) => ({ Organisation: d.organisation_name, Contact: d.contact_name, Email: d.email, Project: d.project_name, "Amount requested": `£${d.amount_requested}`, Files: String(files.length) }),
  });
}
