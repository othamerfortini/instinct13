import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_FROM = "Instinct13 Contact <contact@instinct13.com>";
const CONTACT_TO = "fortini.thamer@gmail.com";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY ?? "";
  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }
  const resend = new Resend(apiKey);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, subject, message, turnstileToken } = body as Record<string, unknown>;

  // --- Input validation ---
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
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
  const subjectTrimmed = subject.trim();
  const messageTrimmed = message.trim();

  if (!nameTrimmed || nameTrimmed.length > 100) {
    return NextResponse.json(
      { error: "Name must be between 1 and 100 characters." },
      { status: 400 },
    );
  }

  const atIdx = emailTrimmed.indexOf("@");
  const domainPart = emailTrimmed.slice(atIdx + 1);
  const isValidEmail =
    atIdx > 0 &&
    atIdx === emailTrimmed.lastIndexOf("@") &&
    domainPart.includes(".") &&
    !domainPart.startsWith(".") &&
    !domainPart.endsWith(".") &&
    emailTrimmed.length <= 254 &&
    !/\s/.test(emailTrimmed);
  if (!isValidEmail) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (!subjectTrimmed || subjectTrimmed.length > 150) {
    return NextResponse.json(
      { error: "Subject must be between 1 and 150 characters." },
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
  const { error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: emailTrimmed,
    subject: `[Instinct13] ${subjectTrimmed}`,
    text: `Name: ${nameTrimmed}\nEmail: ${emailTrimmed}\nSubject: ${subjectTrimmed}\n\n${messageTrimmed}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(nameTrimmed)}</p>
      <p><strong>Email:</strong> ${escapeHtml(emailTrimmed)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subjectTrimmed)}</p>
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
