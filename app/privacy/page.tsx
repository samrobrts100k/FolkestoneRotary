import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
export const metadata: Metadata = buildMetadata({ title: "Privacy Policy", path: "/privacy" });
export default function Page() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy">
      <h2>Who we are</h2><p>{site.name} is the data controller for information collected on this website. Contact: {site.email}.</p>
      <h2>What we collect and why</h2><p>Contact, membership, funding, newsletter and (optional) member-account details you submit, used only to respond to you, assess applications, run our membership and send the news you asked for. We rely on your consent or on our legitimate interests as a charity-supporting club.</p>
      <h2>Who sees it</h2><p>Authorised club members and our service providers (hosting, database, email). We never sell your data. Donations are handled by an external provider.</p>
      <h2>Retention and your rights</h2><p>We keep data only as long as needed. Under UK GDPR you may request access, correction, deletion or withdraw consent at any time by emailing {site.email}. You can complain to the ICO (ico.org.uk).</p>
    </LegalPage>
  );
}
