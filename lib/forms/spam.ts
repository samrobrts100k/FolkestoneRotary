import "server-only";
import { headers } from "next/headers";

const MIN_FILL_MS = 2500;
const hits = new Map<string, number[]>();

/** Returns an error message when the submission looks like spam, otherwise null. Layers: honeypot, timing, rate limit, optional Turnstile. */
export async function checkSpam(fd: FormData): Promise<string | null> {
  if (String(fd.get("website_url") ?? "") !== "") return "Submission rejected.";
  const started = Number(fd.get("_t") ?? 0);
  if (!started || Date.now() - started < MIN_FILL_MS) return "That was very quick — please try again.";

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 5) return "Too many submissions. Please wait a minute and try again.";
  hits.set(ip, [...recent, now]);

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    const token = String(fd.get("cf-turnstile-response") ?? "");
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!res.success) return "Spam check failed. Please try again.";
  }
  return null;
}
