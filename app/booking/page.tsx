"use client"

import { useBookingStore } from "@/hooks/use-booking-store"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { BookingChat } from "@/components/booking/booking-chat"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Page — authless
// Phase 0: Leia introduces herself
// After Get Started: hands off to the booking chat flow
// ═══════════════════════════════════════════════════════════════════════════

export default function BookingPage() {
  const store = useBookingStore()

  // Already in the chat flow
  if (store.currentPhase >= 1 && !store.completed) {
    return <BookingChat userName="" userEmail="" />
  }

  const handleGetStarted = () => {
    store.goToPhase(1, 0)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Leia avatar */}
        <motion.div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <span className="text-2xl font-serif font-bold text-gold">L</span>
        </motion.div>

        <motion.p
          className="text-sm font-medium text-gold mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Meet Leia
        </motion.p>

        <motion.h1
          className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Every great event deserves the perfect soundtrack.
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          I&rsquo;ll help you book Allan for yours.
        </motion.p>

        <motion.button
          onClick={handleGetStarted}
          className="inline-flex items-center gap-2 bg-gold text-gray-950 font-semibold px-8 py-3.5 rounded-full text-base hover:bg-gold/90 transition-colors active:scale-[0.98]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Calendar className="h-4 w-4" />
          Get Started
        </motion.button>
      </motion.div>
    </div>
  )
}
