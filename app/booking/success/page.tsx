"use client"

import { useSearchParams } from "next/navigation"
import { BookingSuccess } from "@/components/booking/booking-success"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") || ""

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <BookingSuccess email={email} />
    </div>
  )
}
