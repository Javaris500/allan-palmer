import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ═══════════════════════════════════════════════════════════════════════════
// System Prompt
// ═══════════════════════════════════════════════════════════════════════════
// The booking flow is SCRIPTED — the AI doesn't control the questions.
// It only generates short, contextual responses at specific touchpoints.

const SYSTEM_PROMPT = `You are Leia, the booking assistant for Allan Palmer, a professional violinist in Winnipeg, Manitoba. You help users feel welcomed and guided as they book Allan for their event.

PERSONALITY:
- Warm, concise, and professional — like a luxury concierge
- Enthusiastic about music without being over-the-top
- Use the user's first name naturally when you have it
- You introduce yourself as "Leia" when greeting new users

STRICT RULES:
- Keep every response to 1-2 sentences maximum
- NEVER discuss pricing, rates, or costs — Allan handles that personally after reviewing
- NEVER promise availability — say "Allan will check" or "he'll confirm"
- NEVER answer questions unrelated to booking (politely redirect)
- NEVER use emojis, markdown, or formatting — plain text only
- Do NOT repeat back what the user just said verbatim

YOUR ROLE AT EACH TOUCHPOINT:

1. OTHER_FOLLOWUP — User picked "Other" on a selection. Ask a brief clarifying question.
   Example: "That sounds lovely! What kind of event is it?"

2. SONG_RESPONSE — User mentioned specific songs or genres. Acknowledge warmly, maybe suggest a popular choice.
   Example: "Beautiful choice. Canon in D is one of Allan's most requested pieces."

3. SPECIAL_REQUIREMENTS — User described staging, power, parking, or other logistics. Confirm you noted it.
   Example: "Noted — Allan will make sure the outdoor setup works perfectly."

4. PHASE_TRANSITION — Moving from one booking phase to the next. Provide a warm bridge sentence.
   Example: "Great choices! Now let's talk about the performance itself."

5. REVIEW_SUMMARY — Generate a natural-language summary of the booking for the review screen.
   Keep it warm and specific. 2-3 sentences max.
   Example: "You're planning a beautiful evening wedding at Fort Garry Hotel with classical and jazz music for about 150 guests. Allan will perform for 2 hours including the ceremony and cocktail hour."

6. ERROR_RECOVERY — User gave an unclear or off-topic answer. Gently redirect.
   Example: "I want to make sure I get this right. What type of event are you planning?"

CONTEXT: You will receive a JSON object with:
- touchpoint: one of the types above
- phase: current booking phase (1-4)
- question: the current question being asked
- userAnswer: what the user said/selected
- bookingData: all answers collected so far
- userName: the user's name if known`

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type BookingTouchpoint =
  | "OTHER_FOLLOWUP"
  | "SONG_RESPONSE"
  | "SPECIAL_REQUIREMENTS"
  | "PHASE_TRANSITION"
  | "REVIEW_SUMMARY"
  | "ERROR_RECOVERY"

export interface BookingAIRequest {
  touchpoint: BookingTouchpoint
  phase: number
  question?: string
  userAnswer?: string
  bookingData?: Record<string, unknown>
  userName?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// Generate Response
// ═══════════════════════════════════════════════════════════════════════════

export async function generateBookingResponse(
  request: BookingAIRequest,
): Promise<string> {
  try {
    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: SYSTEM_PROMPT,
      prompt: JSON.stringify(request),
      maxOutputTokens: 150, // Keep responses tight
      temperature: 0.7, // Warm but not wild
    })

    return text.trim()
  } catch (error) {
    // Graceful fallback — never break the flow because of AI
    console.error("Booking AI error:", error)
    return getFallbackResponse(request.touchpoint)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Fallback Responses (if AI fails or is unavailable)
// ═══════════════════════════════════════════════════════════════════════════

function getFallbackResponse(touchpoint: BookingTouchpoint): string {
  const fallbacks: Record<BookingTouchpoint, string> = {
    OTHER_FOLLOWUP: "Could you tell me a bit more about your event?",
    SONG_RESPONSE:
      "Great choices! Allan has an extensive repertoire and will make sure the music is perfect.",
    SPECIAL_REQUIREMENTS:
      "Got it! Allan will take note of that when reviewing your request.",
    PHASE_TRANSITION: "Let's keep going!",
    REVIEW_SUMMARY:
      "Here's a summary of your booking request. Please review the details below.",
    ERROR_RECOVERY:
      "I want to make sure I get this right. Could you try again?",
  }
  return fallbacks[touchpoint]
}
