import { site } from "../site";
import type { EventItem, NewsItem } from "../types";

const abs = (p: string) => new URL(p, site.url).toString();

export const organisationLd = () => ({
  "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url,
  description: site.description, email: site.email, telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: "Folkestone", addressRegion: "Kent", addressCountry: "GB" },
  sameAs: Object.values(site.social),
});

export const eventLd = (e: EventItem) => ({
  "@context": "https://schema.org", "@type": "Event", name: e.title, description: e.short_description,
  startDate: e.starts_at, endDate: e.ends_at ?? undefined, eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", url: abs(`/events/${e.slug}`),
  image: e.image_url ?? undefined,
  location: { "@type": "Place", name: e.venue_name, address: { "@type": "PostalAddress", streetAddress: e.address, postalCode: e.postcode, addressLocality: "Folkestone", addressCountry: "GB" } },
  organizer: { "@type": "Organization", name: site.name, url: site.url },
});

export const articleLd = (n: NewsItem) => ({
  "@context": "https://schema.org", "@type": "Article", headline: n.title, description: n.summary,
  datePublished: n.published_at, author: { "@type": "Person", name: n.author },
  publisher: { "@type": "Organization", name: site.name }, image: n.image_url ?? undefined, mainEntityOfPage: abs(`/news/${n.slug}`),
});

export const faqLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
});

export const breadcrumbLd = (crumbs: { name: string; path: string }[]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
});
