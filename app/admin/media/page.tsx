import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { deleteMedia } from "../actions";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";

export default async function MediaLibrary() {
  await requireStaff("media");
  const { data } = await (await createSessionClient()).from("media").select("*").order("created_at", { ascending: false }).limit(60);
  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Media library</h1>
      <div className="max-w-xl"><ImageField name="library_upload" label="Upload an image" help="Crop, then Upload. Copy the link below to reuse it anywhere." /></div>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data?.map((m) => (
          <li key={m.id} className="rounded-card border border-slate-200 p-2 text-xs">
            {m.mime_type === "application/pdf" ? <p className="flex h-24 items-center justify-center rounded-lg bg-surface font-bold">PDF</p> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={m.url} alt={m.alt || "Uploaded image"} loading="lazy" className="h-24 w-full rounded-lg object-cover" />}
            <input readOnly aria-label="Public link" value={m.url} className="mt-2 w-full rounded border p-1" />
            <form action={deleteMedia.bind(null, m.id)}><Button type="submit" variant="ghost" size="sm" className="mt-1 text-red-700">Delete</Button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
