import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/prisma"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous"
  const { success: rateLimitOk } = rateLimit(ip, 20, 60000)

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    )
  }

  const email = request.nextUrl.searchParams.get("email")?.toLowerCase().trim()

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    )
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { contactEmail: email },
      orderBy: { createdAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch bookings:", error)
    }
    return NextResponse.json(
      { error: "Failed to fetch bookings. Please try again." },
      { status: 500 },
    )
  }
}
