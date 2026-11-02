"use client";
import { useState } from "react";
import { uploadMedia } from "@/app/admin/actions";
import { readPhotos, type PagePhoto } from "@/lib/page-text";
import { Input } from "@/components/ui/fields";

/** Shrinks big phone photos before upload so pages stay fast. */
async function shrink(file: File, max = 2000): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  try { await img.decode(); } catch { return file; }
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  if (k === 1 && file.size < 1.5e6) return file;
  const c = document.createElement("canvas");
  c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(img.src);
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
}

const btn = "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-rotary disabled:opacity-40";

/** Add several photos at once, describe each one, put them in order, remove any. Saved with the rest of the page. */
export function PhotoListField({ name, label, defaultValue, help, decorative }: { name: string; label: string; defaultValue: string; help?: string; decorative?: boolean }) {
  const [list, setList] = useState<PagePhoto[]>(() => readPhotos(defaultValue));
  const [busy, setBusy] = useState(""), [msg, setMsg] = useState("");
  const move = (i: number, d: number) => setList((l) => { const n = [...l]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setMsg("");
    const added: PagePhoto[] = [], failed: string[] = [];
    for (const [i, f] of [...files].entries()) {
      setBusy(`Uploading ${i + 1} of ${files.length}…`);
      const fd = new FormData();
      fd.set("file", await shrink(f));
      const r = await uploadMedia(fd);
      if (r.url) added.push({ url: r.url, alt: "" }); else failed.push(`${f.name}: ${r.error}`);
    }
    setBusy("");
    setList((l) => [...l, ...added]);
    setMsg([added.length ? `Added ${added.length}. Describe each one below, then press Save.` : "", ...failed].filter(Boolean).join(" "));
  }

  return (
    <div className="rounded-xl border border-slate-300 p-4">
      <p className="mb-1 text-sm font-semibold">{label}</p>
      {help && <p className="mb-3 text-sm text-slate-blue">{help}</p>}
      <input type="hidden" name={name} value={JSON.stringify(list)} />
      {list.length > 0 && (
        <ol className="mb-4 grid gap-4 sm:grid-cols-2">
          {list.map((p, i) => (
            <li key={p.url + i} className="rounded-xl bg-surface p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
              <label className="mt-2 block text-sm font-semibold">{decorative ? "Note (optional)" : "Describe this photo"}
                <Input value={p.alt} placeholder="e.g. Members handing over a cheque at the school" onChange={(e) => setList((l) => l.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))} />
              </label>
              {!decorative && !p.alt.trim() && <p className="mt-1 text-xs font-medium text-amber-800">Add a description so people using screen readers know what it shows.</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move photo ${i + 1} earlier`}>← Earlier</button>
                <button type="button" className={btn} disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label={`Move photo ${i + 1} later`}>Later →</button>
                <button type="button" className={`${btn} ml-auto text-red-800`} onClick={() => setList((l) => l.filter((_, k) => k !== i))} aria-label={`Remove photo ${i + 1}`}>Remove</button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <label className="block text-sm font-semibold" htmlFor={`${name}-add`}>{list.length ? "Add more photos" : "Add photos"}</label>
      <Input id={`${name}-add`} type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={Boolean(busy)} onChange={(e) => { add(e.target.files); e.target.value = ""; }} className="mt-1 p-2" />
      <p role="status" className="mt-2 text-sm font-medium">{busy || msg}</p>
    </div>
  );
}
