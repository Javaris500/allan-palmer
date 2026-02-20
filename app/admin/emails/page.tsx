"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════════════════════════════════
// Sample data for previewing each email template
// ═══════════════════════════════════════════════════════════════════════════

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const LOGO_URL = `${SITE_URL}/images/allan-logo.png`

// Shared helpers (duplicated from lib/resend.ts for client-side preview)
function detailRow(label: string, value: string, isGold = false): string {
  return `<tr>
    <td style="color:#888;padding:10px 12px;font-size:14px;border-bottom:1px solid #1a1a1a;white-space:nowrap;">${label}</td>
    <td style="color:${isGold ? "#d4a843" : "#e5e5e5"};padding:10px 12px;font-size:14px;border-bottom:1px solid #1a1a1a;text-align:right;">${value}</td>
  </tr>`
}

function detailsCard(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;margin:24px 0;">
    ${rows}
  </table>`
}

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

function emailLayout(preheader: string, body: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <title>Allan Palmer</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 28px;border-bottom:1px solid #1a1a1a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0;">
                    <img src="${LOGO_URL}" alt="AP" width="48" height="48" style="display:block;width:48px;height:48px;object-fit:contain;border:0;margin-bottom:12px;" />
                    <h1 style="margin:0;font-size:26px;font-weight:600;color:#d4a843;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.5px;">Allan Palmer</h1>
                    <p style="margin:6px 0 0;font-size:13px;color:#666;letter-spacing:1.5px;text-transform:uppercase;">Professional Violinist</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 0;">${body}</td>
          </tr>
          <tr>
            <td style="border-top:1px solid #1a1a1a;padding:24px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 16px;font-size:13px;">
                      <a href="#" style="color:#666;text-decoration:none;margin:0 8px;">Instagram</a>
                      <span style="color:#333;">&middot;</span>
                      <a href="#" style="color:#666;text-decoration:none;margin:0 8px;">YouTube</a>
                      <span style="color:#333;">&middot;</span>
                      <a href="#" style="color:#666;text-decoration:none;margin:0 8px;">TikTok</a>
                    </p>
                    <p style="margin:0 0 8px;font-size:12px;color:#444;">Allan Palmer &bull; Winnipeg, Manitoba &bull; (204) 898-9699</p>
                    <p style="margin:0;font-size:11px;color:#333;"><a href="#" style="color:#444;text-decoration:none;">allanpalmer.com</a></p>
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

// ═══════════════════════════════════════════════════════════════════════════
// Template definitions with sample data
// ═══════════════════════════════════════════════════════════════════════════

interface EmailTemplate {
  id: string
  name: string
  description: string
  subject: string
  html: string
}

function getTemplates(): EmailTemplate[] {
  return [
    {
      id: "booking-received",
      name: "Booking Received",
      description: "Sent to the user after they submit a booking request",
      subject: "Booking Request Received — BK-20260215-A3F7 | Allan Palmer",
      html: emailLayout(
        "Thank you! Allan will review your wedding booking and respond within 24-48 hours.",
        `<h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;">Your Request Has Been Received</h2>
        <p style="margin:0 0 8px;font-size:16px;color:#ccc;line-height:1.65;">Hi Jane, thank you for your interest in having live violin at your event. Allan will review your request and get back to you within 24&ndash;48 hours.</p>
        ${detailsCard(
          detailRow("Reference", "BK-20260215-A3F7") +
          detailRow("Event", "Wedding Ceremony", true) +
          detailRow("Date", "Saturday, June 15, 2026") +
          detailRow("Time", "Evening (5pm+)") +
          detailRow("Duration", "2 hours")
        )}
        ${infoBlock("What happens next?", "Allan will review the details of your event and reach out to discuss availability, pricing, and any special arrangements. You can check your booking status anytime from your dashboard.")}
        ${ctaButton("View My Booking", "#")}
        <p style="margin:0;font-size:13px;color:#666;text-align:center;">Questions? Reply to this email or call <strong style="color:#888;">(204) 898-9699</strong></p>`,
      ),
    },
    {
      id: "new-booking-alert",
      name: "New Booking Alert",
      description: "Sent to Allan when a new booking request comes in",
      subject: "New Booking: Wedding Ceremony — Jane Smith (BK-20260215-A3F7)",
      html: emailLayout(
        "Jane Smith wants to book you for a wedding ceremony on June 15, 2026.",
        `<h2 style="margin:0 0 4px;font-size:22px;color:#fff;font-weight:600;">New Booking Request</h2>
        <p style="margin:0 0 24px;font-size:14px;color:#d4a843;">Jane Smith &mdash; Wedding Ceremony</p>
        <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Event Details</p>
        ${detailsCard(
          detailRow("Reference", "BK-20260215-A3F7") +
          detailRow("Event Type", "Wedding Ceremony", true) +
          detailRow("Date", "Saturday, June 15, 2026") +
          detailRow("Time", "Evening (5pm+)") +
          detailRow("Venue", "The Fort Garry Hotel") +
          detailRow("Guests", "100-200") +
          detailRow("Setting", "Indoor") +
          detailRow("Duration", "2 hours") +
          detailRow("Music Styles", "Classical, Jazz & Standards")
        )}
        <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Contact Information</p>
        ${detailsCard(
          detailRow("Name", "Jane Smith") +
          detailRow("Email", "jane@example.com") +
          detailRow("Phone", "(204) 555-0123")
        )}
        <p style="margin:24px 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Additional Notes</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;margin:8px 0 24px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 12px;font-size:14px;color:#ccc;line-height:1.6;"><strong style="color:#888;">Song Requests:</strong><br/>Canon in D for the processional, A Thousand Years for the recessional</p>
            <p style="margin:0;font-size:14px;color:#ccc;line-height:1.6;"><strong style="color:#888;">Special Requirements:</strong><br/>Need power outlet near gazebo area for amplification</p>
          </td></tr>
        </table>
        ${ctaButton("Review in Dashboard", "#")}
        <p style="margin:0;font-size:13px;color:#666;text-align:center;">Reply directly to <a href="#" style="color:#d4a843;text-decoration:none;">jane@example.com</a> or call <strong style="color:#888;">(204) 555-0123</strong></p>`,
      ),
    },
    {
      id: "status-confirmed",
      name: "Booking Confirmed",
      description: "Sent when Allan confirms the booking",
      subject: "Your Booking Is Confirmed! — BK-20260215-A3F7 | Allan Palmer",
      html: emailLayout(
        "Your Booking Is Confirmed! — Your wedding ceremony booking has been updated.",
        `<div style="text-align:center;margin-bottom:24px;">
          <span style="display:inline-block;background-color:#22c55e;color:#000;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.5px;text-transform:uppercase;">CONFIRMED</span>
        </div>
        <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">Your Booking Is Confirmed!</h2>
        <p style="margin:0 0 8px;font-size:15px;color:#ccc;line-height:1.65;text-align:center;">Hi Jane, great news — Allan has confirmed your booking. He's looking forward to performing at your event. The details are below.</p>
        ${detailsCard(
          detailRow("Reference", "BK-20260215-A3F7") +
          detailRow("Event", "Wedding Ceremony", true) +
          detailRow("Date", "Saturday, June 15, 2026")
        )}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border-left:3px solid #d4a843;border-radius:0 12px 12px 0;margin:24px 0;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 6px;font-size:12px;color:#d4a843;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message from Allan</p>
              <p style="margin:0;font-size:14px;color:#ccc;line-height:1.65;">Looking forward to this! I'll arrive 30 minutes early for setup. I'll bring my full amplification system for the gazebo area.</p>
            </td>
          </tr>
        </table>
        ${ctaButton("View My Booking", "#")}
        <p style="margin:0;font-size:13px;color:#666;text-align:center;">Questions? Reply to this email or call <strong style="color:#888;">(204) 898-9699</strong></p>`,
      ),
    },
    {
      id: "status-cancelled",
      name: "Booking Cancelled",
      description: "Sent when a booking is cancelled",
      subject: "Booking Cancelled — BK-20260215-A3F7 | Allan Palmer",
      html: emailLayout(
        "Booking Cancelled — Your wedding ceremony booking has been updated.",
        `<div style="text-align:center;margin-bottom:24px;">
          <span style="display:inline-block;background-color:#ef4444;color:#000;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.5px;text-transform:uppercase;">CANCELLED</span>
        </div>
        <h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">Booking Cancelled</h2>
        <p style="margin:0 0 8px;font-size:15px;color:#ccc;line-height:1.65;text-align:center;">Hi Jane, your booking has been cancelled. If this was unexpected or you'd like to rebook, please don't hesitate to reach out.</p>
        ${detailsCard(
          detailRow("Reference", "BK-20260215-A3F7") +
          detailRow("Event", "Wedding Ceremony", true) +
          detailRow("Date", "Saturday, June 15, 2026")
        )}
        ${ctaButton("View My Booking", "#")}
        <p style="margin:0;font-size:13px;color:#666;text-align:center;">Questions? Reply to this email or call <strong style="color:#888;">(204) 898-9699</strong></p>`,
      ),
    },
    {
      id: "new-message",
      name: "New Message",
      description: "Sent when Allan sends a message about a booking",
      subject: "Allan sent you a message — BK-20260215-A3F7 | Allan Palmer",
      html: emailLayout(
        'Allan says: "Just wanted to confirm — should I prepare any specific hymns for the ceremony?"',
        `<h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;">New Message About Your Booking</h2>
        <p style="margin:0 0 24px;font-size:15px;color:#ccc;line-height:1.65;">Hi Jane, Allan sent you a message regarding your <strong style="color:#d4a843;">Wedding Ceremony</strong> booking (BK-20260215-A3F7).</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border-left:3px solid #d4a843;border-radius:0 12px 12px 0;margin:0 0 24px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:12px;color:#d4a843;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Allan Palmer</p>
              <p style="margin:0;font-size:15px;color:#ddd;line-height:1.65;">Just wanted to confirm — should I prepare any specific hymns for the ceremony? I have a beautiful arrangement of "Amazing Grace" and "Ave Maria" that work wonderfully for church settings.</p>
            </td>
          </tr>
        </table>
        ${ctaButton("Reply in Dashboard", "#")}
        <p style="margin:0;font-size:13px;color:#666;text-align:center;">You can also reply directly to this email.</p>`,
      ),
    },
    {
      id: "welcome",
      name: "Welcome",
      description: "Sent after account registration",
      subject: "Welcome to Allan Palmer | Your Account Is Ready",
      html: emailLayout(
        "Welcome Jane! Your Allan Palmer account is ready. Start booking live violin for your next event.",
        `<h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">Welcome, Jane</h2>
        <p style="margin:0 0 8px;font-size:16px;color:#ccc;line-height:1.65;text-align:center;">Your account has been created. You can now book Allan for your next event and manage everything from your personal dashboard.</p>
        ${infoBlock("What can you do?", "Browse services &bull; Request a booking &bull; Message Allan directly &bull; Track your booking status")}
        ${ctaButton("Book Allan", "#")}
        <p style="margin:0;font-size:13px;color:#666;text-align:center;">Need help? Reply to this email anytime.</p>`,
      ),
    },
    {
      id: "password-reset",
      name: "Password Reset",
      description: "Sent when a user requests a password reset",
      subject: "Reset Your Password | Allan Palmer",
      html: emailLayout(
        "You requested a password reset. This link expires in 1 hour.",
        `<h2 style="margin:0 0 16px;font-size:22px;color:#fff;font-weight:600;text-align:center;">Reset Your Password</h2>
        <p style="margin:0 0 8px;font-size:15px;color:#ccc;line-height:1.65;text-align:center;">We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong style="color:#fff;">1 hour</strong>.</p>
        ${ctaButton("Reset Password", "#")}
        <p style="margin:0 0 8px;font-size:13px;color:#666;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
        <p style="margin:0;font-size:12px;color:#444;text-align:center;">Or copy this link: <a href="#" style="color:#d4a843;text-decoration:none;">https://allanpalmer.com/reset/abc123...</a></p>`,
      ),
    },
  ]
}

// ═══════════════════════════════════════════════════════════════════════════
// Preview Page Component
// ═══════════════════════════════════════════════════════════════════════════

export default function EmailPreviewPage() {
  const templates = getTemplates()
  const [activeId, setActiveId] = useState(templates[0]?.id ?? "")
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")

  const active = templates.find((t) => t.id === activeId) ?? templates[0]
  if (!active) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container flex items-center justify-between py-4 px-6">
          <div>
            <h1 className="text-lg font-semibold">Email Templates</h1>
            <p className="text-sm text-muted-foreground">
              Preview all {templates.length} transactional emails
            </p>
          </div>
          <a
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Admin
          </a>
        </div>
      </div>

      <div className="container py-6 px-6">
        <div className="flex gap-6">
          {/* Sidebar: Template list */}
          <div className="w-64 shrink-0">
            <div className="sticky top-20 space-y-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                    activeId === t.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span className="block">{t.name}</span>
                  <span className="block text-xs opacity-70 mt-0.5">
                    {t.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main: Preview */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold">{active.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Subject: <span className="text-foreground">{active.subject}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    viewMode === "desktop"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    viewMode === "mobile"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Email iframe */}
            <div
              className={cn(
                "mx-auto border rounded-xl overflow-hidden bg-[#0a0a0a] shadow-xl transition-all duration-300",
                viewMode === "desktop" ? "w-full max-w-[660px]" : "w-[375px]",
              )}
            >
              <iframe
                srcDoc={active.html}
                title={`Preview: ${active.name}`}
                className="w-full border-0"
                style={{ height: viewMode === "desktop" ? "800px" : "900px" }}
              />
            </div>

            {/* Source code toggle */}
            <details className="mt-6">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                View HTML source
              </summary>
              <pre className="mt-3 p-4 bg-muted rounded-lg text-xs overflow-x-auto max-h-[400px] overflow-y-auto">
                <code>{active.html}</code>
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
