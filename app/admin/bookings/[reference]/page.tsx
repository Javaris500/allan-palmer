import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { updateAdminNotes } from "../actions";
import { AdminMessageForm, StatusUpdateForm } from "./forms";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  REVIEWED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  CONFIRMED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  COMPLETED: "bg-gold/15 text-gold border-gold/30",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/30",
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimestamp(d: Date) {
  return d.toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-2.5 border-b border-border/20 last:border-b-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!booking) notFound();

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/admin/bookings"
              className="text-sm text-muted-foreground hover:text-gold flex items-center gap-1.5 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              All bookings
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                {booking.contactName}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border",
                  STATUS_COLOR[booking.status] ??
                    "bg-muted/30 text-muted-foreground border-border/50",
                )}
              >
                {booking.status}
              </span>
              <span className="text-xs text-muted-foreground">
                {booking.reference}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
        {/* Left column — booking detail & messaging */}
        <div className="space-y-6 min-w-0">
          {/* Event details */}
          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="font-serif text-lg font-bold mb-3">Event</h2>
            <dl>
              <DetailRow label="Type" value={booking.eventType} />
              <DetailRow label="Date" value={formatDate(booking.eventDate)} />
              <DetailRow label="Time" value={booking.timePreference} />
              <DetailRow
                label="Duration"
                value={booking.duration || "—"}
              />
              <DetailRow label="Venue" value={booking.venue || "—"} />
              <DetailRow
                label="Guest count"
                value={booking.guestCount || "—"}
              />
              <DetailRow
                label="Setting"
                value={booking.setting || "—"}
              />
              <DetailRow
                label="Music styles"
                value={
                  booking.musicStyles.length
                    ? booking.musicStyles.join(", ")
                    : "—"
                }
              />
              <DetailRow
                label="Song requests"
                value={
                  booking.songRequests ? (
                    <span className="whitespace-pre-wrap">
                      {booking.songRequests}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
              <DetailRow
                label="Special notes"
                value={
                  booking.specialRequirements ? (
                    <span className="whitespace-pre-wrap">
                      {booking.specialRequirements}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
            </dl>
          </section>

          {/* Contact */}
          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="font-serif text-lg font-bold mb-3">Contact</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a
                href={`mailto:${booking.contactEmail}`}
                className="flex items-center gap-2 text-foreground hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-muted-foreground" />
                {booking.contactEmail}
              </a>
              <a
                href={`tel:${booking.contactPhone}`}
                className="flex items-center gap-2 text-foreground hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-muted-foreground" />
                {booking.contactPhone}
              </a>
            </div>
          </section>

          {/* Thread */}
          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold" />
              Messages
            </h2>

            {booking.messages.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-4">
                No messages yet. Sending one logs it here and opens your mail
                client pre-filled to {booking.contactName.split(" ")[0]}.
              </p>
            ) : (
              <ul className="space-y-3 mb-4">
                {booking.messages.map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "rounded-lg p-3 text-sm border",
                      m.fromAdmin
                        ? "bg-gold/5 border-gold/20 ml-8"
                        : "bg-muted/30 border-border/40 mr-8",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {m.fromAdmin ? "Allan" : booking.contactName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatTimestamp(m.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-foreground/90">
                      {m.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <AdminMessageForm
              booking={{
                reference: booking.reference,
                contactName: booking.contactName,
                contactEmail: booking.contactEmail,
                eventType: booking.eventType,
                eventDate: formatDate(booking.eventDate),
                currentStatus: booking.status,
              }}
            />
          </section>
        </div>

        {/* Right column — status + notes */}
        <aside className="space-y-6">
          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="font-serif text-lg font-bold mb-3">Status</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Saves the new status, then opens your mail client so you can
              send {booking.contactName.split(" ")[0]} the update.
            </p>
            <StatusUpdateForm
              booking={{
                reference: booking.reference,
                contactName: booking.contactName,
                contactEmail: booking.contactEmail,
                eventType: booking.eventType,
                eventDate: formatDate(booking.eventDate),
                currentStatus: booking.status,
              }}
            />
          </section>

          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="font-serif text-lg font-bold mb-3">Admin notes</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Private — only visible here.
            </p>
            <form action={updateAdminNotes} className="space-y-3">
              <input type="hidden" name="reference" value={booking.reference} />
              <textarea
                name="adminNotes"
                defaultValue={booking.adminNotes ?? ""}
                rows={5}
                maxLength={4000}
                placeholder="Internal notes…"
                className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 resize-none"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-md border border-border/50 text-foreground text-xs uppercase tracking-wider font-medium hover:border-gold/50 hover:text-gold transition-colors"
              >
                Save notes
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="font-serif text-lg font-bold mb-3">Timeline</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Received</dt>
                <dd>{formatTimestamp(booking.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last updated</dt>
                <dd>{formatTimestamp(booking.updatedAt)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
