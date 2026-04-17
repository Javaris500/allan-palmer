"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Send,
  User,
  Mail,
  Phone,
  Music,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const EVENT_TYPES = [
  "Wedding",
  "Ceremony",
  "Ceremony + Cocktail Hour",
  "Cocktail Hour",
  "Corporate Event",
  "Private Party",
  "Gala",
  "Lessons",
  "Other",
];

const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const ALLAN_EMAIL = "palmerar@myumanitoba.ca";

export default function BookingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    preferredTime: "",
    venue: "",
    message: "",
  });
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    // Build a clean, readable plain-text email body. Allan receives this
    // directly from the client's own email address, so he can reply inline.
    const lines: string[] = [
      `Hi Allan,`,
      ``,
      `I'd like to book you for an event. Here are the details:`,
      ``,
      `— Contact —`,
      `Name:  ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      ``,
      `— Event —`,
      `Type:  ${form.eventType}`,
      `Date:  ${form.eventDate}`,
    ];
    if (form.preferredTime) lines.push(`Time:  ${form.preferredTime}`);
    if (form.venue) lines.push(`Venue: ${form.venue}`);
    if (form.message) {
      lines.push(``, `— Additional Details —`, form.message);
    }
    lines.push(``, `Thanks,`, form.name);

    const subject = `Booking Request — ${form.eventType || "Event"} — ${form.eventDate}`;
    const body = lines.join("\n");

    // mailto URL — keep total length under ~1800 chars for broad client support
    const mailtoUrl = `mailto:${ALLAN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the user's default email client
    window.location.href = mailtoUrl;

    // Move to the success state so the user knows what to do next
    setState({ status: "success" });
  }

  function reset() {
    setForm({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      preferredTime: "",
      venue: "",
      message: "",
    });
    setState({ status: "idle" });
  }

  // ──────────────────────────────────────────────
  // Success state — cinematic confirmation
  // ──────────────────────────────────────────────
  if (state.status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(212,168,67,0.08) 0%, transparent 70%)",
          }}
        />
        <motion.div
          className="w-full max-w-lg text-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border border-gold/30 mb-8"
          >
            <CheckCircle2 className="h-10 w-10 text-gold" strokeWidth={1.5} />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-serif font-light text-foreground tracking-wide">
            Almost there.
          </h1>
          <div className="mx-auto w-12 h-px bg-gold/40 mt-5 mb-6" />
          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            Your email app just opened with your request pre-filled. Hit{" "}
            <span className="text-foreground font-medium">Send</span> and Allan
            will receive your booking directly. He&rsquo;ll reach out within
            24&ndash;48 hours.
          </p>

          <div className="mt-10 max-w-sm mx-auto text-xs text-muted-foreground/70 leading-relaxed">
            <p>
              If nothing opened, email Allan directly at{" "}
              <a
                href={`mailto:${ALLAN_EMAIL}`}
                className="text-gold hover:underline"
              >
                {ALLAN_EMAIL}
              </a>
              .
            </p>
          </div>

          <div className="mt-12">
            <button
              onClick={reset}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors border-b border-current pb-1"
            >
              Submit another request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Form state
  // ──────────────────────────────────────────────
  const inputClass =
    "w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 pl-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const iconClass =
    "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none";

  const submitting = state.status === "submitting";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <motion.div
        className="w-full max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/20 mb-5">
            <Calendar className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-2">
            Book Allan Palmer
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Fill out the details below and Allan will get back to you to confirm
            availability.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Contact Info */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className={iconClass} />
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className={inputClass}
                      placeholder="Jane Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className={iconClass} />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        className={inputClass}
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className={iconClass} />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        className={inputClass}
                        placeholder="(204) 555-0100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Section: Event Details */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
                Event Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="eventType" className={labelClass}>
                    Event Type *
                  </label>
                  <div className="relative">
                    <Music className={iconClass} />
                    <select
                      id="eventType"
                      name="eventType"
                      value={form.eventType}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="">Select an event type</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className={labelClass}>
                      Event Date *
                    </label>
                    <div className="relative">
                      <Calendar className={iconClass} />
                      <input
                        id="eventDate"
                        type="date"
                        name="eventDate"
                        value={form.eventDate}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        min={tomorrow}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="preferredTime" className={labelClass}>
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className={iconClass} />
                      <input
                        id="preferredTime"
                        type="time"
                        name="preferredTime"
                        value={form.preferredTime}
                        onChange={handleChange}
                        disabled={submitting}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="venue" className={labelClass}>
                    Venue / Location
                  </label>
                  <div className="relative">
                    <MapPin className={iconClass} />
                    <input
                      id="venue"
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      disabled={submitting}
                      className={inputClass}
                      placeholder="The Fairmont Hotel, Winnipeg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Section: Additional Info */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
                Additional Details
              </h2>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  disabled={submitting}
                  className={`${inputClass} resize-none pt-2.5`}
                  placeholder="Music preferences, special requests, or anything else Allan should know..."
                />
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {state.status === "error" && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{state.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-3.5 rounded-full text-base hover:bg-gold/90 active:scale-[0.98] transition-all mt-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-gray-950/30 border-t-gray-950 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Booking Request
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You&rsquo;ll receive a confirmation reference once submitted.
        </p>
      </motion.div>
    </div>
  );
}
