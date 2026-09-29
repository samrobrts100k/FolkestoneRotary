import "server-only";

export interface EmailMessage { to: string | string[]; subject: string; html: string; replyTo?: string }
export interface EmailProvider { send(msg: EmailMessage): Promise<void> }

class ResendProvider implements EmailProvider {
  constructor(private apiKey: string, private from: string) {}
  async send({ to, subject, html, replyTo }: EmailMessage) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: this.from, to, subject, html, reply_to: replyTo }),
    });
    if (!res.ok) throw new Error(`Resend error ${res.status}`);
  }
}

/** Used in local dev when no provider is configured: logs instead of sending. */
class ConsoleProvider implements EmailProvider {
  async send({ to, subject }: EmailMessage) { console.info(`[email:dev] to=${to} subject="${subject}"`); }
}

export function getEmailProvider(): EmailProvider {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Folkestone Rotary <noreply@example.org>";
  return key ? new ResendProvider(key, from) : new ConsoleProvider();
}

/** Email failures must never break a form submission. */
export async function sendSafely(msg: EmailMessage) {
  try { await getEmailProvider().send(msg); } catch (e) { console.error("[email] failed", e); }
}
