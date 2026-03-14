"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

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

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = `Booking Inquiry: ${form.eventType} — ${form.name}`;
    const bodyLines = [
      `Hi Allan,`,
      ``,
      `I'd like to book you for an upcoming event. Here are the details:`,
      ``,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Event Type: ${form.eventType}`,
      `Event Date: ${form.eventDate}`,
      form.preferredTime ? `Preferred Time: ${form.preferredTime}` : "",
      form.venue ? `Venue: ${form.venue}` : "",
      ``,
      form.message ? `Additional Details:\n${form.message}` : "",
      ``,
      `Looking forward to hearing from you!`,
    ]
      .filter(Boolean)
      .join("\n");

    const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
    window.location.href = mailtoUrl;
  }

  const inputClass =
    "w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 pl-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const iconClass =
    "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none";

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
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <User className={iconClass} />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Jane Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <div className="relative">
                      <Mail className={iconClass} />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <div className="relative">
                      <Phone className={iconClass} />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="(204) 555-0100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Section: Event Details */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
                Event Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Event Type *</label>
                  <div className="relative">
                    <Music className={iconClass} />
                    <select
                      name="eventType"
                      value={form.eventType}
                      onChange={handleChange}
                      required
                      className={inputClass}
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
                    <label className={labelClass}>Event Date *</label>
                    <div className="relative">
                      <Calendar className={iconClass} />
                      <input
                        type="date"
                        name="eventDate"
                        value={form.eventDate}
                        onChange={handleChange}
                        required
                        min={tomorrow}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Time</label>
                    <div className="relative">
                      <Clock className={iconClass} />
                      <input
                        type="time"
                        name="preferredTime"
                        value={form.preferredTime}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Venue / Location</label>
                  <div className="relative">
                    <MapPin className={iconClass} />
                    <input
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="The Fairmont Hotel, Winnipeg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Section: Additional Info */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
                Additional Details
              </h2>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} resize-none pt-2.5`}
                  placeholder="Music preferences, special requests, or anything else Allan should know..."
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-3.5 rounded-full text-base hover:bg-gold/90 active:scale-[0.98] transition-all mt-2"
            >
              <Send className="h-4 w-4" />
              Send Booking Request
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          This will open your email client with the details pre-filled.
        </p>
      </motion.div>
    </div>
  );
}
