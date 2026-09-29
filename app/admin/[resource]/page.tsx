import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { getResource } from "@/lib/admin/resources";
import { deleteRecord } from "../actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const cell = (k: string, v: unknown) => v == null || v === "" ? "—" : typeof v === "boolean" ? (v ? "Yes" : "No") : /(_at|_on)$/.test(k) ? formatDate(String(v), { day: "numeric", month: "short", year: "numeric" }) : String(v);

export default async function ResourceList({ params, searchParams }: { params: Promise<{ resource: string }>; searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const { resource } = await params;
  const res = getResource(resource);
  if (!res) notFound();
  await requireStaff(res.key);
  const sp = await searchParams;
  const { data, error } = await (await createSessionClient()).from(res.table).select("*").order(res.orderBy, { ascending: res.ascending ?? true }).limit(200);
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl">{res.title}</h1>{!res.readonly && <ButtonLink href={`/admin/${res.key}/new`}>Add {res.singular}</ButtonLink>}</div>
      {res.help && <p className="mb-4 text-slate-700">{res.help}</p>}
      {(sp.saved || sp.deleted) && <p role="status" className="mb-4 rounded-xl bg-rotary-light p-3 font-medium">{sp.saved ? "Saved." : "Deleted."}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-red-800">Couldn&apos;t load: {error.message}</p>}
      <div className="overflow-x-auto rounded-card border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface"><tr>{res.columns.map((c) => <th key={c} scope="col" className="p-3 capitalize">{c.replace(/_/g, " ")}</th>)}{res.workflow && <th scope="col" className="p-3">Status</th>}<th scope="col" className="p-3"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {data?.map((row) => (
              <tr key={row.id}>
                {res.columns.map((c) => <td key={c} className="p-3">{cell(c, row[c])}</td>)}
                {res.workflow && <td className="p-3"><Badge>{row.status}</Badge></td>}
                <td className="flex flex-wrap gap-2 p-3">
                  <Link href={`/admin/${res.key}/${row.id}`} className="font-semibold text-rotary underline">{res.readonly ? "View" : "Edit"}</Link>
                  {res.previewKind && <Link href={`/admin/preview/${res.key}/${row.id}`} className="underline">Preview</Link>}
                  {!res.readonly && <form action={deleteRecord.bind(null, res.key, row.id)}><Button type="submit" variant="ghost" size="sm" className="min-h-8 px-2 text-red-700" aria-label={`Delete ${row.title ?? row.name ?? row.label ?? "item"}`}>Delete</Button></form>}
                </td>
              </tr>
            ))}
            {!data?.length && <tr><td colSpan={res.columns.length + 2} className="p-6 text-center text-slate-blue">Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {res.readonly && <p className="mt-3 text-sm text-slate-blue">Submissions arrive from the public forms. Open one to read it and update its status.</p>}
    </div>
  );
}
