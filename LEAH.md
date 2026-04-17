# LEAH — Allan's AI Assistant

> Living spec. Update as decisions are made. Do not start building until "Open Questions" are resolved and Allan/Javaris give the go-ahead.

---

## 1. Purpose

Leah is a single AI agent with **two modes** determined by the authenticated user's role:

- **Customer mode** — helps visitors book Allan faster, answers FAQs, captures leads, and escalates anything she can't resolve.
- **Admin mode (Allan)** — acts as Allan's personal assistant: views bookings, drafts replies, manages calendar, surfaces what needs attention.

Same personality. Same memory layer. Different toolset and permissions, gated server-side.

---

## 2. Locked Decisions

| # | Decision | Notes |
|---|---|---|
| 1 | **One agent, role-aware** | Single `/api/leah/chat` endpoint. `session.user.role` decides which tools are exposed. |
| 2 | **Coexists with existing booking form** | The scripted form stays. Leah offers a faster conversational path: *"Want me to book this for you in 30 seconds?"* |
| 3 | **Always visible** | Floating widget on every page, expands to side panel. |
| 4 | **Logged-in users get continuity** | Conversation history persists per `userId`. |
| 5 | **Model: Haiku 4.5 across both modes (v1)** | Speed-first. Per-tool upgrade to Sonnet 4.6 later if quality demands. |
| 6 | **Tool gating is server-side, not prompt-based** | A jailbroken customer Leah still cannot invoke admin tools. |
| 7 | **Strict auth gate** | Anonymous users cannot chat with Leah. Widget is visible but clicking it prompts sign-in. Every conversation is tied to a real account. |
| 8 | **v1 Allan tools: read-only + calendar only** | `listBookings`, `blockTime`, `morningBriefing`, `triageLeads`. No outbound email/communication from Leah in v1 — Allan handles his own replies. |
| 9 | **Auth: email + password only, with auto-register** | Single Credentials provider. Unknown email + password → create account (USER role) and sign in. Known email + correct password → sign in. Wrong password on existing account → reject (no overwrite). **Magic-link / Resend provider removed** (was decided in original spec, removed 2026-04-17 for simpler UX). Allan signs in with the same credentials — his ADMIN role is set in the DB by the seed. |

---

## 3. Open Questions

_All resolved. See decisions #7 and #8 above._

---

## 3a. Prerequisites (must land BEFORE Leah v1 build)

Surfaced by `UI-UX-AUDIT.md` (2026-04-16). These are blockers, not nice-to-haves — Leah cannot ship safely without them.

| # | Prerequisite | Why it blocks Leah | Source |
|---|---|---|---|
| P1 | **Real auth guard on `/admin` + role check in NextAuth session** | Leah's admin-mode tools (`listBookings`, `blockTime`, `morningBriefing`, `triageLeads`) gate on `session.user.role === 'admin'`. Today, anyone can reach `/admin` — meaning role isn't enforced anywhere. Admin tools would be exposed to the world. | Audit issue #1 (`app/admin/layout.tsx:8`) |
| P2 | **Replace booking `mailto:` with real `/api/booking` POST + Resend confirmation + truthful success page** | Leah's `submitBooking` tool needs a real backend endpoint to call. The existing form should also route through it, so fixing it once benefits both paths. | Audit issues #2, #3 (`app/booking/page.tsx:77`, `booking-success.tsx:119`) |
| P3 | **Decide & seed Allan's admin user** in DB | Without a known `userId` flagged as admin, `morningBriefing` and `triageLeads` have no "Allan" to greet or filter for. Needs a Prisma seed or manual record. | New requirement |

**Recommended sequencing:**
1. P1 first — pure security fix, smallest blast radius.
2. P3 alongside P1 — one Prisma migration to add `role` enum to `User` + seed Allan.
3. P2 next — booking API hardening; benefits the existing form even if Leah slips.
4. THEN start Leah build (Section 10 build order).

**Out of scope for Leah but flagged for Allan to schedule separately:**
- Audit issues #4–#10 (form a11y, lightbox focus trap, video perf, captions, gold contrast, services pricing) — independent of Leah.
- Dead-code cleanup (~1,500 lines: `hero-section.tsx` v1, `booking-wizard.tsx`, `back-to-top.tsx`, `contact-questionnaire.tsx`).
- UI/UX Audit Part 2 design overhaul (Cormorant Garamond, dual-tone gold, editorial layout) — large separate initiative.

---

## 4. Capabilities

### 4a. Customer Mode

| Capability | Tool name | v1? |
|---|---|---|
| Answer FAQ (pricing, availability, services) | `answerFAQ` | ✅ |
| Check date availability | `checkAvailability` | ✅ |
| Draft a booking from chat | `createBookingDraft` | ✅ |
| Submit booking (creates DB record + emails Allan) | `submitBooking` | ✅ |
| Escalate to Allan when she can't help | `escalateToAllan` | ✅ |
| Capture lead info if user isn't ready to book | `captureLead` | ✅ |
| Suggest songs / sample videos based on event type | `recommendContent` | v2 |

### 4b. Admin Mode (Allan)

| Capability | Tool name | v1? |
|---|---|---|
| View upcoming bookings | `listBookings` | ✅ |
| Block calendar time | `blockTime` | ✅ |
| Morning briefing (gigs + leads + alerts) | `morningBriefing` | ✅ |
| Lead triage (rank unread leads by urgency) | `triageLeads` | ✅ |
| Draft reply to a lead/customer | `draftReply` | v2 |
| Send drafted email (with confirmation) | `sendEmail` | v2 |
| Stale-lead recovery ("you haven't replied to X") | `findStaleLeads` | v2 |
| Conflict detection (overlapping bookings/travel) | `detectConflicts` | v2 |
| Business stats ("how many weddings in March?") | `getStats` | v2 |
| Weekly summary (auto-generated Sunday recap) | `weeklySummary` | v2 |
| Update Sanity content from chat | `updateContent` | v2 |
| Quote drafting from rate card | `draftQuote` | v2 |
| Auto-request testimonials post-gig | `requestTestimonial` | v2 |
| Gig prep info (address, contact, songs) | `gigPrep` | v2 |

---

## 5. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| LLM | **Anthropic Haiku 4.5** (both modes, v1) | Speed + cost. Allan has paid credits. |
| SDK | Vercel AI SDK + `@ai-sdk/anthropic` | Already in stack for booking flow. |
| Streaming | SSE via Next.js route handler | Existing pattern. |
| Persistence | Prisma + Postgres | Existing stack. |
| Auth | NextAuth v5 (already in stack) | Role determined from session. |
| Email | Resend | Existing stack — used by `sendBookingInquiry` (booking submissions) and `escalateToAllan` (Leah → Allan notifications). NOT used for auth (magic-link removed 2026-04-17). |
| CMS | Sanity | Used by `updateContent` (v2). |

---

## 6. Proposed File Structure

```
app/
├── api/leah/
│   ├── chat/route.ts              # SSE streaming, role-aware
│   ├── conversations/
│   │   ├── route.ts               # GET list, POST new
│   │   └── [id]/route.ts          # GET messages, DELETE convo
│   └── tools/                     # tool handlers, server-only
│       ├── customer/
│       │   ├── availability.ts
│       │   ├── booking.ts
│       │   ├── faq.ts
│       │   ├── lead.ts
│       │   └── escalate.ts
│       └── admin/
│           ├── bookings.ts
│           ├── reply.ts
│           ├── calendar.ts
│           ├── briefing.ts
│           └── triage.ts
components/leah/
│   ├── LeahWidget.tsx             # floating button, site-wide
│   ├── LeahPanel.tsx              # expanded chat panel
│   ├── LeahMessage.tsx            # message bubbles + tool result cards
│   ├── LeahToolCard.tsx           # rich rendering for tool results (booking card, email draft preview, etc.)
│   └── LeahAdminView.tsx          # Allan-only enhancements
lib/leah/
│   ├── prompts/
│   │   ├── base.ts                # personality, tone, name
│   │   ├── customer.ts            # customer-mode suffix
│   │   └── admin.ts               # admin-mode suffix
│   ├── tools.ts                   # tool registry, role-gated
│   ├── memory.ts                  # load/save conversation
│   ├── model.ts                   # Haiku factory (Sonnet override available)
│   └── auth.ts                    # role + permission helpers
prisma/schema.prisma               # +LeahConversation, +LeahMessage
```

---

## 7. DB Schema (proposed)

```prisma
model LeahConversation {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  mode      LeahMode // customer | admin
  title     String?  // auto-generated from first user msg
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  LeahMessage[]

  @@index([userId, updatedAt])
}

model LeahMessage {
  id             String   @id @default(cuid())
  conversationId String
  conversation   LeahConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           LeahRole // user | assistant | tool
  content        String   @db.Text
  toolCalls      Json?    // structured tool invocations + results
  createdAt      DateTime @default(now())

  @@index([conversationId, createdAt])
}

enum LeahMode {
  CUSTOMER
  ADMIN
}

enum LeahRole {
  USER
  ASSISTANT
  TOOL
}
```

---

## 8. Security Rules (non-negotiable)

1. **Role check happens in every tool handler**, before any DB read/write. Never trust the prompt.
2. **Admin tools never appear in the customer tool registry.** Build two separate tool sets in `lib/leah/tools.ts`.
3. **Email send always requires explicit confirmation** from Allan in the UI before `sendEmail` actually fires. Leah drafts, Allan approves.
4. **No PII or credentials in logs.** Standard rule.
5. **Rate limit `/api/leah/chat`** per user (e.g. 60 msgs/15min) to prevent abuse.
6. **Conversation isolation**: a user can only load their own conversations. Allan can load all in admin mode (for the `searchConversations` tool, v2).

---

## 9. UX Notes

- **Anonymous visitors**: Leah widget is visible site-wide. Clicking it opens the panel with a *"Sign in to chat with Leah"* prompt + sign-in CTA. No messaging until authenticated.
- **Sign-in page**: Single email + password form (no tabs, no magic-link). Tagline: *"New here? Just enter your email and a password — we'll set up your account automatically."* Auto-registers unknown emails. The `/verify` page was removed when magic-link was deprecated.
- **Customer-facing greeting** (first message after sign-in): *"Hi, I'm Leah, Allan's assistant. Looking to book a date or just have a question?"*
- **Allan-facing greeting**: *"Morning, Allan. Want your briefing, or got something specific?"* (or time-of-day appropriate)
- **Visual differentiation**: same widget, but Allan's panel has an "Admin" badge + access to past-bookings sidebar.
- **Streaming feel**: token-by-token via SSE. Tool calls render as cards inline.
- **Confirmation pattern**: anything destructive or external (create booking, block calendar) shows a card with "Confirm / Edit / Cancel" before executing.

---

## 10. Build Order (proposed once approved)

1. **Schema + migration** (LeahConversation, LeahMessage)
2. **Auth + role helpers** (lib/leah/auth.ts) — includes strict-gate check on `/api/leah/chat`
3. **Widget UI with sign-in prompt for anonymous users** (floating button, panel, gated messaging)
4. **Tool registry + 2-3 customer tools** (FAQ, availability, escalate) — prove the loop end-to-end
5. **Booking tools** (createBookingDraft, submitBooking) wired to existing booking model
6. **Admin tools v1** (listBookings, blockTime, morningBriefing, triageLeads)
7. **Memory persistence + conversation list UI**
8. **Polish, rate limits, telemetry, manual QA**

> **Auth simplification (2026-04-17):** the original plan included a Resend magic-link path for guests + Credentials for Allan. That was collapsed into a **single email + password form with auto-register** to reduce friction. See decision #9. The `/verify` page and `sendMagicLinkEmail` helper were retired alongside.

---

## 11. Out of Scope (explicit non-goals for v1)

- Voice input/output
- Mobile app
- Multi-tenant (multiple musicians using Leah)
- Calendar sync with external Google Calendar (v2)
- Payment processing through Leah (always hand off to existing flow)
- Real-time multi-device sync of Allan's chat (single active session is fine for v1)
