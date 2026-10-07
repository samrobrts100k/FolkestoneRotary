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
    when: "2nd and 4th Monday of each month, 12:15–12:45pm",
    short: "2nd and 4th Mondays, 12:15",
    venue: "The Burlington Hotel",
    address: "3-5 Earls Avenue, Folkestone",
    postcode: "CT20 2HR",
  },
  social: {
    facebook: "https://www.facebook.com/folkestonerotary", // placeholder – confirm
    instagram: "https://www.instagram.com/folkestonerotary", // placeholder – confirm
    linkedin: "https://www.linkedin.com/company/folkestone-rotary", // placeholder – confirm
  },
  donateUrl: process.env.NEXT_PUBLIC_DONATE_URL || "",
  donateMonthlyUrl: process.env.NEXT_PUBLIC_DONATE_MONTHLY_URL || "",
  /**
   * Home hero film. Add 1–6 short, silent clips (e.g. "/video/race-night.mp4" in /public) and they play as a
   * looping montage behind the headline. Leave empty to show the plain colour background.
   */
  heroVideos: [] as string[],
  /** "Watch the full film" button: a YouTube/Vimeo embed URL or an .mp4. Leave empty to hide the button. */
  filmUrl: "",
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
