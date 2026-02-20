"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, MapPin, Users, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import type { BookingData } from "../multi-step-booking-form"

interface EventDetailsStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  canGoBack: boolean
}

export function EventDetailsStep({
  bookingData,
  updateBookingData,
  onNext,
  onPrevious,
}: EventDetailsStepProps) {
  const [location, setLocation] = useState(bookingData.location || "")
  const [attendees, setAttendees] = useState(
    bookingData.numberOfAttendees?.toString() || ""
  )
  const [specialRequests, setSpecialRequests] = useState(
    bookingData.specialRequests || ""
  )

  const handleContinue = () => {
    updateBookingData({
      location,
      numberOfAttendees: attendees ? parseInt(attendees, 10) : undefined,
      specialRequests,
    })
    onNext()
  }

  const isValid = location.trim().length > 0

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-semibold mb-2">
          Tell us about your event
        </h3>
        <p className="text-muted-foreground">
          Help us prepare the perfect musical experience
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Event Location
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            placeholder="Venue name or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">
            e.g., &quot;Fort Garry Hotel, Winnipeg&quot; or &quot;Private
            Residence - Address TBD&quot;
          </p>
        </motion.div>

        {/* Number of Attendees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="attendees" className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Estimated Number of Guests
          </Label>
          <Input
            id="attendees"
            type="number"
            placeholder="Approximate guest count"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            min={1}
            max={1000}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">
            This helps Allan prepare the appropriate sound setup
          </p>
        </motion.div>

        {/* Special Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="requests" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Special Requests or Song Requests
          </Label>
          <Textarea
            id="requests"
            placeholder="Any specific songs, themes, or requirements?"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Let us know about specific songs, cultural traditions, or any other
            preferences
          </p>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/50 rounded-lg p-4"
        >
          <h4 className="font-medium mb-2">💡 Quick Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Allan specializes in classical, jazz, and contemporary music</li>
            <li>• Popular wedding songs include &quot;Canon in D&quot;, &quot;A Thousand Years&quot;</li>
            <li>• Special cultural or traditional music can be arranged in advance</li>
          </ul>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!isValid}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
