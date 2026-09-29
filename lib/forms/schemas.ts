import { z } from "zod";
import { contactSubjects } from "./subjects";

const consent = z.literal("on", { error: "Please tick to confirm you consent" });
const optional = (s: z.ZodString) => s.optional().or(z.literal("").transform(() => undefined));
const phone = z.string().trim().max(30).regex(/^[0-9+()\s-]*$/, "Enter a valid phone number");
const email = z.string().trim().toLowerCase().email("Enter a valid email address").max(200);
const name = z.string().trim().min(2, "Please enter your name").max(120);

export const contactSchema = z.object({
  name, email, phone: optional(phone),
  subject: z.enum(contactSubjects, { error: "Choose a subject" }),
  message: z.string().trim().min(10, "Please write a little more (10+ characters)").max(4000),
  consent,
});
export { contactSubjects };

export const membershipSchema = z.object({
  name, email, phone: phone.min(6, "Enter a phone number"),
  age_range: optional(z.string().max(20)), occupation: optional(z.string().max(120)),
  why_interested: z.string().trim().min(10, "Tell us a little about why you're interested").max(3000),
  preferred_contact: z.enum(["email", "phone"], { error: "Choose a contact method" }),
  consent,
});

export const newsletterSchema = z.object({ first_name: name, last_name: z.string().trim().min(1, "Enter your last name").max(120), email, consent });

const money = z.coerce.number({ error: "Enter an amount" }).positive("Enter an amount above £0").max(1_000_000);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date");
export const fundingSchema = z.object({
  organisation_name: z.string().trim().min(2, "Enter the organisation name").max(200),
  charity_number: optional(z.string().max(30)),
  contact_name: name, email, phone: phone.min(6, "Enter a phone number"),
  website: optional(z.string().url("Enter a full web address, e.g. https://example.org")),
  project_name: z.string().trim().min(2, "Enter the project name").max(200),
  project_description: z.string().trim().min(30, "Please describe the project (30+ characters)").max(5000),
  amount_requested: money, total_project_cost: money,
  who_benefits: z.string().trim().min(5, "Tell us who will benefit").max(2000),
  beneficiary_count: z.coerce.number().int().positive("Enter a number").max(10_000_000),
  expected_outcomes: z.string().trim().min(10, "Describe the expected outcomes").max(3000),
  other_funding: optional(z.string().max(2000)),
  start_date: date, end_date: date,
  additional_info: optional(z.string().max(3000)),
  consent,
}).refine((d) => d.total_project_cost >= d.amount_requested, { path: ["total_project_cost"], message: "Total cost must be at least the amount requested" })
  .refine((d) => d.end_date >= d.start_date, { path: ["end_date"], message: "End date must be after the start date" });

export type FieldErrors = Record<string, string>;
export interface FormState { ok: boolean; message?: string; errors?: FieldErrors; reference?: string }

export function flattenErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const i of err.issues) out[i.path.join(".") || "form"] ??= i.message;
  return out;
}
