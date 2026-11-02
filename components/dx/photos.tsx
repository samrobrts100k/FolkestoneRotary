import { Photo } from "@/components/ui/photo";
import { readPhotos, type PagePhoto } from "@/lib/page-text";

/** A page's photo section from Admin → Page text. Renders nothing until it has a photo. */
export function DxPhotos({ title, value, extra = [], grey }: { title: string; value: string; extra?: PagePhoto[]; grey?: boolean }) {
  const list = [...readPhotos(value), ...extra];
  if (!list.length) return null;
  return (
    <section className={`sec${grey ? " grey" : ""}`} id="photos"><div className="wrap">
      <h2 className="s">{title}</h2>
      <ul className="gal">{list.map((p, i) => <li key={p.url + i}><Photo src={p.url} alt={p.alt} ratio="aspect-square" className="rounded-xl" sizes="(min-width:768px) 25vw, 50vw" /></li>)}</ul>
    </div></section>
  );
}
