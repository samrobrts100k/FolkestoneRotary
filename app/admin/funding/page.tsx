import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { fundingStatuses } from "@/lib/admin/resources";
import { Badge } from "@/components/ui/badge";
import { formatDate, gbp } from "@/lib/utils";

export default async function FundingList({ searchParams }: { searchParams: Promise<{ status?: string; saved?: string }> }) {
  await requireStaff("funding_applications");
  const { status, saved } = await searchParams;
  let q = (await createSessionClient()).from("funding_applications").select("id,organisation_name,project_name,amount_requested,status,created_at").order("created_at", { ascending: false });
  if (status && fundingStatuses.some((s) => s.value === status)) q = q.eq("status", status);
  const { data } = await q;
  return (
    <div>
      <h1 className="mb-4 text-3xl">Funding applications</h1>
      {saved && <p role="status" className="mb-4 rounded-xl bg-rotary-light p-3 font-medium">Saved.</p>}
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/funding" className="rounded-full border-2 px-4 py-2 text-sm font-semibold">All</Link>
        {fundingStatuses.map((s) => <Link key={s.value} href={`/admin/funding?status=${s.value}`} className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${status === s.value ? "border-rotary bg-rotary text-white" : ""}`}>{s.label}</Link>)}
      </nav>
      <div className="overflow-x-auto rounded-card border border-slate-200"><table className="w-full text-left text-sm">
        <thead className="bg-surface"><tr>{["Organisation", "Project", "Requested", "Received", "Status"].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-200">{data?.map((a) => <tr key={a.id}><td className="p-3"><Link href={`/admin/funding/${a.id}`} className="font-semibold text-rotary underline">{a.organisation_name}</Link></td><td className="p-3">{a.project_name}</td><td className="p-3">{gbp(a.amount_requested)}</td><td className="p-3">{formatDate(a.created_at)}</td><td className="p-3"><Badge>{fundingStatuses.find((s) => s.value === a.status)?.label}</Badge></td></tr>)}
          {!data?.length && <tr><td colSpan={5} className="p-6 text-center text-slate-blue">No applications.</td></tr>}</tbody>
      </table></div>
    </div>
  );
}
