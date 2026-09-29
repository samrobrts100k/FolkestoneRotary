import { site } from "../site";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#F5F7FA;font-family:Arial,sans-serif;color:#0B1F3A">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
<table width="600" style="max-width:100%;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#005DAA;padding:20px 28px;color:#fff;font-size:20px;font-weight:bold">${esc(site.name)}</td></tr>
<tr><td style="padding:28px"><h1 style="font-size:22px;margin:0 0 16px">${esc(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="background:#F5F7FA;padding:16px 28px;font-size:12px;color:#5B6B80">${esc(site.name)} · ${esc(site.meeting.address)}<br>You are receiving this because you contacted us via ${esc(site.url)}.</td></tr>
</table></td></tr></table></body></html>`;
}
const p = (t: string) => `<p style="line-height:1.6;margin:0 0 12px">${t}</p>`;
type Out = { subject: string; html: string };

export const templates = {
  contactConfirmation: (d: { name: string }): Out => ({
    subject: "We've received your message",
    html: layout("Thanks for getting in touch", p(`Hi ${esc(d.name)},`) + p("Thank you for contacting Folkestone Rotary. A member of the club will reply as soon as possible.")),
  }),
  membershipConfirmation: (d: { name: string }): Out => ({
    subject: "Thanks for your interest in Folkestone Rotary",
    html: layout("Welcome!", p(`Hi ${esc(d.name)},`) + p("Thank you for your membership enquiry. Someone from the club will be in touch shortly to invite you to a meeting as our guest.")),
  }),
  fundingConfirmation: (d: { name: string; organisation: string; project: string; reference: string }): Out => ({
    subject: `Funding application received – ${d.project}`,
    html: layout("Application received", p(`Hi ${esc(d.name)},`) + p(`We've received the application from <strong>${esc(d.organisation)}</strong> for <strong>${esc(d.project)}</strong>.`) + p(`Your reference is <strong>${esc(d.reference)}</strong>. The funding panel will review it and contact you about next steps.`)),
  }),
  eventRegistrationConfirmation: (d: { name: string; event: string; when: string }): Out => ({
    subject: `You're registered: ${d.event}`,
    html: layout("Registration confirmed", p(`Hi ${esc(d.name)},`) + p(`You're registered for <strong>${esc(d.event)}</strong> on ${esc(d.when)}. We look forward to seeing you.`)),
  }),
  newsletterConfirmation: (d: { name: string }): Out => ({
    subject: "You're subscribed to Folkestone Rotary news",
    html: layout("Thanks for subscribing", p(`Hi ${esc(d.name)},`) + p("You'll now receive news about our events and community projects. You can unsubscribe at any time by replying to any email.")),
  }),
  donationThanks: (d: { name: string }): Out => ({
    subject: "Thank you for your donation",
    html: layout("Thank you", p(`Hi ${esc(d.name)},`) + p("Thank you for supporting Folkestone Rotary. Every donation helps local people and community projects.")),
  }),
  adminNotification: (d: { kind: string; fields: Record<string, string> }): Out => ({
    subject: `New ${d.kind} via the website`,
    html: layout(`New ${d.kind}`, `<table cellpadding="6" style="font-size:14px">${Object.entries(d.fields).map(([k, v]) => `<tr><td style="color:#5B6B80;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>`),
  }),
};
