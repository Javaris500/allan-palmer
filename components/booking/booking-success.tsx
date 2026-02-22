"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Success — Confirmation screen with animated checkmark
// ═══════════════════════════════════════════════════════════════════════════

interface BookingSuccessProps {
  bookingId: string
  email: string
  className?: string
}

export function BookingSuccess({
  bookingId,
  email,
  className = "",
}: BookingSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className={`flex flex-col items-center text-center px-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated checkmark */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* Outer gold ring */}
        <motion.div
          className="h-20 w-20 rounded-full border-2 border-gold/30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Inner gold circle with check */}
          <motion.div
            className="h-14 w-14 rounded-full bg-gold/15 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 250,
              damping: 20,
            }}
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Check className="h-7 w-7 text-gold" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Gold particle dots */}
        {showConfetti &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-gold/60"
              style={{
                top: "50%",
                left: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i * Math.PI) / 4) * 50,
                y: Math.sin((i * Math.PI) / 4) * 50,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
      </motion.div>

      {/* Text */}
      <motion.h2
        className="text-xl font-serif font-semibold text-foreground mb-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Your booking request has been submitted!
      </motion.h2>

      <motion.p
        className="text-sm text-muted-foreground mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Booking Reference:{" "}
        <span className="font-mono text-foreground">{bookingId}</span>
      </motion.p>

      <motion.p
        className="text-sm text-muted-foreground max-w-sm mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Allan will review your request and reach out within 24 hours to discuss
        details and confirm availability.
      </motion.p>

      <motion.p
        className="text-xs text-muted-foreground/70 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        A confirmation email has been sent to{" "}
        <span className="text-foreground">{email}</span>
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-gold/90 transition-colors active:scale-[0.98]"
        >
          Back to Home
        </Link>
        <Link
          href={`/my-bookings?email=${encodeURIComponent(email)}`}
          className="inline-flex items-center gap-2 bg-muted text-foreground font-medium px-6 py-2.5 rounded-full text-sm hover:bg-muted/80 transition-colors active:scale-[0.98]"
        >
          View My Bookings
        </Link>
      </motion.div>
    </motion.div>
  )
}
