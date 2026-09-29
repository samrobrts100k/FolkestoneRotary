import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { getResource } from "@/lib/admin/resources";
import { RecordForm } from "@/components/admin/record-form";
import { updateEnquiryStatus } from "../../actions";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/fields";
import { formatDate } from "@/lib/utils";

export default async function EditRecord({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  const res = getResource(resource);
  if (!res) notFound();
  await requireStaff(res.key);
  let record: Record<string, unknown> | null = null;
  if (id !== "new") {
    const { data } = await (await createSessionClient()).from(res.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    record = data;
  } else if (res.readonly) notFound();
  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${res.key}`} className="text-sm underline">← {res.title}</Link>
      <h1 className="mb-6 mt-2 text-3xl">{id === "new" ? `Add ${res.singular}` : res.readonly ? "Enquiry" : `Edit ${res.singular}`}</h1>
      {res.readonly && record ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-blue">Received {formatDate(String(record.created_at))}</p>
          <dl className="space-y-3">{res.fields.filter((f) => f.name !== "status").map((f) => <div key={f.name}><dt className="text-sm font-semibold text-slate-blue">{f.label}</dt><dd className="whitespace-pre-wrap">{String(record![f.name] ?? "—")}</dd></div>)}</dl>
          {res.fields.some((f) => f.name === "status") && (
            <form action={updateEnquiryStatus.bind(null, res.key, id)} className="flex items-end gap-3"><label className="text-sm font-semibold">Status<Select name="status" defaultValue={String(record.status)}>{res.fields.find((f) => f.name === "status")!.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></label><Button type="submit">Update</Button></form>
          )}
        </div>
      ) : <RecordForm resource={res} id={id} record={record} />}
      {res.previewKind && id !== "new" && <p className="mt-6"><Link href={`/admin/preview/${res.key}/${id}`} className="font-semibold text-rotary underline">Preview how this looks on the site →</Link></p>}
    </div>
  );
}
