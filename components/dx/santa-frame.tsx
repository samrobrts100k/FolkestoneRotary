"use client";
import { useEffect, useRef, useState } from "react";
import { santaFinderUrl } from "@/lib/site";

const ORIGIN = new URL(santaFinderUrl).origin;

/**
 * The Santa route finder, exactly as its author built it, in a frame. It tells us its height (santaHeight)
 * so the frame grows to fit, and where to scroll to (santaScrollTo) when someone picks a street.
 * Only messages from that frame and that site are acted on.
 */
export function SantaFrame({ title }: { title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  // Load the frame only once we are listening, so its first height message is never missed.
  const [listening, setListening] = useState(false);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      const f = ref.current;
      if (!f || e.source !== f.contentWindow || e.origin !== ORIGIN || !e.data || typeof e.data !== "object") return;
      const h = Number(e.data.santaHeight);
      if (h > 0 && h < 20000) f.style.height = `${Math.ceil(h)}px`;
      if (typeof e.data.santaScrollTo === "number") {
        const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Keep clear of the sticky header.
        scrollTo({ top: f.getBoundingClientRect().top + scrollY + e.data.santaScrollTo - 84, behavior: smooth ? "smooth" : "auto" });
      }
    };
    addEventListener("message", on);
    setListening(true);
    return () => removeEventListener("message", on);
  }, []);
  return <iframe ref={ref} id="santa-route-finder" src={listening ? santaFinderUrl : undefined} title={title} className="santa-frame" />;
}
