import { business } from "@/lib/business";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

/**
 * Sends a contact-form enquiry to the shop. Without RESEND_API_KEY the message
 * is logged to the server console instead — enough to develop against, and the
 * visitor still sees the success state.
 */
export async function sendContactMessage(msg: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || business.email;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.info(
      `[contact] RESEND_API_KEY not set — message not sent.\n  to: ${to}\n  from: ${msg.name} <${msg.email}>\n  message: ${msg.message}`,
    );
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `${business.name} website <${from}>`,
    to: [to],
    replyTo: msg.email,
    subject: `Website enquiry from ${msg.name}`,
    text: `${msg.message}\n\n—\nFrom: ${msg.name} <${msg.email}>\nSent from the ${business.name} website contact form.`,
  });

  if (error) throw new Error(error.message || "The message could not be sent.");
}
