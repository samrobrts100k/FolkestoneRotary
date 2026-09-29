import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { buildMetadata } from "@/lib/seo/metadata";
export const metadata: Metadata = buildMetadata({ title: "Cookie Policy", path: "/cookies" });
export default function Page() {
  return (
    <LegalPage title="Cookie Policy" path="/cookies" cookieButton>
      <h2>Essential cookies</h2><p>Used for security, member login sessions and remembering your cookie choice. These cannot be switched off.</p>
      <h2>Analytics cookies</h2><p>Only set if you choose Accept All (or enable Analytics in Manage Preferences). They help us understand which pages are useful using Google Analytics. Until you consent, no analytics scripts load.</p>
    </LegalPage>
  );
}
