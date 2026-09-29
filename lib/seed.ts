/**
 * Sample content shown until Supabase is connected (and mirrored in supabase/seed.sql).
 * Everything here is an EDITABLE PLACEHOLDER — figures and details are unconfirmed.
 */
import type { Category, ContentItem, EventItem, ImpactStory, NewsItem, Sponsor, Stat } from "./types";

const day = 86_400_000;
const at = (days: number, hour = 10) => {
  const d = new Date(Date.now() + days * day);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const eventCategories: Category[] = [
  { slug: "fundraising", name: "Fundraising" },
  { slug: "community", name: "Community" },
  { slug: "social", name: "Social" },
  { slug: "business", name: "Business" },
  { slug: "youth", name: "Youth" },
];
export const newsCategories: Category[] = [
  { slug: "club-news", name: "Club News" },
  { slug: "fundraising", name: "Fundraising" },
  { slug: "community", name: "Community" },
];

const ev = (e: Partial<EventItem> & Pick<EventItem, "id" | "slug" | "title" | "short_description" | "starts_at" | "category" | "venue_name">): EventItem => ({
  description: e.short_description + "\n\nSample description — replace with the confirmed event details.",
  status: "published", is_sample: true, image_url: null, image_alt: "", postcode: "CT20 1AA", address: "Folkestone, Kent",
  ticket_info: "Ticket and entry details to be confirmed.", book_url: null, enter_url: null,
  programme: [{ time: "10:00", item: "Registration" }, { time: "11:00", item: "Main event" }, { time: "15:00", item: "Close and thank-yous" }],
  sponsors: ["Your business here"], gallery: [], downloads: [],
  faq: [{ q: "Where does the money go?", a: "All proceeds support local Folkestone charities and community projects." }],
  ...e,
});

export const events: EventItem[] = [
  ev({ id: "e1", slug: "folkestone-rotary-golf-day", title: "Folkestone Rotary Golf Day", category: "fundraising", starts_at: at(35, 8), ends_at: at(35, 17), venue_name: "Local golf club (TBC)", short_description: "A friendly team golf day raising money for local causes, with lunch and prizes.", show_countdown: true, book_url: "/contact?subject=Events" }),
  ev({ id: "e2", slug: "folkestone-half-marathon", title: "Folkestone Half Marathon", category: "community", starts_at: at(80, 9), ends_at: at(80, 14), venue_name: "Folkestone Seafront", short_description: "Run the Leas and the coast in Folkestone's flagship community race.", show_countdown: true, enter_url: "/contact?subject=Events" }),
  ev({ id: "e3", slug: "christmas-collections", title: "Christmas Collections", category: "community", starts_at: at(60, 17), ends_at: at(60, 20), venue_name: "Around Folkestone", short_description: "Join Santa's sleigh and help collect for families in need this Christmas." }),
  ev({ id: "e4", slug: "race-night", title: "Race Night", category: "social", starts_at: at(20, 19), ends_at: at(20, 22), venue_name: "Venue to be confirmed", short_description: "An evening of fun, friendly betting and supper — all for charity.", book_url: "/contact?subject=Events" }),
  ev({ id: "e5", slug: "wine-and-wisdom", title: "Wine & Wisdom", category: "social", starts_at: at(45, 19), ends_at: at(45, 22), venue_name: "Venue to be confirmed", short_description: "A relaxed quiz-and-tasting evening with great company." }),
  ev({ id: "e6", slug: "dragons-den", title: "Dragons' Den", category: "youth", starts_at: at(100, 14), ends_at: at(100, 17), venue_name: "Local school (TBC)", short_description: "Young entrepreneurs pitch their business ideas to a panel of local business leaders." }),
  ev({ id: "e7", slug: "summer-fete-2025", title: "Summer Community Fete", category: "community", starts_at: at(-120, 12), ends_at: at(-120, 16), venue_name: "Folkestone", short_description: "A past event — kept as an example of the archive." }),
];

export const news: NewsItem[] = [
  { id: "n1", slug: "community-funding-round-open", title: "Community funding round now open", summary: "Local charities and groups can now apply for grants from Folkestone Rotary.", body: "Folkestone Rotary is inviting applications from local organisations.\n\nGrants support projects that benefit people across Folkestone.\n\nSample article — replace with real news.", author: "Folkestone Rotary", category: "community", tags: ["funding", "charity"], published_at: at(-5), status: "published", featured: true, is_sample: true },
  { id: "n2", slug: "baby-basics-folkestone-donation", title: "Supporting Baby Basics Folkestone", summary: "Rotary funds essentials for local new parents through Baby Basics.", body: "Baby Basics Folkestone provides essentials to families who need them most.\n\nSample article — replace with real news.", author: "Folkestone Rotary", category: "community", tags: ["families", "funding"], published_at: at(-15), status: "published", is_sample: true },
  { id: "n3", slug: "welcome-new-members", title: "Welcoming new members to the club", summary: "A warm welcome to our newest Rotarians — could you be next?", body: "Our club is growing.\n\nSample article — replace with real news.", author: "Folkestone Rotary", category: "club-news", tags: ["membership"], published_at: at(-30), status: "published", is_sample: true },
  { id: "n4", slug: "golf-day-announced", title: "Golf Day date announced", summary: "Book your team for this year's Rotary Golf Day.", body: "Sample article — replace with real news.", author: "Folkestone Rotary", category: "fundraising", tags: ["events", "golf"], published_at: at(-40), status: "published", is_sample: true },
];

export const stories: ImpactStory[] = [
  { id: "s1", slug: "baby-basics-folkestone", title: "Baby Basics Folkestone", organisation: "Baby Basics Folkestone", summary: "Essential items for local families welcoming a new baby.", outcome: "Families received starter packs when they needed them most.", amount_awarded: 1500, status: "published", is_sample: true },
  { id: "s2", slug: "local-schools", title: "Supporting local schools", organisation: "Folkestone primary schools", summary: "Books, equipment and enterprise activities for local pupils.", outcome: "More children able to take part in learning and enterprise activities.", amount_awarded: 2000, status: "published", is_sample: true },
  { id: "s3", slug: "community-charities", title: "Community charity grants", organisation: "Local charities", summary: "Grants to small charities delivering vital local services.", outcome: "Local groups were able to keep essential services running.", amount_awarded: 5000, status: "published", is_sample: true },
  { id: "s4", slug: "christmas-family-support", title: "Christmas family support", organisation: "Local families", summary: "Christmas gifts and food for families facing hardship.", outcome: "Families enjoyed a happier Christmas.", amount_awarded: null, status: "published", is_sample: true },
  { id: "s5", slug: "youth-programmes", title: "Youth programmes", organisation: "Young people of Folkestone", summary: "Enterprise, sport and skills opportunities for young people.", outcome: "Young people gained confidence and new skills.", amount_awarded: 1000, status: "published", is_sample: true },
];

export const stats: Stat[] = [
  { id: "t1", label: "Raised for local causes", value: 48500, prefix: "£", suffix: "+", sort_order: 1, is_sample: true },
  { id: "t2", label: "Local organisations supported", value: 40, suffix: "+", sort_order: 2, is_sample: true },
  { id: "t3", label: "Volunteer hours contributed", value: 1200, suffix: "+", sort_order: 3, is_sample: true },
  { id: "t4", label: "Families supported at Christmas", value: 120, sort_order: 4, is_sample: true },
  { id: "t5", label: "Young people supported", value: 300, suffix: "+", sort_order: 5, is_sample: true },
];

const sp = (id: string, name: string, level: Sponsor["level"]): Sponsor => ({ id, name, level, status: "published", website: "https://example.org", description: "Sample sponsor — replace.", is_sample: true });
export const sponsors: Sponsor[] = [
  sp("p1", "Sample Gold Sponsor", "gold"), sp("p2", "Sample Silver Sponsor", "silver"),
  sp("p3", "Sample Bronze Sponsor", "bronze"), sp("p4", "Sample Community Partner", "community"),
];

const ci = (id: string, kind: ContentItem["kind"], title: string, body: string, sort_order: number, extra: Partial<ContentItem> = {}): ContentItem =>
  ({ id, kind, title, body, sort_order, status: "published", is_sample: true, ...extra });
export const contentItems: ContentItem[] = [
  ci("c1", "faq", "Do I need to be a business owner to join?", "No. Rotary welcomes people from every background and profession.", 1, { page: "join" }),
  ci("c2", "faq", "How much time does it take?", "As much or as little as you can give. Most members attend meetings and help at a few events each year.", 2, { page: "join" }),
  ci("c3", "faq", "Can I visit before joining?", "Yes — come along as a guest, no commitment needed.", 3, { page: "join" }),
  ci("c4", "faq", "Who can apply for funding?", "Registered charities, community groups, schools and non-profits working in the Folkestone area.", 1, { page: "funding" }),
  ci("c5", "testimonial", "Sample Member, Rotarian", "“Rotary is a great way to meet people and make a real difference locally.” (sample quote)", 1),
  ci("c6", "testimonial", "Sample Charity Trustee", "“The grant transformed what we could offer our community.” (sample quote)", 2),
  ci("c7", "annual_report", "Annual Report (sample)", "Upload the PDF in Admin → Content items.", 1, { url: "" }),
  ci("c8", "timeline", "Founded", "Add the club's founding year and key milestones here (sample).", 1),
  ci("c9", "timeline", "Growing our impact", "Add a milestone (sample).", 2),
  ci("c10", "leader", "Club President", "Name to be confirmed (sample).", 1),
  ci("c11", "leader", "Secretary", "Name to be confirmed (sample).", 2),
  ci("c12", "leader", "Treasurer", "Name to be confirmed (sample).", 3),
];
