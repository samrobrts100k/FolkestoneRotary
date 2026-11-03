"use client";
import { useRef, useState } from "react";
// The preview uses the site's own article styles.
import "@/app/dx.css";
import "@/app/dx-extra.css";
import { uploadMedia } from "@/app/admin/actions";
import { RichText } from "@/components/rich-text";
import { okHref } from "@/lib/rich-text";
import { Textarea } from "@/components/ui/fields";

/** Shrinks big phone photos before upload so pages stay fast. */
async function shrink(file: File, max = 2000): Promise<File> {
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

const tool = "min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold hover:border-rotary hover:bg-rotary-light disabled:opacity-40";

/** Article editor: a toolbar that writes simple formatting, photo uploads that drop into the text, and a preview. */
export function RichTextField({ name, label, defaultValue, help, rows = 14, required }: { name: string; label: string; defaultValue?: string; help?: string; rows?: number; required?: boolean }) {
  const [text, setText] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(""), [msg, setMsg] = useState("");
  const area = useRef<HTMLTextAreaElement>(null);
  const files = useRef<HTMLInputElement>(null);

  /** Replace the selection, then put the cursor/selection back where it makes sense. */
  const put = (fn: (sel: string, before: string, after: string) => { text: string; start: number; end: number }) => {
    const el = area.current; if (!el) return;
    const a = el.selectionStart, b = el.selectionEnd;
    const r = fn(text.slice(a, b), text.slice(0, a), text.slice(b));
    setText(r.text);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(r.start, r.end); });
  };
  const wrap = (mark: string, sample: string) => put((sel, before, after) => {
    const inner = sel || sample;
    return { text: before + mark + inner + mark + after, start: before.length + mark.length, end: before.length + mark.length + inner.length };
  });
  /** Add a prefix to every selected line (or the current line), on a line of its own. */
  const lines = (prefix: (i: number) => string, sample: string) => put((sel, before, after) => {
    const lineStart = before.lastIndexOf("\n") + 1, head = before.slice(0, lineStart), cur = before.slice(lineStart) + sel;
    const body = (cur || sample).split("\n").map((l, i) => prefix(i) + l.replace(/^(#{2,3}|[-*]|\d+[.)]|>)\s+/, "")).join("\n");
    const pre = head && !head.endsWith("\n\n") ? (head.endsWith("\n") ? "\n" : "\n\n") : "";
    return { text: head + pre + body + after, start: head.length + pre.length, end: head.length + pre.length + body.length };
  });
  /** Insert a block (photo lines, divider) on its own, with blank lines around it, after any selected text (never replacing it). */
  const block = (b: string) => put((sel, beforeSel, after) => {
    const before = beforeSel + sel;
    const pre = !before || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const post = after.startsWith("\n\n") || !after ? "" : after.startsWith("\n") ? "\n" : "\n\n";
    const at = before.length + pre.length + b.length;
    return { text: before + pre + b + post + after, start: at, end: at };
  });
  const link = () => {
    const url = window.prompt("Link to (a page like /join, or a full https:// address, mailto: or tel:)", "https://");
    if (!url) return;
    if (!okHref(url.trim())) { setMsg("That link won’t work. Use /page, https://…, mailto:… or tel:…"); return; }
    put((sel, before, after) => { const t = sel || "link text"; const s = `[${t}](${url.trim()})`; return { text: before + s + after, start: before.length + 1, end: before.length + 1 + t.length }; });
  };
  const addPhotos = async (list: FileList | null) => {
    if (!list?.length) return;
    setMsg(""); const got: string[] = [], failed: string[] = [];
    for (const [i, f] of [...list].entries()) {
      setBusy(`Uploading ${i + 1} of ${list.length}…`);
      const fd = new FormData(); fd.set("file", await shrink(f));
      const r = await uploadMedia(fd);
      if (r.url) got.push(`![Describe this photo](${r.url})`); else failed.push(`${f.name}: ${r.error}`);
    }
    setBusy("");
    if (got.length) block(got.join("\n"));
    setMsg([got.length ? `Added ${got.length} photo${got.length > 1 ? "s" : ""}. Replace “Describe this photo” with a short description: it shows as the caption.${got.length > 1 ? " Photos next to each other show as a gallery." : ""}` : "", ...failed].filter(Boolean).join(" "));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}{required && <span className="text-red-700"> *</span>}</p>
      <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Formatting">
        <button type="button" className={tool} disabled={preview} onClick={() => lines(() => "## ", "Heading")}>Heading</button>
        <button type="button" className={tool} disabled={preview} onClick={() => lines(() => "### ", "Smaller heading")}>Subheading</button>
        <button type="button" className={`${tool} font-extrabold`} disabled={preview} onClick={() => wrap("**", "bold text")} aria-label="Bold">B</button>
        <button type="button" className={`${tool} italic`} disabled={preview} onClick={() => wrap("*", "italic text")} aria-label="Italic">I</button>
        <button type="button" className={tool} disabled={preview} onClick={link}>Link</button>
        <button type="button" className={tool} disabled={preview} onClick={() => lines(() => "- ", "List item")}>• List</button>
        <button type="button" className={tool} disabled={preview} onClick={() => lines((i) => `${i + 1}. `, "First step")}>1. List</button>
        <button type="button" className={tool} disabled={preview} onClick={() => lines(() => "> ", "A quote")}>Quote</button>
        <button type="button" className={tool} disabled={preview} onClick={() => block("---")}>Line</button>
        <button type="button" className={`${tool} border-rotary text-rotary`} disabled={preview || Boolean(busy)} onClick={() => files.current?.click()}>+ Photos</button>
        <input ref={files} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
        <button type="button" className={`${tool} ml-auto ${preview ? "bg-navy text-white hover:bg-navy" : ""}`} aria-pressed={preview} onClick={() => setPreview(!preview)}>{preview ? "Back to editing" : "Preview"}</button>
      </div>
      <input type="hidden" name={name} value={text} />
      {preview
        ? <div className="dx rounded-xl border border-slate-300 bg-white p-5"><div className="dtl-copy">{text.trim() ? <RichText text={text} /> : <p>Nothing written yet.</p>}</div></div>
        : <Textarea ref={area} id={name} aria-label={label} rows={rows} value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-[15px] leading-relaxed" required={required} />}
      <p role="status" className="text-sm font-medium">{busy || msg}</p>
      <details className="text-sm text-slate-blue">
        <summary className="cursor-pointer font-semibold">How the formatting works</summary>
        <p className="mt-1">Use the buttons, or type it yourself. A blank line starts a new paragraph. <code>## Heading</code>, <code>**bold**</code>, <code>*italic*</code>, <code>[link text](https://…)</code>, <code>- list</code>, <code>1. list</code>, <code>&gt; quote</code>, <code>---</code> for a line. Photos are lines like <code>![description](address)</code>; put several on lines next to each other for a gallery. Photos always show in full, never cut off.</p>
      </details>
      {help && <p className="text-sm text-slate-blue">{help}</p>}
    </div>
  );
}
