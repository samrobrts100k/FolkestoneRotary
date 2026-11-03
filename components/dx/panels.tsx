import Link from "next/link";
import { readPanels, type PagePanel, type PanelWhere } from "@/lib/page-text";

/** One button: pages on this site use client-side links; other addresses open as normal links (new tab for websites). */
export function PanelButton({ href, label, className }: { href: string; label: string; className: string }) {
  if (href.startsWith("/")) return <Link className={className} href={href}>{label}</Link>;
  const ext = href.startsWith("https://");
  return <a className={className} href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}{ext && <span className="sr-only"> (opens in a new tab)</span>}</a>;
}

function Panel({ p }: { p: PagePanel }) {
  return (
    <div className={`meet${p.tone === "gold" ? "" : ` ${p.tone}`}`} data-rv>
      <h2>{p.title}</h2>
      <div>
        {p.text && <p style={{ margin: "0 0 16px" }}>{p.text}</p>}
        {p.btn && <PanelButton className="btn" href={p.href} label={p.btn} />}{" "}
        {p.btn2 && <PanelButton className="btn ghost" href={p.href2} label={p.btn2} />}
      </div>
    </div>
  );
}

/** Extra panels an admin added to this page (Page text → Extra panels), for one position. */
export function DxPanels({ value, where }: { value: string; where: PanelWhere }) {
  const list = readPanels(value).filter((p) => p.where === where);
  if (!list.length) return null;
  return <section className="sec"><div className="wrap xpanels">{list.map((p, i) => <Panel key={i} p={p} />)}</div></section>;
}
