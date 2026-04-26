import Link from "next/link";
import { ArrowLeft, ChevronRight, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "REVIEWED", label: "Reviewed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
] as const;

type StatusKey = (typeof STATUS_TABS)[number]["key"];

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  REVIEWED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  CONFIRMED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  COMPLETED: "bg-gold/15 text-gold border-gold/30",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/30",
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const rawStatus = (params.status ?? "ALL").toUpperCase();
  const activeStatus: StatusKey = (
    STATUS_TABS.some((t) => t.key === rawStatus) ? rawStatus : "ALL"
  ) as StatusKey;

  const [bookings, counts] = await Promise.all([
    prisma.booking.findMany({
      where: activeStatus === "ALL" ? {} : { status: activeStatus },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        reference: true,
        status: true,
        contactName: true,
        contactEmail: true,
        eventType: true,
        eventDate: true,
        timePreference: true,
        venue: true,
        createdAt: true,
      },
    }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countByStatus: Record<string, number> = {};
  let total = 0;
  for (const row of counts) {
    countByStatus[row.status] = row._count._all;
    total += row._count._all;
  }
  countByStatus.ALL = total;

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                Bookings
              </h1>
              <p className="text-sm text-muted-foreground">
                {total} total · {countByStatus.PENDING ?? 0} pending review
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-gold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to admin
          </Link>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = tab.key === activeStatus;
            const n = countByStatus[tab.key] ?? 0;
            return (
              <Link
                key={tab.key}
                href={
                  tab.key === "ALL"
                    ? "/admin/bookings"
                    : `/admin/bookings?status=${tab.key}`
                }
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider border transition-all",
                  isActive
                    ? "bg-gold text-ink border-gold"
                    : "border-border/50 text-muted-foreground hover:border-gold/40 hover:text-gold",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "ml-2 text-[10px] px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-ink/10" : "bg-muted/40",
                  )}
                >
                  {n}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {bookings.length === 0 && (
          <div className="rounded-xl border border-border/50 bg-card/30 py-16 text-center">
            <Inbox className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No bookings in this view.
            </p>
          </div>
        )}

        {/* Booking list */}
        {bookings.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
            <ul className="divide-y divide-border/40">
              {bookings.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/admin/bookings/${b.reference}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                  >
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border",
                        STATUS_COLOR[b.status] ??
                          "bg-muted/30 text-muted-foreground border-border/50",
                      )}
                    >
                      {b.status}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="font-medium text-foreground truncate">
                          {b.contactName}
                        </p>
                        <span className="text-xs text-muted-foreground truncate">
                          {b.contactEmail}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {b.eventType} · {formatDate(b.eventDate)} ·{" "}
                        {b.timePreference}
                        {b.venue ? ` · ${b.venue}` : ""}
                      </p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-muted-foreground">
                        {b.reference}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                        Received {formatDate(b.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
