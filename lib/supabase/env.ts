const clean = (v?: string) => (v ?? "").trim();
const validUrl = (v: string) => { try { return /^https?:$/.test(new URL(v).protocol); } catch { return false; } };

const rawUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseUrl = validUrl(rawUrl) ? rawUrl : "";
export const supabaseAnonKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
/** False when the env vars are missing or malformed, so the site falls back to sample content instead of crashing. */
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);
