export type Status = "draft" | "published" | "scheduled" | "archived";
export const STATUSES: Status[] = ["draft", "published", "scheduled", "archived"];

interface Base { id: string; status: Status; publish_at?: string | null; is_sample?: boolean }

export interface EventItem extends Base {
  slug: string; title: string; short_description: string; description: string;
  starts_at: string; ends_at?: string | null;
  venue_name: string; address?: string; postcode?: string; lat?: number | null; lng?: number | null;
  category: string; image_url?: string | null; image_alt?: string;
  book_url?: string | null; enter_url?: string | null; ticket_info?: string;
  programme?: { time: string; item: string }[];
  sponsors?: string[];
  gallery?: { url: string; alt: string }[];
  downloads?: { label: string; url: string }[];
  faq?: { q: string; a: string }[];
  show_countdown?: boolean;
}
export interface NewsItem extends Base {
  slug: string; title: string; summary: string; body: string; author: string;
  category: string; tags: string[]; image_url?: string | null; image_alt?: string;
  published_at: string; featured?: boolean;
}
export interface ImpactStory extends Base {
  slug: string; title: string; organisation: string; summary: string; outcome: string;
  amount_awarded?: number | null; image_url?: string | null; image_alt?: string; body?: string;
}
export interface Sponsor extends Base {
  name: string; logo_url?: string | null; website?: string; email?: string; phone?: string;
  description?: string; level: "gold" | "silver" | "bronze" | "community";
  event_id?: string | null; starts_on?: string | null; ends_on?: string | null;
}
export interface Stat { id: string; label: string; value: number; prefix?: string; suffix?: string; sort_order: number; is_sample?: boolean }
export type ContentKind = "faq" | "testimonial" | "annual_report" | "timeline" | "leader";
export interface ContentItem extends Base {
  kind: ContentKind; title: string; body?: string; url?: string; page?: string; sort_order: number;
}
export interface Category { slug: string; name: string }
