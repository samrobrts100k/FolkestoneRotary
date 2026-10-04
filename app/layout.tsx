import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd } from "@/components/json-ld";
import { organisationLd } from "@/lib/seo/jsonld";
import { site } from "@/lib/site";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], axes: ["opsz"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["Folkestone Rotary", "Rotary Club Folkestone", "Volunteer Folkestone", "Charity events Folkestone", "Community funding Folkestone", "Folkestone Half Marathon", "Folkestone Rotary Golf Day"],
  openGraph: { siteName: site.name, locale: "en_GB", type: "website" },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#005DAA", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="sr-only z-50 rounded-full bg-gold px-5 py-3 font-bold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <CookieConsent />
        <JsonLd data={organisationLd()} />
      </body>
    </html>
  );
}
