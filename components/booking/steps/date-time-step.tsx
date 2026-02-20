"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { BookingData } from "../multi-step-booking-form"

interface DateTimeStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  canGoBack: boolean
}

const timeSlots = [
  { id: "morning", label: "Morning", time: "9:00 AM - 12:00 PM", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM - 5:00 PM", icon: "☀️" },
  { id: "evening", label: "Evening", time: "5:00 PM - 9:00 PM", icon: "🌆" },
]

export function DateTimeStep({
  bookingData,
  updateBookingData,
  onNext,
  onPrevious,
}: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date
  )
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(
    bookingData.timeSlot
  )

  // Disable dates in the past and within 2 weeks
  const disabledDays = useMemo(() => {
    const today = new Date()
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(today.getDate() + 14)
    return { before: twoWeeksFromNow }
  }, [])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (timeSlotId: string) => {
    setSelectedTimeSlot(timeSlotId)
  }

  const handleContinue = () => {
    updateBookingData({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    })
    onNext()
  }

  const isValid = selectedDate && selectedTimeSlot

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-semibold mb-2">
          When is your event?
        </h3>
        <p className="text-muted-foreground">
          Select a date at least 2 weeks in advance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="flex justify-center">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-md"
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </Card>
        </div>

        {/* Time Slots */}
        <div>
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Preferred Time
          </h4>
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <motion.div
                key={slot.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedTimeSlot === slot.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => handleTimeSelect(slot.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <span className="text-2xl">{slot.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{slot.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {slot.time}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 transition-colors",
                        selectedTimeSlot === slot.id
                          ? "border-primary bg-primary"
                          : "border-muted"
                      )}
                    >
                      {selectedTimeSlot === slot.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Selected Summary */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-muted/50 rounded-lg"
            >
              <p className="text-sm text-muted-foreground">Selected Date:</p>
              <p className="font-medium">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          )}
        </div>
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
