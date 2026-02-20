"use client"

import { useEffect } from "react"

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Booking error:", error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-2xl font-serif font-bold mb-3">
          Booking Temporarily Unavailable
        </h1>
        <p className="text-muted-foreground mb-8">
          We encountered an issue with the booking system. Please try again in a moment.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-gold/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 border border-border px-6 py-2.5 rounded-full text-sm hover:bg-muted transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}
