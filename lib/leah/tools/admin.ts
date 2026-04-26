import { tool } from "ai";
import { z } from "zod";
import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/leah/auth";

// ──────────────────────────────────────────────
// listBookings — read-only with filters
// ──────────────────────────────────────────────
export const listBookingsTool = (session: Session | null) =>
  tool({
    description:
      "List Allan's bookings with optional filters. Returns up to 25 most recent matching bookings.",
    inputSchema: z.object({
      status: z
        .enum(["PENDING", "REVIEWED", "CONFIRMED", "COMPLETED", "CANCELLED"])
        .optional(),
      from: z.string().optional().describe("Start date YYYY-MM-DD inclusive"),
      to: z.string().optional().describe("End date YYYY-MM-DD inclusive"),
      eventType: z.string().optional(),
    }),
    execute: async ({ status, from, to, eventType }) => {
      requireAdmin(session);
      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (eventType)
        where.eventType = { contains: eventType, mode: "insensitive" };
      if (from || to) {
        where.eventDate = {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        };
      }

      const bookings = await prisma.booking.findMany({
        where,
        orderBy: { eventDate: "asc" },
        take: 25,
        select: {
          id: true,
          reference: true,
          status: true,
          eventType: true,
          eventDate: true,
          timePreference: true,
          venue: true,
          contactName: true,
          contactEmail: true,
          contactPhone: true,
          createdAt: true,
        },
      });

      return {
        count: bookings.length,
        bookings: bookings.map((b) => ({
          ...b,
          eventDate: b.eventDate.toISOString().slice(0, 10),
          createdAt: b.createdAt.toISOString(),
        })),
      };
    },
  });

// ──────────────────────────────────────────────
// blockTime — write to Availability
// ──────────────────────────────────────────────
export const blockTimeTool = (session: Session | null) =>
  tool({
    description:
      "Block a time slot on Allan's calendar (mark unavailable). Pass `date` for a one-off block on a specific day (YYYY-MM-DD). Pass `dayOfWeek` for a recurring weekly block. Provide exactly one of the two. Two-step: call WITHOUT `confirm` first to preview, then re-call with `confirm: true` after Allan says yes.",
    inputSchema: z
      .object({
        date: z
          .string()
          .optional()
          .describe(
            "One-off date in YYYY-MM-DD format. Use this when Allan says 'block next Thursday' or 'block July 12'.",
          ),
        dayOfWeek: z
          .number()
          .min(0)
          .max(6)
          .optional()
          .describe(
            "0=Sunday, 6=Saturday. Use ONLY for recurring weekly blocks (e.g. 'block every Sunday').",
          ),
        startTime: z.string().describe("HH:MM 24h, e.g. 14:00"),
        endTime: z.string().describe("HH:MM 24h, e.g. 17:00"),
        reason: z.string().optional(),
        confirm: z
          .boolean()
          .optional()
          .describe(
            "Set true ONLY after Allan has explicitly confirmed the block in chat. First call should omit this to return a preview.",
          ),
      })
      .refine(
        (d) =>
          (d.date && d.dayOfWeek === undefined) ||
          (d.dayOfWeek !== undefined && !d.date),
        {
          message: "Provide exactly one of `date` or `dayOfWeek`.",
        },
      ),
    execute: async ({
      date,
      dayOfWeek,
      startTime,
      endTime,
      reason,
      confirm,
    }) => {
      requireAdmin(session);

      // Two-step gate. The admin prompt also tells Leah to confirm, but we
      // enforce server-side too so a single over-eager turn cannot write to
      // the calendar. Preview returns a description; the model then asks
      // Allan, and re-calls with `confirm: true` when he says yes.
      if (!confirm) {
        const target = date
          ? `${date}`
          : dayOfWeek !== undefined
            ? `every ${dayName(dayOfWeek)}`
            : "(unspecified)";
        return {
          confirmed: false,
          preview: {
            target,
            startTime,
            endTime,
            reason: reason ?? null,
          },
          message: `Preview: block ${target} ${startTime}–${endTime}${reason ? ` (${reason})` : ""}. Ask Allan to confirm, then call again with confirm: true to apply.`,
        };
      }

      try {
        if (date) {
          const parsed = new Date(`${date}T00:00:00.000Z`);
          if (isNaN(parsed.getTime())) {
            return {
              success: false,
              message: "Invalid date (use YYYY-MM-DD).",
            };
          }
          const block = await prisma.availability.create({
            data: {
              date: parsed,
              dayOfWeek: null,
              startTime,
              endTime,
              isAvailable: false,
              reason: reason ?? null,
            },
          });
          return {
            success: true,
            id: block.id,
            message: `Blocked ${date} ${startTime}–${endTime}${reason ? ` (${reason})` : ""}.`,
          };
        }
        const block = await prisma.availability.create({
          data: {
            dayOfWeek: dayOfWeek!,
            startTime,
            endTime,
            isAvailable: false,
            reason: reason ?? null,
          },
        });
        return {
          success: true,
          id: block.id,
          message: `Blocked every ${dayName(dayOfWeek!)} ${startTime}–${endTime}${reason ? ` (${reason})` : ""}.`,
        };
      } catch {
        return { success: false, message: "Couldn't save the time block." };
      }
    },
  });

function dayName(d: number): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d] ?? "?";
}

// ──────────────────────────────────────────────
// morningBriefing — aggregated overview
// ──────────────────────────────────────────────
export const morningBriefingTool = (session: Session | null) =>
  tool({
    description:
      "Generate Allan's morning briefing: today's events, this week's gigs, new pending leads, and anything that needs attention.",
    inputSchema: z.object({}),
    execute: async () => {
      requireAdmin(session);
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(todayStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const [todaysEvents, thisWeek, newLeads, urgentPending] =
        await Promise.all([
          prisma.booking.findMany({
            where: {
              eventDate: { gte: todayStart, lte: endOfDay(now) },
              status: { in: ["CONFIRMED", "REVIEWED"] },
            },
            select: {
              reference: true,
              eventType: true,
              contactName: true,
              venue: true,
              timePreference: true,
            },
          }),
          prisma.booking.findMany({
            where: {
              eventDate: { gt: todayStart, lte: weekEnd },
              status: { in: ["CONFIRMED", "REVIEWED"] },
            },
            orderBy: { eventDate: "asc" },
            select: {
              reference: true,
              eventDate: true,
              eventType: true,
              contactName: true,
            },
          }),
          prisma.booking.findMany({
            where: {
              status: "PENDING",
              createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
            },
            orderBy: { createdAt: "desc" },
            select: {
              reference: true,
              eventType: true,
              eventDate: true,
              contactName: true,
              createdAt: true,
            },
          }),
          prisma.booking.count({
            where: {
              status: "PENDING",
              eventDate: {
                lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
              },
            },
          }),
        ]);

      return {
        timestamp: now.toISOString(),
        today: {
          count: todaysEvents.length,
          events: todaysEvents,
        },
        thisWeek: {
          count: thisWeek.length,
          events: thisWeek.map((e) => ({
            ...e,
            eventDate: e.eventDate.toISOString().slice(0, 10),
          })),
        },
        newLeadsLast24h: {
          count: newLeads.length,
          leads: newLeads.map((l) => ({
            ...l,
            eventDate: l.eventDate.toISOString().slice(0, 10),
            createdAt: l.createdAt.toISOString(),
          })),
        },
        urgent: {
          pendingWithin14Days: urgentPending,
        },
      };
    },
  });

function endOfDay(d: Date): Date {
  const e = new Date(d);
  e.setHours(23, 59, 59, 999);
  return e;
}

// ──────────────────────────────────────────────
// triageLeads — rank PENDING bookings by urgency
// ──────────────────────────────────────────────
export const triageLeadsTool = (session: Session | null) =>
  tool({
    description:
      "Rank pending bookings by urgency. Urgency = how soon the event is + how recent the inquiry. Returns top 10.",
    inputSchema: z.object({}),
    execute: async () => {
      requireAdmin(session);
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      // Only consider PENDING leads with events in the future. Past-dated
      // pending rows belong to a different workflow (stale cleanup) and
      // shouldn't be mixed into an urgency rank.
      const pending = await prisma.booking.findMany({
        where: { status: "PENDING", eventDate: { gte: todayStart } },
        select: {
          reference: true,
          eventType: true,
          eventDate: true,
          contactName: true,
          contactEmail: true,
          contactPhone: true,
          createdAt: true,
          venue: true,
        },
      });

      const DAY_MS = 24 * 60 * 60 * 1000;
      const ranked = pending
        .map((b) => {
          const daysUntilEvent = Math.max(
            0,
            Math.floor((b.eventDate.getTime() - now.getTime()) / DAY_MS),
          );
          const daysSinceInquiry = Math.max(
            0,
            Math.floor((now.getTime() - b.createdAt.getTime()) / DAY_MS),
          );
          // Lower score = more urgent. Clamp floor so ancient unreplied
          // leads don't bubble above genuinely urgent near-term events.
          const score = Math.max(0, daysUntilEvent - daysSinceInquiry * 0.5);
          return {
            ...b,
            eventDate: b.eventDate.toISOString().slice(0, 10),
            createdAt: b.createdAt.toISOString(),
            daysUntilEvent,
            daysSinceInquiry,
            score,
          };
        })
        .sort((a, b) => a.score - b.score)
        .slice(0, 10);

      return { count: ranked.length, leads: ranked };
    },
  });

// ──────────────────────────────────────────────
// Aggregator
// ──────────────────────────────────────────────
export function adminTools(session: Session | null) {
  return {
    listBookings: listBookingsTool(session),
    blockTime: blockTimeTool(session),
    morningBriefing: morningBriefingTool(session),
    triageLeads: triageLeadsTool(session),
  };
}
