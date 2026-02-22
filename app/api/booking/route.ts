import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { rateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/prisma"
import { sendBookingReceived, sendNewBookingAlert } from "@/lib/resend"
import { format, isAfter, addDays, startOfDay } from "date-fns"

// Simple HTML-entity sanitizer for user input going into emails
function sanitize(input: string | undefined | null): string {
  if (!input) return ""
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .slice(0, 2000) // length cap
}

export async function POST(request: NextRequest) {
  // Rate limiting: 5 requests per minute per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous"
  const { success: rateLimitOk } = rateLimit(ip, 5, 60000)

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    )
  }

  try {
    const bookingData = await request.json()

    // Validate required fields
    const requiredFields = [
      "eventType",
      "eventDate",
      "timePreference",
      "name",
      "email",
      "phone",
    ]
    const missingFields = requiredFields.filter(
      (field) => !bookingData[field],
    )

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    // Validate musicStyles is present and non-empty
    if (
      !bookingData.musicStyles ||
      !Array.isArray(bookingData.musicStyles) ||
      bookingData.musicStyles.length === 0
    ) {
      return NextResponse.json(
        { error: "Please select at least one music style" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(bookingData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      )
    }

    // Validate phone (at least 7 digits for international support)
    const phoneDigits = (bookingData.phone || "").replace(/\D/g, "")
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: "Please provide a valid phone number" },
        { status: 400 },
      )
    }

    // Validate event date is in the future (at least tomorrow)
    const eventDate = new Date(bookingData.eventDate)
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid event date" },
        { status: 400 },
      )
    }
    const minimumDate = addDays(startOfDay(new Date()), 1)
    if (!isAfter(eventDate, minimumDate)) {
      return NextResponse.json(
        { error: "Event date must be at least tomorrow" },
        { status: 400 },
      )
    }

    // Generate booking reference with crypto
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const rand = randomUUID().slice(0, 4).toUpperCase()
    const bookingRef = `BK-${dateStr}-${rand}`

    // Resolve event type display
    const eventType =
      bookingData.eventType === "other"
        ? sanitize(bookingData.customEventType) || "Other"
        : sanitize(bookingData.eventType)

    // Resolve duration display
    const duration =
      bookingData.duration === "custom"
        ? sanitize(bookingData.customDuration) || "Custom"
        : sanitize(bookingData.duration) || "Not specified"

    // Save to database (wrapped in try-catch)
    try {
      await prisma.booking.create({
        data: {
          reference: bookingRef,
          status: "PENDING",
          eventType,
          eventDate,
          timePreference: sanitize(bookingData.timePreference),
          venue: sanitize(bookingData.venue) || null,
          guestCount: sanitize(bookingData.guestCount) || null,
          setting: sanitize(bookingData.setting) || null,
          duration,
          musicStyles: (bookingData.musicStyles || []).map((s: string) =>
            sanitize(s)
          ),
          songRequests: sanitize(bookingData.songRequests) || null,
          specialRequirements:
            sanitize(bookingData.specialRequirements) || null,
          contactName: sanitize(bookingData.name),
          contactEmail: bookingData.email.toLowerCase().trim(),
          contactPhone: bookingData.phone.trim(),
          referralSource: sanitize(bookingData.referralSource) || null,
        },
      })
    } catch (dbError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Database error creating booking:", dbError)
      }
      return NextResponse.json(
        { error: "Failed to save booking. Please try again." },
        { status: 500 },
      )
    }

    // Format date for emails
    const formattedDate = format(eventDate, "MMMM d, yyyy")

    // Send emails (non-blocking but logged)
    sendBookingReceived({
      to: bookingData.email,
      name: bookingData.name.split(" ")[0],
      reference: bookingRef,
      eventType,
      eventDate: formattedDate,
      timePreference: bookingData.timePreference,
      duration,
    }).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to send booking confirmation email:", err)
      }
    })

    sendNewBookingAlert({
      reference: bookingRef,
      contactName: bookingData.name,
      contactEmail: bookingData.email,
      contactPhone: bookingData.phone,
      eventType,
      eventDate: formattedDate,
      timePreference: bookingData.timePreference,
      venue: bookingData.venue,
      guestCount: bookingData.guestCount,
      setting: bookingData.setting,
      duration,
      musicStyles: bookingData.musicStyles || [],
      songRequests: bookingData.songRequests,
      specialRequirements: bookingData.specialRequirements,
    }).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to send admin booking alert:", err)
      }
    })

    return NextResponse.json({
      success: true,
      message:
        "Booking request received. Allan will review and respond within 24 hours.",
      bookingId: bookingRef,
      reference: bookingRef,
      submittedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Booking submission error:", error)
    }
    return NextResponse.json(
      { error: "Failed to process booking request. Please try again." },
      { status: 500 },
    )
  }
}
