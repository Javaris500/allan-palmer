"use client"

import { useSearchParams } from "next/navigation"
import { BookingSuccess } from "@/components/booking/booking-success"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") || ""
  const reference = searchParams?.get("ref") || undefined
  const mailto = searchParams?.get("mailto") || undefined

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <BookingSuccess email={email} reference={reference} mailto={mailto} />
    </div>
  )
}
