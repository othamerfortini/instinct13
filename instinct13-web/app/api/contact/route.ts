import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";
const CONTACT_TO = "contact@instinct13.com";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET,
      response: token,
    }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message, turnstileToken } = body as Record<string, unknown>;

  // --- Input validation ---
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof turnstileToken !== "string"
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  const nameTrimmed = name.trim();
  const emailTrimmed = email.trim().toLowerCase();
  const messageTrimmed = message.trim();

  if (!nameTrimmed || nameTrimmed.length > 100) {
    return NextResponse.json(
      { error: "Name must be between 1 and 100 characters." },
      { status: 400 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimmed) || emailTrimmed.length > 254) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (!messageTrimmed || messageTrimmed.length > 5000) {
    return NextResponse.json(
      { error: "Message must be between 1 and 5000 characters." },
      { status: 400 },
    );
  }

  // --- Turnstile verification ---
  const isHuman = await verifyTurnstile(turnstileToken);
  if (!isHuman) {
    return NextResponse.json(
      { error: "Human verification failed. Please try again." },
      { status: 400 },
    );
  }

  // --- Send email via Resend ---
  function escapeHtml(str: string) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const { error } = await resend.emails.send({
    from: "Instinct 13 Contact <noreply@instinct13.com>",
    to: CONTACT_TO,
    replyTo: emailTrimmed,
    subject: `New contact message from ${nameTrimmed}`,
    text: `Name: ${nameTrimmed}\nEmail: ${emailTrimmed}\n\n${messageTrimmed}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(nameTrimmed)}</p>
      <p><strong>Email:</strong> ${escapeHtml(emailTrimmed)}</p>
      <hr />
      <p>${escapeHtml(messageTrimmed).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
