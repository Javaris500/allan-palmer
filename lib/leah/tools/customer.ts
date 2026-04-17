import { tool } from "ai";
import { z } from "zod";
import crypto from "node:crypto";
import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import { sendAdminNotification, sendBookingInquiry } from "@/lib/resend";
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
      const userEmail = session?.user?.email ?? contactEmail ?? "unknown";
      try {
        await sendAdminNotification({
          subject: `Leah escalation: ${reason}`,
          body: `<p><strong>From user:</strong> ${userEmail}</p><p><strong>Summary:</strong></p><p>${summary}</p>`,
        });
        return {
          escalated: true,
          message: `I've flagged this for Allan. He'll reach out personally${contactEmail ? ` at ${contactEmail}` : ""}.`,
        };
      } catch {
        return {
          escalated: false,
          message:
            "I couldn't send that to Allan right now — please email him directly at " +
            CONTACT_INFO.email,
        };
      }
    },
  });

// ──────────────────────────────────────────────
// Capture lead — store name/email even if no booking yet
// ──────────────────────────────────────────────
export const leadTool = (session: Session | null) =>
  tool({
    description:
      "Capture the user's contact details when they're interested but not ready to book yet. Stores them as a User in the system for follow-up.",
    inputSchema: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      note: z
        .string()
        .optional()
        .describe("Anything they said about what they're looking for"),
    }),
    execute: async ({ name, email, note }) => {
      try {
        const cleanEmail = email.toLowerCase().trim();
        await prisma.user.upsert({
          where: { email: cleanEmail },
          update: { name },
          create: { email: cleanEmail, name, role: "USER" },
        });
        if (note) {
          await sendAdminNotification({
            subject: `New lead: ${name}`,
            body: `<p><strong>${name}</strong> (${cleanEmail})</p><p>${note}</p>`,
          });
        }
        return {
          captured: true,
          message: `Got it — I've saved ${name}'s details. Allan will be in touch.`,
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

        // Notify Allan (best effort — don't fail booking if email fails)
        try {
          await sendBookingInquiry({
            name: draft.contactName,
            email: contactEmail,
            phone: draft.contactPhone,
            eventType: draft.eventType,
            eventDate: draft.eventDate,
            venue: draft.venue,
            message:
              [draft.songRequests, draft.specialRequirements]
                .filter(Boolean)
                .join("\n\n") || undefined,
          });
        } catch {
          // swallow — booking is saved
        }

        return {
          success: true,
          reference: booking.reference,
          message: `Booking submitted. Reference: ${booking.reference}. Allan will reach out within 24-48 hours.`,
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
