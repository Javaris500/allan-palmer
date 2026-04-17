import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import { sendBookingInquiry } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

function sanitize(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .slice(0, 2000);
}

function generateReference(): string {
  const date = new Date();
  const yyyymmdd =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const tail = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `BK-${yyyymmdd}-${tail}`;
}

function inferTimePreference(time?: string): string {
  if (!time) return "Not specified";
  const [h] = time.split(":");
  const hr = parseInt(h ?? "", 10);
  if (isNaN(hr)) return "Not specified";
  if (hr < 12) return "Morning";
  if (hr < 17) return "Afternoon";
  return "Evening";
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
  const { success: rateLimitOk } = rateLimit(ip, 5, 60000);

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      preferredTime,
      venue,
      message,
    } = body;

    if (!name || !email || !phone || !eventType || !eventDate) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid event date." },
        { status: 400 },
      );
    }

    const reference = generateReference();
    const submittedEmail = email.toLowerCase().trim();

    // If the submitter is signed in, canonicalize to the session email and
    // stamp userId so /my-bookings can surface the record by session rather
    // than email-challenge. Mismatched emails are recorded in adminNotes so
    // Allan sees the discrepancy.
    const session = await auth();
    const sessionEmail = session?.user?.email?.toLowerCase() ?? null;
    const sessionUserId = session?.user?.id ?? null;
    const cleanEmail = sessionEmail ?? submittedEmail;
    const emailMismatch =
      sessionEmail !== null && sessionEmail !== submittedEmail;
    const adminNotes = emailMismatch
      ? `[/api/booking] Session email (${sessionEmail}) differs from submitted email (${submittedEmail}). Using session email.`
      : null;

    const timePreference = preferredTime
      ? `${inferTimePreference(preferredTime)} (${preferredTime})`
      : "Not specified";

    const booking = await prisma.booking.create({
      data: {
        reference,
        status: "PENDING",
        userId: sessionUserId,
        eventType: sanitize(eventType),
        eventDate: parsedDate,
        timePreference,
        venue: venue ? sanitize(venue) : null,
        duration: "Not specified",
        musicStyles: [],
        songRequests: message ? sanitize(message) : null,
        contactName: sanitize(name),
        contactEmail: cleanEmail,
        contactPhone: sanitize(phone),
        adminNotes,
      },
    });

    try {
      await sendBookingInquiry({
        name: sanitize(name),
        email: cleanEmail,
        phone: sanitize(phone),
        eventType: sanitize(eventType),
        eventDate: sanitize(eventDate),
        venue: venue ? sanitize(venue) : undefined,
        message: message ? sanitize(message) : undefined,
      });
    } catch (mailError) {
      // Booking is saved; admin can still see it. Log the email failure.
      if (process.env.NODE_ENV === "development") {
        console.error("Booking email send failed:", mailError);
      }
    }

    return NextResponse.json({
      success: true,
      reference: booking.reference,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Booking form error:", error);
    }
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 500 },
    );
  }
}
