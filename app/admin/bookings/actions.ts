"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const STATUSES = [
  "PENDING",
  "REVIEWED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

const updateStatusSchema = z.object({
  reference: z.string().min(1),
  status: z.enum(STATUSES),
});

const sendMessageSchema = z.object({
  reference: z.string().min(1),
  message: z.string().min(1).max(2000),
});

const updateNotesSchema = z.object({
  reference: z.string().min(1),
  adminNotes: z.string().max(4000),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

// Delivery to the customer is handled on the client via mailto so Allan's
// own mail client sends the email. These server actions just persist the
// DB state — the detail page revalidates after each call.

export async function updateBookingStatus(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = updateStatusSchema.safeParse({
    reference: formData.get("reference"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await prisma.booking.update({
    where: { reference: parsed.data.reference },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${parsed.data.reference}`);
}

export async function sendAdminMessage(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = sendMessageSchema.safeParse({
    reference: formData.get("reference"),
    message: formData.get("message"),
  });
  if (!parsed.success) return;

  const booking = await prisma.booking.findUnique({
    where: { reference: parsed.data.reference },
    select: { id: true },
  });
  if (!booking) return;

  await prisma.bookingMessage.create({
    data: {
      bookingId: booking.id,
      fromAdmin: true,
      content: parsed.data.message,
    },
  });

  revalidatePath(`/admin/bookings/${parsed.data.reference}`);
}

export async function updateAdminNotes(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = updateNotesSchema.safeParse({
    reference: formData.get("reference"),
    adminNotes: formData.get("adminNotes") ?? "",
  });
  if (!parsed.success) return;

  await prisma.booking.update({
    where: { reference: parsed.data.reference },
    data: { adminNotes: parsed.data.adminNotes || null },
  });

  revalidatePath(`/admin/bookings/${parsed.data.reference}`);
}
