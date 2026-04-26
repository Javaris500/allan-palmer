"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { sendAdminMessage, updateBookingStatus } from "../actions";

const STATUS_OPTIONS = [
  "PENDING",
  "REVIEWED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

interface CustomerInfo {
  reference: string;
  contactName: string;
  contactEmail: string;
  eventType: string;
  eventDate: string;
  currentStatus: string;
}

function buildMailto(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ─────────────────────────────────────────────────────
// StatusUpdateForm — saves new status + opens Allan's
// mail client pre-filled to the customer.
// ─────────────────────────────────────────────────────

export function StatusUpdateForm({ booking }: { booking: CustomerInfo }) {
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>(
    booking.currentStatus as (typeof STATUS_OPTIONS)[number],
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const firstName = booking.contactName.split(/\s+/)[0] || booking.contactName;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData();
    fd.set("reference", booking.reference);
    fd.set("status", status);

    startTransition(async () => {
      await updateBookingStatus(fd);

      const lines: string[] = [
        `Hi ${firstName},`,
        ``,
        `Quick update on your ${booking.eventType} booking for ${booking.eventDate} (${booking.reference}):`,
        ``,
        `Status: ${status}`,
      ];
      if (message.trim()) {
        lines.push(``, message.trim());
      }
      lines.push(``, `Thanks,`, `Allan`);

      const subject = `Your Allan Palmer booking (${booking.reference}) — ${status}`;
      const mailto = buildMailto(
        booking.contactEmail,
        subject,
        lines.join("\n"),
      );
      window.location.href = mailto;
      setMessage("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select
        name="status"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
        }
        disabled={isPending}
        className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-gold/50 disabled:opacity-60"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <textarea
        name="adminMessage"
        rows={3}
        maxLength={2000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isPending}
        placeholder={`Optional note for ${firstName}…`}
        className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 resize-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gold text-ink text-xs uppercase tracking-wider font-medium hover:bg-champagne transition-colors disabled:opacity-60"
      >
        <Mail className="w-3.5 h-3.5" />
        {isPending ? "Saving…" : "Save & email customer"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────
// AdminMessageForm — saves a thread message + opens
// Allan's mail client to send the same message out.
// ─────────────────────────────────────────────────────

export function AdminMessageForm({ booking }: { booking: CustomerInfo }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const firstName = booking.contactName.split(/\s+/)[0] || booking.contactName;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    const fd = new FormData();
    fd.set("reference", booking.reference);
    fd.set("message", trimmed);

    startTransition(async () => {
      await sendAdminMessage(fd);

      const lines: string[] = [
        `Hi ${firstName},`,
        ``,
        trimmed,
        ``,
        `Thanks,`,
        `Allan`,
      ];
      const subject = `Re: Your Allan Palmer booking (${booking.reference})`;
      const mailto = buildMailto(
        booking.contactEmail,
        subject,
        lines.join("\n"),
      );
      window.location.href = mailto;
      setMessage("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        name="message"
        required
        rows={3}
        maxLength={2000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isPending}
        placeholder={`Message ${firstName}…`}
        className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 resize-none disabled:opacity-60"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gold text-ink text-xs uppercase tracking-wider font-medium hover:bg-champagne transition-colors disabled:opacity-60"
        >
          <Mail className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : "Save & email"}
        </button>
      </div>
    </form>
  );
}
