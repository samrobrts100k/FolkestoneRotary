/**
 * Every editable piece of page text, with the wording the site uses until someone changes it in
 * Admin → Page text. Saved wording lives in the `pages` table (slug `text-<page>`, body = JSON of the
 * changed fields only), so an empty box always falls back to the default here.
 *
 * In any field, {meeting} becomes the meeting time ("2nd and 4th Monday…") and {venue} the meeting place,
 * both from lib/site.ts. On Our impact, {amount} becomes the headline figure.
 *
 * `image` fields hold one photo URL; `photos` fields hold a JSON list of { url, alt } (see readPhotos). Both start empty.
 * `panels` fields hold a JSON list of extra panels (see readPanels). `switch` fields are "show" or "hide".
 */
export interface TextField { label: string; def: string; long?: boolean; lines?: boolean; help?: string; kind?: "image" | "photos" | "panels" | "switch" }
export interface TextGroup { title: string; fields: Record<string, TextField> }
export interface TextPage { label: string; path: string; groups: TextGroup[] }

const f = (label: string, def: string, extra: Partial<TextField> = {}): TextField => ({ label, def, ...extra });
const long = (label: string, def: string, extra: Partial<TextField> = {}) => f(label, def, { long: true, ...extra });
const lines = (label: string, def: string[], extra: Partial<TextField> = {}) => f(label, def.join("\n"), { lines: true, help: "One per line.", ...extra });
/** One photo (an `image` field). Not used by any page right now; kept for single-photo slots. */
export const image = (label: string, help?: string): TextField => ({ label, def: "", kind: "image", help });
/** A heading plus a set of photos. Nothing shows on the page until a photo is added. */
const photos = (title: string, help = "Add, remove and reorder photos. The section only appears once it has a photo.") => ({ photosTitle: f("Photos heading", title), photos: { label: "Photos", def: "", kind: "photos", help } as TextField });
/** On/off for a built-in part of a page. */
const show = (label: string): TextField => ({ label, def: "show", kind: "switch" });
type Panel = { ctaShow: TextField; ctaTitle: TextField; ctaText: TextField; ctaBtn: TextField };
function panel(title: string, text: string, b1: string): Panel;
function panel(title: string, text: string, b1: string, b2: string): Panel & { ctaBtn2: TextField };
function panel(title: string, text: string, b1: string, b2?: string) {
  return { ctaShow: show("Show this panel"), ctaTitle: f("Panel heading", title), ctaText: long("Panel text", text), ctaBtn: f("Main button", b1), ...(b2 ? { ctaBtn2: f("Second button", b2) } : {}) };
}

/** Extra panels admins can add to any page: as many as they like, near the top or at the bottom. */
const EXTRA_PANELS: TextField = { label: "Extra panels", def: "", kind: "panels", help: "Add your own panels: a heading, a line of text and up to two buttons. Choose where each one goes and its colour. Nothing shows until you add one." };

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
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
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
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
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
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
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
      evCtaShow: show("Show the gold panel on event pages"), evCtaTitle: f("Gold panel heading", "Help make it happen"), evCtaText: long("Gold panel text", "Put your business on the programme, or give a morning to help it run."),
      evCtaBtn: f("Gold panel button", "Sponsor this event"), evCtaBtn2: f("Gold panel second button", "Volunteer"),
    } },
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
  ] },
  news: { label: "News", path: "/news", groups: [
    { title: "Top of the page", fields: { heroTitle: f("Headline", "News from the club"), heroLead: long("Introduction", "Funding rounds, new members and the odd photo of someone in a hat.") } },
    { title: "Featured story", fields: { featTag: f("Label", "Featured"), featLink: f("Link", "Read the story") } },
    { title: "Each article’s own page", fields: {
      moreTitle: f("“More news” heading", "More from the club"), moreBtn: f("“More news” button", "All news"),
      artCtaShow: show("Show the gold panel on article pages"), artCtaTitle: f("Gold panel heading", "Come to a meeting as our guest"), artCtaText: long("Gold panel text", "{meeting}. At {venue}. No obligation."), artCtaBtn: f("Gold panel button", "Ask to visit"),
    } },
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
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
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
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
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
  ] },
  christmas: { label: "Christmas (Santa’s sleigh)", path: "/christmas", groups: [
    { title: "Top of the page", fields: {
      heroTitle: f("Headline", "Santa’s on his way"),
      heroLead: long("Introduction", "Every December, Santa’s sleigh tours Folkestone with our members collecting for local families. Find out when he’ll reach your street."),
      sleighPhoto: image("Sleigh photo", "Shown above the route finder. Wide photos work best."),
      sleighAlt: f("Describe the sleigh photo", "Santa’s sleigh on a Folkestone street, lit up for Christmas"),
    } },
    { title: "Route finder", fields: {
      finderTitle: f("Heading", "When is Santa coming to my street?"),
      finderNote: long("Line under the heading", "Routes and times are kept up to date by our route team, so this always shows the latest."),
    } },
    { title: "Gold panel (bottom)", fields: panel("Walk with Santa", "Members and friends walk alongside the sleigh, collecting for local families. Join us for an evening.", "Volunteer", "Donate") },
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
  ] },
  forms: { label: "Forms (labels and messages)", path: "/contact", groups: [
    { title: "Used by every form", fields: {
      g_name: f("“Your name” label", "Your name"), g_email: f("“Email” label", "Email"),
      g_nameErr: f("Message when the name is missing", "Please tell us your name."),
      g_emailErr: f("Message when the email isn’t valid", "Enter an email like name@example.com."),
      g_sending: f("Button while sending", "Sending…"),
      g_privacy: f("Link text for the privacy policy", "Privacy Policy"),
      g_wrong: long("If sending fails (connection problem)", "Sorry, something went wrong. Please try again."),
      g_fix: long("If the server finds a problem with the answers", "Please fix the highlighted fields."),
      g_notConnected: long("If the forms aren’t connected to the database", "This form isn't connected yet. Please email us directly."),
      g_saveFailed: long("If saving fails", "Sorry, something went wrong saving your submission. Please try again."),
      g_received: long("Confirmation after sending", "Thank you — your submission has been received."),
    } },
    { title: "Reserve a seat (Join page and home page)", fields: {
      r_doneTitle: f("Heading after reserving", "You’re down for {date}, 12:15", { help: "{date} becomes the lunch they picked." }),
      r_donePts: lines("What happens next", ["Check your inbox for a confirmation.", "Someone will be in touch to arrange your visit.", "Nothing to bring. Come as you are."]),
      r_doneCal: f("“Add to calendar” button", "Add to calendar"), r_doneAsk: f("Second button", "Ask us a question"),
    } },
    { title: "Contact form", fields: {
      c_subjectTitle: f("Heading above the subjects", "What’s it about?"),
      c_msgErr: f("Message when the message is too short", "Write a few words so we can help (10+ characters)."),
      c_consent: long("Line above the button", "By sending you agree to Folkestone Rotary storing your details to reply, as described in the", { help: "The privacy policy link is added at the end." }),
      c_send: f("Send button", "Send message"),
      c_doneTitle: f("Heading after sending", "Message sent"), c_doneText: f("Line after sending", "We’ve emailed you a confirmation."), c_another: f("“Send another” button", "Send another"),
      c_generalWho: f("General Enquiry: who replies", "Anyone on the committee can answer this."), c_generalLabel: f("General Enquiry: message box label", "Your message"),
      c_membershipWho: f("Membership: who replies", "The membership team will reply."), c_membershipLabel: f("Membership: message box label", "Tell us a little about yourself"),
      c_fundingWho: f("Funding: who replies", "The funding panel will point you the right way."), c_fundingLabel: f("Funding: message box label", "Tell us about your project"),
      c_eventsWho: f("Events: who replies", "The events team will get back to you."), c_eventsLabel: f("Events: message box label", "Which event, and how can we help?"),
      c_sponsorshipWho: f("Sponsorship: who replies", "Our sponsorship lead will reply."), c_sponsorshipLabel: f("Sponsorship: message box label", "Tell us about your business"),
      c_mediaWho: f("Media: who replies", "Our media contact will reply."), c_mediaLabel: f("Media: message box label", "What are you working on?"),
      c_otherWho: f("Other: who replies", "We’ll pass it to the right person."), c_otherLabel: f("Other: message box label", "Your message"),
    } },
    { title: "Funding application: step 1 (you)", fields: {
      f_steps: lines("Step names", ["You", "Your project", "The details"], { help: "One per line, three lines." }),
      f_stepOf: f("Step counter", "Step {n} of 3", { help: "{n} becomes the step number." }), f_saved: f("Saved note", "Saved just now"),
      f_welcome: f("Returning visitor greeting", "Welcome back{name}. We kept your answers.", { help: "{name} becomes “, Sam” when we know their name." }), f_restart: f("“Start again” link", "Start again"),
      f_whoQ: f("Question", "Who’s applying?"), f_types: lines("Choices", ["Charity", "School", "Community group", "Something else"], { help: "One per line, four lines. The last one is for people we can’t fund." }),
      f_typeErr: f("Message when nothing is picked", "Please pick who’s applying"),
      f_otherNote: long("Note when “Something else” is picked", "We can’t fund individuals or private businesses, but there may be another way."), f_otherLink: f("Link after that note", "Talk to us."),
      f_org: f("Organisation label", "Group or organisation name"), f_orgErr: f("Message when it’s missing", "Tell us the name of your group."),
      f_phone: f("Phone label", "Phone (optional)"),
      f_next1: f("Button", "Next: your project"), f_fine1: f("Line under the button", "About 5 minutes. Your answers save as you go."),
    } },
    { title: "Funding application: step 2 (your project)", fields: {
      f_title: f("Project name label", "Your project in one line"), f_titleErr: f("Message when it’s missing", "Give your project a short name."),
      f_what: f("Description label", "What will the money do?"), f_whatErr: f("Message when it’s too short", "A couple of sentences is plenty (at least 20 characters)."),
      f_amtQ: f("Amount question", "How much are you asking for?"),
      f_pplQ: f("People question", "Roughly how many people will benefit?"), f_ppl: lines("People choices", ["1 to 10", "11 to 50", "51 to 200", "200 or more"], { help: "One per line, four lines." }),
      f_whoLabel: f("“Who are they?” label", "Who are they? (optional)"),
      f_back: f("Back button", "Back"), f_next2: f("Next button", "Next: the details"),
    } },
    { title: "Funding application: step 3 (the details)", fields: {
      f_whenQ: f("Question", "When do you need the money?"), f_when: lines("Choices", ["Within a month", "In 3 months", "No rush"], { help: "One per line, three lines (about a month, about three months, no date)." }),
      f_quoteQ: f("Files question", "Got a quote or budget?"), f_quoteOpt: f("Note beside it", "Optional, you can send it later"),
      f_drop: f("File box text", "Add files"), f_dropOr: f("File box second part", "or drop them here"), f_remove: f("Remove-file button", "Remove"),
      f_cost: f("Total cost label", "Total project cost, if more than you’re asking for (£)"), f_num: f("Charity number label", "Charity number (optional)"),
      f_extra: f("“Anything else” label", "Anything else we should know? (optional)"),
      f_send: f("Send button", "Send my application"),
      f_consent: long("Line under the button", "By sending you agree to us storing your details to review your application, as described in the", { help: "The privacy policy link is added at the end." }),
    } },
    { title: "Funding application: after sending", fields: {
      f_doneTitle: f("Heading", "Thank you{name}. It’s with us.", { help: "{name} becomes “, Sam”." }), f_ref: f("Reference label", "Your reference:"),
      f_doneText: long("Summary", "You asked for {amount} for {project}. We’ve emailed a confirmation to {email}."),
      f_n1: f("Next step 1", "Received"), f_n1Text: f("Next step 1 text", "Your application is with the funding panel"),
      f_n2: f("Next step 2", "Under review"), f_n2Text: f("Next step 2 text", "A panel member reads it and may be in touch"),
      f_n3: f("Next step 3", "Decision"), f_n3Text: f("Next step 3 text", "You’ll hear from us by email"),
      f_home: f("Home button", "Back to the home page"), f_again: f("Apply again button", "Apply for another project"),
      f_bar: f("Sticky bar text (phones)", "5-minute application"), f_barBtn: f("Sticky bar button", "Continue"),
    } },
    { title: "Newsletter (footer)", fields: {
      n_first: f("First name label", "First Name"), n_last: f("Last name label", "Last Name"),
      n_consent: long("Tick box text", "I agree to Folkestone Rotary storing my details to send me the newsletter, as described in the", { help: "The privacy policy link is added at the end." }),
      n_btn: f("Button", "Subscribe"), n_doneTitle: f("Heading after subscribing", "You're subscribed"), n_doneText: f("Line after subscribing", "You're subscribed — thank you!"),
    } },
  ] },
  contact: { label: "Contact", path: "/contact", groups: [
    { title: "Top of the page", fields: {
      heroTitle: f("Headline", "Say hello"),
      heroLead: long("Introduction", "Questions about membership, funding, events or sponsorship? A real person will reply."),
      glassLabel: f("Box heading", "Fastest ways to reach us"), nextLabel: f("“Next meeting” label", "Next meeting"),
    } },
    { title: "Extra panels", fields: { panels: EXTRA_PANELS } },
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

export type PanelTone = "gold" | "blue" | "navy";
export type PanelWhere = "top" | "bottom";
export interface PagePanel { title: string; text: string; btn: string; href: string; btn2: string; href2: string; where: PanelWhere; tone: PanelTone }
export const PANEL_TONES: [PanelTone, string][] = [["gold", "Gold"], ["blue", "Blue"], ["navy", "Navy"]];
export const PANEL_PLACES: [PanelWhere, string][] = [["bottom", "At the bottom of the page"], ["top", "Under the top section"]];
/** A button link: a page on this site (/join), a full https address, an email (mailto:) or a phone number (tel:). */
export const okLink = (u: unknown): u is string => typeof u === "string" && /^(\/(?!\/)|https:\/\/|mailto:|tel:)[^\s"'<>]*$/.test(u);
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Reads a `panels` field. Keeps panels with a heading; drops buttons without a label or with an unsafe link. */
export function readPanels(v: string | null | undefined): PagePanel[] {
  if (!v) return [];
  let list: unknown;
  try { list = JSON.parse(v); } catch { return []; }
  if (!Array.isArray(list)) return [];
  return list.filter((p) => p && typeof p === "object").map((p) => {
    const btn = str(p.btn, 60), href = str(p.href, 500), btn2 = str(p.btn2, 60), href2 = str(p.href2, 500);
    const ok1 = Boolean(btn && okLink(href)), ok2 = Boolean(btn2 && okLink(href2));
    return {
      title: str(p.title, 120), text: str(p.text, 600),
      btn: ok1 ? btn : "", href: ok1 ? href : "", btn2: ok2 ? btn2 : "", href2: ok2 ? href2 : "",
      where: p.where === "top" ? "top" : "bottom", tone: p.tone === "blue" || p.tone === "navy" ? p.tone : "gold",
    } as PagePanel;
  }).filter((p) => p.title).slice(0, 12);
}

/** Turns a one-per-line field into a list, dropping blank lines. */
export const toLines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

/** Fills {meeting}, {venue} and any extra tokens. */
export function fill(s: string, vars: Record<string, string>) {
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
}
