import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
// 660px wide: three times the largest size shown, so it stays sharp on high-resolution screens.
import logo from "@/public/brand/rotary-folkestone-660.png";
import logoWhite from "@/public/brand/rotary-folkestone-white-660.png";

/** The club's Rotary signature. `light` swaps to the white-text version for dark backgrounds (gold wheel either way). */
export function Logo({ light = false, size = "header" }: { light?: boolean; size?: "header" | "footer" }) {
  const h = size === "footer" ? "h-16" : "h-10 sm:h-11 xl:h-14";
  const img = (src: typeof logo, on: boolean, priority: boolean) => (
    <Image src={src} alt="" priority={priority} unoptimized
      className={cn("w-auto transition-opacity duration-200", h, on ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0")} />
  );
  return (
    <Link href="/" className="relative block shrink-0 rounded-lg no-underline" aria-label={`${site.name} – home`}>
      {img(logo, !light, size === "header")}
      {img(logoWhite, light, size === "header")}
    </Link>
  );
}
