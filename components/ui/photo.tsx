import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Responsive, lazy-loaded photo. Shows a branded placeholder until a real image is uploaded. */
export function Photo({ src, alt, className, priority, sizes = "(min-width: 1024px) 400px, 100vw", ratio = "aspect-[16/10]" }: { src?: string | null; alt: string; className?: string; priority?: boolean; sizes?: string; ratio?: string }) {
  if (!src) {
    return (
      <div role="img" aria-label={alt || "Photo placeholder"} className={cn("flex items-center justify-center bg-gradient-to-br from-rotary to-navy text-white/60", ratio, className)}>
        <ImageIcon aria-hidden className="h-10 w-10" />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden", ratio, className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
