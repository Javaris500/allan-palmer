"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Send } from "lucide-react"

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
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      router.push(
        `/booking/success?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`,
      )
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
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
            Fill out the form below and Allan will be in touch within 24 hours.
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-3 rounded-full text-base hover:bg-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Sending..." : "Send Booking Request"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
