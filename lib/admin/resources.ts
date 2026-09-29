import type { Role } from "../permissions";
import { resourceRoles } from "../permissions";

export type FieldType = "text" | "textarea" | "number" | "date" | "datetime" | "select" | "checkbox" | "image" | "file" | "tags" | "json" | "url";
export interface FieldDef { name: string; label: string; type: FieldType; required?: boolean; help?: string; options?: { value: string; label: string }[]; rows?: number }
export interface Resource {
  key: string; table: string; title: string; singular: string; roles: Role[];
  fields: FieldDef[]; columns: string[]; orderBy: string; ascending?: boolean;
  /** Has Draft/Published/Scheduled/Archived. */
  workflow?: boolean; slugFrom?: string; readonly?: boolean; previewKind?: "event" | "news" | "story";
  help?: string;
}

const opts = (...v: string[]) => v.map((x) => ({ value: x, label: x[0].toUpperCase() + x.slice(1) }));
const eventCats = opts("fundraising", "community", "social", "business", "youth");
const newsCats = [{ value: "club-news", label: "Club News" }, { value: "fundraising", label: "Fundraising" }, { value: "community", label: "Community" }];
const t = (name: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ name, label, type: "text", ...extra });

const r = (x: Omit<Resource, "roles">): Resource => ({ ...x, roles: resourceRoles[x.key] });

export const resources: Resource[] = [
  r({ key: "events", table: "events", title: "Events", singular: "event", workflow: true, slugFrom: "title", previewKind: "event", orderBy: "starts_at", columns: ["title", "starts_at", "category"],
    fields: [
      t("title", "Title", { required: true }), t("slug", "URL slug", { help: "Leave blank to create from the title." }),
      { name: "category", label: "Category", type: "select", options: eventCats, required: true },
      { name: "starts_at", label: "Starts", type: "datetime", required: true }, { name: "ends_at", label: "Ends", type: "datetime" },
      t("short_description", "Short description", { required: true }), { name: "description", label: "Full description", type: "textarea", rows: 8, help: "Separate paragraphs with a blank line." },
      t("venue_name", "Venue name", { required: true }), t("address", "Address"), t("postcode", "Postcode"), { name: "lat", label: "Latitude", type: "number" }, { name: "lng", label: "Longitude", type: "number" },
      { name: "image_url", label: "Event image", type: "image" }, t("image_alt", "Image description (alt text)"),
      { name: "book_url", label: "Booking link", type: "url", help: "Shows a Book button." }, { name: "enter_url", label: "Entry link", type: "url", help: "Shows an Enter button." },
      { name: "ticket_info", label: "Ticket / entry information", type: "textarea", rows: 3 },
      { name: "sponsors", label: "Sponsors (comma separated)", type: "tags" },
      { name: "programme", label: "Programme (advanced)", type: "json", help: 'JSON list, e.g. [{"time":"10:00","item":"Registration"}]' },
      { name: "faq", label: "FAQ (advanced)", type: "json", help: 'JSON list, e.g. [{"q":"Question?","a":"Answer."}]' },
      { name: "downloads", label: "Downloads (advanced)", type: "json", help: 'JSON list, e.g. [{"label":"Entry form","url":"https://…"}]' },
      { name: "show_countdown", label: "Show countdown timer", type: "checkbox" },
    ] }),
  r({ key: "news", table: "news", title: "News", singular: "article", workflow: true, slugFrom: "title", previewKind: "news", orderBy: "published_at", columns: ["title", "published_at", "category"],
    fields: [
      t("title", "Headline", { required: true }), t("slug", "URL slug", { help: "Leave blank to create from the headline." }),
      { name: "category", label: "Category", type: "select", options: newsCats, required: true }, { name: "published_at", label: "Article date", type: "datetime", required: true },
      t("author", "Author"), t("summary", "Summary", { required: true }), { name: "body", label: "Article", type: "textarea", rows: 12, help: "Separate paragraphs with a blank line." },
      { name: "tags", label: "Tags (comma separated)", type: "tags" }, { name: "image_url", label: "Image", type: "image" }, t("image_alt", "Image description (alt text)"), { name: "featured", label: "Featured article", type: "checkbox" },
    ] }),
  r({ key: "impact_stories", table: "impact_stories", title: "Impact stories", singular: "story", workflow: true, slugFrom: "title", previewKind: "story", orderBy: "created_at", ascending: false, columns: ["title", "organisation", "amount_awarded"],
    fields: [t("title", "Project title", { required: true }), t("slug", "URL slug"), t("organisation", "Organisation supported", { required: true }), t("summary", "Short description", { required: true }), t("outcome", "Outcome"),
      { name: "amount_awarded", label: "Amount awarded (£)", type: "number" }, { name: "image_url", label: "Image", type: "image" }, t("image_alt", "Image description (alt text)")] }),
  r({ key: "stats", table: "stats", title: "Homepage statistics", singular: "statistic", orderBy: "sort_order", columns: ["label", "value"], help: "These numbers appear in the animated counters on the homepage and Our Impact page.",
    fields: [t("label", "Label", { required: true }), { name: "value", label: "Number", type: "number", required: true }, t("prefix", "Prefix (e.g. £)"), t("suffix", "Suffix (e.g. +)"), { name: "sort_order", label: "Order", type: "number" }, { name: "is_sample", label: "Still a sample figure?", type: "checkbox" }] }),
  r({ key: "sponsors", table: "sponsors", title: "Sponsors", singular: "sponsor", workflow: true, orderBy: "name", columns: ["name", "level"],
    fields: [t("name", "Business name", { required: true }), { name: "logo_url", label: "Logo", type: "image" }, { name: "website", label: "Website", type: "url" }, t("email", "Email"), t("phone", "Phone"),
      { name: "description", label: "Description", type: "textarea", rows: 3 }, { name: "level", label: "Sponsorship level", type: "select", options: opts("gold", "silver", "bronze", "community"), required: true },
      t("event_id", "Event association (event ID, optional)"), { name: "starts_on", label: "Start date", type: "date" }, { name: "ends_on", label: "End date", type: "date" }] }),
  r({ key: "content_items", table: "content_items", title: "FAQs, testimonials & reports", singular: "item", workflow: true, orderBy: "kind", columns: ["kind", "title"],
    help: "FAQs (set Page to join or funding), testimonials, timeline entries, leadership roles and annual report PDFs.",
    fields: [{ name: "kind", label: "Type", type: "select", options: [{ value: "faq", label: "FAQ" }, { value: "testimonial", label: "Testimonial" }, { value: "annual_report", label: "Annual report" }, { value: "timeline", label: "Timeline entry" }, { value: "leader", label: "Leadership role" }], required: true },
      t("title", "Title / question / name / year", { required: true }), { name: "body", label: "Text / answer / quote", type: "textarea", rows: 4 }, { name: "url", label: "PDF or link", type: "file", help: "Upload a PDF (annual reports)." },
      { name: "page", label: "Page (FAQs: join or funding)", type: "select", options: opts("join", "funding") }, { name: "sort_order", label: "Order", type: "number" }] }),
  r({ key: "pages", table: "pages", title: "Pages", singular: "page", workflow: true, orderBy: "slug", columns: ["slug", "title"], fields: [t("slug", "Slug", { required: true }), t("title", "Title", { required: true }), t("meta_description", "Search description"), { name: "body", label: "Text", type: "textarea", rows: 12 }] }),
  r({ key: "galleries", table: "galleries", title: "Galleries", singular: "gallery", workflow: true, slugFrom: "title", orderBy: "created_at", ascending: false, columns: ["title", "slug"], fields: [t("title", "Title", { required: true }), t("slug", "URL slug"), { name: "description", label: "Description", type: "textarea", rows: 3 }] }),
  r({ key: "meetings", table: "meetings", title: "Meetings", singular: "meeting", orderBy: "starts_at", columns: ["title", "starts_at"], fields: [t("title", "Title", { required: true }), { name: "starts_at", label: "Date & time", type: "datetime", required: true }, t("venue", "Venue"), { name: "notes", label: "Notes", type: "textarea", rows: 3 }] }),
  r({ key: "member_documents", table: "member_documents", title: "Member documents", singular: "document", orderBy: "created_at", ascending: false, columns: ["kind", "title"],
    fields: [{ name: "kind", label: "Section", type: "select", options: [{ value: "minutes", label: "Minutes" }, { value: "policy", label: "Policy" }, { value: "document", label: "Document" }, { value: "committee", label: "Committee" }, { value: "download", label: "Download" }], required: true }, t("title", "Title", { required: true }), { name: "url", label: "File", type: "file", required: true }, { name: "meeting_date", label: "Meeting date", type: "date" }] }),
  r({ key: "contact_enquiries", table: "contact_enquiries", title: "Contact enquiries", singular: "enquiry", readonly: true, orderBy: "created_at", ascending: false, columns: ["name", "subject", "created_at", "status"],
    fields: [t("name", "Name"), t("email", "Email"), t("phone", "Phone"), t("subject", "Subject"), { name: "message", label: "Message", type: "textarea" }, { name: "status", label: "Status", type: "select", options: opts("new", "replied", "closed") }] }),
  r({ key: "membership_enquiries", table: "membership_enquiries", title: "Membership enquiries", singular: "enquiry", readonly: true, orderBy: "created_at", ascending: false, columns: ["name", "email", "created_at", "status"],
    fields: [t("name", "Name"), t("email", "Email"), t("phone", "Phone"), t("age_range", "Age range"), t("occupation", "Occupation"), { name: "why_interested", label: "Why interested", type: "textarea" }, t("preferred_contact", "Preferred contact"), { name: "status", label: "Status", type: "select", options: opts("new", "contacted", "visited", "joined", "closed") }] }),
  r({ key: "newsletter_subscribers", table: "newsletter_subscribers", title: "Newsletter subscribers", singular: "subscriber", readonly: true, orderBy: "created_at", ascending: false, columns: ["first_name", "last_name", "email", "is_subscribed"],
    fields: [t("first_name", "First name"), t("last_name", "Last name"), t("email", "Email"), { name: "is_subscribed", label: "Subscribed", type: "checkbox" }] }),
];

export const getResource = (key: string) => resources.find((x) => x.key === key);
export const fundingStatuses = [
  { value: "received", label: "Received" }, { value: "under_review", label: "Under Review" }, { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" }, { value: "more_info_required", label: "More Information Required" },
];
