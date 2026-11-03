import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { parseRich, type Inline, type RichImage } from "@/lib/rich-text";

function Inl({ c }: { c: Inline[] }) {
  return <>{c.map((x, i) => {
    if (x.t === "text") return <Fragment key={i}>{x.v}</Fragment>;
    if (x.t === "br") return <br key={i} />;
    if (x.t === "b") return <strong key={i}><Inl c={x.c} /></strong>;
    if (x.t === "i") return <em key={i}><Inl c={x.c} /></em>;
    if (x.href.startsWith("/")) return <Link key={i} href={x.href}><Inl c={x.c} /></Link>;
    const ext = x.href.startsWith("https://");
    return <a key={i} href={x.href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}><Inl c={x.c} />{ext && <span className="sr-only"> (opens in a new tab)</span>}</a>;
  })}</>;
}

/** A photo at its own shape, never cropped. The description doubles as its caption. */
export function UncutPhoto({ img, sizes, priority, caption = true }: { img: RichImage; sizes: string; priority?: boolean; caption?: boolean }) {
  return (
    <figure className="rt-fig">
      <Image src={img.url} alt={img.alt} width={0} height={0} sizes={sizes} priority={priority} style={{ width: "auto", height: "auto" }} />
      {caption && img.alt && <figcaption>{img.alt}</figcaption>}
    </figure>
  );
}

/** Renders article text written with the toolbar (see lib/rich-text.ts). Plain paragraphs from older articles work unchanged. */
export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`rtx ${className ?? ""}`}>
      {parseRich(text).map((b, i) => {
        switch (b.t) {
          case "p": return <p key={i}><Inl c={b.c} /></p>;
          case "h2": return <h2 key={i}><Inl c={b.c} /></h2>;
          case "h3": return <h3 key={i}><Inl c={b.c} /></h3>;
          case "quote": return <blockquote key={i}><p><Inl c={b.c} /></p></blockquote>;
          case "hr": return <hr key={i} />;
          case "ul": return <ul key={i}>{b.items.map((it, k) => <li key={k}><Inl c={it} /></li>)}</ul>;
          case "ol": return <ol key={i}>{b.items.map((it, k) => <li key={k}><Inl c={it} /></li>)}</ol>;
          case "images": return b.images.length === 1
            ? <UncutPhoto key={i} img={b.images[0]} sizes="(min-width:800px) 760px, 100vw" />
            : <div key={i} className={`rt-gal n${Math.min(b.images.length, 3)}`}>{b.images.map((img, k) => <UncutPhoto key={k} img={img} sizes="(min-width:800px) 380px, 50vw" />)}</div>;
        }
      })}
    </div>
  );
}
