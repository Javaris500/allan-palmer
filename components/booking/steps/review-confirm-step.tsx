"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Mail,
  Phone,
  Music,
  Loader2,
  Edit2,
} from "lucide-react"
import { motion } from "framer-motion"
import type { BookingData } from "../multi-step-booking-form"

interface ReviewConfirmStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onPrevious: () => void
  onSubmit: () => void
  isSubmitting: boolean
  canGoBack: boolean
}

const serviceLabels: Record<string, string> = {
  weddings: "Wedding Services",
  private: "Private Functions",
  lessons: "Violin Lessons",
}

const serviceTypeLabels: Record<string, string> = {
  ceremony: "Ceremony Only",
  "ceremony-cocktail": "Ceremony + Cocktail Hour",
  "full-wedding": "Full Wedding Package",
  "dinner-party": "Dinner Party",
  celebration: "Special Celebration",
  memorial: "Memorial Service",
  corporate: "Corporate Event",
  single: "Single Lesson",
  monthly: "Monthly Package",
  intensive: "Intensive Program",
}

const timeSlotLabels: Record<string, string> = {
  morning: "Morning (9:00 AM - 12:00 PM)",
  afternoon: "Afternoon (12:00 PM - 5:00 PM)",
  evening: "Evening (5:00 PM - 9:00 PM)",
}

export function ReviewConfirmStep({
  bookingData,
  onPrevious,
  onSubmit,
  isSubmitting,
}: ReviewConfirmStepProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "Not specified"
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const sections = [
    {
      title: "Service Details",
      icon: Music,
      items: [
        {
          label: "Service Type",
          value: bookingData.service
            ? serviceLabels[bookingData.service] || bookingData.service
            : "Not selected",
        },
        {
          label: "Package",
          value: bookingData.serviceType
            ? serviceTypeLabels[bookingData.serviceType] || bookingData.serviceType
            : "Not selected",
        },
      ],
    },
    {
      title: "Date & Time",
      icon: Calendar,
      items: [
        {
          label: "Event Date",
          value: formatDate(bookingData.date),
          icon: Calendar,
        },
        {
          label: "Preferred Time",
          value: bookingData.timeSlot
            ? timeSlotLabels[bookingData.timeSlot]
            : "Not specified",
          icon: Clock,
        },
      ],
    },
    {
      title: "Event Details",
      icon: MapPin,
      items: [
        {
          label: "Location",
          value: bookingData.location || "Not specified",
          icon: MapPin,
        },
        {
          label: "Estimated Guests",
          value: bookingData.numberOfAttendees
            ? `${bookingData.numberOfAttendees} guests`
            : "Not specified",
          icon: Users,
        },
      ],
    },
    {
      title: "Contact Information",
      icon: User,
      items: [
        {
          label: "Name",
          value: bookingData.name || "Not provided",
          icon: User,
        },
        {
          label: "Email",
          value: bookingData.email || "Not provided",
          icon: Mail,
        },
        {
          label: "Phone",
          value: bookingData.phone || "Not provided",
          icon: Phone,
        },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-semibold mb-2">
          Review Your Booking Request
        </h3>
        <p className="text-muted-foreground">
          Please confirm all details are correct before submitting
        </p>
      </div>

      {/* Review Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium text-sm">{item.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Special Requests */}
      {bookingData.specialRequests && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Special Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {bookingData.specialRequests}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-4"
      >
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Edit2 className="w-4 h-4 text-primary" />
          What happens next?
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Allan will review your request within 24-48 hours</li>
          <li>• You&apos;ll receive a confirmation email with availability</li>
          <li>• Pricing details and contract will be provided</li>
          <li>• A deposit secures your date</li>
        </ul>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="gold"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[180px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </Button>
      </div>
    </div>
  )
}
