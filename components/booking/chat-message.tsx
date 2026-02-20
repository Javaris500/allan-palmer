"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

// ═══════════════════════════════════════════════════════════════════════════
// Chat Message — AI typewriter effect
// ═══════════════════════════════════════════════════════════════════════════
// Leia's messages type in character by character, then trigger onComplete.

interface ChatMessageProps {
  message: string
  /** Speed in ms per character */
  speed?: number
  /** Skip typewriter and show full message immediately */
  instant?: boolean
  onComplete?: () => void
  className?: string
}

export function ChatMessage({
  message,
  speed = 30,
  instant = false,
  onComplete,
  className = "",
}: ChatMessageProps) {
  const [displayed, setDisplayed] = useState(instant ? message : "")
  const [isDone, setIsDone] = useState(instant)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (instant) {
      setDisplayed(message)
      setIsDone(true)
      onCompleteRef.current?.()
      return
    }

    setDisplayed("")
    setIsDone(false)
    let i = 0

    const interval = setInterval(() => {
      i++
      setDisplayed(message.slice(0, i))
      if (i >= message.length) {
        clearInterval(interval)
        setIsDone(true)
        onCompleteRef.current?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [message, speed, instant])

  return (
    <motion.div
      className={`flex items-start gap-3 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Leia avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-8 w-8 rounded-full bg-gold/15 flex items-center justify-center">
          <span className="text-xs font-semibold text-gold">L</span>
        </div>
      </div>

      {/* Message bubble */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground mb-1">Leia</p>
        <p className="text-base text-foreground leading-relaxed">
          {displayed}
          {!isDone && (
            <span className="inline-block w-0.5 h-4 bg-gold ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </motion.div>
  )
}
