import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_TO = "contact@instinct13.com";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_REQUEST_BYTES = 16 * 1024;

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured.");
    return false;
  }

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error("Turnstile verification returned HTTP", res.status);
      return false;
    }

    const data = (await res.json()) as { success?: unknown };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message, turnstileToken } = body as Record<string, unknown>;

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
  const tokenTrimmed = turnstileToken.trim();

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

  if (!messageTrimmed || messageTrimmed.length > 5000) {
    return NextResponse.json(
      { error: "Message must be between 1 and 5000 characters." },
      { status: 400 },
    );
  }

  if (!tokenTrimmed || tokenTrimmed.length > 4096) {
    return NextResponse.json(
      { error: "Human verification failed. Please try again." },
      { status: 400 },
    );
  }

  if (!(await verifyTurnstile(tokenTrimmed))) {
    return NextResponse.json(
      { error: "Human verification failed. Please try again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(apiKey);
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
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Contact email delivery failed:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
