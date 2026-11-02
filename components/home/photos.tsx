import { Photo } from "@/components/ui/photo";
import { Section, SectionHeading } from "@/components/sections";
import { readPhotos } from "@/lib/page-text";

/** Home page photos from Admin → Page text. Renders nothing until it has a photo. */
export function HomePhotos({ title, value }: { title: string; value: string }) {
  const list = readPhotos(value);
  if (!list.length) return null;
  return (
    <Section className="pt-0 sm:pt-0">
      <SectionHeading title={title} />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {list.map((p, i) => <li key={p.url + i}><Photo src={p.url} alt={p.alt} ratio="aspect-square" className="rounded-[14px]" sizes="(min-width:768px) 25vw, 50vw" /></li>)}
      </ul>
    </Section>
  );
}
