"use client";
import { submitNewsletter } from "@/app/actions/forms";
import { Consent, Field, Input } from "@/components/ui/fields";
import { FormShell, PrivacyConsent } from "./form-shell";
import { useFormText } from "@/components/form-text";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const p = compact ? "nl-f-" : "nl-";
  const ft = useFormText();
  return (
    <FormShell action={submitNewsletter} submitLabel={ft.n_btn} successTitle={ft.n_doneTitle} trackAs="newsletter_signup" className="space-y-3">
      {(e) => (
        <>
          <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
            <Field label={ft.n_first} name={`${p}first`} error={e.first_name} required>{(a) => <Input {...a} name="first_name" autoComplete="given-name" />}</Field>
            <Field label={ft.n_last} name={`${p}last`} error={e.last_name} required>{(a) => <Input {...a} name="last_name" autoComplete="family-name" />}</Field>
          </div>
          <Field label={ft.g_email} name={`${p}email`} error={e.email} required>{(a) => <Input {...a} name="email" type="email" autoComplete="email" />}</Field>
          <Consent error={e.consent}><PrivacyConsent text={ft.n_consent} /></Consent>
        </>
      )}
    </FormShell>
  );
}
