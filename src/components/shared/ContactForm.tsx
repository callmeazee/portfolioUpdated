"use client";

import { useState } from "react";

/**
 * Contact form.
 *
 * Only rendered when the server reports a configured mail provider — see
 * `/contact`. A form that accepts a message and quietly drops it is worse than
 * no form, because the sender leaves believing they have been in touch.
 *
 * ACCESSIBILITY: real labels bound to inputs, `aria-invalid` and `aria-describedby`
 * on failure, and the result announced through a live region so a screen-reader
 * user learns the outcome without hunting for it.
 */
export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setState("sending");
    setError(null);

    const data = Object.fromEntries(new FormData(formEvent.currentTarget));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setError(result.error ?? "Could not send. Please email directly.");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setError("Could not send. Please email directly.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p role="status" className="rounded-md border border-border bg-surface-secondary p-md text-body-m">
        Thanks — your message is on its way. I&rsquo;ll reply to the address you gave.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-[42rem] gap-md">
      <div className="grid gap-xs">
        <label htmlFor="name" className="text-body-s font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className="rounded-md border border-border bg-surface px-sm py-xs text-body-m"
        />
      </div>

      <div className="grid gap-xs">
        <label htmlFor="email" className="text-body-s font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className="rounded-md border border-border bg-surface px-sm py-xs text-body-m"
        />
      </div>

      <div className="grid gap-xs">
        <label htmlFor="message" className="text-body-s font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          aria-invalid={state === "error" || undefined}
          aria-describedby={state === "error" ? "contact-error" : undefined}
          className="rounded-md border border-border bg-surface px-sm py-xs text-body-m"
        />
      </div>

      {/*
        Honeypot: hidden from people, irresistible to bots. `tabIndex={-1}` and
        `aria-hidden` keep it out of the keyboard and screen-reader paths, so it
        traps scripts without ever reaching a real visitor.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-md">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-md bg-accent px-md py-sm text-body-s font-medium text-accent-foreground disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send message"}
        </button>

        <p className="text-body-s text-muted">
          or email{" "}
          <a href={`mailto:${email}`} className="underline">
            {email}
          </a>
        </p>
      </div>

      {/* Announced to assistive technology as soon as it appears. */}
      <p id="contact-error" role="alert" className="min-h-[1.5rem] text-body-s text-danger">
        {error ?? ""}
      </p>
    </form>
  );
}
