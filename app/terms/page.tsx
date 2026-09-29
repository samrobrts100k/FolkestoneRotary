import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
export const metadata: Metadata = buildMetadata({ title: "Terms of Use", path: "/terms" });
export default function Page() {
  return (
    <LegalPage title="Terms of Use" path="/terms">
      <p>This website is provided by {site.name} for information. Event details may change; please check before travelling. Content is © {site.name} unless stated. Links to external sites are provided for convenience and we are not responsible for their content.</p>
    </LegalPage>
  );
}
