import { create } from "zustand"
import { persist } from "zustand/middleware"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Store — Zustand + localStorage persistence
// ═══════════════════════════════════════════════════════════════════════════
// Tracks the entire booking flow state across 4 phases.
// Persisted to localStorage so users can resume mid-flow.

export interface BookingAnswers {
  // Phase 1: Your Event
  eventType: string
  customEventType?: string
  eventDate: string
  timePreference: string
  venue: string
  guestCount: string
  setting: string
  // Phase 2: The Performance
  duration: string
  customDuration?: string
  musicStyles: string[]
  songRequests?: string
  specialRequirements?: string
  // Phase 3: About You
  name: string
  email: string
  phone: string
  referralSource: string
}

// Questions per phase (0-indexed within each phase)
const QUESTIONS_PER_PHASE: Record<number, number> = {
  1: 4, // eventType, date, time, venue card
  2: 4, // duration, musicStyles, songs, special
  3: 1, // contact form card
  4: 1, // review
}

interface BookingState {
  currentPhase: number
  currentQuestion: number
  answers: Partial<BookingAnswers>
  bookingId: string | null
  bookingRef: string | null
  completed: boolean

  // Actions
  setAnswer: <K extends keyof BookingAnswers>(
    key: K,
    value: BookingAnswers[K],
  ) => void
  setAnswers: (partial: Partial<BookingAnswers>) => void
  nextQuestion: () => void
  prevQuestion: () => void
  nextPhase: () => void
  goToPhase: (phase: number, question?: number) => void
  setBookingId: (id: string) => void
  setBookingRef: (ref: string) => void
  complete: () => void
  reset: () => void

  // Derived
  progress: () => number
  isPhaseComplete: (phase: number) => boolean
}

const EMPTY_ANSWERS: Partial<BookingAnswers> = {}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentPhase: 0,
      currentQuestion: 0,
      answers: EMPTY_ANSWERS,
      bookingId: null,
      bookingRef: null,
      completed: false,

      setAnswer: (key, value) =>
        set((s) => ({ answers: { ...s.answers, [key]: value } })),

      setAnswers: (partial) =>
        set((s) => ({ answers: { ...s.answers, ...partial } })),

      nextQuestion: () => {
        const { currentPhase, currentQuestion } = get()
        const maxQ = QUESTIONS_PER_PHASE[currentPhase] ?? 1
        if (currentQuestion < maxQ - 1) {
          set({ currentQuestion: currentQuestion + 1 })
        } else {
          // Auto-advance to next phase
          set({ currentPhase: currentPhase + 1, currentQuestion: 0 })
        }
      },

      prevQuestion: () => {
        const { currentPhase, currentQuestion } = get()
        if (currentQuestion > 0) {
          set({ currentQuestion: currentQuestion - 1 })
        } else if (currentPhase > 1) {
          const prevPhase = currentPhase - 1
          const prevMax = QUESTIONS_PER_PHASE[prevPhase] ?? 1
          set({ currentPhase: prevPhase, currentQuestion: prevMax - 1 })
        }
      },

      nextPhase: () => {
        const { currentPhase } = get()
        set({ currentPhase: currentPhase + 1, currentQuestion: 0 })
      },

      goToPhase: (phase, question = 0) =>
        set({ currentPhase: phase, currentQuestion: question }),

      setBookingId: (id) => set({ bookingId: id }),

      setBookingRef: (ref) => set({ bookingRef: ref }),

      complete: () => set({ completed: true }),

      reset: () =>
        set({
          currentPhase: 0,
          currentQuestion: 0,
          answers: EMPTY_ANSWERS,
          bookingId: null,
          bookingRef: null,
          completed: false,
        }),

      progress: () => {
        const { currentPhase, currentQuestion } = get()
        if (currentPhase <= 0) return 0
        if (currentPhase >= 5) return 100
        // Total questions across phases 1-4
        const totalQ = Object.values(QUESTIONS_PER_PHASE).reduce(
          (a, b) => a + b,
          0,
        )
        let completed = 0
        for (let p = 1; p < currentPhase; p++) {
          completed += QUESTIONS_PER_PHASE[p] ?? 0
        }
        completed += currentQuestion
        return Math.round((completed / totalQ) * 100)
      },

      isPhaseComplete: (phase) => {
        const { answers } = get()
        switch (phase) {
          case 1:
            return !!(
              answers.eventType &&
              answers.eventDate &&
              answers.timePreference &&
              answers.venue &&
              answers.guestCount &&
              answers.setting
            )
          case 2:
            return !!(
              answers.duration &&
              answers.musicStyles &&
              answers.musicStyles.length > 0
            )
          case 3:
            return !!(answers.name && answers.email && answers.phone)
          default:
            return false
        }
      },
    }),
    {
      name: "ap_booking_state",
      version: 1,
    },
  ),
)
