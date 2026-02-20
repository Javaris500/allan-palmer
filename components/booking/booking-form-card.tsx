"use client"

import { motion } from "framer-motion"
import { type ReactNode } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Form Card — Glassmorphic card for grouped form fields
// ═══════════════════════════════════════════════════════════════════════════
// Used in Phase 1 (venue details) and Phase 3 (contact info).

interface BookingFormCardProps {
  title: string
  children: ReactNode
  onSubmit: () => void
  submitLabel?: string
  disabled?: boolean
  className?: string
}

export function BookingFormCard({
  title,
  children,
  onSubmit,
  submitLabel = "Continue",
  disabled = false,
  className = "",
}: BookingFormCardProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!disabled) onSubmit()
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`w-full max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-warm-md p-6">
        <h3 className="text-base font-serif font-semibold text-foreground mb-5">
          {title}
        </h3>
        <div className="space-y-4">{children}</div>
        <motion.button
          type="submit"
          disabled={disabled}
          className={`
            mt-6 w-full rounded-full py-2.5 text-sm font-semibold
            transition-all duration-200 active:scale-[0.98]
            ${
              disabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gold text-gray-950 hover:bg-gold/90 shadow-warm-sm"
            }
          `}
          whileTap={disabled ? undefined : { scale: 0.98 }}
        >
          {submitLabel} &rarr;
        </motion.button>
      </div>
    </motion.form>
  )
}

// ─── Reusable form field wrapper ─────────────────────────────────────────

interface FormFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
  error?: string
}

export function FormField({ label, htmlFor, children, error }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-muted-foreground mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">{error}</p>
      )}
    </div>
  )
}

// ─── Styled text input for form cards ─────────────────────────────────────

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function FormInput({ className = "", ...props }: FormInputProps) {
  return (
    <input
      {...props}
      className={`
        w-full rounded-lg bg-muted/40 border border-border px-3 py-2
        text-sm text-foreground placeholder:text-muted-foreground/50
        focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20
        transition-all duration-200
        ${className}
      `}
    />
  )
}
