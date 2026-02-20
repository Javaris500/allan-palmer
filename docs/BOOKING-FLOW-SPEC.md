# Booking Flow — Full Specification

## Overview

A conversational, chat-driven booking experience at `/booking` where an AI agent guides users through booking Allan Palmer for their event. Combines chat-style single questions with compact form cards for grouped fields. Ends with email confirmation via Resend.

---

## Entry Points

- **Services page** → "Ready to Book" gold CTA button
- **Navigation menu** → "Book" replaces "Contact" in the nav
- **Homepage hero** → Can link to `/booking` from CTAs
- `/contact` still exists but is removed from nav (accessible via footer for general inquiries)

---

## Design System (Adapted from Onboarding)

| Element | Allan Palmer Adaptation |
|---------|------------------------|
| Background | Dark bg matching site theme |
| Accent color | Gold (#d4a843) gradient instead of purple/indigo |
| Glass cards | `bg-card/80 backdrop-blur-xl border-gold/10` |
| Progress dots | Gold active dot (elongates into pill shape) |
| Pill select | Gold selected bg with dark text |
| Typewriter | AI agent types questions character by character |
| Chat bubbles | User answers appear as gold-accented right-aligned bubbles |
| Animations | Framer Motion slide transitions between questions/phases |

---

## Chat Interface Components

### Chat Input Field
- Text input at bottom of each question
- Enter key or arrow button submits
- **Microphone button** for speech-to-text (Web Speech API — browser built-in, free, no backend)
  - User taps/holds mic icon → speaks → words transcribe into the text field in real-time
  - User reviews transcribed text → hits send
  - Mic icon pulses gold while recording
- For pill-select questions, typing in the chat input triggers fuzzy matching on available options

### Chat Thread Behavior
- **Previous answers fade out** as the user progresses to the next question within a phase
- Only the current question is prominent
- **Back button** available to revisit previous answers within the phase
- When going back, the previous question fades in with the user's existing answer pre-filled
- Moving to a new phase resets the chat view (clean slate for the new topic)

### "Other" Selection
- When user picks "Other" on any pill select, the chat input becomes the primary focus
- AI follow-up: "What type of event is it?" → user types custom answer in chat input
- Custom answer appears as their chat bubble and is stored in booking state

---

## Auth Flow

- **Auth required at the beginning** (Phase 0)
- User clicks "Get Started" → auth modal opens immediately
- After sign-in/register → booking flow begins
- If already signed in → skips straight to Phase 1
- User's name and email are pre-filled in Phase 3 from their session

---

## Flow Phases

Progress bar shows **4 phases**. Within each phase, the AI agent asks questions conversationally.

### Phase 0: Welcome (No Progress Bar)

```
[Violin silhouette icon with gold glow]

"Every great event deserves the perfect soundtrack."  ← typewriter line 1
"Let's plan yours."                                   ← typewriter line 2 (300ms delay)

         [ Get Started ]  ← gold pill button, fades in after typing completes
```

- AI agent name: TBD (placeholder for now, easy to swap in)
- Clicking "Get Started" → auth modal if not signed in, then Phase 1
- Subtle background: blurred performance photo at low opacity

---

### Phase 1: Your Event `[●━━○━━○━━○]`

**Q1 — Chat (pill select, single)**
> "What type of event are you planning?"

Pills: Wedding Ceremony | Cocktail Hour | Corporate Event | Private Party | Memorial Service | Other

If "Other" → follow-up: "What type of event is it?" → chat input

User's answer fades in as gold bubble → fades out → next question appears.

**Q2 — Chat (date picker)**
> "When is your event?"

Custom-styled date picker appears inline (not native browser picker). Min date = tomorrow. Calendar component with gold accent on selected date.

**Q3 — Chat (pill select, single)**
> "What time of day?"

Pills: Morning (8am–12pm) | Afternoon (12–5pm) | Evening (5pm+)

**Q4 — Form card**
> "A few more details about the venue..."

Compact glassmorphic card with:
- **Venue / Location** — text input, placeholder: "Venue name, City"
- **Expected Guests** — pill select: Under 50 | 50–100 | 100–200 | 200+
- **Setting** — pill select: Indoor | Outdoor | Both

"Continue →" button advances to Phase 2.

---

### Phase 2: The Performance `[●━━●━━○━━○]`

**Q5 — Chat (card select, single)**
> "How long would you like the performance?"

Duration cards (no pricing — inquiry-based):

| 30 min | 1 hour | 2 hours | Custom |
|--------|--------|---------|--------|
| Perfect for ceremonies | Ideal for cocktail hours | Great for full receptions | Tell me more |

If "Custom" → chat input: "How long are you thinking?"

**Q6 — Chat (pill select, multi)**
> "What kind of music sets the mood?"

Pills (multi-select, user can pick several): Classical | Contemporary Pop | Jazz & Standards | Film/TV Scores | Religious/Hymns | Custom Mix

**Q7 — Chat (text input, optional)**
> "Any specific songs you'd love to hear?"

Chat input field. "Skip" button available.
Placeholder: "e.g., Canon in D for the processional"

**Q8 — Chat (text input, optional)**
> "Anything else Allan should know? Staging, power, parking?"

Chat input field. "Skip" button available.

---

### Phase 3: About You `[●━━●━━●━━○]`

**Form card** (pre-filled from auth session)
> "Almost there! Let's confirm your contact details."

Glassmorphic card with:
- **Full Name** — text input (pre-filled from session)
- **Email** — email input (pre-filled from session)
- **Phone** — phone input with formatting hint: (204) 555-0123
- **How did you hear about Allan?** — pill select: Google | Instagram | TikTok | Wedding Planner | Referral | Other

"Review Booking →" button

---

### Phase 4: Review & Confirm `[●━━●━━●━━●]`

**Summary card** with all answers organized by section:

```
┌─────────────────────────────────────────┐
│  Event Details                   [Edit] │
│  Wedding Ceremony · June 15, 2026       │
│  Evening · The Fort Garry Hotel         │
│  100–200 guests · Indoor                │
├─────────────────────────────────────────┤
│  Performance                     [Edit] │
│  2 hours · Classical, Jazz & Standards  │
│  Song: "Canon in D" for processional    │
├─────────────────────────────────────────┤
│  Contact                         [Edit] │
│  Jane Smith · jane@email.com            │
│  (204) 555-0123                         │
└─────────────────────────────────────────┘

         [ Confirm Booking Request ]  ← gold button

  "Allan typically responds within 24 hours"
```

- Each [Edit] link jumps back to that specific phase
- After editing, user returns to review

---

### Phase 5: Confirmation (Success Screen, No Progress Bar)

```
[Animated checkmark with gold ring]

"Your booking request has been submitted!"

Booking Reference: #BK-20260215-A3F7

Allan will review your request and reach out
within 24 hours to discuss details and confirm availability.

A confirmation email has been sent to jane@email.com

     [ View My Bookings ]     [ Back to Home ]
```

- Subtle gold particle or confetti animation on success
- Email sent to user via `sendBookingConfirmation()` with booking ID + all details
- Email sent to Allan via `sendAdminNotification()` with full booking summary

---

## Email Triggers

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Booking submitted | User | Confirmation with booking ref, event summary, "Allan will respond within 24 hours" |
| Booking submitted | Allan (admin) | Full booking details, user contact info, event type, date, preferences |

Both emails use dark-themed HTML templates with gold (#d4a843) branding (already built in `lib/resend.ts`).

---

## State Management

### Booking Store (`useBookingStore`)
- Persisted to `localStorage` key `ap_booking_state`
- Enables resume if user leaves mid-flow
- Tracks: `currentPhase`, `currentQuestion`, `answers`, `bookingId`, `completed`
- Methods: `nextQuestion()`, `prevQuestion()`, `nextPhase()`, `goToPhase()`, `setAnswer()`, `reset()`
- Derived: `bookingProgress` (percentage), `isComplete` (boolean)

### Answer Shape
```typescript
interface BookingAnswers {
  // Phase 1
  eventType: string
  customEventType?: string
  eventDate: string
  timePreference: string
  venue: string
  guestCount: string
  setting: string

  // Phase 2
  duration: string
  customDuration?: string
  musicStyles: string[]
  songRequests?: string
  specialRequirements?: string

  // Phase 3
  name: string
  email: string
  phone: string
  referralSource: string
}
```

---

## My Bookings Dashboard (`/my-bookings`)

Accessible after booking confirmation and from user menu when signed in.

### Layout
- Clean dashboard with booking cards
- Each card shows: booking ref, event type, date, status badge
- Expandable for full details
- Status badges with colors:
  - **Pending** (gold) — Allan hasn't responded yet
  - **Confirmed** (green) — Allan confirmed the booking
  - **Completed** (muted) — Event has passed
  - **Cancelled** (red) — Booking was cancelled

### Features
- View all bookings (upcoming and past)
- See full booking details when expanded
- Allan can send messages/updates per booking (visible to user)
- Status timeline: Submitted → Reviewed → Confirmed → Event Day → Completed

---

## Navigation Update

### Before
```
Home | About | Repertoire | Gallery | Contact
```

### After
```
Home | About | Repertoire | Gallery | Book
```

- "Book" links to `/booking`
- `/contact` still exists, linked in footer for general inquiries
- `/contact` removed from main navigation

---

## Technical Implementation

### New Files to Create
| File | Purpose |
|------|---------|
| `app/booking/page.tsx` | Booking page route |
| `components/booking/booking-chat.tsx` | Main chat orchestrator |
| `components/booking/chat-message.tsx` | AI typewriter message |
| `components/booking/chat-bubble.tsx` | User answer bubble |
| `components/booking/chat-input.tsx` | Text input + mic button + send |
| `components/booking/pill-select.tsx` | Reusable pill chips (single/multi) |
| `components/booking/duration-cards.tsx` | Performance duration selection |
| `components/booking/date-picker.tsx` | Custom styled date picker |
| `components/booking/booking-progress.tsx` | Gold progress indicator |
| `components/booking/booking-review.tsx` | Summary card with edit links |
| `components/booking/booking-success.tsx` | Confirmation screen |
| `hooks/use-booking-store.ts` | localStorage-persisted booking state |
| `hooks/use-speech-to-text.ts` | Web Speech API hook |
| `app/my-bookings/page.tsx` | User bookings dashboard |
| `components/bookings/booking-card.tsx` | Individual booking card |
| `components/bookings/status-badge.tsx` | Status pill with color |

### Database Changes (Prisma)
Add `Booking` model to `prisma/schema.prisma`:
- id, reference number, userId, status
- Event fields: type, date, time, venue, guestCount, setting
- Performance fields: duration, musicStyles, songRequests, specialRequirements
- Contact fields: name, email, phone, referralSource
- Timestamps: createdAt, updatedAt
- Relation to User model

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `POST /api/booking` | POST | Submit booking (update existing route) |
| `GET /api/bookings` | GET | Fetch user's bookings |
| `PATCH /api/bookings/[id]` | PATCH | Update booking status (admin) |

---

## Speech-to-Text Details

- Uses browser's built-in **Web Speech API** (`webkitSpeechRecognition` / `SpeechRecognition`)
- No backend, no cost, works in Chrome/Edge/Safari
- Mic icon in chat input field (right side, next to send button)
- **Recording state**: mic icon pulses gold, waveform animation in input field
- **Transcription**: words appear in text input in real-time as user speaks
- User reviews transcribed text → can edit → hits send
- Graceful fallback: if browser doesn't support Web Speech API, mic button hidden (text-only)

---

## Date Picker Design

Custom styled calendar component (not native browser):
- Dark themed to match site
- Gold accent on selected date
- Month/year navigation arrows
- Disabled dates before tomorrow
- Mobile: full-width bottom sheet style
- Desktop: inline dropdown below the chat question
- Smooth open/close animation

---

## Open Items

- [ ] AI agent name (TBD — user will provide)
- [ ] Typewriter intro text finalization
- [ ] Whether to show a background image/video on the welcome screen
