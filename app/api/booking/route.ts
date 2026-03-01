import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { sendBookingInquiry } from "@/lib/resend"

function sanitize(input: string | undefined | null): string {
  if (!input) return ""
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .slice(0, 2000)
}

export async function POST(request: NextRequest) {
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
    const body = await request.json()
    const { name, email, phone, eventType, eventDate, venue, message } = body

    if (!name || !email || !phone || !eventType || !eventDate) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      )
    }

    await sendBookingInquiry({
      name: sanitize(name),
      email: email.toLowerCase().trim(),
      phone: sanitize(phone),
      eventType: sanitize(eventType),
      eventDate: sanitize(eventDate),
      venue: sanitize(venue) || undefined,
      message: sanitize(message) || undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Booking form error:", error)
    }
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 500 },
    )
  }
}
