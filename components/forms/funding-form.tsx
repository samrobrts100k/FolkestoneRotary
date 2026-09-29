"use client";
import { submitFunding } from "@/app/actions/forms";
import { Consent, Field, Input, Textarea } from "@/components/ui/fields";
import { FormShell, PrivacyConsent } from "./form-shell";

const uploads = [
  ["file_quote", "Quotes"], ["file_supporting", "Supporting documents"], ["file_budget", "Project budget"], ["file_image", "Images"],
] as const;

export function FundingForm() {
  return (
    <FormShell action={submitFunding} submitLabel="Submit application" successTitle="Application received" trackAs="funding_application">
      {(e) => (
        <>
          <fieldset className="space-y-5"><legend className="mb-2 text-lg font-bold">Your organisation</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Organisation Name" name="organisation_name" error={e.organisation_name} required>{(a) => <Input {...a} autoComplete="organization" />}</Field>
              <Field label="Charity Number" name="charity_number" error={e.charity_number} hint="If you are a registered charity">{(a) => <Input {...a} />}</Field>
              <Field label="Contact Name" name="contact_name" error={e.contact_name} required>{(a) => <Input {...a} autoComplete="name" />}</Field>
              <Field label="Email" name="email" error={e.email} required>{(a) => <Input {...a} type="email" autoComplete="email" />}</Field>
              <Field label="Phone" name="phone" error={e.phone} required>{(a) => <Input {...a} type="tel" autoComplete="tel" />}</Field>
              <Field label="Website" name="website" error={e.website} hint="Include https://">{(a) => <Input {...a} type="url" />}</Field>
            </div>
          </fieldset>
          <fieldset className="space-y-5"><legend className="mb-2 text-lg font-bold">Your project</legend>
            <Field label="Project Name" name="project_name" error={e.project_name} required>{(a) => <Input {...a} />}</Field>
            <Field label="Project Description" name="project_description" error={e.project_description} required>{(a) => <Textarea {...a} />}</Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Amount Requested (£)" name="amount_requested" error={e.amount_requested} required>{(a) => <Input {...a} type="number" min="1" step="any" inputMode="decimal" />}</Field>
              <Field label="Total Project Cost (£)" name="total_project_cost" error={e.total_project_cost} required>{(a) => <Input {...a} type="number" min="1" step="any" inputMode="decimal" />}</Field>
              <Field label="Who Will Benefit" name="who_benefits" error={e.who_benefits} required>{(a) => <Input {...a} />}</Field>
              <Field label="Number of Beneficiaries" name="beneficiary_count" error={e.beneficiary_count} required>{(a) => <Input {...a} type="number" min="1" inputMode="numeric" />}</Field>
              <Field label="Project Start Date" name="start_date" error={e.start_date} required>{(a) => <Input {...a} type="date" />}</Field>
              <Field label="Project End Date" name="end_date" error={e.end_date} required>{(a) => <Input {...a} type="date" />}</Field>
            </div>
            <Field label="Expected Outcomes" name="expected_outcomes" error={e.expected_outcomes} required>{(a) => <Textarea {...a} rows={4} />}</Field>
            <Field label="Other Funding Secured" name="other_funding" error={e.other_funding}>{(a) => <Textarea {...a} rows={3} />}</Field>
            <Field label="Additional Information" name="additional_info" error={e.additional_info}>{(a) => <Textarea {...a} rows={3} />}</Field>
          </fieldset>
          <fieldset className="space-y-5"><legend className="mb-2 text-lg font-bold">Documents</legend>
            <p className="text-sm text-slate-blue">PDF, Word, Excel, JPG or PNG. Maximum 10MB per file.</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {uploads.map(([n, l]) => (
                <Field key={n} label={l} name={n}>{(a) => <Input {...a} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" className="p-2" />}</Field>
              ))}
            </div>
          </fieldset>
          <Consent error={e.consent}><PrivacyConsent what="assess my funding application" /></Consent>
        </>
      )}
    </FormShell>
  );
}
