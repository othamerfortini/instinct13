"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { clsx } from "clsx";

type FormState = "idle" | "loading" | "success" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!turnstileToken) {
      setErrorMessage("Please complete the human verification.");
      setFormState("error");
      return;
    }

    setFormState("loading");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
      turnstileToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setErrorMessage(
          json.error ?? "Something went wrong. Please try again.",
        );
        setFormState("error");
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }

      setFormState("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setFormState("error");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-lg font-medium text-neutral-200">
          Message received.
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          We&apos;ll be in touch at the email you provided.
        </p>
      </div>
    );
  }

  const isLoading = formState === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-300"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          disabled={isLoading}
          className={clsx(
            "w-full rounded-md border bg-white/5 px-4 py-3",
            "text-sm text-neutral-200 placeholder-neutral-600",
            "border-white/10 focus:border-white/30 focus:outline-none",
            "transition-colors duration-150",
            "disabled:opacity-50",
          )}
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          disabled={isLoading}
          className={clsx(
            "w-full rounded-md border bg-white/5 px-4 py-3",
            "text-sm text-neutral-200 placeholder-neutral-600",
            "border-white/10 focus:border-white/30 focus:outline-none",
            "transition-colors duration-150",
            "disabled:opacity-50",
          )}
          placeholder="you@example.com"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-neutral-300"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          disabled={isLoading}
          rows={6}
          className={clsx(
            "w-full resize-y rounded-md border bg-white/5 px-4 py-3",
            "text-sm text-neutral-200 placeholder-neutral-600",
            "border-white/10 focus:border-white/30 focus:outline-none",
            "transition-colors duration-150",
            "disabled:opacity-50",
          )}
          placeholder="Your message"
        />
      </div>

      {/* Turnstile */}
      <Turnstile
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
        options={{ theme: "dark" }}
      />

      {/* Error */}
      {formState === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={clsx(
          "inline-flex items-center gap-2 rounded-md px-6 py-3",
          "text-sm font-medium text-white",
          "border border-white/20 bg-white/10",
          "hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2",
          "transition-colors duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {isLoading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
