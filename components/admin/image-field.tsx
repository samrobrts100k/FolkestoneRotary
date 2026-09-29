"use client";
import { useRef, useState } from "react";
import { uploadMedia } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/fields";

const ratios = { "16:10": 1.6, "1:1": 1, "4:3": 4 / 3, Original: 0 } as const;
type Ratio = keyof typeof ratios;

/** Upload with live preview, crop (aspect ratio + zoom + position), and removal. Stores the resulting public URL in a hidden input. */
export function ImageField({ name, label, defaultValue, accept = "image", help }: { name: string; label: string; defaultValue?: string | null; accept?: "image" | "file"; help?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [src, setSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ratio, setRatio] = useState<Ratio>("16:10");
  const [zoom, setZoom] = useState(1);
  const [px, setPx] = useState(50), [py, setPy] = useState(50);
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState("");
  const [alt, setAlt] = useState(""), [caption, setCaption] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const isPdf = file?.type === "application/pdf";

  const pick = (f?: File) => {
    setMsg(""); setFile(f ?? null);
    setSrc(f && f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  };

  async function cropped(): Promise<Blob | File> {
    const img = imgRef.current;
    if (!img || !file || isPdf || !img.naturalWidth) return file!;
    const ar = ratios[ratio] || img.naturalWidth / img.naturalHeight;
    let w = img.naturalWidth, h = w / ar;
    if (h > img.naturalHeight) { h = img.naturalHeight; w = h * ar; }
    w /= zoom; h /= zoom;
    const x = (img.naturalWidth - w) * (px / 100), y = (img.naturalHeight - h) * (py / 100);
    const out = Math.min(1600, w);
    const c = document.createElement("canvas");
    c.width = out; c.height = out / (w / h);
    c.getContext("2d")!.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
    return new Promise((res) => c.toBlob((b) => res(b ?? file), "image/jpeg", 0.85));
  }

  async function upload() {
    if (!file) return;
    setBusy(true); setMsg("");
    const blob = await cropped();
    const fd = new FormData();
    fd.set("alt", alt); fd.set("caption", caption);
    fd.set("file", blob instanceof File ? blob : new File([blob], "image.jpg", { type: "image/jpeg" }));
    const r = await uploadMedia(fd);
    setBusy(false);
    if (r.error) return setMsg(r.error);
    setUrl(r.url ?? ""); setSrc(null); setFile(null); setMsg("Uploaded.");
  }

  const aspect = ratios[ratio] ? { aspectRatio: String(ratios[ratio]) } : undefined;
  return (
    <div className="rounded-xl border border-slate-300 p-4">
      <p className="mb-2 text-sm font-semibold">{label} <span className="font-normal text-slate-blue">(optional)</span></p>
      <input type="hidden" name={name} value={url} />
      {url && !src && (
        <div className="mb-3 flex items-center gap-3">
          {accept === "image" ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={url} alt="Current" className="h-24 w-40 rounded-lg object-cover" /> : <a href={url} className="text-sm underline" target="_blank" rel="noreferrer">Current file</a>}
          <Button type="button" variant="outline" size="sm" onClick={() => setUrl("")}>Remove</Button>
        </div>
      )}
      <label className="sr-only" htmlFor={`${name}-file`}>Choose {label}</label>
      <Input id={`${name}-file`} type="file" accept={accept === "image" ? "image/jpeg,image/png,image/webp" : "application/pdf,image/*"} onChange={(e) => pick(e.target.files?.[0])} className="p-2" />
      {src && (
        <div className="mt-3 space-y-3">
          <div className="max-w-sm overflow-hidden rounded-lg bg-slate-100" style={aspect}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={src} alt="Preview of the cropped image" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})`, objectPosition: `${px}% ${py}%` }} />
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <label>Shape <select value={ratio} onChange={(e) => setRatio(e.target.value as Ratio)} className="ml-2 rounded border p-1">{Object.keys(ratios).map((r) => <option key={r}>{r}</option>)}</select></label>
            <label>Zoom <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(+e.target.value)} /></label>
            <label>Left–right <input type="range" min={0} max={100} value={px} onChange={(e) => setPx(+e.target.value)} /></label>
            <label>Up–down <input type="range" min={0} max={100} value={py} onChange={(e) => setPy(+e.target.value)} /></label>
          </div>
        </div>
      )}
      {file && !isPdf && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="text-sm font-semibold">Alt text (describe the image)<Input value={alt} onChange={(e) => setAlt(e.target.value)} /></label>
          <label className="text-sm font-semibold">Caption (optional)<Input value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
        </div>
      )}
      {file && <Button type="button" className="mt-3" size="sm" onClick={upload} disabled={busy}>{busy ? "Uploading…" : "Upload"}</Button>}
      {msg && <p role="status" className="mt-2 text-sm font-medium">{msg}</p>}
      {help && <p className="mt-1 text-sm text-slate-blue">{help}</p>}
    </div>
  );
}
