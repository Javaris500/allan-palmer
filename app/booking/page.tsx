"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Send } from "lucide-react"
import { CONTACT_INFO } from "@/lib/constants"

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Private Party",
  "Ceremony",
  "Gala",
  "Other",
]

const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

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
  })

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const subject = `Booking Inquiry: ${form.eventType} — ${form.name}`
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
      .join("\n")

    const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`
    window.location.href = mailtoUrl
  }

  const inputClass =
    "w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Calendar className="mx-auto h-8 w-8 text-gold mb-4" />
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-2">
            Book Allan Palmer
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to send Allan a booking request directly via email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email *
            </label>
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="+1 (204) 555-0100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Event Type *
            </label>
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Event Date *
            </label>
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Preferred Time
            </label>
            <select
              name="preferredTime"
              value={form.preferredTime}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select a preferred time (optional)</option>
              <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
              <option value="Afternoon (12 PM – 5 PM)">Afternoon (12 PM – 5 PM)</option>
              <option value="Evening (5 PM – 9 PM)">Evening (5 PM – 9 PM)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">Allan will confirm his availability after receiving your request.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Venue / Location
            </label>
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              className={inputClass}
              placeholder="The Fairmont Hotel, Winnipeg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Message / Additional Details
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Tell Allan about your event, music preferences, or any special requests..."
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-3 rounded-full text-base hover:bg-gold/90 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Booking Request
          </button>
        </form>
      </motion.div>
    </div>
  )
}
