import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { SKY_DEFS, SKY_HERO } from "@/lib/skyline";
import Link from "next/link";
import { Fragment } from "react";

const BG: Record<string, string> = {
  about: "radial-gradient(60% 80% at 80% 30%,rgba(247,168,27,.5),transparent 70%),linear-gradient(160deg,#0B1F3A,#005DAA)",
  impact: "radial-gradient(70% 90% at 15% 90%,rgba(77,147,204,.55),transparent 70%),linear-gradient(160deg,#004A88,#0B1F3A)",
  events: "radial-gradient(60% 80% at 85% 20%,rgba(247,168,27,.45),transparent 70%),linear-gradient(160deg,#0B1F3A,#005DAA)",
  news: "radial-gradient(60% 80% at 20% 30%,rgba(247,168,27,.4),transparent 70%),linear-gradient(160deg,#0B1F3A,#004A88)",
  join: "radial-gradient(60% 80% at 80% 80%,rgba(247,168,27,.5),transparent 70%),linear-gradient(160deg,#16304F,#005DAA)",
  funding: "radial-gradient(60% 80% at 20% 20%,rgba(247,168,27,.4),transparent 70%),linear-gradient(160deg,#0B1F3A,#004A88)",
  contact: "radial-gradient(60% 80% at 75% 25%,rgba(77,147,204,.55),transparent 70%),linear-gradient(160deg,#0B1F3A,#005DAA)",
};

/** Dark hero with the Folkestone skyline. The page header sits transparent on top of it (see Header's `heroPaths`). */
export function DxHero({ page, title, lead, crumb, extra, aside }: { page: keyof typeof BG; title: string; lead: string; crumb: string; extra?: React.ReactNode; aside?: React.ReactNode }) {
  const trail = [{ name: "Home", path: "/" }, { name: crumb, path: `/${page}` }];
  return (
    <div className="ph" id="hero" style={{ ["--bg" as string]: BG[page] }}>
      <div dangerouslySetInnerHTML={{ __html: SKY_DEFS }} />
      <div aria-hidden dangerouslySetInnerHTML={{ __html: SKY_HERO }} />
      <JsonLd data={breadcrumbLd(trail)} />
      <div className="wrap">
        <div>
          <p className="crumb"><Link href="/">Home</Link> / {crumb}</p>
          <h1 id={`h-${page}`}>{title.split(" ").map((w, i) => <Fragment key={i}><span className="w" style={{ ["--i" as string]: i }}>{w}</span>{" "}</Fragment>)}</h1>
          <p className="lead">{lead}</p>
          {extra}
        </div>
        {aside}
      </div>
    </div>
  );
}
