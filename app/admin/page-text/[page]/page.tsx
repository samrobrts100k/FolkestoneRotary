import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { PAGE_TEXT, isPageKey, mergeText, pageTextSlug, type TextGroup } from "@/lib/page-text";
import { PageTextForm } from "@/components/admin/page-text-form";

export default async function EditPageText({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!isPageKey(page)) notFound();
  await requireStaff("pages");
  const { data } = await (await createSessionClient()).from("pages").select("body").eq("slug", pageTextSlug(page)).maybeSingle();
  let saved: Record<string, unknown> | null = null;
  try { saved = data?.body ? JSON.parse(data.body) : null; } catch { /* stored text unreadable: show defaults */ }
  const def = PAGE_TEXT[page];
  return (
    <div className="max-w-3xl">
      <Link href="/admin/page-text" className="text-sm underline">← Page text</Link>
      <h1 className="mb-2 mt-2 text-3xl">{def.label} page text</h1>
      <p className="mb-6 text-slate-700">Edit any box and press <strong>Save</strong>. Empty a box, or press <strong>Use original</strong>, to go back to the original wording. <Link href={def.path} target="_blank" className="font-semibold text-rotary underline">Open the page (new tab)</Link></p>
      <PageTextForm page={page} groups={def.groups as readonly TextGroup[]} values={mergeText(page, saved) as Record<string, string>} />
    </div>
  );
}
