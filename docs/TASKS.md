# Allan Palmer — Task Tracker

> **Status legend:** 🔴 BLOCKED (waiting on UI/UX audit) · 🟡 READY (can start after audit) · 🟢 IN PROGRESS · ✅ DONE · ⏸️ DEFERRED
>
> **Global gate:** Nothing starts until the in-progress UI/UX audit comes back. All items below are 🔴 until that happens.

---

## EPIC 0 — Foundations (must ship before everything else)

| ID | Task | Status | Notes |
|---|---|---|---|
| F-01 | Provision Stripe account (Canada, CAD) | 🔴 | Need: business type (sole prop vs inc), publishable + secret + webhook keys. |
| F-02 | Provision Resend account + API key | 🔴 | Admin email provided: `palmerar@myumanitoba.ca` — see ⚠️ F-08. Free tier OK for v1. |
| F-03 | Verify `allanpalmerviolinist.com` as Resend sending domain — **DNS via Vercel dashboard** | 🔴 | DNS hosted at Vercel (confirmed). Add 4 TXT/MX records in Vercel Domain DNS panel: MX, SPF, DKIM, DMARC. |
| F-04 | Set up inbound email via **Zoho Mail (free tier)** — DNS stays on Vercel | 🔴 | **LOCKED 2026-04-16.** Add Zoho MX + TXT verification records to Vercel DNS. Covers `hello@`, `lessons@`, `noreply@` as real inboxes. Free for 1 user / 5GB. Upgrade path to Google Workspace later by swapping MX records only. |
| F-05 | Update `lib/resend.ts` fallback URL `allanpalmer.com` → `allanpalmerviolinist.com` | 🔴 | Two spots. Small but important. |
| F-06 | Update env vars for production (`EMAIL_FROM`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, Stripe keys) | 🔴 | |
| F-07 | CASL compliance: physical mailing address + unsubscribe footer in `emailLayout()` | 🔴 | Required for all Canadian marketing emails. |
| F-08 | ⚠️ **Risk: university email as master account** — recommend `allan@allanpalmerviolinist.com` (routed to Gmail) as permanent master for Stripe/Resend/Vercel | 🔴 | `palmerar@myumanitoba.ca` will deactivate after Allan leaves UofM. Stripe account recovery if the master email dies is extremely painful. Use UofM as backup only. |
| F-09 | Update Vercel A record to new `216.150.1.1` (non-urgent, old still works) | 🔴 | Per Vercel's DNS Change Recommended notice. |

---

## EPIC 1 — Authentication (NextAuth v5 — currently NOT wired)

**Audit finding:** NextAuth installed but zero config. `components/auth/` empty. No User/Session Prisma models. `/admin` is publicly accessible.

| ID | Task | Status | Notes |
|---|---|---|---|
| A-01 | Add NextAuth Prisma models: `User`, `Account`, `Session`, `VerificationToken` | 🔴 | Adapter requires these exactly. |
| A-02 | Extend `User` with capability flags: `isStudent`, `isPatron`, `isAdmin`, `stripeCustomerId`, `bookingEmails[]` | 🔴 | See architecture doc in prior convo. |
| A-03 | Create `auth.ts` — NextAuth config with PrismaAdapter + Email (magic link) + Credentials (password) providers | 🔴 | BOTH providers — user wants password option. |
| A-04 | Add `app/api/auth/[...nextauth]/route.ts` handler | 🔴 | |
| A-05 | Sign-in page `/signin` with email + password + "Sign in with email link" option | 🔴 | |
| A-06 | Sign-up page `/signup` (email + password, or just email for magic-link) | 🔴 | |
| A-07 | **Password reset flow** | 🔴 | `/forgot-password` → email w/ tokenized link → `/reset-password?token=X` → set new pw. Uses existing `password-reset` email template. |
| A-08 | Verify-email flow (post-signup, before account activation) | 🔴 | |
| A-09 | `middleware.ts` — protect `/admin/*`, `/lessons/portal/*`, `/account/*` | 🔴 | Admin is currently wide open — HIGH priority. |
| A-10 | Seed Allan as `isAdmin=true` | 🔴 | |
| A-11 | Remove stale `lib/dev-auth.ts` reference from MEMORY.md | 🔴 | File doesn't exist; memory inaccurate. |
| A-12 | Password hashing with bcrypt (already in deps) — strong rules, rate limit `/signin` | 🔴 | Per global CASL+security rules. |

---

## EPIC 2 — Donations Page (`/support`)

**Decision locked:** Gifts only, not tax-deductible. Label clearly. Canadian charity partnership deferred to v2.

| ID | Task | Status | Notes |
|---|---|---|---|
| D-01 | Prisma model `Donation` + `DonationType` / `DonationTier` / `DonationStatus` enums | 🔴 | |
| D-02 | Stripe SDK install + `lib/stripe.ts` client | 🔴 | |
| D-03 | Seed Stripe Products/Prices for monthly tiers (Bronze $5 / Silver $15 / Gold $50 CAD) | 🔴 | |
| D-04 | `POST /api/support/checkout` — creates Checkout Session (payment or subscription) | 🔴 | Rate-limited. |
| D-05 | Shared `POST /api/webhooks/stripe` dispatcher | 🔴 | Routes by `metadata.purpose`. Used by lessons too. |
| D-06 | Webhook handler: `checkout.session.completed` → mark `SUCCEEDED`, send receipt | 🔴 | |
| D-07 | Webhook handler: `invoice.paid` → new Donation row for that period (monthly) | 🔴 | |
| D-08 | Webhook handler: `customer.subscription.deleted` → mark canceled, flip `isPatron=false` | 🔴 | |
| D-09 | `/support` page — hero, amount selector, tier cards, impact strip, supporter wall, FAQ, alt ways | 🔴 | Awaits audit for visual direction. |
| D-10 | `/support/thanks` page — reads session_id, shows receipt inline | 🔴 | |
| D-11 | `/account/support` — patron self-service: view plan, update card, cancel (Stripe Customer Portal) | 🔴 | |
| D-12 | Admin `/admin/support` — list, totals, MRR chart, CSV export, toggle "display on wall" | 🔴 | |
| D-13 | Footer "Support Allan" low-key link | 🔴 | |

---

## EPIC 3 — Lessons Public Page + Checkout (`/lessons`)

**Replace current "coming soon" placeholder.**

| ID | Task | Status | Notes |
|---|---|---|---|
| L-01 | Prisma models: `LessonPackage`, `Enrollment`, `Lesson`, `LessonResource`, `Assignment` + enums | 🔴 | Keeps existing `Booking` / `LessonType` / `SkillLevel` untouched. |
| L-02 | Seed `LessonPackage` catalog: Single 30, Single 60, 4-pack, 8-pack, Monthly Sub, Library Sub, Gift Card | 🔴 | Syncs to Stripe Prices. |
| L-03 | Replace `app/lessons/page.tsx` with marketing page: hero, who-it's-for, format toggle, pricing, sample video, teacher bio, testimonials, FAQ, CTA | 🔴 | |
| L-04 | Trial lesson SKU: $40 half-rate (user-approved). Dedicated CTA. | 🔴 | |
| L-05 | `POST /api/lessons/checkout` — creates Stripe Checkout for chosen package | 🔴 | |
| L-06 | Stripe webhook → create User (if new) + Enrollment + send magic-link welcome | 🔴 | |
| L-07 | Sample lesson free Mux video + email-gate for full 15-min | 🔴 | Lead capture. |

---

## EPIC 4 — Student Portal (`/lessons/portal`)

| ID | Task | Status | Notes |
|---|---|---|---|
| P-01 | Portal layout + auth guard (redirect non-students to `/lessons`) | 🔴 | |
| P-02 | Dashboard — next lesson, practice streak, recent notes | 🔴 | |
| P-03 | Intake form (goals, level, availability) on first login | 🔴 | |
| P-04 | Schedule tab — book lesson from `Availability`, reschedule ≥24h, cancel | 🔴 | Reuses existing `Availability` model. |
| P-05 | Library tab — assigned Mux videos, PDF sheet music, practice tracks | 🔴 | |
| P-06 | Progress tab — skills tree / repertoire / practice log | 🔴 | |
| P-07 | Messages tab — student↔Allan thread (mirror `BookingMessage` pattern) | 🔴 | |
| P-08 | Billing tab — plan, invoices, payment method, cancel (Stripe Customer Portal link) | 🔴 | |
| P-09 | Post-lesson: Allan marks `COMPLETED`, writes shared notes, assigns resources → decrement `lessonsRemaining` | 🔴 | |
| P-10 | Renewal nudge at `lessonsRemaining == 1` | 🔴 | |
| P-11 | Practice streak gamification | 🔴 | |
| P-12 | Referral credit system ("refer friend, get free lesson") | 🔴 | v1.5 |

---

## EPIC 5 — Lessons Admin (`/admin/lessons`, `/admin/students`, `/admin/library`)

| ID | Task | Status | Notes |
|---|---|---|---|
| AL-01 | `/admin/students` — list, filter by level/package, view one student's full history | 🔴 | |
| AL-02 | `/admin/lessons` — calendar, upcoming/completed, quick note entry | 🔴 | |
| AL-03 | `/admin/packages` — CRUD SKUs, syncs to Stripe Prices | 🔴 | |
| AL-04 | `/admin/library` — Mux upload UI, tag/level/publish, assign to students | 🔴 | |
| AL-05 | `/admin/revenue` — MRR, LTV, churn, donation totals, pipeline | 🔴 | Combined donations + lessons revenue. |

---

## EPIC 6 — Email Templates (preview at `/api/email-preview` — dev only)

**Existing templates (already built):** `booking-received`, `admin-alert`, `status-reviewed`, `status-confirmed`, `status-completed`, `status-cancelled`, `new-message`, `welcome`, `password-reset`.

### New templates needed

| ID | Template key | Trigger | Status |
|---|---|---|---|
| E-01 | `magic-link-signin` | User requests magic-link login | 🔴 |
| E-02 | `verify-email` | After signup, before activation | 🔴 |
| E-03 | `password-changed` | Confirmation after successful reset | 🔴 |
| E-04 | `donation-receipt-onetime` | One-time gift succeeded | 🔴 |
| E-05 | `patron-welcome` | First month of monthly subscription | 🔴 |
| E-06 | `patron-monthly-receipt` | Each month `invoice.paid` | 🔴 |
| E-07 | `patron-payment-failed` | Stripe dunning event | 🔴 |
| E-08 | `patron-canceled` | Subscription ended | 🔴 |
| E-09 | `patron-anniversary` | 1-year retention thank-you | 🔴 |
| E-10 | `enrollment-confirmed` | Package purchase success | 🔴 |
| E-11 | `portal-welcome` | First login to student portal | 🔴 |
| E-12 | `lesson-scheduled` | Student booked a slot | 🔴 |
| E-13 | `lesson-reminder-24h` | Day-before cron | 🔴 |
| E-14 | `lesson-reminder-1h` | Hour-before cron | 🔴 |
| E-15 | `lesson-rescheduled` | Either party reschedules | 🔴 |
| E-16 | `lesson-canceled-by-student` | Student cancels | 🔴 |
| E-17 | `lesson-canceled-by-allan` | Allan cancels | 🔴 |
| E-18 | `lesson-completed-notes` | Post-lesson shared notes + next assignment | 🔴 |
| E-19 | `new-assignment` | New Mux video / PDF assigned | 🔴 |
| E-20 | `lessons-remaining-warning` | 1 lesson left, renew nudge | 🔴 |
| E-21 | `package-expired` | Pack fully consumed | 🔴 |
| E-22 | `subscription-topup` | Monthly `lessonsRemaining` auto-topped | 🔴 |
| E-23 | `gift-card-purchased` | Buyer confirmation | 🔴 |
| E-24 | `gift-card-received` | Recipient notification | 🔴 |
| E-25 | `winback-14d` | 14 days after cancellation | 🔴 |
| E-26 | `admin-new-student` | Allan alert on new enrollment | 🔴 |
| E-27 | `admin-lesson-booked` | Allan alert on slot booking | 🔴 |
| E-28 | `admin-lesson-rescheduled` | Allan alert | 🔴 |
| E-29 | `admin-new-donation` | Allan alert on donation (optional, daily digest?) | 🔴 |
| E-30 | `leah-escalate-to-allan` | Leah hands off lead to Allan | 🔴 |
| E-31 | `leah-lead-captured` | Allan alert w/ chat context | 🔴 |

**Preview route** already supports adding new templates — just append to the `templates` record in `app/api/email-preview/route.ts`. Dev-only (blocks in production).

---

## EPIC 7 — Leah AI Assistant (see `LEAH.md`)

**Status:** Spec decisions #7 + #8 locked (2026-04-16).
- **Strict auth gate** — anonymous users see widget but get "Sign in to chat with Leah" prompt.
- **Admin v1 = read-only + calendar blocking only** — `listBookings`, `blockTime`, `morningBriefing`, `triageLeads`. No `draftReply` / `sendEmail` in v1.

**Hard dependency:** Epic 1 (Auth) must ship first.

| ID | Task | Status | Notes |
|---|---|---|---|
| LEAH-01 | ✅ Q1 resolved — strict gate | ✅ | Decision #7 |
| LEAH-02 | ✅ Q2 resolved — read-only admin v1 | ✅ | Decision #8 |
| LEAH-03 | Prisma: `LeahConversation`, `LeahMessage` + `LeahMode` / `LeahRole` enums | 🔴 | |
| LEAH-04 | Tool registry + role-gating (`lib/leah/tools.ts`, `auth.ts`) | 🔴 | |
| LEAH-05 | Customer tools v1 — `answerFAQ`, `checkAvailability`, `createBookingDraft`, `submitBooking`, `escalateToAllan`, `captureLead` | 🔴 | |
| LEAH-06 | `/api/leah/chat` SSE route + streaming, auth-required | 🔴 | Returns 401 for anonymous; client shows sign-in CTA. |
| LEAH-07 | Widget UI — floating button, sign-in prompt for anon, panel + messages + tool cards for authed | 🔴 | |
| LEAH-08 | Admin tools v1 — `listBookings`, `blockTime`, `morningBriefing`, `triageLeads` (NO email tools in v1) | 🔴 | Scope reduced ~30% vs original plan. |
| LEAH-09 | Memory persistence + conversation list | 🔴 | |
| LEAH-10 | Rate limits + manual QA | 🔴 | |
| LEAH-11 | v2 (deferred): `draftReply`, `sendEmail` w/ confirmation UX | ⏸️ | Moved to v2 per decision #8. |

---

## EPIC 8 — UI/UX Audit Remediation

**Audit returned 2026-04-16.** Split into three sub-epics per approved path C. Reference: `UI-UX-AUDIT.md`.

---

### EPIC 8a — Design System Foundation (do first, unblocks everything)

Establish the new editorial visual language before any new page work. Donations + Lessons pages will be built directly on these tokens.

| ID | Task | Status | Notes |
|---|---|---|---|
| 8A-01 | Install fonts via `next/font`: Cormorant Garamond (display), Tenor Sans (labels), Inter (body) in `app/layout.tsx` | 🟢 | Replace current Playfair + Inter loader. |
| 8A-02 | Update `globals.css` dark-mode tokens | 🟢 | Warm near-black `#0A0908`, dual gold `#C9A646` + champagne `#D4B87A` + bronze `#8B6F3D`, cream `#F5EFE6` / parchment `#EBE3D5`, earthier semantics (forest/amber/sienna), radius `0.25rem`. |
| 8A-03 | Add utilities: `.label-caps`, `.divider-gold`, `.divider-gold-sm`, `.section-pad`, `.shadow-glow-gold` to `globals.css` | 🟢 | |
| 8A-04 | Update `tailwind.config.ts`: new color tokens (champagne/bronze/parchment/cream/ink), font families (display/heading/body), cinematic easing keyframes, glow-gold shadow. Remove `animate-bounce` keyframe. Dark-aware shadows. | 🟢 | |
| 8A-05 | Create `lib/motion.ts` — `EASE_OUT = [0.22, 1, 0.36, 1]`, `DURATIONS`, `useMotionConfig()` hook respecting `useReducedMotion()` | 🟢 | |
| 8A-06 | Create `public/images/f-hole.svg` brand motif | 🟢 | Single-path minimal silhouette, monochrome, used at low opacity. |
| 8A-07 | Refactor `components/ui/button.tsx`: remove `active:scale-[0.98]` → `active:opacity-80`. Add `editorial` variant (gold, `rounded-sm`, small-caps, wide-tracked). Keep `rounded-full` on icon/FAB only. | 🟢 | |
| 8A-08 | Create `components/ui/text-link.tsx` — underline-draw L→R on hover via `::after` at 500ms cubic-bezier | 🟢 | Used for all secondary CTAs site-wide. |
| 8A-09 | Nav change: remove `/my-bookings`, add `/support` (Donate) in `components/floating-nav.tsx` | 🟢 | Services keeps sole gold highlight. Add "My Bookings" to footer so flow isn't lost. |
| 8A-10 | Fix stale `allanpalmer.com` fallbacks → `allanpalmerviolinist.com` in `lib/constants.ts:7`, `lib/resend.ts:5-6`, `app/api/email-preview/route.ts:10` | 🟢 | |
| 8A-11 | Delete dead code: `hero-section.tsx`, `booking/booking-wizard.tsx`, `back-to-top.tsx`, `contact/contact-questionnaire.tsx`, `footer.tsx` | 🟢 | Verify no imports first. ~1,500 lines. |
| 8A-12 | Verify build passes after all 8a changes | 🟢 | `npm run build`, `npm run lint`. Show evidence. |

---

### EPIC 8b — Critical Bug / Accessibility Fixes (after 8a, before new features)

| ID | Task | Status | Notes |
|---|---|---|---|
| 8B-01 | Admin auth guard (overlaps with Epic 1 A-09) — `/admin/*` middleware | 🔴 | Ships with auth foundation. |
| 8B-02 | Replace booking `mailto:` with real API POST to `/api/booking` | 🔴 | Route to `/booking/success`, trigger Resend. `app/booking/page.tsx:76-77`. |
| 8B-03 | Remove false "confirmation email sent" claim in `components/booking/booking-success.tsx:119` — or make it true | 🔴 | |
| 8B-04 | Add `htmlFor`/`id` to every label in `app/booking/page.tsx:118-239` | 🔴 | |
| 8B-05 | Add `aria-invalid`, `role="alert"`, `aria-describedby` to contact form errors `contact-form.tsx:164-174` | 🔴 | |
| 8B-06 | Lightbox: add `role="dialog"`, `aria-modal`, focus trap, focus restore | 🔴 | `components/ui/lightbox.tsx` |
| 8B-07 | `VideoThumbnailGrid`: swap live `MuxVideoPlayer` → `OptimizedVideoThumbnail` | 🔴 | Huge perf win. Line 193. |
| 8B-08 | Add `<track>` captions element to `mux-video-player.tsx`, `video-showcase.tsx` | 🔴 | WCAG 1.2.2 |
| 8B-09 | Fix hero v2 `aria-label`s on play/mute/fullscreen + seek bar as keyboard-operable slider (`role="slider"`, `aria-valuenow`, `onKeyDown`) | 🔴 | |
| 8B-10 | Add `useReducedMotion()` guards to Framer animations across hero, page-transition, split-testimonials | 🔴 | |
| 8B-11 | Fix gallery: arrow/dot buttons `aria-label`, theater close button label, gallery-tabs inactive contrast | 🔴 | |
| 8B-12 | Fix `my-bookings`: label the email input, badge contrast (amber 2.8:1 → warning token), retry button, focus-visible | 🔴 | |
| 8B-13 | Fix error/404/loading pages: brand icon + serif heading, `role="status"` | 🔴 | |
| 8B-14 | Fix `contact-info.tsx:99` "Use Booking Form" points to `/services` — should be `/booking` | 🔴 | Broken intent link. |
| 8B-15 | Fix duplicate footer links (`/services#private` × 2), merge or differentiate | 🔴 | |
| 8B-16 | Move test data: `lib/testimonials.ts` single source, consolidate `thumbnailConfigs` | 🔴 | |

---

### EPIC 8c — Per-Page Visual Redesigns (scheduled after Donations + Lessons ship)

Ordered by ROI (conversion-critical first). Each is a separate PR with the new tokens.

| ID | Task | Status | Notes |
|---|---|---|---|
| 8C-01 | Home page — 12 editorial improvements (Cormorant h1, warm-black bg, dual-tone gold, film-grain overlay, asymmetric testimonials, pull-quote cards, cinematic easing, letterbox video, underline text links, f-hole watermark, 120px+ section rhythm) | ⏸️ | |
| 8C-02 | Services page — 12 improvements + real pricing tier cards (Ceremony / Cocktail / Full Event) | ⏸️ | **Highest conversion impact** |
| 8C-03 | Booking page — 13 improvements (concierge letter layout, underline inputs, floating labels, cinematic success) | ⏸️ | |
| 8C-04 | Contact page — 11 improvements (editorial header, typographic list, matched underline inputs) | ⏸️ | |
| 8C-05 | About page — 12 improvements (kill animated mesh, editorial portrait, vertical score timeline, programme-photo duotone) | ⏸️ | |
| 8C-06 | Gallery page — 13 improvements (hairline underline tabs, bento grid, grayscale→color hover, museum-placard lightbox captions) | ⏸️ | |
| 8C-07 | Repertoire page — 10 improvements (recessed letterforms, programme entry rows, editorial search) | ⏸️ | |
| 8C-08 | My Bookings — 10 improvements (rename "Your Engagements", status badge tokens, progress indicator, editorial empty state) | ⏸️ | |
| 8C-09 | Nav + Footer — 8 improvements (enlarge FAB drawer, delete full footer, hairline dividers, champagne hover) | ⏸️ | |
| 8C-10 | Error/404/Loading — 8 improvements (full-bleed, brand motif, "An Unexpected Rest", display 404 watermark, AP logo pulse) | ⏸️ | |

---

## Dependency graph (critical path)

```
F-01..F-07 (Stripe+Resend+Domain)
   │
   ▼
A-01..A-12 (Auth: models, providers, middleware, password reset)
   │
   ├──► D-01..D-13  (Donations)
   │
   ├──► L-01..L-07  (Lessons public + checkout)
   │        │
   │        ▼
   │     P-01..P-12 (Student portal)
   │        │
   │        ▼
   │     AL-01..AL-05 (Lessons admin)
   │
   └──► LEAH-01..LEAH-10 (Leah — after auth + bookings foundation)

E-01..E-31 (Email templates) — built incrementally alongside the feature that triggers them
```

---

## Known architectural facts (from existing codebase audit, 2026-04-16)

- NextAuth v5 beta + PrismaAdapter installed but **ZERO config code exists**. Greenfield auth build.
- `components/auth/` directory is empty.
- `lib/dev-auth.ts` does NOT exist (MEMORY.md claim is stale).
- `/admin/*` routes have **NO auth protection** — only `robots: noindex`. High-priority fix.
- Email preview route `/api/email-preview` exists, dev-only (blocks in prod), 9 templates.
- `lib/resend.ts` fallback URL still says `allanpalmer.com` — needs update to `allanpalmerviolinist.com`.
- Prisma schema currently: `Booking`, `BookingMessage`, `Availability`. No User/Account/Session/Lesson/Donation models yet.
- Existing Booking flow is authless, email-keyed via `BK-YYYYMMDD-XXXX` reference codes. Stays that way.
- Domain: **allanpalmerviolinist.com** (confirmed).
- DNS host: **Vercel** (confirmed from dashboard screenshot 2026-04-16). Vercel recommends A record update to `216.150.1.1` (non-urgent).
- Admin email provided: `palmerar@myumanitoba.ca` ⚠️ university email, deactivation risk — see F-08.
- LEAH v1 scope locked: strict auth gate, read-only admin tools only (no email sending from Leah in v1).
