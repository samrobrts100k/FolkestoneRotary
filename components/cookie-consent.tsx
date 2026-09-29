"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Consent = { analytics: boolean; decided: boolean };
const KEY = "fr_cookie_consent_v1";
const GA = process.env.NEXT_PUBLIC_GA4_ID;
const GTM = process.env.NEXT_PUBLIC_GTM_ID;

function read(): Consent {
  try { const v = localStorage.getItem(KEY); if (v) return { ...JSON.parse(v), decided: true }; } catch { /* storage blocked */ }
  return { analytics: false, decided: false };
}

/** UK GDPR/PECR banner. Only essential cookies until the visitor opts in; analytics scripts load after consent. */
export function CookieConsent() {
  const [c, setC] = useState<Consent>({ analytics: false, decided: true });
  const [manage, setManage] = useState(false);
  const [pref, setPref] = useState(false);
  useEffect(() => {
    setC(read());
    const open = () => { setManage(true); setC((x) => ({ ...x, decided: false })); };
    window.addEventListener("open-cookie-settings", open);
    return () => window.removeEventListener("open-cookie-settings", open);
  }, []);

  const save = (analytics: boolean) => {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics })); } catch { /* ignore */ }
    setC({ analytics, decided: true }); setManage(false);
  };

  return (
    <>
      {c.analytics && GTM && (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}</Script>
      )}
      {c.analytics && GA && !GTM && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}</Script>
        </>
      )}
      {!c.decided && (
        <div role="dialog" aria-modal="false" aria-labelledby="cc-title" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-card border border-slate-200 bg-white p-5 shadow-lift">
          <h2 id="cc-title" className="text-lg font-bold">Your privacy choices</h2>
          <p className="mt-1 text-sm text-slate-700">We use essential cookies to make the site work. With your permission we also use analytics cookies to understand how the site is used. See our <a href="/cookies" className="font-semibold text-rotary underline">Cookie Policy</a>.</p>
          {manage && (
            <div className="mt-3 space-y-2 rounded-xl bg-surface p-3 text-sm">
              <label className="flex items-center gap-3"><input type="checkbox" checked disabled className="h-5 w-5" /> <span><strong>Essential</strong> – always on (security, login, this choice)</span></label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={pref} onChange={(e) => setPref(e.target.checked)} className="h-5 w-5 accent-rotary" /> <span><strong>Analytics</strong> – anonymous usage statistics</span></label>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => save(true)}>Accept All</Button>
            <Button size="sm" variant="outline" onClick={() => save(false)}>Reject Non-Essential</Button>
            {manage
              ? <Button size="sm" variant="ghost" onClick={() => save(pref)}>Save preferences</Button>
              : <Button size="sm" variant="ghost" onClick={() => setManage(true)}>Manage Preferences</Button>}
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsButton() {
  return <button type="button" className="font-semibold text-rotary underline" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}>Change cookie settings</button>;
}
