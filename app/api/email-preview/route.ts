import { NextRequest, NextResponse } from "next/server"
import {
  emailLayout,
  detailRow,
  detailsCard,
  ctaButton,
  infoBlock,
} from "@/lib/resend"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://allanpalmer.com"

// Sample data for previews
const mock = {
  name: "Sarah Mitchell",
  email: "sarah@example.com",
  phone: "(204) 555-1234",
  reference: "BK-20260315-A3F7",
  eventType: "Wedding Reception",
  eventDate: "Saturday, March 15, 2026",
  timePreference: "Evening",
  venue: "The Fort Garry Hotel",
  guestCount: "120",
  setting: "Indoor",
  duration: "2 hours",
  musicStyles: ["Classical", "Pop", "Jazz"],
  songRequests: "Can't Help Falling in Love (Elvis), A Thousand Years (Christina Perri), Canon in D",
  specialRequirements: "Would love a 15-minute solo during the ceremony entrance, then background music during dinner.",
}

const templates: Record<string, () => string> = {
  "booking-received": () => {
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;">
        Your Request Has Been Received
      </h2>
      <p style="margin:0 0 8px;font-size:16px;color:#ccc;line-height:1.65;">
        Hi ${mock.name}, thank you for your interest in having live violin at your event.
        Allan will review your request and get back to you within 24&ndash;48 hours.
      </p>
      ${detailsCard(
        detailRow("Reference", mock.reference) +
        detailRow("Event", mock.eventType, true) +
        detailRow("Date", mock.eventDate) +
        detailRow("Time", mock.timePreference) +
        detailRow("Duration", mock.duration)
      )}
      ${infoBlock(
        "What happens next?",
        "Allan will review the details of your event and reach out to discuss " +
        "availability, pricing, and any special arrangements. You can check your " +
        "booking status anytime from your dashboard."
      )}
      ${ctaButton("View My Booking", `${SITE_URL}/my-bookings`)}
      <p style="margin:0;font-size:13px;color:#666;text-align:center;">
        Questions? Reply to this email or call <strong style="color:#888;">(204) 898-9699</strong>
      </p>`
    return emailLayout({ preheader: `Thank you, ${mock.name}! Allan will review your booking.`, body })
  },

  "admin-alert": () => {
    const eventRows =
      detailRow("Reference", mock.reference) +
      detailRow("Event Type", mock.eventType, true) +
      detailRow("Date", mock.eventDate) +
      detailRow("Time", mock.timePreference) +
      detailRow("Venue", mock.venue) +
      detailRow("Guests", mock.guestCount) +
      detailRow("Setting", mock.setting) +
      detailRow("Duration", mock.duration) +
      detailRow("Music Styles", mock.musicStyles.join(", "))
    const contactRows =
      detailRow("Name", mock.name) +
      detailRow("Email", mock.email) +
      detailRow("Phone", mock.phone)
    const body = `
      <h2 style="margin:0 0 4px;font-size:22px;color:#fff;font-weight:600;">
        New Booking Request
      </h2>
      <p style="margin:0 0 24px;font-size:14px;color:#d4a843;">
        ${mock.name} &mdash; ${mock.eventType}
      </p>
      <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Event Details</p>
      ${detailsCard(eventRows)}
      <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Contact Information</p>
      ${detailsCard(contactRows)}
      <p style="margin:24px 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Additional Notes</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;margin:8px 0 24px;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 12px;font-size:14px;color:#ccc;line-height:1.6;">
            <strong style="color:#888;">Song Requests:</strong><br/>${mock.songRequests}
          </p>
          <p style="margin:0;font-size:14px;color:#ccc;line-height:1.6;">
            <strong style="color:#888;">Special Requirements:</strong><br/>${mock.specialRequirements}
          </p>
        </td></tr>
      </table>
      ${ctaButton("Review in Dashboard", `${SITE_URL}/admin`)}
      <p style="margin:0;font-size:13px;color:#666;text-align:center;">
        Reply directly to <a href="mailto:${mock.email}" style="color:#d4a843;text-decoration:none;">${mock.email}</a>
        or call <strong style="color:#888;">${mock.phone}</strong>
      </p>`
    return emailLayout({ preheader: `${mock.name} wants to book you for a wedding reception.`, body })
  },

  "status-reviewed": () => statusEmail("REVIEWED", "Your Booking Is Being Reviewed", "Allan has reviewed your request and is checking availability. You'll hear back shortly with a confirmation or follow-up questions.", "#3b82f6", null),
  "status-confirmed": () => statusEmail("CONFIRMED", "Your Booking Is Confirmed!", "Great news — Allan has confirmed your booking. He's looking forward to performing at your event. The details are below.", "#22c55e", "Looking forward to your wedding! I'll arrive 30 minutes early to set up. Let me know if you have any last-minute song additions."),
  "status-completed": () => statusEmail("COMPLETED", "Thank You for Having Allan!", "Your event has been marked as completed. Thank you for choosing Allan Palmer. If you enjoyed the performance, a review would mean the world.", "#d4a843", null),
  "status-cancelled": () => statusEmail("CANCELLED", "Booking Cancelled", "Your booking has been cancelled. If this was unexpected or you'd like to rebook, please don't hesitate to reach out.", "#ef4444", null),

  "new-message": () => {
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;">
        New Message About Your Booking
      </h2>
      <p style="margin:0 0 24px;font-size:15px;color:#ccc;line-height:1.65;">
        Hi ${mock.name}, Allan sent you a message regarding your <strong style="color:#d4a843;">${mock.eventType}</strong> booking (${mock.reference}).
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border-left:3px solid #d4a843;border-radius:0 12px 12px 0;margin:0 0 24px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 8px;font-size:12px;color:#d4a843;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Allan Palmer</p>
            <p style="margin:0;font-size:15px;color:#ddd;line-height:1.65;">
              Hi Sarah! Just confirming I have your song list. I'll also prepare a few surprise classical pieces that work beautifully for wedding receptions. See you on the 15th!
            </p>
          </td>
        </tr>
      </table>
      ${ctaButton("Reply in Dashboard", `${SITE_URL}/my-bookings`)}
      <p style="margin:0;font-size:13px;color:#666;text-align:center;">You can also reply directly to this email.</p>`
    return emailLayout({ preheader: `Allan says: "Hi Sarah! Just confirming I have your song list..."`, body })
  },

  "welcome": () => {
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">
        Welcome, ${mock.name}
      </h2>
      <p style="margin:0 0 8px;font-size:16px;color:#ccc;line-height:1.65;text-align:center;">
        Your account has been created. You can now book Allan for your next event
        and manage everything from your personal dashboard.
      </p>
      ${infoBlock(
        "What can you do?",
        "Browse services &bull; Request a booking &bull; Message Allan directly &bull; Track your booking status"
      )}
      ${ctaButton("Book Allan", `${SITE_URL}/booking`)}
      <p style="margin:0;font-size:13px;color:#666;text-align:center;">Need help? Reply to this email anytime.</p>`
    return emailLayout({ preheader: `Welcome ${mock.name}! Your Allan Palmer account is ready.`, body })
  },

  "password-reset": () => {
    const resetUrl = `${SITE_URL}/reset-password?token=abc123def456`
    const body = `
      <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">
        Reset Your Password
      </h2>
      <p style="margin:0 0 8px;font-size:15px;color:#ccc;line-height:1.65;text-align:center;">
        We received a request to reset your password. Click the button below to choose a new one.
        This link expires in <strong style="color:#fff;">1 hour</strong>.
      </p>
      ${ctaButton("Reset Password", resetUrl)}
      <p style="margin:0 0 8px;font-size:13px;color:#666;text-align:center;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <p style="margin:0;font-size:12px;color:#444;text-align:center;word-break:break-all;">
        Or copy this link: <a href="${resetUrl}" style="color:#d4a843;text-decoration:none;">${resetUrl}</a>
      </p>`
    return emailLayout({ preheader: "You requested a password reset. This link expires in 1 hour.", body })
  },
}

function statusEmail(status: string, heading: string, message: string, color: string, adminMessage: string | null) {
  const statusBadge = `<span style="display:inline-block;background-color:${color};color:#000;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.5px;text-transform:uppercase;">${status}</span>`
  const body = `
    <div style="text-align:center;margin-bottom:24px;">${statusBadge}</div>
    <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">${heading}</h2>
    <p style="margin:0 0 8px;font-size:15px;color:#ccc;line-height:1.65;text-align:center;">
      Hi ${mock.name}, ${message.charAt(0).toLowerCase()}${message.slice(1)}
    </p>
    ${detailsCard(
      detailRow("Reference", mock.reference) +
      detailRow("Event", mock.eventType, true) +
      detailRow("Date", mock.eventDate)
    )}
    ${adminMessage
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border-left:3px solid #d4a843;border-radius:0 12px 12px 0;margin:24px 0;">
           <tr><td style="padding:16px 20px;">
             <p style="margin:0 0 6px;font-size:12px;color:#d4a843;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message from Allan</p>
             <p style="margin:0;font-size:14px;color:#ccc;line-height:1.65;">${adminMessage}</p>
           </td></tr>
         </table>`
      : ""}
    ${ctaButton("View My Booking", `${SITE_URL}/my-bookings`)}
    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      Questions? Reply to this email or call <strong style="color:#888;">(204) 898-9699</strong>
    </p>`
  return emailLayout({ preheader: `${heading} — Your booking has been updated.`, body })
}

// Index page listing all templates
function indexPage(): string {
  const templateList = Object.keys(templates)
  const links = templateList
    .map(
      (t) =>
        `<a href="/api/email-preview?template=${t}" style="display:block;padding:14px 20px;margin:6px 0;background:#111;border:1px solid #222;border-radius:8px;color:#d4a843;text-decoration:none;font-size:15px;transition:border-color 0.2s;" onmouseover="this.style.borderColor='#d4a843'" onmouseout="this.style.borderColor='#222'">${t}</a>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Email Template Preview</title></head>
<body style="margin:0;padding:40px 20px;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#fff;">
  <div style="max-width:500px;margin:0 auto;">
    <h1 style="font-size:24px;color:#d4a843;margin:0 0 8px;font-family:Georgia,serif;">Allan Palmer</h1>
    <p style="color:#888;margin:0 0 32px;font-size:14px;">Email Template Preview</p>
    ${links}
    <p style="color:#444;font-size:12px;margin:24px 0 0;text-align:center;">Dev only — remove before production</p>
  </div>
</body>
</html>`
}

export async function GET(request: NextRequest) {
  // Block in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const template = request.nextUrl.searchParams.get("template")

  if (!template) {
    return new NextResponse(indexPage(), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  const generator = templates[template]
  if (!generator) {
    return NextResponse.json(
      { error: "Unknown template", available: Object.keys(templates) },
      { status: 404 }
    )
  }

  return new NextResponse(generator(), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
