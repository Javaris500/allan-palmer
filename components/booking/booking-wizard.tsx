"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressStepper } from "./progress-stepper"
import { ServiceSelectionStep } from "./steps/service-selection-step"
import { DateTimeStep } from "./steps/date-time-step"
import { EventDetailsStep } from "./steps/event-details-step"
import { ContactInfoStep } from "./steps/contact-info-step"
import { ReviewConfirmStep } from "./steps/review-confirm-step"
import { BookingData, initialBookingData } from "./multi-step-booking-form"
import { CONTACT_INFO } from "@/lib/constants"

const steps = [
  { id: "service", title: "Service", description: "Choose your service" },
  { id: "datetime", title: "Date & Time", description: "Pick your date" },
  { id: "details", title: "Event Details", description: "Tell us more" },
  { id: "contact", title: "Contact", description: "Your information" },
  { id: "review", title: "Review", description: "Confirm booking" },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
}

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }, [])

  const goToNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep])

  const goToPrevious = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex <= currentStep) {
      setDirection(stepIndex > currentStep ? 1 : -1)
      setCurrentStep(stepIndex)
    }
  }, [currentStep])

  const handleSubmit = () => {
    const eventDate = bookingData.date
      ? bookingData.date.toLocaleDateString()
      : "Not specified"

    const subject = `Booking Inquiry: ${bookingData.service || "Event"} — ${bookingData.name || "Guest"}`
    const bodyLines = [
      `Hi Allan,`,
      ``,
      `I'd like to book you for an upcoming event. Here are the details:`,
      ``,
      `Name: ${bookingData.name || ""}`,
      `Email: ${bookingData.email || ""}`,
      `Phone: ${bookingData.phone || ""}`,
      `Service: ${bookingData.service || ""}`,
      bookingData.serviceType ? `Service Type: ${bookingData.serviceType}` : "",
      `Date: ${eventDate}`,
      bookingData.timeSlot ? `Time: ${bookingData.timeSlot}` : "",
      bookingData.location ? `Location: ${bookingData.location}` : "",
      bookingData.numberOfAttendees
        ? `Number of Attendees: ${bookingData.numberOfAttendees}`
        : "",
      ``,
      bookingData.message ? `Message:\n${bookingData.message}` : "",
      bookingData.specialRequests
        ? `Special Requests:\n${bookingData.specialRequests}`
        : "",
      ``,
      `Looking forward to hearing from you!`,
    ]
      .filter(Boolean)
      .join("\n")

    const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`
    window.location.href = mailtoUrl
    setIsComplete(true)
  }

  const resetWizard = () => {
    setCurrentStep(0)
    setBookingData(initialBookingData)
    setIsComplete(false)
  }

  if (isComplete) {
    return (
      <Card elevation="lg" className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Booking Request Submitted!
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Thank you for your interest in booking Allan Palmer. You&apos;ll receive
              a confirmation email shortly with more details.
            </p>
            <button
              onClick={resetWizard}
              className="text-primary hover:underline"
            >
              Submit another request
            </button>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  const stepProps = {
    bookingData,
    updateBookingData,
    onNext: goToNext,
    onPrevious: goToPrevious,
    canGoBack: currentStep > 0,
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ServiceSelectionStep {...stepProps} />
      case 1:
        return <DateTimeStep {...stepProps} />
      case 2:
        return <EventDetailsStep {...stepProps} />
      case 3:
        return <ContactInfoStep {...stepProps} />
      case 4:
        return (
          <ReviewConfirmStep
            {...stepProps}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <ProgressStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={goToStep}
        className="mb-8"
      />

      {/* Step Content */}
      <Card elevation="lg">
        <CardContent className="p-6 md:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
