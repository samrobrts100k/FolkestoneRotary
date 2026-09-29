import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { createSessionClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/auth";
import { canViewCommitteeDocs } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

const titles: Record<string, string> = { minutes: "Meeting minutes", policy: "Policies", document: "Documents", committee: "Committee documents", download: "Downloads" };

export default async function DocumentsPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!titles[kind]) notFound();
  const s = await requireMember(`/members/documents/${kind}`);
  if (kind === "committee" && !canViewCommitteeDocs(s.role)) notFound();
  const { data } = await (await createSessionClient()).from("member_documents").select("*").eq("kind", kind).order("created_at", { ascending: false });
  return (
    <div><h1 className="mb-5 text-3xl">{titles[kind]}</h1>
      {data?.length ? <ul className="divide-y divide-slate-200 rounded-card border border-slate-200">{data.map((d) => <li key={d.id} className="flex items-center justify-between gap-3 p-4"><span><strong>{d.title}</strong>{d.meeting_date && <span className="block text-sm text-slate-blue">{formatDate(d.meeting_date)}</span>}</span><a href={d.url} className="inline-flex items-center gap-2 font-semibold text-rotary underline"><Download aria-hidden className="h-4 w-4" />Open</a></li>)}</ul> : <p>Nothing here yet.</p>}
    </div>
  );
}
