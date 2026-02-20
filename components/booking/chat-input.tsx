"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Mic, MicOff, SkipForward } from "lucide-react"
import { useSpeechToText } from "@/hooks/use-speech-to-text"

// ═══════════════════════════════════════════════════════════════════════════
// Chat Input — Text + mic + send button
// ═══════════════════════════════════════════════════════════════════════════

interface ChatInputProps {
  onSubmit: (text: string) => void
  placeholder?: string
  /** Show a skip button for optional questions */
  showSkip?: boolean
  onSkip?: () => void
  disabled?: boolean
  className?: string
}

export function ChatInput({
  onSubmit,
  placeholder = "Type your answer...",
  showSkip = false,
  onSkip,
  disabled = false,
  className = "",
}: ChatInputProps) {
  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { isSupported, isListening, transcript, start, stop, reset } =
    useSpeechToText()

  // Sync speech transcript into text field
  useEffect(() => {
    if (transcript) {
      setText(transcript)
    }
  }, [transcript])

  // Auto-focus the input
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setText("")
    reset()
    if (isListening) stop()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleMic = () => {
    if (isListening) {
      stop()
    } else {
      start()
    }
  }

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="relative flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-full bg-muted/60 border border-border px-4 py-2.5
            text-sm text-foreground placeholder:text-muted-foreground/60
            focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20
            transition-all duration-200 disabled:opacity-50
            ${isListening ? "border-gold/50 ring-1 ring-gold/30" : ""}
            ${isSupported ? "pr-10" : ""}
          `}
        />

        {/* Mic button (inside input) */}
        {isSupported && (
          <button
            type="button"
            onClick={toggleMic}
            disabled={disabled}
            className={`
              absolute right-2 p-1.5 rounded-full transition-all duration-200
              ${
                isListening
                  ? "text-gold bg-gold/10 animate-pulse"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }
            `}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        className={`
          flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
          transition-all duration-200 active:scale-[0.95]
          ${
            text.trim()
              ? "bg-gold text-gray-950 shadow-warm-sm hover:bg-gold/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }
        `}
      >
        <Send className="h-4 w-4" />
      </button>

      {/* Skip button */}
      {showSkip && (
        <button
          type="button"
          onClick={onSkip}
          disabled={disabled}
          className="flex-shrink-0 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          Skip
          <SkipForward className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  )
}
