import { NextResponse } from "next/server";

import { contact } from "@/content";

/**
 * Contact form handler (README §23 — validation, spam protection, rate limiting,
 * secure backend handling).
 *
 * Delivers through Resend's REST API using `fetch` rather than its SDK: one
 * HTTP call does not justify a dependency (CLAUDE.md §35).
 *
 * The route refuses to run unless `RESEND_API_KEY` is set, and the form is not
 * rendered at all in that case — a contact form that silently swallows messages
 * is worse than no form, because the sender believes they have reached someone.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

/*
 * In-memory rate limiting, deliberately. It resets on deploy and is per
 * instance, which is the honest trade for a portfolio: it stops the casual
 * flood a public form attracts without adding Redis. A determined abuser is not
 * the threat model here.
 */
const attempts = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = contact.email;

  if (!apiKey || !to) {
    return NextResponse.json(
      { ok: false, error: "Contact form is not configured." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.company ?? "").trim();

  /*
   * The honeypot field is hidden from people and left empty by them. Bots fill
   * every input they find. Answer 200 so the bot believes it succeeded and does
   * not retry with the field omitted.
   */
  if (honeypot) return NextResponse.json({ ok: true });

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ ok: false, error: "Please give your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: "Please give a valid email." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Please write a message of at least 10 characters." },
      { status: 400 },
    );
  }

  /* Forwarded-for is the only caller identifier available and is not stored. */
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(key)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      /* Replying goes to the sender, not to the site. */
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!response.ok) {
    /* Log for diagnosis; never leak provider detail to the client. */
    console.error("Contact send failed:", response.status, await response.text().catch(() => ""));
    return NextResponse.json(
      { ok: false, error: "Could not send right now. Please email directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
