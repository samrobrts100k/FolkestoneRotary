/**
 * Every editable piece of page text, with the wording the site uses until someone changes it in
 * Admin → Page text. Saved wording lives in the `pages` table (slug `text-<page>`, body = JSON of the
 * changed fields only), so an empty box always falls back to the default here.
 *
 * In any field, {meeting} becomes the meeting time ("2nd and 4th Monday…") and {venue} the meeting place,
 * both from lib/site.ts. On Our impact, {amount} becomes the headline figure.
 *
 * `image` fields hold one photo URL; `photos` fields hold a JSON list of { url, alt } (see readPhotos). Both start empty.
 */
export interface TextField { label: string; def: string; long?: boolean; lines?: boolean; help?: string; kind?: "image" | "photos" }
export interface TextGroup { title: string; fields: Record<string, TextField> }
export interface TextPage { label: string; path: string; groups: TextGroup[] }

const f = (label: string, def: string, extra: Partial<TextField> = {}): TextField => ({ label, def, ...extra });
const long = (label: string, def: string, extra: Partial<TextField> = {}) => f(label, def, { long: true, ...extra });
const lines = (label: string, def: string[], extra: Partial<TextField> = {}) => f(label, def.join("\n"), { lines: true, help: "One per line.", ...extra });
/** One photo (an `image` field). Not used by any page right now; kept for single-photo slots. */
export const image = (label: string, help?: string): TextField => ({ label, def: "", kind: "image", help });
/** A heading plus a set of photos. Nothing shows on the page until a photo is added. */
const photos = (title: string, help = "Add, remove and reorder photos. The section only appears once it has a photo.") => ({ photosTitle: f("Photos heading", title), photos: { label: "Photos", def: "", kind: "photos", help } as TextField });
function panel(title: string, text: string, b1: string): { ctaTitle: TextField; ctaText: TextField; ctaBtn: TextField };
function panel(title: string, text: string, b1: string, b2: string): { ctaTitle: TextField; ctaText: TextField; ctaBtn: TextField; ctaBtn2: TextField };
function panel(title: string, text: string, b1: string, b2?: string) {
  return { ctaTitle: f("Panel heading", title), ctaText: long("Panel text", text), ctaBtn: f("Main button", b1), ...(b2 ? { ctaBtn2: f("Second button", b2) } : {}) };
}

export const PAGE_TEXT = {
  home: { label: "Home", path: "/", groups: [
    { title: "Top of the page", fields: {
      heroTitle: f("Headline", "Making a difference in Folkestone"),
      heroLead: long("Introduction", "We’re local people who raise money, give time and back the charities, young people and projects that make this town work."),
      heroBtn: f("Gold button", "Join us"), heroLink1: f("First link", "View events"), heroLink2: f("Second link", "Apply for funding"),
      heroPhotos: { label: "Background photos (slideshow)", def: "", kind: "photos", help: "Shown behind the headline, darkened so the text stays readable. With two or more, they cross-fade every 5 seconds. Wide landscape photos work best. Hero videos, once added, play instead." },
    } },
    { title: "What’s on", fields: { eventsTitle: f("Heading", "What’s on"), eventsIntro: long("Introduction", "Come for the fun. The money stays in Folkestone."), eventsLink: f("Link", "See all events") } },
    { title: "News", fields: { newsTitle: f("Heading", "News from the club"), newsLink: f("Link", "All news") } },
    { title: "Sponsors", fields: {
      sponsorsTitle: f("Heading", "The local businesses behind us"),
      sponsorsIntro: long("Introduction", "Sponsors put their name to our events and help them happen. Yours could be on the next one."),
      sponsorsBtn: f("Button", "Become a sponsor"), sponsorsLink: f("Link", "See all our sponsors"),
    } },
    { title: "Photos", fields: photos("Folkestone Rotary in action") },
    { title: "Gold guest panel (bottom)", fields: panel("Come to a meeting as our guest", "{meeting}. At {venue}. No obligation.", "Ask to visit") },
  ] },
  about: { label: "About us", path: "/about", groups: [
    { title: "Top of the page", fields: { heroTitle: f("Headline", "Local people. Global network."), heroLead: long("Introduction", "We’re Folkestone’s Rotary club: neighbours who’d rather do something than talk about it."), glassLabel: f("Box heading", "At a glance") } },
    { title: "Who we are", fields: {
      swapStart: f("Start of the big line", "Rotary is a group of"),
      swapWords: lines("Words that swap in", ["neighbours.", "friends.", "leaders.", "problem-solvers."]),
      whoText: long("Paragraph", "We raise money, give time and connect with local organisations, as part of a worldwide network of Rotarians. Our focus is firmly local: every pound raised goes to local causes."),
    } },
    { title: "Our story", fields: { storyTitle: f("Heading", "Our story") } },
    { title: "Leadership", fields: { leadersTitle: f("Heading", "Pull up a chair"), leadersSub: long("Introduction", "This is who’s round the table at lunch. Tap a seat to say hello.") } },
    { title: "Rotary International", fields: { worldTitle: f("Heading", "Part of something bigger"), worldText: long("Paragraph", "Rotary International brings over a million Rotarians together on causes including peace, health, education and the environment.") } },
    { title: "Photos", fields: photos("Life in the club") },
    { title: "Gold panel (bottom)", fields: panel("Come and meet us", "{meeting}, {venue}. Visitors are always welcome.", "Visit as a guest", "Get in touch") },
  ] },
  impact: { label: "Our impact", path: "/impact", groups: [
    { title: "Top of the page", fields: {
      heroTitle: f("Headline", "What {amount} did", { help: "{amount} becomes the first figure in Homepage statistics." }),
      heroLead: long("Introduction", "Every pound we raise stays in the town. Here’s where it went, and what happened next."),
      glassNote: f("Line under the figure", "All of it stays in Folkestone."), glassBtn: f("Button", "See where it went"),
    } },
    { title: "Beach huts", fields: { hutsTitle: f("Heading", "Where every pound went"), hutsSub: long("Introduction", "Four beach huts, one town. Hover over a hut to open the door (tap on a phone).") } },
    { title: "Stories", fields: { storiesTitle: f("Heading", "Stories behind the numbers"), storiesSub: long("Introduction", "Open any story to see what it paid for.") } },
    { title: "Quotes, volunteering, photos, reports", fields: {
      quotesTitle: f("Quotes heading", "In their words"),
      timeTitle: f("Volunteering heading", "Time is the other currency"),
      timeSub: long("Volunteering text", "Collections, races, school visits and clear-ups. Every hour is given freely by members and friends."),
      timeBtn: f("Volunteering button", "Give some time"),
      galleryTitle: f("Photos heading", "Rotary in action"), reportsTitle: f("Reports heading", "Annual reports"),
      photos: { label: "Photos", def: "", kind: "photos", help: "Add, remove and reorder photos for the “Rotary in action” section. It only appears once it has a photo." },
    } },
    { title: "Gold panel (bottom)", fields: panel("Help us do even more", "Give, volunteer or ask for funding for a project of your own.", "Apply for funding", "Join us") },
  ] },
  events: { label: "Events", path: "/events", groups: [
    { title: "Top of the page", fields: { heroTitle: f("Headline", "What’s on"), heroLead: long("Introduction", "Races, quizzes, collections and one very good golf day. Every ticket helps someone in Folkestone.") } },
    { title: "Harbour Arm timeline", fields: { yearTitle: f("Heading", "The year at a glance"), yearSub: long("Introduction", "Every date in the diary, flying from the Harbour Arm. Tap a flag for the details, drag along the arm, or use the arrows.") } },
    { title: "Photos", fields: photos("From past events") },
    { title: "Gold panel (bottom)", fields: panel("Want to sponsor or volunteer at an event?", "Put your business on the programme, or give a morning to help it run.", "Sponsor an event", "Volunteer") },
    { title: "Each event’s own page", fields: {
      evAbout: f("“About” heading", "About this event"), evDay: f("Programme heading", "On the day"), evTickets: f("Tickets heading", "Tickets and entry"),
      evTicketsNone: long("When there are no ticket details", "Details coming soon. Ask us and we’ll let you know first."),
      evThanks: f("Sponsors heading", "With thanks to"), evFaq: f("Questions heading", "Questions"),
      evCtaTitle: f("Gold panel heading", "Help make it happen"), evCtaText: long("Gold panel text", "Put your business on the programme, or give a morning to help it run."),
      evCtaBtn: f("Gold panel button", "Sponsor this event"), evCtaBtn2: f("Gold panel second button", "Volunteer"),
    } },
  ] },
  news: { label: "News", path: "/news", groups: [
    { title: "Top of the page", fields: { heroTitle: f("Headline", "News from the club"), heroLead: long("Introduction", "Funding rounds, new members and the odd photo of someone in a hat.") } },
    { title: "Featured story", fields: { featTag: f("Label", "Featured"), featLink: f("Link", "Read the story") } },
    { title: "Each article’s own page", fields: {
      moreTitle: f("“More news” heading", "More from the club"), moreBtn: f("“More news” button", "All news"),
      artCtaTitle: f("Gold panel heading", "Come to a meeting as our guest"), artCtaText: long("Gold panel text", "{meeting}. At {venue}. No obligation."), artCtaBtn: f("Gold panel button", "Ask to visit"),
    } },
  ] },
  join: { label: "Join Rotary", path: "/join", groups: [
    { title: "Top of the page", fields: {
      heroTitle: f("Headline", "Your first lunch"),
      heroLead: long("Introduction", "No sign-up, no suit, no speech. Come to lunch and see if it feels like your kind of people."),
      heroNos: lines("Ticks under the introduction", ["No suit", "No speech", "No commitment"]),
    } },
    { title: "“Reserve your seat” card (also on the home page)", fields: {
      cardTitle: f("Card heading", "Reserve your seat"), cardBtn: f("Button", "Reserve my seat"),
      cardFine: long("Small print", "No obligation. We’ll be in touch to arrange your visit. By reserving you agree to us storing your details to reply, as described in the", { help: "The words “Privacy Policy” are added at the end as a link." }),
      barBtn: f("Sticky bar button (phones)", "Reserve a seat"),
    } },
    { title: "Who’s it for?", fields: {
      whoTitle: f("Heading", "Who’s it for?"), whoSub: long("Introduction", "Everyone at the table started as a stranger. Find yourself below."), cardCta: f("Button on each card", "Come along"),
      p1Title: f("Card 1 heading", "Business owners"), p1Hook: long("Card 1 line", "Meet the people who buy, sell and hire in Folkestone."), p1Pts: lines("Card 1 points", ["Lunch with other local business people", "Help with the Golf Day sponsorship drive", "Mentor young people at Dragons’ Den"]),
      p2Title: f("Card 2 heading", "Retired"), p2Hook: long("Card 2 line", "Be useful, social and out of the house at lunchtime."), p2Pts: lines("Card 2 points", ["Meet people who live nearby", "Help at collections and the Half Marathon", "Plan an event, or just turn up and help"]),
      p3Title: f("Card 3 heading", "Teachers"), p3Hook: long("Card 3 line", "Bring your school’s ideas to people who can fund them."), p3Pts: lines("Card 3 points", ["Link your school with funding", "Run enterprise days with Dragons’ Den", "Hear what local charities need"]),
      p4Title: f("Card 4 heading", "New to Folkestone"), p4Hook: long("Card 4 line", "One lunch and you know a roomful of locals."), p4Pts: lines("Card 4 points", ["Meet a friendly crowd in one lunch", "Learn the town from the people who run it", "Find a reason to be on the seafront on a Saturday"]),
      p5Title: f("Card 5 heading", "Under 30"), p5Hook: long("Card 5 line", "Your ideas, your skills, a network that opens doors."), p5Pts: lines("Card 5 points", ["Bring ideas the club hasn’t tried", "Run the social media for an event", "Build skills and a local network"]),
    } },
    { title: "Pull up a chair", fields: {
      tableTitle: f("Heading", "Pull up a chair"), tableSub: long("Introduction", "This is the kind of company you’ll find at lunch. Take one of the free seats."),
      seats: lines("People at the table", ["Retired teacher", "Print shop owner", "Student nurse", "Lifeboat volunteer", "Café owner", "Retired engineer", "Primary school teacher"], { help: "One per line, up to 7. The three free seats are added automatically." }),
      tableNote: f("Line under the table", "Three seats free. Yours?"),
    } },
    { title: "Four facts", fields: {
      fact1: f("Fact 1", "To be confirmed"), fact1Sub: f("Fact 1 label", "Annual membership"),
      fact2: f("Fact 2", "About two hours"), fact2Sub: f("Fact 2 label", "A month, if you want it that way"),
      fact3: f("Fact 3", "Come as you are"), fact3Sub: f("Fact 3 label", "Dress for your day"),
      fact4: f("Fact 4", "Always welcome"), fact4Sub: f("Fact 4 label", "Guests, no strings"),
    } },
    { title: "Photos", fields: photos("Lunch with the club") },
    { title: "Questions and closing panel", fields: {
      faqTitle: f("Questions heading", "Questions people ask"),
      ...panel("Your seat’s waiting.", "It takes ten seconds. Pick a lunch date, tell us your name and email, and someone will be in touch.", "Reserve my seat"),
    } },
  ] },
  funding: { label: "Apply for funding", path: "/funding", groups: [
    { title: "Top of the page", fields: {
      heroTitle: f("Headline", "Funding for local good"),
      heroLead: long("Introduction", "Tell us about your project in three short steps. No account, no jargon, and we save your answers as you go."),
      heroNos: lines("Ticks under the introduction", ["About 5 minutes", "Saved as you type", "Quotes can wait"]),
    } },
    { title: "What we fund", fields: {
      fundTitle: f("Heading", "What we fund"),
      fundSub: long("Introduction", "Registered charities, schools, community groups and non-profits working to benefit people in the Folkestone area. If your idea is somewhere in this list, apply."),
      c1Title: f("Card 1 heading", "Community projects"), c1Text: f("Card 1 text", "Equipment, venue hire, activity programmes"),
      c2Title: f("Card 2 heading", "Schools and young people"), c2Text: f("Card 2 text", "Enterprise days, books, trips, sport"),
      c3Title: f("Card 3 heading", "Health and wellbeing"), c3Text: f("Card 3 text", "Lunch clubs, mental health support"),
      c4Title: f("Card 4 heading", "Families in need"), c4Text: f("Card 4 text", "Starter packs, Christmas support"),
      c5Title: f("Card 5 heading", "Events and heritage"), c5Text: f("Card 5 text", "Festivals, gardens, local history"),
      notTitle: f("“Not a fit” heading", "Usually not a fit"),
      notList: lines("“Not a fit” list", ["Individuals or private businesses", "Running costs on their own", "Political or religious campaigns"]),
      notLink: f("“Not a fit” link", "Not sure? Ask us first."),
    } },
    { title: "What happens after you apply", fields: {
      afterTitle: f("Heading", "What happens after you apply"),
      afterSub: long("Introduction", "Our funding panel reviews each application and you will be told the outcome. The panel confirms the timings."),
      s1: f("Step 1", "Received"), s1Text: f("Step 1 text", "You get a reference by email."),
      s2: f("Step 2", "Read by a panel member"), s2Text: f("Step 2 text", "They may ask a question or two."),
      s3: f("Step 3", "Panel decides"), s3Text: f("Step 3 text", "Approved, declined, or more information needed."),
      s4: f("Step 4", "Funds paid"), s4Text: f("Step 4 text", "Then tell us how it went."),
    } },
    { title: "Photos", fields: photos("Projects we’ve backed") },
    { title: "Grants, questions and closing panel", fields: {
      grantsTitle: f("Recent grants heading", "Recent grants"), faqTitle: f("Questions heading", "Quick answers"),
      ...panel("Got a project in mind?", "It takes about five minutes, and you can stop and come back whenever you like.", "Start my application"),
    } },
  ] },
  contact: { label: "Contact", path: "/contact", groups: [
    { title: "Top of the page", fields: {
      heroTitle: f("Headline", "Say hello"),
      heroLead: long("Introduction", "Questions about membership, funding, events or sponsorship? A real person will reply."),
      glassLabel: f("Box heading", "Fastest ways to reach us"), nextLabel: f("“Next meeting” label", "Next meeting"),
    } },
  ] },
} as const satisfies Record<string, TextPage>;

export type PageKey = keyof typeof PAGE_TEXT;
type Groups<P extends PageKey> = (typeof PAGE_TEXT)[P]["groups"][number];
export type TextKey<P extends PageKey> = Groups<P> extends infer G ? G extends { fields: infer F } ? keyof F & string : never : never;
export type PageText<P extends PageKey> = Record<TextKey<P>, string>;

export const isPageKey = (v: string): v is PageKey => Object.hasOwn(PAGE_TEXT, v);
export const pageTextSlug = (p: PageKey) => `text-${p}`;

/** All fields of a page, flattened. */
export const textFields = (p: PageKey): [string, TextField][] => (PAGE_TEXT[p].groups as readonly TextGroup[]).flatMap((g) => Object.entries(g.fields));

/** Defaults overlaid with saved wording (blank saved values are ignored). */
export function mergeText<P extends PageKey>(p: P, saved: Record<string, unknown> | null | undefined): PageText<P> {
  const out: Record<string, string> = {};
  // The home page once had a single background photo; carry it into the slideshow.
  if (p === "home" && saved && typeof saved.heroPhoto === "string" && saved.heroPhoto && !saved.heroPhotos) saved = { ...saved, heroPhotos: JSON.stringify([{ url: saved.heroPhoto, alt: "" }]) };
  for (const [k, fd] of textFields(p)) {
    const v = saved?.[k];
    out[k] = typeof v === "string" && v.trim() ? v.trim() : fd.def;
  }
  return out as PageText<P>;
}

export interface PagePhoto { url: string; alt: string }
const okUrl = (u: unknown): u is string => typeof u === "string" && /^(https:\/\/|\/)[^\s"'<>]*$/.test(u);

/** Reads a `photos` field. Ignores anything that isn't a list of photos with a safe web address. */
export function readPhotos(v: string | null | undefined): PagePhoto[] {
  if (!v) return [];
  try {
    const list: unknown = JSON.parse(v);
    if (!Array.isArray(list)) return [];
    return list.filter((p) => p && okUrl(p.url)).slice(0, 48).map((p) => ({ url: p.url, alt: typeof p.alt === "string" ? p.alt.trim().slice(0, 300) : "" }));
  } catch { return []; }
}
/** Reads an `image` field: the URL if it is safe to show, otherwise empty. */
export const readImage = (v: string | null | undefined) => (okUrl(v) ? v : "");

/** Turns a one-per-line field into a list, dropping blank lines. */
export const toLines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

/** Fills {meeting}, {venue} and any extra tokens. */
export function fill(s: string, vars: Record<string, string>) {
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
}
