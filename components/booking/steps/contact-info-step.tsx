"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, User, Mail, Phone, Shield } from "lucide-react"
import { motion } from "framer-motion"
import type { BookingData } from "../multi-step-booking-form"

interface ContactInfoStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  canGoBack: boolean
}

// Simple email validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Simple phone validation (allows various formats)
const isValidPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 10
}

export function ContactInfoStep({
  bookingData,
  updateBookingData,
  onNext,
  onPrevious,
}: ContactInfoStepProps) {
  const [name, setName] = useState(bookingData.name || "")
  const [email, setEmail] = useState(bookingData.email || "")
  const [phone, setPhone] = useState(bookingData.phone || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!isValidPhone(phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      updateBookingData({
        name,
        email,
        phone,
      })
      onNext()
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format phone number as user types
    const value = e.target.value.replace(/\D/g, "")
    let formatted = value

    if (value.length > 0) {
      if (value.length <= 3) {
        formatted = `(${value}`
      } else if (value.length <= 6) {
        formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`
      } else {
        formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
      }
    }

    setPhone(formatted)
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-semibold mb-2">
          Your Contact Information
        </h3>
        <p className="text-muted-foreground">
          How can Allan reach you to discuss your event?
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Full Name
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
            }}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
            }}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(204) 555-1234"
            value={phone}
            onChange={handlePhoneChange}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/50 rounded-lg p-4 flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              Your privacy matters
            </p>
            <p>
              Your information is used only to contact you about your booking
              request. We never share your details with third parties.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue}>
          Review Booking
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
