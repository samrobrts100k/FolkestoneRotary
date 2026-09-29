import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { fundingStatuses } from "@/lib/admin/resources";
import { updateFunding } from "../../actions";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/fields";
import { formatDate, gbp } from "@/lib/utils";

export default async function FundingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireStaff("funding_applications");
  const sb = await createSessionClient();
  const { data: a } = await sb.from("funding_applications").select("*").eq("id", id).maybeSingle();
  if (!a) notFound();
  const { data: docs } = await sb.from("funding_documents").select("*").eq("application_id", id);
  // Private bucket: hand out short-lived signed links (1 hour)
  const links = await Promise.all((docs ?? []).map(async (d) => ({ ...d, url: (await sb.storage.from("funding-documents").createSignedUrl(d.storage_path, 3600)).data?.signedUrl })));
  const rows: [string, string][] = [
    ["Organisation", a.organisation_name], ["Charity number", a.charity_number ?? "—"], ["Contact", `${a.contact_name} · ${a.email} · ${a.phone ?? ""}`], ["Website", a.website ?? "—"],
    ["Project", a.project_name], ["Description", a.project_description], ["Requested", gbp(a.amount_requested)], ["Total cost", gbp(a.total_project_cost)],
    ["Who benefits", a.who_benefits ?? "—"], ["Beneficiaries", String(a.beneficiary_count ?? "—")], ["Outcomes", a.expected_outcomes ?? "—"], ["Other funding", a.other_funding ?? "—"],
    ["Dates", `${a.start_date ?? "?"} to ${a.end_date ?? "?"}`], ["Additional", a.additional_info ?? "—"], ["Received", formatDate(a.created_at)],
  ];
  return (
    <div className="max-w-3xl">
      <Link href="/admin/funding" className="text-sm underline">← Applications</Link>
      <h1 className="mb-6 mt-2 text-3xl">{a.organisation_name}</h1>
      <dl className="space-y-3">{rows.map(([k, v]) => <div key={k}><dt className="text-sm font-semibold text-slate-blue">{k}</dt><dd className="whitespace-pre-wrap">{v}</dd></div>)}</dl>
      <h2 className="mb-2 mt-8 text-xl">Documents</h2>
      {links.length ? <ul className="space-y-1">{links.map((d) => <li key={d.id}>{d.url ? <a href={d.url} className="text-rotary underline" target="_blank" rel="noreferrer">{d.file_name}</a> : d.file_name} <span className="text-sm text-slate-blue">({d.doc_type})</span></li>)}</ul> : <p className="text-slate-blue">No files uploaded.</p>}
      <form action={updateFunding.bind(null, id)} className="mt-8 space-y-4 rounded-card bg-surface p-5">
        <label className="block font-semibold">Status<Select name="status" defaultValue={a.status}>{fundingStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></label>
        <label className="block font-semibold">Reviewer notes (internal)<Textarea name="reviewer_notes" defaultValue={a.reviewer_notes ?? ""} /></label>
        <Button type="submit">Save review</Button>
      </form>
    </div>
  );
}
