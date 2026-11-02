"use client";
import { useEffect, useRef, useState } from "react";
import { santaFinderUrl } from "@/lib/site";

const ORIGIN = new URL(santaFinderUrl).origin;
/** The finder always reports its height once it has loaded. If it hasn't by then, it isn't loading here. */
const WAIT_MS = 8000;

/**
 * The Santa route finder, exactly as its author built it, in a frame. It tells us its height (santaHeight)
 * so the frame grows to fit, and where to scroll to (santaScrollTo) when someone picks a street.
 * Only messages from that frame and that site are acted on. If it never reports in (for example its site
 * doesn't allow being shown on ours), the frame is swapped for a button that opens it in a new tab.
 */
export function SantaFrame({ title, openLabel }: { title: string; openLabel: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  // Load the frame only once we are listening, so its first height message is never missed.
  const [listening, setListening] = useState(false);
  const [state, setState] = useState<"waiting" | "ok" | "blocked">("waiting");
  useEffect(() => {
    const on = (e: MessageEvent) => {
      const f = ref.current;
      if (!f || e.source !== f.contentWindow || e.origin !== ORIGIN || !e.data || typeof e.data !== "object") return;
      setState("ok");
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
    const t = setTimeout(() => setState((s) => (s === "waiting" ? "blocked" : s)), WAIT_MS);
    return () => { removeEventListener("message", on); clearTimeout(t); };
  }, []);
  return (
    <>
      {state === "blocked" && (
        <div className="santa-fallback" role="status">
          <p>The route finder opens on its own page.</p>
          <a className="btn gold" href={santaFinderUrl} target="_blank" rel="noopener noreferrer">{openLabel} <span className="sr">(opens in a new tab)</span></a>
        </div>
      )}
      {/* Kept in the page while hidden, so it can still appear if it was only slow. */}
      <iframe ref={ref} id="santa-route-finder" src={listening ? santaFinderUrl : undefined} title={title} className="santa-frame" hidden={state === "blocked"} />
      {state !== "blocked" && <p className="santa-alt">Can’t see the route finder? <a href={santaFinderUrl} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>.</p>}
    </>
  );
}
