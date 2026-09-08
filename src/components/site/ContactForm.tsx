"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/(site)/visit/actions";

const initialState: ContactState = { status: "idle" };

const fieldClass =
  "mt-2 w-full border border-line bg-cream px-4 py-3 text-base text-charcoal transition-colors placeholder:text-charcoal-muted/60 focus:border-gold focus:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex min-h-12 items-center justify-center bg-charcoal px-8 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-rose-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border border-gold/50 bg-blush px-6 py-10 text-center"
      >
        <h3 className="text-2xl">Thank you</h3>
        <p className="mx-auto mt-3 max-w-sm text-charcoal-muted">
          Your message is on its way to the shop. We will come back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5">
      {state.message && (
        <p role="alert" className="border-l-2 border-rose-dark bg-blush px-4 py-3 text-sm">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="contact-name" className="eyebrow">
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          aria-invalid={Boolean(state.errors?.name)}
          aria-describedby={state.errors?.name ? "contact-name-error" : undefined}
          className={fieldClass}
        />
        {state.errors?.name && (
          <p id="contact-name-error" className="mt-1.5 text-sm text-rose-dark">
            {state.errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="eyebrow">
          Email address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={state.errors?.email ? "contact-email-error" : undefined}
          className={fieldClass}
        />
        {state.errors?.email && (
          <p id="contact-email-error" className="mt-1.5 text-sm text-rose-dark">
            {state.errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="eyebrow">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          defaultValue={state.values?.message}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "contact-message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
        {state.errors?.message && (
          <p id="contact-message-error" className="mt-1.5 text-sm text-rose-dark">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
    </form>
  );
}
