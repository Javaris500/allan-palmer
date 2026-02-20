"use client"

import { motion } from "framer-motion"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Progress — Gold dot progress indicator
// ═══════════════════════════════════════════════════════════════════════════
// 4 dots with connecting lines. Active dot elongates into a pill.

interface BookingProgressProps {
  currentPhase: number
  totalPhases?: number
}

export function BookingProgress({
  currentPhase,
  totalPhases = 4,
}: BookingProgressProps) {
  // Don't show on phase 0 (welcome) or phase 5 (success)
  if (currentPhase < 1 || currentPhase > totalPhases) return null

  const PHASE_LABELS = ["Event Details", "Performance", "Contact", "Review"]

  return (
    <div className="flex items-center justify-center gap-1.5 py-4" role="group" aria-label="Booking progress">
      {Array.from({ length: totalPhases }, (_, i) => {
        const phase = i + 1
        const isActive = phase === currentPhase
        const isComplete = phase < currentPhase

        return (
          <div key={phase} className="flex items-center gap-1.5">
            <motion.div
              aria-current={isActive ? "step" : undefined}
              aria-label={`Step ${phase}: ${PHASE_LABELS[i]}${isComplete ? " (complete)" : isActive ? " (current)" : ""}`}
              role="progressbar"
              className={`
                rounded-full transition-colors duration-300
                ${
                  isActive
                    ? "bg-gold"
                    : isComplete
                      ? "bg-gold/60"
                      : "bg-muted-foreground/20"
                }
              `}
              animate={{
                width: isActive ? 24 : 8,
                height: 8,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            {/* Connector line between dots */}
            {phase < totalPhases && (
              <div
                className={`h-px w-6 transition-colors duration-300 ${
                  isComplete ? "bg-gold/40" : "bg-muted-foreground/15"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
