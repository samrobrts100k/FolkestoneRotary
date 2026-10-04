import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));

/**
 * Node and browsers ship different ICU data, so the same en-GB format can differ by punctuation
 * ("Sat, 14 November" on the server, "Sat 14 November" in Chrome). That breaks hydration, so the
 * separators are normalised to single spaces and the output is identical everywhere.
 */
export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", ...opts })
    .formatToParts(new Date(iso))
    .map((p) => (p.type === "literal" && /^[\s,]+$/.test(p.value) ? " " : p.value))
    .join("");

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const absoluteUrl = (path: string, base: string) => new URL(path, base).toString();
export const categoryName = (cats: { slug: string; name: string }[], slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug;
