import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { generateBookingResponse, type BookingAIRequest } from "@/lib/booking-ai"

export async function POST(request: NextRequest) {
  // Rate limit: 30 requests per minute per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous"
  const { success: rateLimitOk } = rateLimit(`ai:${ip}`, 30, 60000)

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    )
  }

  try {
    const body: BookingAIRequest = await request.json()

    // Validate touchpoint
    const validTouchpoints = [
      "OTHER_FOLLOWUP",
      "SONG_RESPONSE",
      "SPECIAL_REQUIREMENTS",
      "PHASE_TRANSITION",
      "REVIEW_SUMMARY",
      "ERROR_RECOVERY",
    ]

    if (!body.touchpoint || !validTouchpoints.includes(body.touchpoint)) {
      return NextResponse.json(
        { error: "Invalid touchpoint" },
        { status: 400 },
      )
    }

    // Sanitize user-provided text fields before passing to AI
    const sanitizedBody: BookingAIRequest = {
      ...body,
      userAnswer: body.userAnswer?.slice(0, 1000)?.replace(/[\x00-\x1F\x7F]/g, ""),
      userName: body.userName?.slice(0, 50)?.replace(/[\x00-\x1F\x7F]/g, ""),
    }

    const response = await generateBookingResponse(sanitizedBody)

    return NextResponse.json({ response })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Booking AI route error:", error)
    }
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    )
  }
}
