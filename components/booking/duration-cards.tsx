"use client"

import { motion } from "framer-motion"
import { Clock, MessageSquare } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════
// Duration Cards — Performance duration selection
// ═══════════════════════════════════════════════════════════════════════════

interface DurationOption {
  value: string
  label: string
  description: string
  isCustom?: boolean
}

const DURATION_OPTIONS: DurationOption[] = [
  { value: "30min", label: "30 min", description: "Perfect for ceremonies" },
  { value: "1hour", label: "1 hour", description: "Ideal for cocktail hours" },
  {
    value: "2hours",
    label: "2 hours",
    description: "Great for full receptions",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Tell me more",
    isCustom: true,
  },
]

interface DurationCardsProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DurationCards({
  value,
  onChange,
  className = "",
}: DurationCardsProps) {
  return (
    <motion.div
      className={`grid grid-cols-2 gap-3 ${className}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {DURATION_OPTIONS.map((option, i) => {
        const isSelected = value === option.value
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative flex flex-col items-center gap-2 rounded-xl p-4 text-center
              transition-all duration-200 active:scale-[0.97]
              ${
                isSelected
                  ? "bg-gold/10 border-2 border-gold shadow-warm-sm"
                  : "bg-card/60 border border-border hover:border-gold/30 hover:bg-card/80"
              }
            `}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              className={`rounded-full p-2 ${
                isSelected
                  ? "bg-gold/20 text-gold"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {option.isCustom ? (
                <MessageSquare className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            <span
              className={`text-sm font-semibold ${
                isSelected ? "text-gold" : "text-foreground"
              }`}
            >
              {option.label}
            </span>
            <span className="text-xs text-muted-foreground leading-snug">
              {option.description}
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
