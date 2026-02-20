import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting: 3 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous"
  const { success: rateLimitOk } = rateLimit(ip, 3, 60000)

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Integration point: Email service (Resend, SendGrid)
    // await sendContactNotification(data)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully. Allan will respond soon!",
    })
  } catch (error) {
    // Log error server-side only (not exposed to client)
    if (process.env.NODE_ENV === "development") {
      console.error("Contact form error:", error)
    }
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
