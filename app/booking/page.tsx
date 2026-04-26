"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_INFO } from "@/lib/constants";
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
  | { status: "error"; message: string };

export default function BookingPage() {
  const router = useRouter();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    try {
      // Persist the booking so it shows up in /admin/bookings. Delivery to
      // Allan happens via mailto below — the customer's own mail client
      // sends the email so it lands in Allan's inbox from their address.
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json().catch(() => null)) as
        | { success: true; reference: string }
        | { error: string }
        | null;

      if (!res.ok || !data || !("success" in data)) {
        const message =
          (data && "error" in data && data.error) ||
          "Something went wrong. Please try again.";
        setState({ status: "error", message });
        return;
      }

      // Open the user's mail client with the booking details pre-filled.
      const lines: string[] = [
        `Hi Allan,`,
        ``,
        `I'd like to book you for an event. Here are the details:`,
        ``,
        `— Reference —`,
        data.reference,
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

      const subject = `Booking Request — ${form.eventType || "Event"} — ${form.eventDate} (${data.reference})`;
      const body = lines.join("\n");
      const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Fire the mail handler, then navigate. Giving the mailto a tick
      // before router.push prevents browsers from cancelling the handler
      // as the app navigates. The success page also carries the mailto
      // URL so the user has a visible fallback button if no mail client
      // was registered.
      window.location.href = mailtoUrl;

      const params = new URLSearchParams({
        ref: data.reference,
        email: form.email,
        mailto: mailtoUrl,
      });
      setTimeout(() => {
        router.push(`/booking/success?${params.toString()}`);
      }, 150);
    } catch {
      setState({
        status: "error",
        message:
          "Couldn't reach the server. Please check your connection and try again.",
      });
    }
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
