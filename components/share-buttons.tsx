"use client";
import { useState } from "react";
import { Link2, Mail } from "lucide-react";
import { Facebook, Linkedin, XIcon as Twitter } from "@/components/icons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  const links = [
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: Facebook },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: Twitter },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: Linkedin },
    { label: "Share by email", href: `mailto:?subject=${t}&body=${u}`, Icon: Mail },
  ];
  const cls = "flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-300 text-navy hover:border-rotary hover:text-rotary";
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share">
      <span className="mr-1 text-sm font-semibold">Share:</span>
      {links.map(({ label, href, Icon }) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={label} className={cls}><Icon aria-hidden className="h-5 w-5" /></a>)}
      <button type="button" className={cls} aria-label={copied ? "Link copied" : "Copy link"} onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ } }}><Link2 aria-hidden className="h-5 w-5" /></button>
      <span role="status" className="sr-only">{copied ? "Link copied" : ""}</span>
    </div>
  );
}
