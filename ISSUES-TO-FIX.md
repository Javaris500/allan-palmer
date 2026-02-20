# Allan Palmer — Production Readiness TODO

> Updated: 2026-02-20 | Status: **IN PROGRESS**

---

## PHASE 1: CRITICAL — DONE

### Security

- [ ] **Rotate all API keys** — If keys were ever committed to git history, revoke and regenerate (manual step)
- [x] **Remove `ignoreBuildErrors: true`** in `next.config.mjs`
- [x] **Remove `ignoreDuringBuilds: true`** (ESLint) in `next.config.mjs`
- [x] **Fix dev-auth bypass** — Removed `lib/dev-auth` import from booking page entirely
- [x] **Add auth to admin page** — `app/admin/layout.tsx` now requires ADMIN role via server-side `auth()`
- [x] **Remove hardcoded credentials from seed script** — `prisma/seed.ts` now requires env vars with no fallback

### Build

- [x] **Fix all TypeScript errors** — All 30 TS errors fixed, `tsc --noEmit` passes clean

---

## PHASE 2: HIGH PRIORITY — DONE

### Booking API (`app/api/booking/route.ts`)

- [x] **Add `musicStyles` to required fields validation** — Now requires non-empty array
- [x] **Add `phone` to required fields validation** — Added to required fields list
- [x] **Validate `eventDate` is in the future** — Must be at least tomorrow via date-fns
- [x] **Wrap `prisma.booking.create()` in try-catch** — DB errors now return 500 with message
- [x] **Prevent duplicate submissions** — Review button already disables via `isSubmitting` prop
- [x] **Require authentication** — Returns 401 if no session (no more anonymous bookings)
- [x] **Sanitize all user input** — HTML entities escaped, length-capped before DB/email
- [x] **Use crypto for booking reference** — Now uses `crypto.randomUUID()` instead of `Math.random()`

### Booking Chat (`components/booking/booking-chat.tsx`)

- [x] **Add timeout to AI requests** — 10s AbortController timeout
- [x] **Add retry logic for AI failures** — Up to 2 retries
- [x] **Add `beforeunload` handler** — Warns before leaving mid-booking
- [x] **Add loading state for Phase 4 review** — `reviewLoading` state tracks summary generation
- [x] **Fix phone validation** — Relaxed to 7-15 digits (supports international)
- [x] **Add form label accessibility** — `htmlFor`/`id` on contact form fields

### Auth & Security

- [x] **Rate-limit AI route** — `app/api/booking/ai/route.ts` now rate-limited (30/min per IP)
- [x] **Add security headers** — Added HSTS, upgraded Referrer-Policy to strict-origin-when-cross-origin
- [x] **Sanitize user input before AI prompt** — Control chars stripped, length capped in AI route

### Database (`prisma/schema.prisma`)

- [x] **Add indexes** — Added: `Booking(userId, eventDate, status)`, `Enrollment(userId, lessonId)`, `Payment(userId)`, `BookingMessage(bookingId)`

### Other

- [x] **Add `.npmrc` with `legacy-peer-deps=true`** — Prevents CI failures
- [x] **Add booking error boundary** — Created `app/booking/error.tsx`
- [x] **Add `aria-current="step"` to progress indicator** — With role and aria-label

---

## PHASE 3: MEDIUM PRIORITY — PARTIALLY DONE

### Already Fixed

- [x] **Phone validation relaxed** — Now accepts 7-15 digit international numbers
- [x] **Booking page metadata** — `app/booking/layout.tsx` already had metadata
- [x] **Admin `robots: noindex`** — Already in `app/admin/layout.tsx`
- [x] **Error boundary** — Created `app/booking/error.tsx`
- [x] **Form label accessibility** — `htmlFor` + `id` added
- [x] **Progress indicator accessibility** — `aria-current="step"` added

### Remaining

- [ ] **No timezone handling** — Dates stored without timezone context
- [ ] **Emails sent fire-and-forget** — Response says "success" before email sends
- [x] **Strengthen email validation** — Regex validation added to register route
- [x] **Strengthen password requirements** — Now requires uppercase, lowercase, and a number
- [x] **Rate-limit login attempts** — 10/min per IP on NextAuth POST handler, 5/min on registration

### Missing Features

- [ ] **Build `/my-bookings` page** — Spec requires booking status dashboard
- [ ] **Email verification flow** — Users can register with any email

---

## PHASE 4: LOW PRIORITY (Polish)

- [x] **Remove console.error without NODE_ENV check** — Fixed in AI route
- [x] **Use `crypto.randomUUID()` for booking reference** — Done
- [x] **Add `.npmrc`** — Done
- [ ] **Add error tracking** (Sentry or similar)
- [ ] **Add analytics** — No conversion funnel tracking
- [ ] **Create deployment guide**
- [ ] **Write tests for booking API** — Zero test files exist
- [ ] **Add bundle analysis** — Install `@next/bundle-analyzer`

---

## Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Phase 1: Critical | 7 | 6 | 1 (manual key rotation) |
| Phase 2: High | 17 | 17 | 0 |
| Phase 3: Medium | 13 | 9 | 4 |
| Phase 4: Low | 9 | 3 | 6 |
| **Total** | **46** | **35** | **11** |
