"use client";
import { submitMembership } from "@/app/actions/forms";
import { Consent, Field, Input, Select, Textarea } from "@/components/ui/fields";
import { FormShell, PrivacyConsent } from "./form-shell";

export function MembershipForm() {
  return (
    <FormShell action={submitMembership} submitLabel="Send my enquiry" successTitle="Enquiry received" trackAs="membership_enquiry">
      {(e) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" error={e.name} required>{(a) => <Input {...a} autoComplete="name" />}</Field>
            <Field label="Email" name="email" error={e.email} required>{(a) => <Input {...a} type="email" autoComplete="email" />}</Field>
            <Field label="Phone" name="phone" error={e.phone} required>{(a) => <Input {...a} type="tel" autoComplete="tel" />}</Field>
            <Field label="Age range" name="age_range" error={e.age_range}>
              {(a) => <Select {...a} defaultValue=""><option value="">Prefer not to say</option>{["18–29", "30–44", "45–59", "60+"].map((s) => <option key={s}>{s}</option>)}</Select>}
            </Field>
            <Field label="Occupation" name="occupation" error={e.occupation}>{(a) => <Input {...a} autoComplete="organization-title" />}</Field>
            <Field label="Preferred contact method" name="preferred_contact" error={e.preferred_contact} required>
              {(a) => <Select {...a} defaultValue=""><option value="" disabled>Choose…</option><option value="email">Email</option><option value="phone">Phone</option></Select>}
            </Field>
          </div>
          <Field label="Why are you interested in Rotary?" name="why_interested" error={e.why_interested} required>{(a) => <Textarea {...a} />}</Field>
          <Consent error={e.consent}><PrivacyConsent what="respond to my membership enquiry" /></Consent>
        </>
      )}
    </FormShell>
  );
}
