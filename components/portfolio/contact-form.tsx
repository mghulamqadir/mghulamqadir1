"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "delayed" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("sending");
    setError("");

    const form = new FormData(formElement);

    // Honeypot check on client
    if (form.get("website")) {
      setState("success");
      formElement.reset();
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });

      if (response.ok) {
        const body = await response.json().catch(() => null);
        formElement.reset();
        if (body?.delivery === "failed") {
          setState("delayed");
        } else {
          setState("success");
        }
      } else {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Unable to send your message. Please try again or email directly.");
        setState("error");
      }
    } catch {
      setError("Network connection issue. Please check your network or email directly.");
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {/* Name & Email inputs in 2 columns */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-xs font-mono uppercase tracking-wider text-text font-medium">
            Full Name <span className="text-accent">*</span>
          </label>
          <Input
            id="contact-name"
            required
            name="name"
            placeholder="Alex Morgan"
            autoComplete="name"
            error={state === "error"}
            aria-invalid={state === "error"}
            aria-describedby={state === "error" ? "form-error-msg" : undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-text font-medium">
            Email Address <span className="text-accent">*</span>
          </label>
          <Input
            id="contact-email"
            required
            type="email"
            name="email"
            placeholder="alex@company.com"
            autoComplete="email"
            error={state === "error"}
            aria-invalid={state === "error"}
            aria-describedby={state === "error" ? "form-error-msg" : undefined}
          />
        </div>
      </div>

      {/* Subject input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-subject" className="text-xs font-mono uppercase tracking-wider text-text font-medium">
          Subject <span className="text-accent">*</span>
        </label>
        <Input
          id="contact-subject"
          required
          name="subject"
          placeholder="Backend Architecture Consultation / Project Ingestion"
          error={state === "error"}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "form-error-msg" : undefined}
        />
      </div>

      {/* Message textarea */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-text font-medium">
          Message <span className="text-accent">*</span>
        </label>
        <Textarea
          id="contact-message"
          required
          name="message"
          rows={6}
          placeholder="Tell me about your technical requirements, architecture bottlenecks, or timeline..."
          error={state === "error"}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "form-error-msg" : undefined}
        />
      </div>

      {/* Honeypot field (hidden from sight and assistive tech) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          type="text"
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Polite Live Region for Status Feedback */}
      <div role="status" aria-live="polite">
        {state === "success" && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Message received successfully. I will review and reply within 24 hours.</span>
          </div>
        )}

        {state === "delayed" && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            <Clock className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Your message was securely saved. Email dispatch is queued and will arrive shortly.</span>
          </div>
        )}

        {state === "error" && (
          <div
            id="form-error-msg"
            role="alert"
            aria-live="assertive"
            className="flex items-center gap-2.5 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={state === "sending"}
        className="w-full sm:w-auto min-h-[48px] px-8 text-sm font-semibold"
      >
        <Send className="w-4 h-4 mr-2" aria-hidden="true" />
        <span>{state === "sending" ? "Sending message…" : "Send message"}</span>
      </Button>
    </form>
  );
}
