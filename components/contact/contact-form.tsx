"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Loader2,
  Check,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar as CalendarIcon,
  Music,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FormData {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  message: string
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  message: "",
}

const eventTypes = [
  "Wedding",
  "Corporate Event",
  "Private Party",
  "Concert",
  "Lesson Inquiry",
  "Other",
]

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please tell us about your event"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to send")

      setIsSuccess(true)
      setFormData(initialFormData)
    } catch (error) {
      console.error("Contact form error:", error)
      setErrors({ message: "Something went wrong. Please try again or contact us directly." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="h-10 w-10 text-gold" />
        </motion.div>
        <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3 text-foreground">
          Thank You!
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Your message has been sent successfully. Allan will get back to you within 24-48 hours.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="border-gold/30 text-gold hover:bg-gold/10"
        >
          Send Another Message
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Get in Touch
        </h2>
        <p className="text-muted-foreground">
          Fill out the form below and Allan will respond within 24-48 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-gold" />
            Full Name <span className="text-gold">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className={cn(
              "bg-background dark:bg-black border-gold/20 focus:border-gold",
              errors.name && "border-red-500 focus:border-red-500"
            )}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm"
              >
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" />
              Email Address <span className="text-gold">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              className={cn(
                "bg-background dark:bg-black border-gold/20 focus:border-gold",
                errors.email && "border-red-500 focus:border-red-500"
              )}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(204) 555-1234"
              className={cn(
                "bg-background dark:bg-black border-gold/20 focus:border-gold",
                errors.phone && "border-red-500 focus:border-red-500"
              )}
            />
            <AnimatePresence>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm"
                >
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Event Type & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-foreground flex items-center gap-2">
              <Music className="h-4 w-4 text-gold" />
              Event Type
            </Label>
            <select
              id="eventType"
              value={formData.eventType}
              onChange={(e) => handleChange("eventType", e.target.value)}
              className="flex h-10 w-full rounded-md border bg-background dark:bg-black border-gold/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select event type...</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate" className="text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gold" />
              Event Date
            </Label>
            <Input
              id="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleChange("eventDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-background dark:bg-black border-gold/20 focus:border-gold"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gold" />
            Tell Us About Your Event <span className="text-gold">*</span>
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Please share any details about your event, musical preferences, or special requests..."
            rows={5}
            className={cn(
              "resize-none bg-background dark:bg-black border-gold/20 focus:border-gold",
              errors.message && "border-red-500 focus:border-red-500"
            )}
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm"
              >
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold hover:bg-gold/90 text-black font-medium py-6 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting this form, you agree to be contacted by Allan Palmer regarding your inquiry.
        </p>
      </form>
    </div>
  )
}
