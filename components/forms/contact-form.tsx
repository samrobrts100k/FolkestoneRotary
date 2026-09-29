"use client";
import { submitContact } from "@/app/actions/forms";
import { Consent, Field, Input, Select, Textarea } from "@/components/ui/fields";
import { contactSubjects } from "@/lib/forms/subjects";
import { FormShell, PrivacyConsent } from "./form-shell";

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  return (
    <FormShell action={submitContact} submitLabel="Send message" successTitle="Message sent">
      {(e) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" error={e.name} required>{(a) => <Input {...a} autoComplete="name" />}</Field>
            <Field label="Email" name="email" error={e.email} required>{(a) => <Input {...a} type="email" autoComplete="email" />}</Field>
            <Field label="Phone" name="phone" error={e.phone}>{(a) => <Input {...a} type="tel" autoComplete="tel" />}</Field>
            <Field label="Subject" name="subject" error={e.subject} required>
              {(a) => <Select {...a} defaultValue={contactSubjects.find((s) => s === defaultSubject) ?? ""}><option value="" disabled>Choose a subject…</option>{contactSubjects.map((s) => <option key={s}>{s}</option>)}</Select>}
            </Field>
          </div>
          <Field label="Message" name="message" error={e.message} required>{(a) => <Textarea {...a} />}</Field>
          <Consent error={e.consent}><PrivacyConsent what="reply to my enquiry" /></Consent>
        </>
      )}
    </FormShell>
  );
}
