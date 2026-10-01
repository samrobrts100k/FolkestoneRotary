import { NextResponse } from "next/server";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/** Connection self-test. Reveals only the (public) project host and whether things work — never any key. */
export async function GET() {
  const out: Record<string, unknown> = {
    urlConfigured: Boolean(supabaseUrl),
    host: supabaseUrl ? new URL(supabaseUrl).host : null,
    anonKeyPresent: Boolean(supabaseAnonKey),
    anonKeyLooksValid: /^(eyJ|sb_publishable_)/.test(supabaseAnonKey),
    serviceKeyPresent: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  };
  if (supabaseUrl) {
    try {
      const r = await fetch(`${supabaseUrl}/auth/v1/health`, { headers: { apikey: supabaseAnonKey }, signal: AbortSignal.timeout(8000) });
      out.authHealthStatus = r.status;
      const t = await fetch(`${supabaseUrl}/rest/v1/event_categories?select=slug&limit=1`, { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` }, signal: AbortSignal.timeout(8000) });
      out.databaseStatus = t.status;
      out.databaseOk = t.ok;
    } catch (e) {
      out.error = e instanceof Error ? (e.cause instanceof Error ? e.cause.message : e.message) : String(e);
    }
  }
  return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
}
