"use client";

import {
  CheckCircle2,
  Calendar,
  AlertCircle,
  ListChecks,
  Mail,
  Sparkles,
} from "lucide-react";

interface ToolCardProps {
  toolName: string;
  result: unknown;
}

export function LeahToolCard({ toolName, result }: ToolCardProps) {
  const r = result as Record<string, unknown>;

  switch (toolName) {
    case "submitBooking":
      if (r?.success) {
        return (
          <div className="my-3 rounded-md border border-gold/30 bg-gold/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="h-5 w-5 text-gold shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium">
                  Booking Submitted
                </p>
                <p className="font-mono text-sm text-foreground tracking-wider">
                  {String(r.reference)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Allan will reach out within 24–48 hours.
                </p>
              </div>
            </div>
          </div>
        );
      }
      return <ErrorCard message={String(r?.message ?? "Booking failed.")} />;

    case "createBookingDraft": {
      const draft = r?.draft as Record<string, string> | undefined;
      if (!draft) return null;
      return (
        <div className="my-3 rounded-md border border-border/60 bg-card/50 p-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium mb-2">
            Booking Draft
          </p>
          <DraftRow label="Event" value={draft.eventType ?? ""} />
          <DraftRow label="Date" value={draft.eventDate ?? ""} />
          {draft.timePreference && (
            <DraftRow label="Time" value={draft.timePreference} />
          )}
          {draft.venue && <DraftRow label="Venue" value={draft.venue} />}
          <DraftRow label="Name" value={draft.contactName ?? ""} />
          <DraftRow label="Email" value={draft.contactEmail ?? ""} />
          <DraftRow label="Phone" value={draft.contactPhone ?? ""} />
          {draft.songRequests && (
            <DraftRow label="Songs" value={draft.songRequests} />
          )}
        </div>
      );
    }

    case "morningBriefing": {
      const today = r?.today as {
        count: number;
        events: Record<string, string>[];
      };
      const week = r?.thisWeek as { count: number };
      const leads = r?.newLeadsLast24h as { count: number };
      const urgent = r?.urgent as { pendingWithin14Days: number };
      return (
        <div className="my-3 rounded-md border border-border/60 bg-card/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium">
              Morning Briefing
            </p>
          </div>
          <BriefRow
            label="Today"
            value={`${today?.count ?? 0} event${today?.count === 1 ? "" : "s"}`}
          />
          <BriefRow
            label="This week"
            value={`${week?.count ?? 0} gig${week?.count === 1 ? "" : "s"}`}
          />
          <BriefRow label="New leads (24h)" value={`${leads?.count ?? 0}`} />
          <BriefRow
            label="Urgent (next 14d)"
            value={`${urgent?.pendingWithin14Days ?? 0} pending`}
            highlight={(urgent?.pendingWithin14Days ?? 0) > 0}
          />
        </div>
      );
    }

    case "listBookings": {
      const bookings =
        (r?.bookings as Array<{
          reference: string;
          eventType: string;
          eventDate: string;
          status: string;
          contactName: string;
        }>) ?? [];
      if (bookings.length === 0) {
        return (
          <div className="my-3 rounded-md border border-border/60 bg-card/30 p-4 text-sm text-muted-foreground">
            No bookings match those filters.
          </div>
        );
      }
      return (
        <div className="my-3 rounded-md border border-border/60 bg-card/50 overflow-hidden">
          <div className="px-4 py-2 border-b border-border/40 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-gold" />
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium">
              {bookings.length} Booking{bookings.length === 1 ? "" : "s"}
            </p>
          </div>
          <ul className="divide-y divide-border/30">
            {bookings.slice(0, 8).map((b) => (
              <li key={b.reference} className="px-4 py-2.5 text-xs space-y-0.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-foreground truncate">
                    {b.contactName}
                  </span>
                  <span className="font-mono text-gold/80 tracking-wider text-[10px] shrink-0">
                    {b.reference}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3 text-muted-foreground">
                  <span>{b.eventType}</span>
                  <span className="tabular-nums">{b.eventDate}</span>
                </div>
                <span className="inline-block text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mt-0.5">
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case "triageLeads": {
      const leads =
        (r?.leads as Array<{
          reference: string;
          contactName: string;
          eventType: string;
          eventDate: string;
          daysUntilEvent: number;
        }>) ?? [];
      if (leads.length === 0) {
        return (
          <div className="my-3 rounded-md border border-border/60 bg-card/30 p-4 text-sm text-muted-foreground">
            No pending leads — you&rsquo;re caught up.
          </div>
        );
      }
      return (
        <div className="my-3 rounded-md border border-border/60 bg-card/50 overflow-hidden">
          <div className="px-4 py-2 border-b border-border/40 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gold" />
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium">
              Triage — Most Urgent First
            </p>
          </div>
          <ol className="divide-y divide-border/30">
            {leads.map((l, i) => (
              <li key={l.reference} className="px-4 py-2.5 text-xs space-y-0.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-foreground">
                    <span className="text-gold/70 mr-2">{i + 1}.</span>
                    {l.contactName}
                  </span>
                  <span
                    className={
                      l.daysUntilEvent < 7
                        ? "text-gold font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {l.daysUntilEvent === 0 ? "Today" : `${l.daysUntilEvent}d`}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {l.eventType} · {l.eventDate}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    }

    case "blockTime":
      if (r?.success) {
        return (
          <div className="my-3 rounded-md border border-gold/30 bg-gold/5 p-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            <p className="text-sm text-foreground">{String(r.message)}</p>
          </div>
        );
      }
      return (
        <ErrorCard
          message={String(r?.message ?? "Couldn't block that time.")}
        />
      );

    case "checkAvailability": {
      const conflicts = r?.hasConflicts as boolean;
      return (
        <div
          className={`my-3 rounded-md border p-3 ${conflicts ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}
        >
          <p className="text-xs text-foreground/80">{String(r?.note ?? "")}</p>
        </div>
      );
    }

    case "escalateToAllan":
    case "captureLead":
      return (
        <div className="my-3 rounded-md border border-gold/20 bg-gold/5 p-3 flex items-center gap-2">
          <Mail className="h-4 w-4 text-gold" />
          <p className="text-sm text-foreground/80">
            {String(r?.message ?? "")}
          </p>
        </div>
      );

    default:
      return null;
  }
}

function DraftRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        {label}
      </span>
      <span className="text-foreground/90 text-right">{value}</span>
    </div>
  );
}

function BriefRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
        {label}
      </span>
      <span className={highlight ? "text-gold font-medium" : "text-foreground"}>
        {value}
      </span>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="my-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 flex items-start gap-2">
      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
