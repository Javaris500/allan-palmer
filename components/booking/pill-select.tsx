"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════
// Pill Select — Single or multi-select chips
// ═══════════════════════════════════════════════════════════════════════════

interface PillOption {
  label: string
  value: string
  description?: string
}

interface PillSelectProps {
  options: PillOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
  className?: string
}

export function PillSelect({
  options,
  value,
  onChange,
  multi = false,
  className = "",
}: PillSelectProps) {
  const selected = Array.isArray(value) ? value : value ? [value] : []

  const toggle = (optionValue: string) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : []
      const next = arr.includes(optionValue)
        ? arr.filter((v) => v !== optionValue)
        : [...arr, optionValue]
      onChange(next)
    } else {
      onChange(optionValue)
    }
  }

  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {options.map((option, i) => {
        const isSelected = selected.includes(option.value)
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={`
              relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm
              font-medium transition-all duration-200 active:scale-[0.97]
              ${
                isSelected
                  ? "bg-gold text-gray-950 shadow-warm-sm"
                  : "bg-muted/60 text-foreground border border-border hover:bg-muted hover:border-gold/30"
              }
            `}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {multi && isSelected && <Check className="h-3.5 w-3.5" />}
            {option.label}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
