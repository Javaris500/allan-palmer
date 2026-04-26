import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/resend";

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
    const { name, email, phone, eventType, eventDate, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const result = await sendContactNotification({
      name: sanitize(name),
      email: email.toLowerCase().trim(),
      phone: phone ? sanitize(phone) : undefined,
      eventType: eventType ? sanitize(eventType) : undefined,
      eventDate: eventDate ? sanitize(eventDate) : undefined,
      message: sanitize(message),
    });

    if (result.error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[/api/contact] Resend send failed:", result.error);
      }
      return NextResponse.json(
        { error: "Couldn't deliver your message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Contact form error:", error);
    }
    return NextResponse.json(
      { error: "Failed to send your message. Please try again." },
      { status: 500 },
    );
  }
}
