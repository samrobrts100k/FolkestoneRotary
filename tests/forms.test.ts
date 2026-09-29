import { describe, expect, it } from "vitest";
import { contactSchema, fundingSchema, membershipSchema, newsletterSchema } from "@/lib/forms/schemas";

describe("contact form", () => {
  const ok = { name: "Sam", email: "sam@example.com", subject: "Events", message: "Hello, is there a race night?", consent: "on" };
  it("accepts a valid enquiry", () => expect(contactSchema.safeParse(ok).success).toBe(true));
  it("rejects bad email, unknown subject, short message and missing consent", () => {
    const r = contactSchema.safeParse({ ...ok, email: "nope", subject: "Spam", message: "hi", consent: undefined });
    expect(r.success).toBe(false);
    expect(r.success ? [] : [...new Set(r.error.issues.map((i) => i.path[0]))].sort()).toEqual(["consent", "email", "message", "subject"]);
  });
});
describe("membership form", () => {
  const ok = { name: "Alex Jones", email: "a@example.com", phone: "01303 123456", why_interested: "I want to volunteer locally", preferred_contact: "email", consent: "on" };
  it("accepts valid input with optional fields blank", () => expect(membershipSchema.safeParse({ ...ok, age_range: "", occupation: "" }).success).toBe(true));
  it("requires a phone number and contact method", () => expect(membershipSchema.safeParse({ ...ok, phone: "", preferred_contact: "" }).success).toBe(false));
});
describe("newsletter form", () => {
  it("requires consent", () => expect(newsletterSchema.safeParse({ first_name: "Ann", last_name: "Bee", email: "a@b.co" }).success).toBe(false));
  it("passes when complete", () => expect(newsletterSchema.safeParse({ first_name: "Ann", last_name: "Bee", email: "a@b.co", consent: "on" }).success).toBe(true));
});
describe("funding application", () => {
  const ok = { organisation_name: "Kent Kids", contact_name: "Pat Smith", email: "p@example.org", phone: "01303 111111", project_name: "Play area",
    project_description: "A new accessible play area for children in Folkestone.", amount_requested: "1500", total_project_cost: "4000", who_benefits: "Local children",
    beneficiary_count: "200", expected_outcomes: "More children active outdoors", start_date: "2026-03-01", end_date: "2026-06-01", consent: "on" };
  it("accepts a complete application and coerces numbers", () => { const r = fundingSchema.safeParse(ok); expect(r.success && r.data.amount_requested).toBe(1500); });
  it("rejects a request larger than the project cost", () => expect(fundingSchema.safeParse({ ...ok, amount_requested: "9000" }).success).toBe(false));
  it("rejects an end date before the start date", () => expect(fundingSchema.safeParse({ ...ok, end_date: "2026-01-01" }).success).toBe(false));
  it("rejects an invalid website", () => expect(fundingSchema.safeParse({ ...ok, website: "not a url" }).success).toBe(false));
});
