"use client"

import { motion } from "framer-motion"

// ═══════════════════════════════════════════════════════════════════════════
// Chat Bubble — User's answer (right-aligned, gold accent)
// ═══════════════════════════════════════════════════════════════════════════

interface ChatBubbleProps {
  message: string
  /** Whether this bubble is for the currently active answer or a past one */
  faded?: boolean
  className?: string
}

export function ChatBubble({
  message,
  faded = false,
  className = "",
}: ChatBubbleProps) {
  return (
    <motion.div
      className={`flex justify-end ${className}`}
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{
        opacity: faded ? 0.4 : 1,
        y: 0,
        scale: 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5
          bg-gold/10 border border-gold/20 text-foreground text-sm
          ${faded ? "opacity-50" : ""}
        `}
      >
        {message}
      </div>
    </motion.div>
  )
}
