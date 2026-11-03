import { readPanels, type PagePanel, type PanelWhere } from "@/lib/page-text";
import { Reveal } from "@/components/motion";
import { PanelButton } from "@/components/dx/panels";

const tones: Record<PagePanel["tone"], { box: string; btn: string; btn2: string }> = {
  gold: { box: "bg-gold text-navy", btn: "bg-navy text-white hover:bg-rotary-dark", btn2: "border-2 border-navy text-navy hover:bg-navy hover:text-white" },
  blue: { box: "on-dark bg-rotary text-white", btn: "bg-gold text-navy hover:bg-[#ffb93a]", btn2: "border-2 border-white text-white hover:bg-white/15" },
  navy: { box: "on-dark bg-navy text-white", btn: "bg-gold text-navy hover:bg-[#ffb93a]", btn2: "border-2 border-white text-white hover:bg-white/15" },
};
const btnBase = "inline-flex min-h-12 items-center rounded-full px-7 font-bold no-underline transition duration-200 ease-out-quint hover:-translate-y-0.5 active:scale-[0.97]";

/** Extra panels an admin added to the home page, styled like the home guest panel. */
export function HomePanels({ value, where }: { value: string; where: PanelWhere }) {
  const list = readPanels(value).filter((p) => p.where === where);
  if (!list.length) return null;
  return (
    <section className={where === "top" ? "pt-9 sm:pt-14" : "pb-14 sm:pb-20"}>
      <div className="container space-y-6">
        {list.map((p, i) => {
          const t = tones[p.tone];
          return (
            <Reveal key={i}>
              <div className={`grid items-center gap-8 rounded-[1.75rem] px-7 py-9 sm:px-10 md:grid-cols-[1.3fr_1fr] md:gap-10 lg:rounded-panel lg:px-14 lg:py-12 ${t.box}`}>
                <h2 className="m-0 text-[clamp(30px,3.6vw,46px)] leading-[1.1] text-inherit">{p.title}</h2>
                <div>
                  {p.text && <p className="mb-5 mt-0">{p.text}</p>}
                  <div className="flex flex-wrap gap-3">
                    {p.btn && <PanelButton className={`${btnBase} ${t.btn}`} href={p.href} label={p.btn} />}
                    {p.btn2 && <PanelButton className={`${btnBase} ${t.btn2}`} href={p.href2} label={p.btn2} />}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
