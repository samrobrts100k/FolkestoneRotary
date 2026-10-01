/** @type {import('next').NextConfig} */
// Never let a mistyped env var break the build: fall back to a placeholder host.
let supabaseHost = "placeholder.supabase.co";
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL.trim()).hostname;
} catch {
  console.warn("NEXT_PUBLIC_SUPABASE_URL is not a valid URL (it should look like https://abcdxyz.supabase.co)");
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost }],
  },
  experimental: { serverActions: { bodySizeLimit: "12mb" } },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default nextConfig;
