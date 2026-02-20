import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || "Allan Palmer <onboarding@resend.dev>"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://allanpalmer.com"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "palmerar@myumanitoba.ca"
const LOGO_URL = `${SITE_URL}/images/allan-logo.png`

// ═══════════════════════════════════════════════════════════════════════════
// Shared Email Layout
// ═══════════════════════════════════════════════════════════════════════════
// Single source of truth for header, footer, and styling. Every email
// passes its body through this wrapper so the brand is consistent.

function emailLayout({
  preheader,
  body,
}: {
  preheader: string
  body: string
}): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Allan Palmer</title>
  <!--[if mso]>
  <style>
    table { border-collapse: collapse; }
    td { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${preheader}
    ${"&nbsp;&zwnj;".repeat(20)}
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Inner container (600px max) -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- ════════ HEADER ════════ -->
          <tr>
            <td style="padding:0 0 28px;border-bottom:1px solid #1a1a1a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0;">
                    <!-- Logo -->
                    <img
                      src="${LOGO_URL}"
                      alt="AP"
                      width="48"
                      height="48"
                      style="display:block;width:48px;height:48px;object-fit:contain;border:0;margin-bottom:12px;"
                    />
                    <h1 style="margin:0;font-size:26px;font-weight:600;color:#d4a843;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.5px;">
                      Allan Palmer
                    </h1>
                    <p style="margin:6px 0 0;font-size:13px;color:#666;letter-spacing:1.5px;text-transform:uppercase;">
                      Professional Violinist
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ════════ BODY ════════ -->
          <tr>
            <td style="padding:32px 0;">
              ${body}
            </td>
          </tr>

          <!-- ════════ FOOTER ════════ -->
          <tr>
            <td style="border-top:1px solid #1a1a1a;padding:24px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Social links -->
                    <p style="margin:0 0 16px;font-size:13px;">
                      <a href="https://www.instagram.com/allan_palms/" style="color:#666;text-decoration:none;margin:0 8px;">Instagram</a>
                      <span style="color:#333;">&middot;</span>
                      <a href="https://www.youtube.com/@AllanPalmerViolinist" style="color:#666;text-decoration:none;margin:0 8px;">YouTube</a>
                      <span style="color:#333;">&middot;</span>
                      <a href="https://www.tiktok.com/@allan_palms/" style="color:#666;text-decoration:none;margin:0 8px;">TikTok</a>
                    </p>
                    <p style="margin:0 0 8px;font-size:12px;color:#444;">
                      Allan Palmer &bull; Winnipeg, Manitoba &bull; (204) 898-9699
                    </p>
                    <p style="margin:0;font-size:11px;color:#333;">
                      <a href="${SITE_URL}" style="color:#444;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Helper: renders a key-value detail row inside a details card
function detailRow(label: string, value: string, isGold = false): string {
  return `<tr>
    <td style="color:#888;padding:10px 12px;font-size:14px;border-bottom:1px solid #1a1a1a;white-space:nowrap;">${label}</td>
    <td style="color:${isGold ? "#d4a843" : "#e5e5e5"};padding:10px 12px;font-size:14px;border-bottom:1px solid #1a1a1a;text-align:right;">${value}</td>
  </tr>`
}

// Helper: wraps rows in a styled details card
function detailsCard(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;margin:24px 0;">
    ${rows}
  </table>`
}

// Helper: gold CTA button
function ctaButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
    <tr>
      <td align="center" style="background-color:#d4a843;border-radius:999px;">
        <a href="${href}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#000;text-decoration:none;letter-spacing:0.3px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`
}

// Helper: muted info block (tip, note, etc.)
function infoBlock(title: string, content: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#141209,#0d0d0d);border:1px solid rgba(212,168,67,0.15);border-radius:12px;margin:24px 0;">
    <tr>
      <td style="padding:20px 24px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#d4a843;">${title}</p>
        <p style="margin:0;font-size:14px;color:#aaa;line-height:1.7;">${content}</p>
      </td>
    </tr>
  </table>`
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. BOOKING RECEIVED — sent to the user after they submit a booking
// ═══════════════════════════════════════════════════════════════════════════

export async function sendBookingReceived({
  to,
  name,
  reference,
  eventType,
  eventDate,
  timePreference,
  duration,
}: {
  to: string
  name: string
  reference: string
  eventType: string
  eventDate: string
  timePreference: string
  duration: string
}) {
  const body = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;">
      Your Request Has Been Received
    </h2>
    <p style="margin:0 0 8px;font-size:16px;color:#ccc;line-height:1.65;">
      Hi ${name}, thank you for your interest in having live violin at your event.
      Allan will review your request and get back to you within 24&ndash;48 hours.
    </p>

    ${detailsCard(
      detailRow("Reference", reference) +
      detailRow("Event", eventType, true) +
      detailRow("Date", eventDate) +
      detailRow("Time", timePreference) +
      detailRow("Duration", duration)
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

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Booking Request Received — ${reference} | Allan Palmer`,
    html: emailLayout({
      preheader: `Thank you, ${name}! Allan will review your ${eventType.toLowerCase()} booking and respond within 24-48 hours.`,
      body,
    }),
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. NEW BOOKING ALERT — sent to Allan when a new booking comes in
// ═══════════════════════════════════════════════════════════════════════════

export async function sendNewBookingAlert({
  reference,
  contactName,
  contactEmail,
  contactPhone,
  eventType,
  eventDate,
  timePreference,
  venue,
  guestCount,
  setting,
  duration,
  musicStyles,
  songRequests,
  specialRequirements,
}: {
  reference: string
  contactName: string
  contactEmail: string
  contactPhone: string
  eventType: string
  eventDate: string
  timePreference: string
  venue?: string | null
  guestCount?: string | null
  setting?: string | null
  duration: string
  musicStyles: string[]
  songRequests?: string | null
  specialRequirements?: string | null
}) {
  const eventRows =
    detailRow("Reference", reference) +
    detailRow("Event Type", eventType, true) +
    detailRow("Date", eventDate) +
    detailRow("Time", timePreference) +
    (venue ? detailRow("Venue", venue) : "") +
    (guestCount ? detailRow("Guests", guestCount) : "") +
    (setting ? detailRow("Setting", setting) : "") +
    detailRow("Duration", duration) +
    detailRow("Music Styles", musicStyles.join(", "))

  const contactRows =
    detailRow("Name", contactName) +
    detailRow("Email", contactEmail) +
    detailRow("Phone", contactPhone)

  const notesHtml =
    (songRequests
      ? `<p style="margin:0 0 12px;font-size:14px;color:#ccc;line-height:1.6;">
           <strong style="color:#888;">Song Requests:</strong><br/>${songRequests}
         </p>`
      : "") +
    (specialRequirements
      ? `<p style="margin:0;font-size:14px;color:#ccc;line-height:1.6;">
           <strong style="color:#888;">Special Requirements:</strong><br/>${specialRequirements}
         </p>`
      : "")

  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#fff;font-weight:600;">
      New Booking Request
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#d4a843;">
      ${contactName} &mdash; ${eventType}
    </p>

    <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
      Event Details
    </p>
    ${detailsCard(eventRows)}

    <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
      Contact Information
    </p>
    ${detailsCard(contactRows)}

    ${notesHtml
      ? `<p style="margin:24px 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
           Additional Notes
         </p>
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;margin:8px 0 24px;">
           <tr><td style="padding:16px 20px;">${notesHtml}</td></tr>
         </table>`
      : ""}

    ${ctaButton("Review in Dashboard", `${SITE_URL}/admin`)}

    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      Reply directly to <a href="mailto:${contactEmail}" style="color:#d4a843;text-decoration:none;">${contactEmail}</a>
      or call <strong style="color:#888;">${contactPhone}</strong>
    </p>`

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    replyTo: contactEmail,
    subject: `New Booking: ${eventType} — ${contactName} (${reference})`,
    html: emailLayout({
      preheader: `${contactName} wants to book you for a ${eventType.toLowerCase()} on ${eventDate}.`,
      body,
    }),
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. BOOKING STATUS UPDATE — sent to user when Allan changes the status
// ═══════════════════════════════════════════════════════════════════════════

const STATUS_COPY: Record<string, { heading: string; message: string; color: string }> = {
  REVIEWED: {
    heading: "Your Booking Is Being Reviewed",
    message: "Allan has reviewed your request and is checking availability. You'll hear back shortly with a confirmation or follow-up questions.",
    color: "#3b82f6", // blue
  },
  CONFIRMED: {
    heading: "Your Booking Is Confirmed!",
    message: "Great news — Allan has confirmed your booking. He's looking forward to performing at your event. The details are below.",
    color: "#22c55e", // green
  },
  COMPLETED: {
    heading: "Thank You for Having Allan!",
    message: "Your event has been marked as completed. Thank you for choosing Allan Palmer. If you enjoyed the performance, a review would mean the world.",
    color: "#d4a843", // gold
  },
  CANCELLED: {
    heading: "Booking Cancelled",
    message: "Your booking has been cancelled. If this was unexpected or you'd like to rebook, please don't hesitate to reach out.",
    color: "#ef4444", // red
  },
}

export async function sendBookingStatusUpdate({
  to,
  name,
  reference,
  eventType,
  eventDate,
  status,
  adminMessage,
}: {
  to: string
  name: string
  reference: string
  eventType: string
  eventDate: string
  status: string
  adminMessage?: string | null
}) {
  const copy = STATUS_COPY[status] || {
    heading: "Booking Update",
    message: "There's been an update to your booking. Check your dashboard for the latest details.",
    color: "#d4a843",
  }

  const statusBadge = `<span style="display:inline-block;background-color:${copy.color};color:#000;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.5px;text-transform:uppercase;">
    ${status}
  </span>`

  const body = `
    <div style="text-align:center;margin-bottom:24px;">
      ${statusBadge}
    </div>

    <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">
      ${copy.heading}
    </h2>
    <p style="margin:0 0 8px;font-size:15px;color:#ccc;line-height:1.65;text-align:center;">
      Hi ${name}, ${copy.message.charAt(0).toLowerCase()}${copy.message.slice(1)}
    </p>

    ${detailsCard(
      detailRow("Reference", reference) +
      detailRow("Event", eventType, true) +
      detailRow("Date", eventDate)
    )}

    ${adminMessage
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border-left:3px solid #d4a843;border-radius:0 12px 12px 0;margin:24px 0;">
           <tr>
             <td style="padding:16px 20px;">
               <p style="margin:0 0 6px;font-size:12px;color:#d4a843;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message from Allan</p>
               <p style="margin:0;font-size:14px;color:#ccc;line-height:1.65;">${adminMessage}</p>
             </td>
           </tr>
         </table>`
      : ""}

    ${ctaButton("View My Booking", `${SITE_URL}/my-bookings`)}

    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      Questions? Reply to this email or call <strong style="color:#888;">(204) 898-9699</strong>
    </p>`

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${copy.heading} — ${reference} | Allan Palmer`,
    html: emailLayout({
      preheader: `${copy.heading} — Your ${eventType.toLowerCase()} booking (${reference}) has been updated.`,
      body,
    }),
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. NEW MESSAGE — sent to user when Allan messages them about a booking
// ═══════════════════════════════════════════════════════════════════════════

export async function sendNewMessageNotification({
  to,
  name,
  reference,
  eventType,
  messagePreview,
}: {
  to: string
  name: string
  reference: string
  eventType: string
  messagePreview: string
}) {
  const body = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;">
      New Message About Your Booking
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#ccc;line-height:1.65;">
      Hi ${name}, Allan sent you a message regarding your <strong style="color:#d4a843;">${eventType}</strong> booking (${reference}).
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border-left:3px solid #d4a843;border-radius:0 12px 12px 0;margin:0 0 24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:12px;color:#d4a843;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
            Allan Palmer
          </p>
          <p style="margin:0;font-size:15px;color:#ddd;line-height:1.65;">
            ${messagePreview}
          </p>
        </td>
      </tr>
    </table>

    ${ctaButton("Reply in Dashboard", `${SITE_URL}/my-bookings`)}

    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      You can also reply directly to this email.
    </p>`

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Allan sent you a message — ${reference} | Allan Palmer`,
    html: emailLayout({
      preheader: `Allan says: "${messagePreview.slice(0, 80)}${messagePreview.length > 80 ? "..." : ""}"`,
      body,
    }),
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. WELCOME EMAIL — sent after account registration
// ═══════════════════════════════════════════════════════════════════════════

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string
  name: string
}) {
  const body = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">
      Welcome, ${name}
    </h2>
    <p style="margin:0 0 8px;font-size:16px;color:#ccc;line-height:1.65;text-align:center;">
      Your account has been created. You can now book Allan for your next event
      and manage everything from your personal dashboard.
    </p>

    ${infoBlock(
      "What can you do?",
      "Browse services &bull; Request a booking &bull; " +
      "Message Allan directly &bull; Track your booking status"
    )}

    ${ctaButton("Book Allan", `${SITE_URL}/booking`)}

    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      Need help? Reply to this email anytime.
    </p>`

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to Allan Palmer | Your Account Is Ready",
    html: emailLayout({
      preheader: `Welcome ${name}! Your Allan Palmer account is ready. Start booking live violin for your next event.`,
      body,
    }),
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. PASSWORD RESET — sent when a user requests a password reset
// ═══════════════════════════════════════════════════════════════════════════

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string
  resetUrl: string
}) {
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

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset Your Password | Allan Palmer",
    html: emailLayout({
      preheader: "You requested a password reset. This link expires in 1 hour.",
      body,
    }),
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. GENERIC ADMIN NOTIFICATION — for system alerts to Allan
// ═══════════════════════════════════════════════════════════════════════════

export async function sendAdminNotification({
  subject,
  body: content,
}: {
  subject: string
  body: string
}) {
  const html = emailLayout({
    preheader: subject,
    body: `
      <h2 style="margin:0 0 16px;font-size:20px;color:#fff;font-weight:600;">
        ${subject}
      </h2>
      <div style="font-size:15px;color:#ccc;line-height:1.65;">
        ${content}
      </div>`,
  })

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[Admin] ${subject}`,
    html,
  })
}
