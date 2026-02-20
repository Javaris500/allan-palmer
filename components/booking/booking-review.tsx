"use client"

import { motion } from "framer-motion"
import { Pencil } from "lucide-react"
import type { BookingAnswers } from "@/hooks/use-booking-store"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Review — Summary card with edit links
// ═══════════════════════════════════════════════════════════════════════════

interface BookingReviewProps {
  answers: Partial<BookingAnswers>
  onEdit: (phase: number) => void
  onConfirm: () => void
  isSubmitting?: boolean
  className?: string
}

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (8am–12pm)",
  afternoon: "Afternoon (12–5pm)",
  evening: "Evening (5pm+)",
}

const DURATION_LABELS: Record<string, string> = {
  "30min": "30 minutes",
  "1hour": "1 hour",
  "2hours": "2 hours",
  custom: "Custom",
}

export function BookingReview({
  answers,
  onEdit,
  onConfirm,
  isSubmitting = false,
  className = "",
}: BookingReviewProps) {
  return (
    <motion.div
      className={`w-full max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-warm-md overflow-hidden">
        {/* Event Details */}
        <ReviewSection title="Event Details" onEdit={() => onEdit(1)}>
          <ReviewLine>
            {answers.eventType === "other"
              ? answers.customEventType || "Other"
              : answers.eventType || "—"}
            {answers.eventDate && ` · ${formatDate(answers.eventDate)}`}
          </ReviewLine>
          <ReviewLine>
            {TIME_LABELS[answers.timePreference || ""] ||
              answers.timePreference ||
              ""}
            {answers.venue && ` · ${answers.venue}`}
          </ReviewLine>
          <ReviewLine>
            {answers.guestCount && `${answers.guestCount} guests`}
            {answers.setting && ` · ${answers.setting}`}
          </ReviewLine>
        </ReviewSection>

        {/* Performance */}
        <ReviewSection title="Performance" onEdit={() => onEdit(2)}>
          <ReviewLine>
            {DURATION_LABELS[answers.duration || ""] || answers.customDuration || "—"}
            {answers.musicStyles && answers.musicStyles.length > 0
              ? ` · ${answers.musicStyles.join(", ")}`
              : ""}
          </ReviewLine>
          {answers.songRequests && (
            <ReviewLine>Song: &ldquo;{answers.songRequests}&rdquo;</ReviewLine>
          )}
          {answers.specialRequirements && (
            <ReviewLine>Note: {answers.specialRequirements}</ReviewLine>
          )}
        </ReviewSection>

        {/* Contact */}
        <ReviewSection title="Contact" onEdit={() => onEdit(3)} last>
          <ReviewLine>
            {answers.name || "—"} · {answers.email || "—"}
          </ReviewLine>
          {answers.phone && <ReviewLine>{answers.phone}</ReviewLine>}
        </ReviewSection>
      </div>

      {/* Confirm button */}
      <motion.button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className={`
          mt-5 w-full rounded-full py-3 text-sm font-semibold
          transition-all duration-200 active:scale-[0.98]
          ${
            isSubmitting
              ? "bg-gold/60 text-gray-950/70 cursor-wait"
              : "bg-gold text-gray-950 hover:bg-gold/90 shadow-warm-sm"
          }
        `}
        whileTap={isSubmitting ? undefined : { scale: 0.98 }}
      >
        {isSubmitting ? "Submitting..." : "Confirm Booking Request"}
      </motion.button>

      <p className="text-center text-xs text-muted-foreground mt-3">
        Allan typically responds within 24 hours
      </p>
    </motion.div>
  )
}

// ─── Internal components ─────────────────────────────────────────────────

function ReviewSection({
  title,
  onEdit,
  last = false,
  children,
}: {
  title: string
  onEdit: () => void
  last?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`p-4 ${!last ? "border-b border-border/40" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 transition-colors"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function ReviewLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-foreground leading-relaxed">{children}</p>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}
