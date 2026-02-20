"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// Speech-to-Text Hook — Web Speech API
// ═══════════════════════════════════════════════════════════════════════════
// Browser built-in, no cost, works in Chrome/Edge/Safari.
// Graceful fallback: `isSupported` is false if unavailable.

interface UseSpeechToTextReturn {
  isSupported: boolean
  isListening: boolean
  transcript: string
  start: () => void
  stop: () => void
  reset: () => void
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null
    setIsSupported(!!SpeechRecognition)

    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = ""
      let interim = ""
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result) continue
        if (result.isFinal) {
          final += result[0]?.transcript ?? ""
        } else {
          interim += result[0]?.transcript ?? ""
        }
      }
      setTranscript(final + interim)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [])

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return
    setTranscript("")
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      // Already started or not supported
    }
  }, [isListening])

  const stop = useCallback(() => {
    if (!recognitionRef.current || !isListening) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [isListening])

  const reset = useCallback(() => {
    setTranscript("")
  }, [])

  return { isSupported, isListening, transcript, start, stop, reset }
}
