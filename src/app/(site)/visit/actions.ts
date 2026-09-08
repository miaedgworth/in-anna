"use server";

import { z } from "zod";
import { sendContactMessage } from "@/lib/email";

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  email: z.string().trim().email("Please check your email address."),
  message: z.string().trim().min(10, "Please write a little more.").max(4000),
  // Honeypot: a real person never fills this in.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; message: string };
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = schema.safeParse({ ...values, website: formData.get("website") ?? "" });

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "message") {
        errors[field] ??= issue.message;
      }
    }
    // A filled honeypot fails validation with no field errors — accept it
    // silently rather than telling a bot it was caught.
    if (Object.keys(errors).length === 0) return { status: "success" };
    return { status: "error", errors, values };
  }

  try {
    await sendContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return { status: "success" };
  } catch (error) {
    console.error("[contact] send failed:", error);
    return {
      status: "error",
      message:
        "Sorry — the message could not be sent just now. Please ring the shop or email us directly.",
      values,
    };
  }
}
