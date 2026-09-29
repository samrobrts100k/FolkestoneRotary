/** Club-wide details. All values marked `placeholder` must be confirmed by the club. */
export const site = {
  name: "Folkestone Rotary",
  tagline: "Making a Difference in Folkestone",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Folkestone Rotary brings local people together to support charities, young people and community projects across Folkestone.",
  email: "info@folkestonerotary.org", // placeholder
  phone: "01303 000000", // placeholder
  meeting: {
    when: "Every Tuesday, 12:30pm", // placeholder
    venue: "Meeting venue to be confirmed", // placeholder
    address: "Folkestone, Kent",
    postcode: "CT20 1AA", // placeholder
  },
  social: {
    facebook: "https://www.facebook.com/folkestonerotary", // placeholder – confirm
    instagram: "https://www.instagram.com/folkestonerotary", // placeholder – confirm
    linkedin: "https://www.linkedin.com/company/folkestone-rotary", // placeholder – confirm
  },
  donateUrl: process.env.NEXT_PUBLIC_DONATE_URL || "",
  donateMonthlyUrl: process.env.NEXT_PUBLIC_DONATE_MONTHLY_URL || "",
  sponsorshipPackUrl: "/downloads/sponsorship-pack.pdf", // replace with an uploaded PDF
} as const;

/** Where the Donate buttons go: the external donation site once configured, otherwise our /donate info page. */
export const donateHref = site.donateUrl || "/donate";
export const donateExternal = Boolean(site.donateUrl);

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/impact", label: "Our Impact" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/join", label: "Join Rotary" },
  { href: "/funding", label: "Apply for Funding" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLegal = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/accessibility", label: "Accessibility Statement" },
  { href: "/terms", label: "Terms" },
] as const;
