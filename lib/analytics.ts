/** Fire a GA4/GTM event. No-ops unless the visitor consented to analytics and a tag is loaded. */
type Ev = "event_click" | "donate_click" | "membership_enquiry" | "funding_application" | "sponsor_enquiry" | "newsletter_signup" | "download";
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void } }

export function track(name: Ev, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  if (window.gtag) window.gtag("event", name, params);
  else window.dataLayer?.push({ event: name, ...params });
}
