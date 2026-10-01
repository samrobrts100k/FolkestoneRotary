import { NextResponse, type NextRequest } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

/** Completes email links (password reset). Exchanges the one-time code for a session cookie. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") ?? "/members";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/members";
  if (code) {
    const { error } = await (await createSessionClient()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, req.nextUrl.origin));
  }
  return NextResponse.redirect(new URL("/forgot-password?error=expired", req.nextUrl.origin));
}
