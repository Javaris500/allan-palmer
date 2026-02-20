"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useBookingStore } from "@/hooks/use-booking-store"
import { BookingSuccess } from "@/components/booking/booking-success"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const store = useBookingStore()

  const bookingRef = searchParams?.get("ref") || store.bookingRef || "—"
  const email = searchParams?.get("email") || store.answers.email || ""

  // Clear booking state after reaching success
  useEffect(() => {
    if (store.completed || store.currentPhase >= 5) {
      store.reset()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <BookingSuccess bookingId={bookingRef} email={email} />
    </div>
  )
}
