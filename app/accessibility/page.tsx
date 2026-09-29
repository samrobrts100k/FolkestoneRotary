import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
export const metadata: Metadata = buildMetadata({ title: "Accessibility Statement", path: "/accessibility" });
export default function Page() {
  return (
    <LegalPage title="Accessibility Statement" path="/accessibility">
      <p>{site.name} aims to meet WCAG 2.2 AA. The site supports keyboard navigation, visible focus, a skip link, labelled forms, alt text and reduced-motion preferences.</p>
      <h2>Feedback</h2><p>If you have difficulty using any part of this site, email {site.email} and we will help and fix the issue.</p>
    </LegalPage>
  );
}
