import { PageHero, Section } from "@/components/sections";
import { CookieSettingsButton } from "@/components/cookie-consent";

export function LegalPage({ title, path, children, cookieButton }: { title: string; path: string; children: React.ReactNode; cookieButton?: boolean }) {
  return (
    <>
      <PageHero title={title} crumbs={[{ name: title, path }]} />
      <Section><div className="prose-club mx-auto max-w-3xl">
        <p className="rounded-xl border border-gold bg-gold-light p-3 text-sm">Draft text for the club to review with a qualified adviser before launch.</p>
        {children}
        {cookieButton && <p className="mt-6"><CookieSettingsButton /></p>}
      </div></Section>
    </>
  );
}
