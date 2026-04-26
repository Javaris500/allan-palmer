import { tool } from "ai";
import { z } from "zod";
import crypto from "node:crypto";
import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import { CONTACT_INFO } from "@/lib/constants";

// ──────────────────────────────────────────────
// FAQ — answers common questions from in-memory data
// ──────────────────────────────────────────────
const FAQ_DATA = [
  {
    topic: "services",
    answer:
      "Allan plays for weddings, ceremonies, cocktail hours, corporate events, private parties, and galas. Lessons are also coming soon.",
  },
  {
    topic: "location",
    answer:
      "Allan is based in Winnipeg, Manitoba, but travels for events. Travel costs may apply outside the Winnipeg area.",
  },
  {
    topic: "pricing",
    answer:
      "Allan quotes each event individually based on the type, date, duration, and travel involved. The fastest way to get a quote is to share your event details and let me start a booking inquiry.",
  },
  {
    topic: "duration",
    answer:
      "Common durations are 30 minutes (ceremony), 1 hour (cocktail hour), or 2-3 hours (full event coverage). Allan can accommodate longer engagements too.",
  },
  {
    topic: "songs",
    answer:
      "Allan has a broad repertoire spanning classical, pop, jazz, and contemporary. You can browse the Repertoire page on the site, or share specific song requests during your booking.",
  },
  {
    topic: "amplification",
    answer:
      "Allan brings amplification for outdoor or larger venues. Just mention the venue size or setting when booking.",
  },
  {
    topic: "booking process",
    answer:
      "You share your event details, I create a draft, you confirm, and Allan reviews and reaches out within 24-48 hours to lock in availability and pricing.",
  },
  {
    topic: "contact",
    answer: `Email: ${CONTACT_INFO.email} | Phone: ${CONTACT_INFO.phone} | Location: ${CONTACT_INFO.location}`,
  },
];

export const faqTool = () =>
  tool({
    description:
      "Look up an answer to a common question about Allan's services, pricing, location, or booking process. Use this BEFORE making things up. Returns 'no match' if the topic isn't covered — in that case, escalate to Allan.",
    inputSchema: z.object({
      topic: z
        .string()
        .describe(
          "Topic keyword: services, location, pricing, duration, songs, amplification, booking process, contact",
        ),
    }),
    execute: async ({ topic }) => {
      const t = topic.toLowerCase();
      const match = FAQ_DATA.find(
        (f) => t.includes(f.topic) || f.topic.includes(t),
      );
      return match
        ? { answer: match.answer, topic: match.topic }
        : { answer: null, note: "No matching FAQ entry. Consider escalating." };
    },
  });

// ──────────────────────────────────────────────
// Check availability — looks at existing bookings
// ──────────────────────────────────────────────
export const availabilityTool = () =>
  tool({
    description:
      "Check whether Allan has any existing bookings or blocked time on a given date. Returns conflicts but cannot guarantee availability — Allan must confirm.",
    inputSchema: z.object({
      date: z.string().describe("Event date in YYYY-MM-DD format"),
    }),
    execute: async ({ date }) => {
      const target = new Date(date);
      if (isNaN(target.getTime())) {
        return { error: "Invalid date format. Use YYYY-MM-DD." };
      }
      const dayOfWeek = target.getDay(); // 0=Sun ... 6=Sat
      const dayStart = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate(),
        0,
        0,
        0,
        0,
      );
      const dayEnd = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate(),
        23,
        59,
        59,
        999,
      );

      // Parallel: booking conflicts + any blocked windows (one-off date OR recurring weekday)
      const [conflicts, blocks] = await Promise.all([
        prisma.booking.findMany({
          where: {
            eventDate: { gte: dayStart, lte: dayEnd },
            status: { in: ["CONFIRMED", "REVIEWED"] },
          },
          select: { eventType: true, timePreference: true },
        }),
        prisma.availability.findMany({
          where: {
            isAvailable: false,
            OR: [{ dayOfWeek }, { date: { gte: dayStart, lte: dayEnd } }],
          },
          select: { startTime: true, endTime: true, date: true, reason: true },
        }),
      ]);

      const bookingCount = conflicts.length;
      const blockCount = blocks.length;
      const hasConflicts = bookingCount > 0 || blockCount > 0;

      let note: string;
      if (!hasConflicts) {
        note =
          "No confirmed conflicts visible, but Allan must verify final availability.";
      } else if (bookingCount > 0 && blockCount > 0) {
        note = `${bookingCount} confirmed booking(s) and ${blockCount} blocked time window(s) on this date. Allan may still be able to accommodate — submit the request and he'll review.`;
      } else if (bookingCount > 0) {
        note = `${bookingCount} confirmed booking(s) on this date. Allan may still be able to accommodate — submit the request and he'll review.`;
      } else {
        note = `Allan has ${blockCount} blocked time window(s) on this day of the week. Submit the request and he'll confirm whether the specific time still works.`;
      }

      return {
        date,
        hasConflicts,
        bookings: bookingCount,
        blockedWindows: blockCount,
        note,
      };
    },
  });

// ──────────────────────────────────────────────
// Escalate to Allan — emails Allan with context
// ──────────────────────────────────────────────
export const escalateTool = (session: Session | null) =>
  tool({
    description:
      "Escalate the conversation to Allan. Use when the user has a complaint, custom request, or question you can't answer reliably. Sends Allan an email with the conversation context.",
    inputSchema: z.object({
      reason: z.string().describe("Brief reason for escalation"),
      summary: z
        .string()
        .describe("Short summary of what the user needs and any context"),
      contactEmail: z
        .string()
        .email()
        .optional()
        .describe("User's email if known, so Allan can follow up"),
    }),
    execute: async ({ reason, summary, contactEmail }) => {
      // Delivery is handled by the user's own mail client via mailto — the
      // email lands in Allan's inbox from the user's address so he can
      // reply directly. We just hand back a pre-built mailto URL; the UI
      // renders it as a clickable button.
      const userEmail = session?.user?.email ?? contactEmail ?? null;
      const subject = `Escalation from Leah — ${reason}`;
      const lines: string[] = [
        `Hi Allan,`,
        ``,
        `Leah asked me to reach out directly about this:`,
        ``,
        `— Reason —`,
        reason,
        ``,
        `— Summary —`,
        summary,
      ];
      if (userEmail) {
        lines.push(``, `— Reply to —`, userEmail);
      }
      lines.push(``, `Thanks.`);
      const body = lines.join("\n");
      const mailto = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      return {
        escalated: true,
        mailto,
        adminEmail: CONTACT_INFO.email,
        message:
          "Click the email button to send this to Allan from your own inbox — he'll reply directly.",
      };
    },
  });

// ──────────────────────────────────────────────
// Capture lead — store name/email even if no booking yet
// ──────────────────────────────────────────────
export const leadTool = (session: Session | null) =>
  tool({
    description:
      "Capture the signed-in user's contact details when they're interested but not ready to book yet. Updates their own profile name (if blank). Always operates on the authenticated user — never another account. Allan sees leads in the admin dashboard.",
    inputSchema: z.object({
      name: z.string().min(1),
      note: z
        .string()
        .optional()
        .describe("Anything they said about what they're looking for"),
    }),
    execute: async ({ name, note }) => {
      const userId = session?.user?.id;
      const sessionEmail = session?.user?.email?.toLowerCase() ?? null;
      if (!userId || !sessionEmail) {
        return {
          captured: false,
          message: "I can't save that without a signed-in account.",
        };
      }
      try {
        // Only fill in `name` if the user has none on file — never overwrite
        // an existing display name from a chat-supplied value, since the
        // model collected it from free-form input and we don't re-verify
        // identity here. Always operate on the session's own row by id.
        const current = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        if (current && !current.name) {
          await prisma.user.update({
            where: { id: userId },
            data: { name },
          });
        }
        // Delivery to Allan happens when the user follows up via a booking
        // or escalation — both produce a mailto the user actively sends.
        // The lead itself is persisted on the User row; Allan surfaces it
        // in the admin dashboard.
        const suffix = note ? ` Here's what you mentioned: "${note}".` : "";
        return {
          captured: true,
          message: `Got it, ${name}.${suffix} Whenever you're ready to lock in a date, just say the word and I'll walk you through it.`,
        };
      } catch {
        return {
          captured: false,
          message: "Couldn't save those details. Please try again.",
        };
      }
    },
  });

// ──────────────────────────────────────────────
// Booking — create a draft (no DB write) + submit
// ──────────────────────────────────────────────
const bookingDraftSchema = z.object({
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7),
  eventType: z.string().min(1),
  eventDate: z.string().describe("YYYY-MM-DD"),
  timePreference: z.string().optional(),
  venue: z.string().optional(),
  guestCount: z.string().optional(),
  duration: z.string().optional(),
  songRequests: z.string().optional(),
  specialRequirements: z.string().optional(),
});

export const createBookingDraftTool = () =>
  tool({
    description:
      "Build a booking draft from collected details. Returns a structured summary to show the user for confirmation. Does NOT save to the database.",
    inputSchema: bookingDraftSchema,
    execute: async (draft) => {
      return {
        draft,
        message:
          "Here's the booking draft — confirm and I'll submit it, or tell me what to change.",
      };
    },
  });

export const submitBookingTool = (session: Session | null) =>
  tool({
    description:
      "Submit a confirmed booking to the database. Only call after the user has explicitly confirmed the draft. Returns the booking reference.",
    inputSchema: bookingDraftSchema,
    execute: async (draft) => {
      try {
        const eventDate = new Date(draft.eventDate);
        if (isNaN(eventDate.getTime())) {
          return { success: false, message: "Invalid event date." };
        }

        // Prefer the authenticated session email over whatever the LLM
        // collected — a signed-in user should not be able to submit a booking
        // under someone else's address. Fall back to the draft email if the
        // session has none (defensive; the chat API already requires auth).
        const sessionEmail = session?.user?.email?.toLowerCase() ?? null;
        const draftEmail = draft.contactEmail.toLowerCase().trim();
        const contactEmail = sessionEmail ?? draftEmail;
        const emailMismatch =
          sessionEmail !== null && sessionEmail !== draftEmail;

        const reference = `BK-${formatDateRef(new Date())}-${crypto
          .randomBytes(2)
          .toString("hex")
          .toUpperCase()}`;

        const adminNotesParts: string[] = [];
        if (emailMismatch) {
          adminNotesParts.push(
            `[Leah] Session email (${sessionEmail}) differs from supplied contact email (${draftEmail}). Using session email for canonical contact.`,
          );
        }

        const booking = await prisma.booking.create({
          data: {
            reference,
            status: "PENDING",
            // Stamp the authenticated user so /my-bookings can surface this
            // by session without requiring an email challenge.
            userId: session?.user?.id ?? null,
            eventType: draft.eventType,
            eventDate,
            timePreference: draft.timePreference ?? "Not specified",
            venue: draft.venue ?? null,
            guestCount: draft.guestCount ?? null,
            duration: draft.duration ?? "Not specified",
            musicStyles: [],
            songRequests: draft.songRequests ?? null,
            specialRequirements: draft.specialRequirements ?? null,
            contactName: draft.contactName,
            contactEmail,
            contactPhone: draft.contactPhone,
            adminNotes: adminNotesParts.length
              ? adminNotesParts.join("\n")
              : null,
          },
        });

        // Email delivery is handled by the user's own mail client via a
        // mailto link, so Allan receives the message from the customer's
        // own address and can reply inline. The booking is already saved
        // to the DB and will appear in /admin/bookings either way.
        const mailto = buildBookingMailto({
          reference: booking.reference,
          contactName: draft.contactName,
          contactEmail,
          contactPhone: draft.contactPhone,
          eventType: draft.eventType,
          eventDate: draft.eventDate,
          timePreference: draft.timePreference,
          venue: draft.venue,
          guestCount: draft.guestCount,
          duration: draft.duration,
          songRequests: draft.songRequests,
          specialRequirements: draft.specialRequirements,
        });

        return {
          success: true,
          reference: booking.reference,
          mailto,
          adminEmail: CONTACT_INFO.email,
          message: `Booking saved (reference ${booking.reference}). Click the email button to send the details to Allan from your own inbox — he'll reply directly.`,
        };
      } catch {
        return {
          success: false,
          message: "Couldn't save the booking. Please try again in a moment.",
        };
      }
    },
  });

function formatDateRef(d: Date): string {
  return (
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0")
  );
}

// Build a mailto: URL the customer can click to send the booking details to
// Allan from their own mail client. Mirrors the plain-text layout used by
// the /booking and /contact form mailto flows.
function buildBookingMailto(input: {
  reference: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  eventType: string;
  eventDate: string;
  timePreference?: string;
  venue?: string;
  guestCount?: string;
  duration?: string;
  songRequests?: string;
  specialRequirements?: string;
}): string {
  const lines: string[] = [
    `Hi Allan,`,
    ``,
    `I'd like to book you for an event. Here are the details:`,
    ``,
    `— Reference —`,
    input.reference,
    ``,
    `— Contact —`,
    `Name:  ${input.contactName}`,
    `Email: ${input.contactEmail}`,
    `Phone: ${input.contactPhone}`,
    ``,
    `— Event —`,
    `Type:  ${input.eventType}`,
    `Date:  ${input.eventDate}`,
  ];
  if (input.timePreference) lines.push(`Time:  ${input.timePreference}`);
  if (input.duration) lines.push(`Length: ${input.duration}`);
  if (input.venue) lines.push(`Venue: ${input.venue}`);
  if (input.guestCount) lines.push(`Guests: ${input.guestCount}`);
  if (input.songRequests) {
    lines.push(``, `— Song Requests —`, input.songRequests);
  }
  if (input.specialRequirements) {
    lines.push(``, `— Additional Notes —`, input.specialRequirements);
  }
  lines.push(``, `Thanks,`, input.contactName);

  const subject = `Booking Request — ${input.eventType} — ${input.eventDate} (${input.reference})`;
  const body = lines.join("\n");
  return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ──────────────────────────────────────────────
// Aggregator
// ──────────────────────────────────────────────
export function customerTools(session: Session | null) {
  return {
    answerFAQ: faqTool(),
    checkAvailability: availabilityTool(),
    escalateToAllan: escalateTool(session),
    captureLead: leadTool(session),
    createBookingDraft: createBookingDraftTool(),
    submitBooking: submitBookingTool(session),
  };
}
