import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/resend"
import { rateLimit } from "@/lib/rate-limit"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: NextRequest) {
  // Rate limit: 5 registration attempts per minute per IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous"
  const { success: rateLimitOk } = rateLimit(`register:${ip}`, 5, 60000)

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    )
  }

  try {
    const { name, email, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Password strength: 8+ chars, at least one uppercase, one lowercase, one number
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json(
        { error: "Password must include uppercase, lowercase, and a number" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
    })

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: user.email, name: user.name || "there" }).catch(
      (err) => console.error("Welcome email failed:", err)
    )

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
