import { NextRequest, NextResponse } from "next/server"
import { handlers } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

export const { GET } = handlers

export async function POST(req: NextRequest) {
  // Rate-limit login attempts: 10 per minute per IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous"
  const { success: rateLimitOk } = rateLimit(`login:${ip}`, 10, 60000)

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 },
    )
  }

  return handlers.POST(req)
}
