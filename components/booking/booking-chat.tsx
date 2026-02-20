"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useBookingStore } from "@/hooks/use-booking-store"
import { BookingProgress } from "./booking-progress"
import { ChatMessage } from "./chat-message"
import { ChatBubble } from "./chat-bubble"
import { ChatInput } from "./chat-input"
import { PillSelect } from "./pill-select"
import { DurationCards } from "./duration-cards"
import { BookingDatePicker } from "./booking-date-picker"
import {
  BookingFormCard,
  FormField,
  FormInput,
} from "./booking-form-card"
import { BookingReview } from "./booking-review"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Chat — Main orchestrator with AI touchpoints
// ═══════════════════════════════════════════════════════════════════════════

interface BookingChatProps {
  userName: string
  userEmail: string
}

// Phase 1 pill options
const EVENT_TYPES = [
  { label: "Wedding Ceremony", value: "Wedding Ceremony" },
  { label: "Cocktail Hour", value: "Cocktail Hour" },
  { label: "Corporate Event", value: "Corporate Event" },
  { label: "Private Party", value: "Private Party" },
  { label: "Memorial Service", value: "Memorial Service" },
  { label: "Other", value: "other" },
]

const TIME_OPTIONS = [
  { label: "Morning (8am–12pm)", value: "morning" },
  { label: "Afternoon (12–5pm)", value: "afternoon" },
  { label: "Evening (5pm+)", value: "evening" },
]

const GUEST_OPTIONS = [
  { label: "Under 50", value: "Under 50" },
  { label: "50–100", value: "50–100" },
  { label: "100–200", value: "100–200" },
  { label: "200+", value: "200+" },
]

const SETTING_OPTIONS = [
  { label: "Indoor", value: "Indoor" },
  { label: "Outdoor", value: "Outdoor" },
  { label: "Both", value: "Both" },
]

// Phase 2 pill options
const MUSIC_STYLES = [
  { label: "Classical", value: "Classical" },
  { label: "Contemporary Pop", value: "Contemporary Pop" },
  { label: "Jazz & Standards", value: "Jazz & Standards" },
  { label: "Film/TV Scores", value: "Film/TV Scores" },
  { label: "Religious/Hymns", value: "Religious/Hymns" },
  { label: "Custom Mix", value: "Custom Mix" },
]

const REFERRAL_OPTIONS = [
  { label: "Google", value: "Google" },
  { label: "Instagram", value: "Instagram" },
  { label: "TikTok", value: "TikTok" },
  { label: "Wedding Planner", value: "Wedding Planner" },
  { label: "Referral", value: "Referral" },
  { label: "Other", value: "Other" },
]

// Phase transition fallback messages (used when AI is slow/unavailable)
const PHASE_BRIDGE_FALLBACKS: Record<string, string> = {
  "1→2": "Great choices! Now let's talk about the performance itself.",
  "2→3": "Almost done! Just need your contact details.",
  "3→4": "Let's review everything before we send it to Allan.",
}

// Question definitions for the conversational flow
interface Question {
  phase: number
  index: number
  message: string
  answerKey: string
}

const QUESTIONS: Question[] = [
  // Phase 1: Your Event
  { phase: 1, index: 0, message: "What type of event are you planning?", answerKey: "eventType" },
  { phase: 1, index: 1, message: "When is your event?", answerKey: "eventDate" },
  { phase: 1, index: 2, message: "What time of day?", answerKey: "timePreference" },
  { phase: 1, index: 3, message: "A few more details about the venue...", answerKey: "venueCard" },
  // Phase 2: The Performance
  { phase: 2, index: 0, message: "How long would you like the performance?", answerKey: "duration" },
  { phase: 2, index: 1, message: "What kind of music sets the mood?", answerKey: "musicStyles" },
  { phase: 2, index: 2, message: "Any specific songs you'd love to hear?", answerKey: "songRequests" },
  { phase: 2, index: 3, message: "Anything else Allan should know? Staging, power, parking?", answerKey: "specialRequirements" },
  // Phase 3: About You
  { phase: 3, index: 0, message: "Almost there! Let's confirm your contact details.", answerKey: "contactCard" },
  // Phase 4: Review
  { phase: 4, index: 0, message: "", answerKey: "review" },
]

// Duration labels for display
const DURATION_LABELS: Record<string, string> = {
  "30min": "30 minutes",
  "1hour": "1 hour",
  "2hours": "2 hours",
  custom: "Custom",
}

// Time labels for display
const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
}

// ═══════════════════════════════════════════════════════════════════════════
// AI Helper — calls /api/booking/ai
// ═══════════════════════════════════════════════════════════════════════════

async function fetchAIResponse(body: {
  touchpoint: string
  phase: number
  question?: string
  userAnswer?: string
  bookingData?: Record<string, unknown>
  userName?: string
}): Promise<string | null> {
  const MAX_RETRIES = 2
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const res = await fetch("/api/booking/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        if (attempt < MAX_RETRIES) continue
        return null
      }
      const data = await res.json()
      return data.response || null
    } catch {
      if (attempt < MAX_RETRIES) continue
      return null
    }
  }
  return null
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper — get a human-readable label for a user's answer
// ═══════════════════════════════════════════════════════════════════════════

function getAnswerLabel(key: string, value: unknown): string {
  if (!value) return ""
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "string") {
    if (key === "timePreference") return TIME_LABELS[value] || value
    if (key === "duration") return DURATION_LABELS[value] || value
    return value
  }
  return String(value)
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export function BookingChat({ userName, userEmail }: BookingChatProps) {
  const router = useRouter()
  const store = useBookingStore()
  const { currentPhase, currentQuestion, answers } = store

  // Chat state
  const [previousAnswer, setPreviousAnswer] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isAiResponding, setIsAiResponding] = useState(false)
  const [reviewSummary, setReviewSummary] = useState<string | null>(null)

  // Local state for "Other" follow-ups
  const [awaitingOther, setAwaitingOther] = useState(false)
  const [awaitingCustomDuration, setAwaitingCustomDuration] = useState(false)
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})

  // Venue form local state
  const [venueForm, setVenueForm] = useState({
    venue: answers.venue || "",
    guestCount: answers.guestCount || "",
    setting: answers.setting || "",
  })

  // Contact form local state
  const [contactForm, setContactForm] = useState({
    name: answers.name || userName || "",
    email: answers.email || userEmail || "",
    phone: answers.phone || "",
    referralSource: answers.referralSource || "",
  })

  const scrollRef = useRef<HTMLDivElement>(null)

  // Warn before leaving mid-booking
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (currentPhase >= 1 && currentPhase < 5 && !store.completed) {
        e.preventDefault()
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [currentPhase, store.completed])

  // Auto-scroll to bottom on state changes
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }, 100)
  }, [currentPhase, currentQuestion, awaitingOther, awaitingCustomDuration, aiResponse, previousAnswer])

  // Get current question object
  const currentQ = QUESTIONS.find(
    (q) => q.phase === currentPhase && q.index === currentQuestion,
  )

  // Fetch AI review summary when entering Phase 4
  useEffect(() => {
    if (currentPhase === 4 && currentQuestion === 0 && !reviewSummary) {
      setReviewLoading(true)
      fetchAIResponse({
        touchpoint: "REVIEW_SUMMARY",
        phase: 4,
        bookingData: answers as Record<string, unknown>,
        userName: userName?.split(" ")[0],
      }).then((response) => {
        setReviewSummary(
          response || "Here's a summary of your booking request. Please review everything below."
        )
        setReviewLoading(false)
      })
    }
  }, [currentPhase, currentQuestion]) // eslint-disable-line react-hooks/exhaustive-deps

  // Get the display message (with Leia's greeting for first question)
  const [reviewLoading, setReviewLoading] = useState(false)

  const getMessage = useCallback(() => {
    if (currentPhase === 4) {
      return reviewSummary || "Let me put together your booking summary..."
    }
    if (currentPhase === 1 && currentQuestion === 0) {
      const name = userName?.split(" ")[0] || ""
      return name
        ? `Hi ${name}! I'm Leia, and I'll help you book Allan for your event. ${currentQ?.message}`
        : `Hi there! I'm Leia, and I'll help you book Allan for your event. ${currentQ?.message}`
    }
    return currentQ?.message || ""
  }, [currentPhase, currentQuestion, userName, currentQ, reviewSummary])

  // ─── AI-powered advance: shows bubble + optional AI response, then advances ──
  const advanceWithAI = useCallback(
    async (
      answerLabel: string,
      touchpoint?: string,
      touchpointContext?: { question?: string; userAnswer?: string },
    ) => {
      // Show user's answer as a bubble
      setPreviousAnswer(answerLabel)
      setTypewriterDone(false)

      // Check if this question is the last in its phase (phase transition)
      const isLastInPhase =
        currentQ &&
        QUESTIONS.find(
          (q) => q.phase === currentQ.phase && q.index === currentQ.index + 1,
        ) === undefined

      const nextPhase = isLastInPhase ? currentPhase + 1 : currentPhase

      // Determine which AI touchpoint to call
      let aiTouchpoint = touchpoint
      if (!aiTouchpoint && isLastInPhase && nextPhase <= 4) {
        aiTouchpoint = "PHASE_TRANSITION"
      }

      if (aiTouchpoint) {
        setIsAiResponding(true)
        const response = await fetchAIResponse({
          touchpoint: aiTouchpoint,
          phase: currentPhase,
          question: touchpointContext?.question || currentQ?.message,
          userAnswer: touchpointContext?.userAnswer || answerLabel,
          bookingData: answers as Record<string, unknown>,
          userName: userName?.split(" ")[0],
        })

        // Use AI response or fallback
        const fallback =
          aiTouchpoint === "PHASE_TRANSITION"
            ? PHASE_BRIDGE_FALLBACKS[`${currentPhase}→${nextPhase}`]
            : null
        setAiResponse(response || fallback || null)
        setIsAiResponding(false)
      } else {
        // No AI needed — advance immediately after a brief pause
        setTimeout(() => {
          setPreviousAnswer(null)
          setAiResponse(null)
          store.nextQuestion()
        }, 300)
      }
    },
    [currentPhase, currentQ, answers, userName, store],
  )

  // Called when AI response typewriter finishes — advance to next question
  const handleAiResponseComplete = useCallback(() => {
    setTimeout(() => {
      setPreviousAnswer(null)
      setAiResponse(null)
      store.nextQuestion()
    }, 600)
  }, [store])

  // ─── Answer handlers ───────────────────────────────────────────────────

  const handleAnswer = useCallback(
    (key: string, value: string | string[]) => {
      store.setAnswer(key as keyof typeof answers, value as never)

      // Check for "Other" selections that need follow-up
      if (key === "eventType" && value === "other") {
        setAwaitingOther(true)
        return
      }
      if (key === "duration" && value === "custom") {
        setAwaitingCustomDuration(true)
        return
      }

      const label = getAnswerLabel(key, value)
      advanceWithAI(label)
    },
    [store, answers, advanceWithAI],
  )

  const handleOtherSubmit = useCallback(
    (text: string) => {
      store.setAnswer("customEventType", text)
      setAwaitingOther(false)
      advanceWithAI(text, "OTHER_FOLLOWUP", {
        question: "What type of event is it?",
        userAnswer: text,
      })
    },
    [store, advanceWithAI],
  )

  const handleCustomDurationSubmit = useCallback(
    (text: string) => {
      store.setAnswer("customDuration", text)
      setAwaitingCustomDuration(false)
      advanceWithAI(text)
    },
    [store, advanceWithAI],
  )

  const handleMusicConfirm = useCallback(() => {
    if (answers.musicStyles && answers.musicStyles.length > 0) {
      const label = answers.musicStyles.join(", ")
      advanceWithAI(label)
    }
  }, [answers.musicStyles, advanceWithAI])

  const handleVenueSubmit = useCallback(() => {
    store.setAnswers({
      venue: venueForm.venue,
      guestCount: venueForm.guestCount,
      setting: venueForm.setting,
    })
    const label = `${venueForm.venue} · ${venueForm.guestCount} guests · ${venueForm.setting}`
    advanceWithAI(label)
  }, [store, venueForm, advanceWithAI])

  const handleSongSubmit = useCallback(
    (text: string) => {
      store.setAnswer("songRequests", text)
      advanceWithAI(text, "SONG_RESPONSE", {
        question: "Any specific songs you'd love to hear?",
        userAnswer: text,
      })
    },
    [store, advanceWithAI],
  )

  const handleSpecialRequirements = useCallback(
    (text: string) => {
      store.setAnswer("specialRequirements", text)
      advanceWithAI(text, "SPECIAL_REQUIREMENTS", {
        question: "Anything else Allan should know?",
        userAnswer: text,
      })
    },
    [store, advanceWithAI],
  )

  const handleContactSubmit = useCallback(() => {
    const errors: Record<string, string> = {}

    if (!contactForm.name.trim()) errors.name = "Name is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contactForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(contactForm.email)) {
      errors.email = "Please enter a valid email"
    }

    const phoneDigits = contactForm.phone.replace(/\D/g, "")
    if (!contactForm.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = "Please enter a valid phone number"
    }

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors)
      return
    }

    setContactErrors({})
    store.setAnswers({
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      referralSource: contactForm.referralSource,
    })
    const label = `${contactForm.name.trim()} · ${contactForm.email.trim()}`
    advanceWithAI(label)
  }, [store, contactForm, advanceWithAI])

  // Handle booking submission → redirect to success page
  const handleConfirmBooking = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      })
      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.")
        return
      }

      // Store booking info and redirect to success page
      if (data.bookingId) store.setBookingId(data.bookingId)
      if (data.reference) store.setBookingRef(data.reference)
      store.complete()

      const ref = data.reference || data.bookingId || ""
      const email = encodeURIComponent(answers.email || userEmail)
      router.push(`/booking/success?ref=${ref}&email=${email}`)
    } catch {
      setSubmitError("Unable to connect. Please check your internet and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [answers, store, router, userEmail])

  // Handle edit from review screen
  const handleEdit = useCallback(
    (phase: number) => {
      store.goToPhase(phase, 0)
      setTypewriterDone(false)
      setReviewSummary(null)
      setPreviousAnswer(null)
      setAiResponse(null)
    },
    [store],
  )

  // Back button handler
  const handleBack = useCallback(() => {
    setTypewriterDone(false)
    setAwaitingOther(false)
    setAwaitingCustomDuration(false)
    setPreviousAnswer(null)
    setAiResponse(null)
    store.prevQuestion()
  }, [store])

  // ─── Render ──────────────────────────────────────────────────────────────

  const canGoBack = currentPhase > 1 || currentQuestion > 0

  // If showing AI response interstitial (bubble + AI message)
  const isInAiInterstitial = !!(previousAnswer && (aiResponse || isAiResponding))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with progress */}
      <div className="flex-shrink-0 px-4 pt-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {canGoBack && !isInAiInterstitial && (
            <button
              type="button"
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex-1">
            <BookingProgress currentPhase={currentPhase} />
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 flex items-center"
      >
        <div className="max-w-md mx-auto w-full space-y-4">
          <AnimatePresence mode="wait">
            {isInAiInterstitial ? (
              // ─── AI interstitial: user bubble + AI acknowledgment ──────
              <motion.div
                key="ai-interstitial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <ChatBubble message={previousAnswer!} />
                {aiResponse && (
                  <ChatMessage
                    message={aiResponse}
                    onComplete={handleAiResponseComplete}
                  />
                )}
                {isAiResponding && !aiResponse && (
                  <motion.div
                    className="flex items-start gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="h-8 w-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-gold">L</span>
                    </div>
                    <div className="flex gap-1 pt-2.5">
                      <span className="h-2 w-2 rounded-full bg-gold/40 animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-gold/40 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-gold/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // ─── Normal question flow ──────────────────────────────────
              <motion.div
                key={`${currentPhase}-${currentQuestion}-${awaitingOther}-${awaitingCustomDuration}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Previous answer bubble (non-AI questions show it briefly) */}
                {previousAnswer && !aiResponse && (
                  <ChatBubble message={previousAnswer} faded />
                )}

                {/* AI message */}
                {currentQ && (
                  <ChatMessage
                    message={
                      awaitingOther
                        ? "What type of event is it?"
                        : awaitingCustomDuration
                          ? "How long are you thinking?"
                          : getMessage()
                    }
                    onComplete={() => setTypewriterDone(true)}
                  />
                )}

                {/* Input area — shown after typewriter completes */}
                {typewriterDone && renderInput()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  // ─── Render the correct input for current question ─────────────────────

  function renderInput() {
    // "Other" follow-up
    if (awaitingOther) {
      return (
        <ChatInput
          onSubmit={handleOtherSubmit}
          placeholder="e.g., Fundraiser gala, Anniversary dinner..."
        />
      )
    }

    // Custom duration follow-up
    if (awaitingCustomDuration) {
      return (
        <ChatInput
          onSubmit={handleCustomDurationSubmit}
          placeholder="e.g., 3 hours with a break"
        />
      )
    }

    if (!currentQ) return null

    // Phase 1
    if (currentPhase === 1) {
      switch (currentQuestion) {
        case 0: // Event type (pill select, single)
          return (
            <PillSelect
              options={EVENT_TYPES}
              value={answers.eventType || ""}
              onChange={(v) => handleAnswer("eventType", v as string)}
            />
          )
        case 1: // Date picker
          return (
            <div className="space-y-3">
              <BookingDatePicker
                value={answers.eventDate || ""}
                onChange={(v) => store.setAnswer("eventDate", v)}
              />
              {answers.eventDate && (
                <motion.button
                  type="button"
                  onClick={() => {
                    const label = new Date(answers.eventDate!).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    advanceWithAI(label)
                  }}
                  className="w-full max-w-sm mx-auto block rounded-full bg-gold text-gray-950 py-2.5 text-sm font-semibold hover:bg-gold/90 transition-colors active:scale-[0.98]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Confirm Date
                </motion.button>
              )}
            </div>
          )
        case 2: // Time of day (pill select)
          return (
            <PillSelect
              options={TIME_OPTIONS}
              value={answers.timePreference || ""}
              onChange={(v) => handleAnswer("timePreference", v as string)}
            />
          )
        case 3: // Venue form card
          return (
            <BookingFormCard
              title="A few more details about the venue..."
              onSubmit={handleVenueSubmit}
              submitLabel="Continue"
              disabled={
                !venueForm.venue || !venueForm.guestCount || !venueForm.setting
              }
            >
              <FormField label="Venue / Location">
                <FormInput
                  placeholder="Venue name, City"
                  value={venueForm.venue}
                  onChange={(e) =>
                    setVenueForm((f) => ({ ...f, venue: e.target.value }))
                  }
                />
              </FormField>
              <FormField label="Expected Guests">
                <PillSelect
                  options={GUEST_OPTIONS}
                  value={venueForm.guestCount}
                  onChange={(v) =>
                    setVenueForm((f) => ({ ...f, guestCount: v as string }))
                  }
                />
              </FormField>
              <FormField label="Setting">
                <PillSelect
                  options={SETTING_OPTIONS}
                  value={venueForm.setting}
                  onChange={(v) =>
                    setVenueForm((f) => ({ ...f, setting: v as string }))
                  }
                />
              </FormField>
            </BookingFormCard>
          )
      }
    }

    // Phase 2
    if (currentPhase === 2) {
      switch (currentQuestion) {
        case 0: // Duration (card select)
          return (
            <DurationCards
              value={answers.duration || ""}
              onChange={(v) => handleAnswer("duration", v)}
            />
          )
        case 1: // Music styles (pill select, multi)
          return (
            <div className="space-y-3">
              <PillSelect
                options={MUSIC_STYLES}
                value={answers.musicStyles || []}
                onChange={(v) => store.setAnswer("musicStyles", v as string[])}
                multi
              />
              {answers.musicStyles && answers.musicStyles.length > 0 && (
                <motion.button
                  type="button"
                  onClick={handleMusicConfirm}
                  className="w-full max-w-sm mx-auto block rounded-full bg-gold text-gray-950 py-2.5 text-sm font-semibold hover:bg-gold/90 transition-colors active:scale-[0.98]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Confirm Selection
                </motion.button>
              )}
            </div>
          )
        case 2: // Song requests (optional text)
          return (
            <ChatInput
              onSubmit={handleSongSubmit}
              placeholder='e.g., Canon in D for the processional'
              showSkip
              onSkip={() => {
                advanceWithAI("Skipped")
              }}
            />
          )
        case 3: // Special requirements (optional text)
          return (
            <ChatInput
              onSubmit={handleSpecialRequirements}
              placeholder="e.g., Outdoor ceremony, need power outlet..."
              showSkip
              onSkip={() => {
                advanceWithAI("No special requirements")
              }}
            />
          )
      }
    }

    // Phase 3: Contact form
    if (currentPhase === 3 && currentQuestion === 0) {
      return (
        <BookingFormCard
          title="Almost there! Let's confirm your details."
          onSubmit={handleContactSubmit}
          submitLabel="Review Booking"
          disabled={
            !contactForm.name || !contactForm.email || !contactForm.phone
          }
        >
          <FormField label="Full Name" htmlFor="booking-name" error={contactErrors.name}>
            <FormInput
              id="booking-name"
              placeholder="Your full name"
              value={contactForm.name}
              onChange={(e) => {
                setContactForm((f) => ({ ...f, name: e.target.value }))
                if (contactErrors.name) setContactErrors((prev) => ({ ...prev, name: "" }))
              }}
            />
          </FormField>
          <FormField label="Email" htmlFor="booking-email" error={contactErrors.email}>
            <FormInput
              id="booking-email"
              type="email"
              placeholder="you@email.com"
              value={contactForm.email}
              onChange={(e) => {
                setContactForm((f) => ({ ...f, email: e.target.value }))
                if (contactErrors.email) setContactErrors((prev) => ({ ...prev, email: "" }))
              }}
            />
          </FormField>
          <FormField label="Phone" htmlFor="booking-phone" error={contactErrors.phone}>
            <FormInput
              id="booking-phone"
              type="tel"
              placeholder="(204) 555-0123"
              value={contactForm.phone}
              onChange={(e) => {
                setContactForm((f) => ({ ...f, phone: e.target.value }))
                if (contactErrors.phone) setContactErrors((prev) => ({ ...prev, phone: "" }))
              }}
            />
          </FormField>
          <FormField label="How did you hear about Allan?">
            <PillSelect
              options={REFERRAL_OPTIONS}
              value={contactForm.referralSource}
              onChange={(v) =>
                setContactForm((f) => ({
                  ...f,
                  referralSource: v as string,
                }))
              }
            />
          </FormField>
        </BookingFormCard>
      )
    }

    // Phase 4: Review
    if (currentPhase === 4 && currentQuestion === 0) {
      return (
        <div className="space-y-3">
          <BookingReview
            answers={answers}
            onEdit={handleEdit}
            onConfirm={handleConfirmBooking}
            isSubmitting={isSubmitting}
          />
          {submitError && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 text-center"
            >
              {submitError}
            </motion.p>
          )}
        </div>
      )
    }

    return null
  }
}
